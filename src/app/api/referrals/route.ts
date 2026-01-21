import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { generateReferralCode, isValidReferralCode } from '@/lib/referrals/utils'

/**
 * GET /api/referrals
 * Get user's referral codes
 */
export async function GET(_request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get referrals error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch referrals' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, referrals })
  } catch (error) {
    console.error('Get referrals error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch referrals' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/referrals
 * Create a new referral code
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      referral_code,
      reward_type = 'credit',
      reward_value = 10,
      max_uses,
      expires_at,
    } = body

    // Generate code if not provided
    let code = referral_code
    if (!code) {
      code = generateReferralCode()
    } else {
      // Validate provided code
      if (!isValidReferralCode(code)) {
        return NextResponse.json(
          { error: 'Invalid referral code format' },
          { status: 400 }
        )
      }
    }

    // Check if code already exists
    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('referral_code', code.toUpperCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Referral code already exists' },
        { status: 400 }
      )
    }

    // Create referral
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: session.user.id,
        referral_code: code.toUpperCase(),
        reward_type,
        reward_value,
        max_uses: max_uses || null,
        expires_at: expires_at || null,
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      console.error('Create referral error:', error)
      return NextResponse.json(
        { error: 'Failed to create referral code' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, referral: data })
  } catch (error) {
    console.error('Create referral error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create referral code' },
      { status: 500 }
    )
  }
}

