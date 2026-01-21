import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * GET /api/referrals/stats
 * Get referral statistics for the current user
 */
export async function GET(_request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's referral codes with usage stats
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('id, referral_code, current_uses, max_uses, created_at')
      .eq('referrer_id', session.user.id)

    if (referralsError) {
      console.error('Get referral stats error:', referralsError)
      return NextResponse.json(
        { error: 'Failed to fetch referral stats' },
        { status: 500 }
      )
    }

    // Get total referrals (usage count)
    const { data: usage, error: usageError } = await supabase
      .from('referral_usage')
      .select('referral_id, reward_value')
      .in(
        'referral_id',
        referrals?.map((r) => r.id) || []
      )

    if (usageError) {
      console.error('Get referral usage error:', usageError)
    }

    // Calculate stats
    const totalReferrals = referrals?.length || 0
    const totalUses = usage?.length || 0
    const totalRewardGiven = usage?.reduce((sum, u) => sum + Number(u.reward_value || 0), 0) || 0

    // Get user's referral credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_credits')
      .eq('id', session.user.id)
      .single()

    return NextResponse.json({
      success: true,
      stats: {
        totalCodes: totalReferrals,
        totalUses,
        totalRewardGiven,
        referralCredits: profile?.referral_credits || 0,
        codes: referrals?.map((ref) => ({
          code: ref.referral_code,
          uses: ref.current_uses,
          maxUses: ref.max_uses,
          createdAt: ref.created_at,
        })),
      },
    })
  } catch (error) {
    console.error('Get referral stats error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch referral stats' },
      { status: 500 }
    )
  }
}

