import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { generateDesignPDF } from '@/lib/pdf/designGenerator'

/**
 * POST /api/labels/generate
 * Generate PDF/image from label design
 * Accepts design ID or design JSON
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { designId, elements, width_px, height_px, format = 'pdf', dpi = 300 } = body

    let designElements = elements
    let widthPx = width_px
    let heightPx = height_px

    // If designId is provided, load design from database
    if (designId && !elements) {
      const { data, error } = await supabase
        .from('label_designs')
        .select('*, labels(*)')
        .eq('id', designId)
        .eq('user_id', session.user.id)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Design not found' },
          { status: 404 }
        )
      }

      designElements = data.elements
      const label = data.labels as any
      widthPx = dpi === 300 ? label?.width_px_300dpi : label?.width_px_203dpi
      heightPx = dpi === 300 ? label?.height_px_300dpi : label?.height_px_203dpi
    }

    if (!designElements || !widthPx || !heightPx) {
      return NextResponse.json(
        { success: false, error: 'Invalid design data: missing elements, width_px, or height_px' },
        { status: 400 }
      )
    }

    // Generate PDF
    if (format === 'pdf') {
      const pdfBuffer = await generateDesignPDF({
        elements: designElements,
        width_px: widthPx,
        height_px: heightPx,
        dpi,
      })

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="label-${Date.now()}.pdf"`,
        },
      })
    }

    // For image formats, would need image generation logic
    return NextResponse.json(
      { success: false, error: 'Image format not yet supported' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Generate label error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate label' },
      { status: 500 }
    )
  }
}