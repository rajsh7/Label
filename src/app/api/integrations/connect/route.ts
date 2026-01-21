import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { checkFeatureAccess } from '@/lib/features/featureGates'

/**
 * POST /api/integrations/connect
 * Connect a WMS integration
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { platform, name, webhook_url, api_key, api_secret, shop_url, store_url, consumer_key, consumer_secret } = body

    if (!platform || !['shopify', 'woocommerce', 'custom'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be shopify, woocommerce, or custom' },
        { status: 400 }
      )
    }

    // Check if user has Enterprise plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const hasAccess = await checkFeatureAccess(
      'wms_integration',
      profile.subscription_tier
    )

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'WMS integrations are available for Enterprise users only' },
        { status: 403 }
      )
    }

    // Prepare integration data
    const integrationData: any = {
      user_id: session.user.id,
      platform,
      name: name || `${platform.charAt(0).toUpperCase() + platform.slice(1)} Integration`,
      status: 'active',
      webhook_url: webhook_url || null,
    }

    // Store credentials securely (in production, encrypt these)
    const credentials: any = {}
    if (platform === 'shopify') {
      credentials.shop_url = shop_url
      credentials.api_key = api_key
      credentials.api_secret = api_secret
    } else if (platform === 'woocommerce') {
      credentials.store_url = store_url
      credentials.consumer_key = consumer_key
      credentials.consumer_secret = consumer_secret
    } else if (platform === 'custom') {
      credentials.api_key = api_key
    }

    integrationData.credentials = credentials

    // Create integration
    const { data: integration, error: createError } = await supabase
      .from('integrations')
      .insert(integrationData)
      .select()
      .single()

    if (createError) {
      console.error('Create integration error:', createError)
      return NextResponse.json(
        { error: 'Failed to create integration' },
        { status: 500 }
      )
    }

    // Generate webhook URL for our platform
    const webhookEndpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/webhook/${integration.id}`

    // Update with webhook endpoint
    await supabase
      .from('integrations')
      .update({ webhook_endpoint: webhookEndpoint })
      .eq('id', integration.id)

    return NextResponse.json({
      success: true,
      integration_id: integration.id,
      webhook_endpoint: webhookEndpoint,
      message: 'Integration connected successfully',
    })
  } catch (error) {
    console.error('Connect integration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to connect integration' },
      { status: 500 }
    )
  }
}

