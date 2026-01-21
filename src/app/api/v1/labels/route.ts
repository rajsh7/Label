import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/v1/labels
 * List all available label types
 * Requires: API key authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate API key
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 })
    }

    const authenticatedUser = await authenticateApiKey(apiKey)
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Check rate limit
    const rateLimitCheck = await checkRateLimit(authenticatedUser.user_id, apiKey)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
        { status: 429, headers: { 'Retry-After': String(rateLimitCheck.retryAfter || 60) } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get query parameters
    const { searchParams } = request.nextUrl
    const category = searchParams.get('category')
    const marketplace = searchParams.get('marketplace')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('labels')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('name', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }
    if (marketplace) {
      query = query.eq('marketplace', marketplace)
    }

    const { data: labels, error } = await query

    if (error) {
      console.error('List labels error:', error)
      return NextResponse.json({ error: 'Failed to fetch labels' }, { status: 500 })
    }

    // Increment API usage
    await incrementApiUsage(authenticatedUser.user_id, apiKey)

    return NextResponse.json({
      success: true,
      data: labels || [],
      pagination: {
        limit,
        offset,
        total: labels?.length || 0,
      },
    })
  } catch (error) {
    console.error('API labels error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Authenticate API key and return user info
 */
async function authenticateApiKey(apiKey: string): Promise<{ user_id: string; key_id: string } | null> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const keyHash = createHash('sha256').update(apiKey).digest('hex')

  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id, id, profiles!inner(subscription_tier)')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  // Verify user has Enterprise plan
  const profile = (data as any).profiles
  if (!profile || profile.subscription_tier !== 'enterprise') {
    return null
  }

  return {
    user_id: data.user_id,
    key_id: data.id,
  }
}

/**
 * Check rate limit for API key
 */
async function checkRateLimit(
  _userId: string,
  apiKey: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const keyHash = createHash('sha256').update(apiKey).digest('hex')

  const { data: apiKeyRecord } = await supabase
    .from('api_keys')
    .select('requests_today, last_used_at')
    .eq('key_hash', keyHash)
    .single()

  if (!apiKeyRecord) {
    return { allowed: false }
  }

  // Reset daily count if it's a new day
  const lastUsed = apiKeyRecord.last_used_at
    ? new Date(apiKeyRecord.last_used_at)
    : null
  const now = new Date()

  if (!lastUsed || lastUsed.toDateString() !== now.toDateString()) {
    // Reset for new day
    await supabase
      .from('api_keys')
      .update({ requests_today: 0 })
      .eq('key_hash', keyHash)
    return { allowed: true }
  }

  // Check limit (2000 requests per day for Enterprise)
  const dailyLimit = 2000
  if (apiKeyRecord.requests_today >= dailyLimit) {
    // Calculate seconds until midnight
    const tomorrow = new Date(now)
    tomorrow.setHours(24, 0, 0, 0)
    const retryAfter = Math.ceil((tomorrow.getTime() - now.getTime()) / 1000)
    return { allowed: false, retryAfter }
  }

  return { allowed: true }
}

/**
 * Increment API usage counter
 */
async function incrementApiUsage(_userId: string, apiKey: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const keyHash = createHash('sha256').update(apiKey).digest('hex')

  await supabase.rpc('increment_api_usage', {
    key_hash: keyHash,
  })
}

