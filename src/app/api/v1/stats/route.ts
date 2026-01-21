import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { authenticateApiKey, checkRateLimit, incrementApiUsage } from '@/lib/api/apiAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/v1/stats
 * Get user statistics
 * Requires: API key authentication
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 })
    }

    const authenticatedUser = await authenticateApiKey(apiKey)
    if (!authenticatedUser.success || !authenticatedUser.userId) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const rateLimitCheck = await checkRateLimit(authenticatedUser.userId)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('labels_used_this_month, batches_used_this_month, subscription_tier')
      .eq('id', authenticatedUser.userId)
      .single()

    const { count: templatesCount } = await supabase
      .from('templates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authenticatedUser.userId)

    const { count: designsCount } = await supabase
      .from('label_designs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authenticatedUser.userId)

    const { data: apiKeyRecord } = await supabase
      .from('api_keys')
      .select('requests_today')
      .eq('id', authenticatedUser.keyId)
      .single()

    await incrementApiUsage(authenticatedUser.userId)

    return NextResponse.json({
      success: true,
      data: {
        labels_used_this_month: profile?.labels_used_this_month || 0,
        batches_used_this_month: profile?.batches_used_this_month || 0,
        templates_count: templatesCount || 0,
        designs_count: designsCount || 0,
        api_requests_today: apiKeyRecord?.requests_today || 0,
        api_requests_limit: 2000,
        subscription_tier: profile?.subscription_tier || 'free',
      },
    })
  } catch (error) {
    console.error('API stats error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

