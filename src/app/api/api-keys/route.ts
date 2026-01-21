import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { createHash, randomBytes } from 'crypto'

/**
 * POST /api/api-keys
 * Create a new API key for Enterprise users
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has Enterprise plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.subscription_tier !== 'enterprise') {
      return NextResponse.json(
        { error: 'API access is only available for Enterprise users' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

    // Generate API key
    const apiKey = `lpk_${randomBytes(32).toString('hex')}`
    const keyHash = createHash('sha256').update(apiKey).digest('hex')
    const keyPrefix = apiKey.substring(0, 20)

    // Store hashed key in database
    const { data: apiKeyRecord, error: insertError } = await supabase
      .from('api_keys')
      .insert({
        user_id: session.user.id,
        name: name.trim(),
        key_hash: keyHash,
        key_prefix: keyPrefix,
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error('API key creation error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      )
    }

    // Return the plain API key only once (user must save it)
    return NextResponse.json({
      success: true,
      api_key: apiKey,
      api_key_id: apiKeyRecord.id,
      message: 'API key created successfully',
    })
  } catch (error) {
    console.error('Create API key error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create API key' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/api-keys
 * List all API keys for the current user
 */
export async function GET() {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('List API keys error:', error)
      return NextResponse.json(
        { error: 'Failed to list API keys' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      api_keys: apiKeys || [],
    })
  } catch (error) {
    console.error('List API keys error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list API keys' },
      { status: 500 }
    )
  }
}

