import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { authenticateApiKey, checkRateLimit, incrementApiUsage } from '@/lib/api/apiAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/v1/templates
 * List user's templates
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

    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', authenticatedUser.userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('List templates error:', error)
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
    }

    await incrementApiUsage(authenticatedUser.userId)

    return NextResponse.json({
      success: true,
      data: templates || [],
    })
  } catch (error) {
    console.error('API templates error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

