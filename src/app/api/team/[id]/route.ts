import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * PATCH /api/team/[id]
 * Update team member role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { role } = body

    if (!role || !['admin', 'member'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "member"' },
        { status: 400 }
      )
    }

    // Verify the team member belongs to the user's team
    const { data: teamMember, error: fetchError } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .eq('team_owner_id', session.user.id)
      .single()

    if (fetchError || !teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    // Update role
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', id)

    if (updateError) {
      console.error('Update team member error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update team member' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Team member updated successfully',
    })
  } catch (error) {
    console.error('Update team member error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update team member' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/team/[id]
 * Remove team member
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

    // Verify the team member belongs to the user's team
    const { data: teamMember, error: fetchError } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .eq('team_owner_id', session.user.id)
      .single()

    if (fetchError || !teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    // Delete team member record
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Delete team member error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to remove team member' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Team member removed successfully',
    })
  } catch (error) {
    console.error('Delete team member error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove team member' },
      { status: 500 }
    )
  }
}
