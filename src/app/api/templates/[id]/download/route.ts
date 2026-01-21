import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * POST /api/templates/[id]/download
 * Increment download count for a template
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Increment download count
    const { error } = await supabase.rpc('increment_template_downloads', {
      template_id: id,
    })

    if (error) {
      // If RPC doesn't exist, do it manually
      const { data: template } = await supabase
        .from('templates')
        .select('downloads')
        .eq('id', id)
        .single()

      if (template) {
        await supabase
          .from('templates')
          .update({ downloads: (template.downloads || 0) + 1 })
          .eq('id', id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Download template error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to download template' },
      { status: 500 }
    )
  }
}

