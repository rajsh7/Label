import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * DELETE /api/integrations/[id]
 * Disconnect an integration
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the integration belongs to the user
    const { data: integration, error: fetchError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
    }

    // Delete integration
    const { error: deleteError } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Delete integration error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to disconnect integration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Integration disconnected successfully',
    })
  } catch (error) {
    console.error('Delete integration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to disconnect integration' },
      { status: 500 }
    )
  }
}

