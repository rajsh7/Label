import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { incrementLabelUsage } from '@/lib/usage/tracking'
import { loadDesign } from '@/server/actions/designs'
import { generateDesignPDF } from '@/lib/pdf/designGenerator'
import { rateLimitAPI, API_RATE_LIMITS } from '@/lib/rateLimit/apiRateLimit'

/**
 * POST /api/labels/download
 * Download a label design as PDF/PNG
 * Tracks usage and enforces limits
 */
export async function POST(request: NextRequest) {
  // Rate limit check
  const rateLimitResult = rateLimitAPI(request, API_RATE_LIMITS.default)
  if (rateLimitResult) {
    return rateLimitResult
  }

  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { design_id, format = 'pdf' } = body

    if (!design_id) {
      return NextResponse.json(
        { error: 'Missing required field: design_id' },
        { status: 400 }
      )
    }

    // Check usage limit before allowing download
    const usageCheck = await incrementLabelUsage(session.user.id)

    if (!usageCheck.success) {
      return NextResponse.json(
        {
          error: usageCheck.error,
          usage: usageCheck.usage,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // Load design
    const designResult = await loadDesign(design_id)
    if (!designResult.success || !designResult.data) {
      return NextResponse.json(
        { error: designResult.error || 'Design not found' },
        { status: 404 }
      )
    }

    // Generate PDF from design
    const design = designResult.data
    
    // Get label base for dimensions
    const { data: labelBase } = await supabase
      .from('labels')
      .select('*')
      .eq('id', design.label_base_id)
      .single()

    if (!labelBase) {
      return NextResponse.json(
        { error: 'Label base not found' },
        { status: 404 }
      )
    }

    // Determine DPI (default 203, can be stored in design)
    const dpi = 203 // TODO: Store DPI preference in design
    const width_px = dpi === 203 ? labelBase.width_px_203dpi : labelBase.width_px_300dpi
    const height_px = dpi === 203 ? labelBase.height_px_203dpi : labelBase.height_px_300dpi

    // Generate PDF
    const pdfBuffer = await generateDesignPDF({
      elements: (design.elements as any) || [],
      width_px: width_px || 812,
      height_px: height_px || 1218,
      dpi,
      format: format as 'pdf' | 'png',
    })

    // Upload to Supabase Storage
    const { storePDF } = await import('@/lib/storage/pdfStorage')
    const uploadResult = await storePDF({
      supabase,
      buffer: pdfBuffer,
      userId: session.user.id,
      designId: design_id,
      folder: 'labels',
    })

    if (!uploadResult.success || !uploadResult.url) {
      console.error('Storage upload error:', uploadResult.error)
      // Return PDF as base64 if upload fails (graceful degradation)
      return NextResponse.json({
        success: true,
        message: 'Label generated successfully',
        usage: usageCheck.usage,
        pdf_base64: pdfBuffer.toString('base64'),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Label generated successfully',
      usage: usageCheck.usage,
      pdf_url: uploadResult.url,
      pdf_path: uploadResult.path,
      pdf_base64: pdfBuffer.toString('base64'), // Also return base64 for immediate download
    })
  } catch (error) {
    console.error('Download label error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to download label' },
      { status: 500 }
    )
  }
}

