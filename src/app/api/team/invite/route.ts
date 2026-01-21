import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { checkFeatureAccess } from '@/lib/features/featureGates'

/**
 * POST /api/team/invite
 * Invite a team member
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, role = 'member' } = body

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    // Check if user has team access
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const hasAccess = await checkFeatureAccess(
      'add_team_member',
      profile.subscription_tier
    )

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Team features are available for Pro and Enterprise users only' },
        { status: 403 }
      )
    }

    // Check team member limit
    const maxMembers = profile.subscription_tier === 'pro' ? 2 : Infinity
    
    const { count: currentCount } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_owner_id', session.user.id)
      .eq('status', 'active')

    if (currentCount !== null && currentCount >= maxMembers) {
      return NextResponse.json(
        {
          error: `You've reached your team member limit. Upgrade to Enterprise for unlimited members.`,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.trim())
      .single()

    // Create team member record
    const teamMemberData: any = {
      team_owner_id: session.user.id,
      invite_email: email.trim(),
      role,
      status: 'pending',
      invited_by: session.user.id,
      invited_at: new Date().toISOString(),
    }

    if (existingUser) {
      teamMemberData.user_id = existingUser.id
    }

    const { data: teamMember, error: inviteError } = await supabase
      .from('team_members')
      .insert(teamMemberData)
      .select()
      .single()

    if (inviteError) {
      console.error('Invite team member error:', inviteError)
      return NextResponse.json(
        { error: 'Failed to send invitation' },
        { status: 500 }
      )
    }

    // Send invitation email
    try {
      const { data: inviterProfile } = await supabase
        .from('profiles')
        .select('full_name, company_name')
        .eq('id', session.user.id)
        .single()

      const inviterName = inviterProfile?.full_name || session.user.email?.split('@')[0] || 'A team member'
      const teamName = inviterProfile?.company_name || 'Our Team'
      const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/team/accept?token=${teamMember.id}`

      const { sendTeamInvitationEmail } = await import('@/server/actions/email')
      await sendTeamInvitationEmail(
        email.trim(),
        inviterName,
        teamName,
        invitationUrl
      )
    } catch (emailError) {
      // Don't fail the request if email fails, but log it
      console.error('Failed to send team invitation email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      team_member_id: teamMember.id,
    })
  } catch (error) {
    console.error('Invite team member error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send invitation' },
      { status: 500 }
    )
  }
}

