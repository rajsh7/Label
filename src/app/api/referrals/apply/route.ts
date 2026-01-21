import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase/server'
import { calculateReward, isReferralExpired, isReferralMaxedOut } from '@/lib/referrals/utils'

/**
 * POST /api/referrals/apply
 * Apply a referral code during signup or upgrade
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { referral_code } = body

    if (!referral_code) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    // Find referral code
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', referral_code.toUpperCase())
      .eq('status', 'active')
      .single()

    if (referralError || !referral) {
      return NextResponse.json(
        { error: 'Invalid or inactive referral code' },
        { status: 404 }
      )
    }

    // Check if expired
    if (isReferralExpired(referral.expires_at)) {
      // Update status
      await supabase
        .from('referrals')
        .update({ status: 'expired' })
        .eq('id', referral.id)

      return NextResponse.json(
        { error: 'Referral code has expired' },
        { status: 400 }
      )
    }

    // Check if maxed out
    if (isReferralMaxedOut(referral.current_uses, referral.max_uses)) {
      return NextResponse.json(
        { error: 'Referral code has reached maximum uses' },
        { status: 400 }
      )
    }

    // Check if user already used this code
    const { data: existingUsage } = await supabase
      .from('referral_usage')
      .select('id')
      .eq('referral_id', referral.id)
      .eq('referred_user_id', session.user.id)
      .single()

    if (existingUsage) {
      return NextResponse.json(
        { error: 'You have already used this referral code' },
        { status: 400 }
      )
    }

    // Check if user is trying to use their own code
    if (referral.referrer_id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot use your own referral code' },
        { status: 400 }
      )
    }

    // Calculate rewards
    const rewards = calculateReward({
      rewardType: referral.reward_type as 'credit' | 'discount' | 'trial',
      rewardValue: Number(referral.reward_value),
    })

    // Use server client for admin operations
    const serverSupabase = await createServerClient()

    // Apply reward to referred user
    if (rewards.referredReward > 0) {
      if (referral.reward_type === 'credit') {
        // Add credits to user profile
        const { data: profile } = await serverSupabase
          .from('profiles')
          .select('referral_credits')
          .eq('id', session.user.id)
          .single()

        await serverSupabase
          .from('profiles')
          .update({
            referral_credits: (profile?.referral_credits || 0) + rewards.referredReward,
          })
          .eq('id', session.user.id)
      } else if (referral.reward_type === 'trial') {
        // Extend trial period
        const { data: profile } = await serverSupabase
          .from('profiles')
          .select('trial_ends_at, subscription_tier')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          const currentTrialEnd = profile.trial_ends_at
            ? new Date(profile.trial_ends_at)
            : new Date()
          const newTrialEnd = new Date(
            currentTrialEnd.getTime() + rewards.referredReward * 24 * 60 * 60 * 1000
          )

          await serverSupabase
            .from('profiles')
            .update({
              trial_ends_at: newTrialEnd.toISOString(),
              subscription_tier: profile.subscription_tier === 'free' ? 'pro' : profile.subscription_tier,
              subscription_status: 'trialing',
            })
            .eq('id', session.user.id)
        }
      }
      // Discount is typically applied at checkout, not here
    }

    // Apply reward to referrer
    if (rewards.referrerReward > 0 && referral.referrer_id) {
      const { data: referrerProfile } = await serverSupabase
        .from('profiles')
        .select('referral_credits')
        .eq('id', referral.referrer_id)
        .single()

      await serverSupabase
        .from('profiles')
        .update({
          referral_credits: (referrerProfile?.referral_credits || 0) + rewards.referrerReward,
        })
        .eq('id', referral.referrer_id)
    }

    // Record referral usage
    await supabase.from('referral_usage').insert({
      referral_id: referral.id,
      referred_user_id: session.user.id,
      reward_applied: true,
      reward_value: rewards.referredReward,
    })

    // Update referral use count
    await supabase
      .from('referrals')
      .update({
        current_uses: referral.current_uses + 1,
      })
      .eq('id', referral.id)

    return NextResponse.json({
      success: true,
      message: 'Referral code applied successfully',
      reward: rewards.referredReward,
      rewardType: referral.reward_type,
    })
  } catch (error) {
    console.error('Apply referral error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to apply referral code' },
      { status: 500 }
    )
  }
}

