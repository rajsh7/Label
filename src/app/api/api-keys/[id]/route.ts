import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * DELETE /api/api-keys/[id]
 * Delete (deactivate) an API key
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

    // Verify the API key belongs to the user
    const { data: apiKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    // Deactivate the key instead of deleting (for audit trail)
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', id)

    if (updateError) {
      console.error('Delete API key error:', updateError)
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully',
    })
  } catch (error) {
    console.error('Delete API key error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete API key' },
      { status: 500 }
    )
  }
}

