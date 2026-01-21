import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateBatchPDF } from '@/lib/pdf/generator'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * POST /api/integrations/webhook/[id]
 * Webhook endpoint for receiving integration events
 * This endpoint is called by external platforms (Shopify, WooCommerce, etc.)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get integration
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (integrationError || !integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
    }

    // Verify webhook signature if provided
    const signature = request.headers.get('x-webhook-signature')
    if (signature && integration.credentials?.webhook_secret) {
      // Verify signature (implementation depends on platform)
      // For now, we'll skip this but it should be implemented in production
    }

    const body = await request.json()

    // Process webhook based on platform
    let orderData: any[] = []
    
    if (integration.platform === 'shopify') {
      // Parse Shopify order webhook
      orderData = parseShopifyWebhook(body)
    } else if (integration.platform === 'woocommerce') {
      // Parse WooCommerce order webhook
      orderData = parseWooCommerceWebhook(body)
    } else {
      // Custom webhook - expect format: { orders: [...] }
      orderData = body.orders || [body]
    }

    // Get default template for this user
    const { data: defaultTemplate } = await supabase
      .from('templates')
      .select('*, labels(*)')
      .eq('user_id', integration.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!defaultTemplate) {
      return NextResponse.json({ error: 'No template found for user' }, { status: 400 })
    }

    // Generate labels for orders
    const templateData = {
      id: defaultTemplate.id,
      name: defaultTemplate.name,
      elements: defaultTemplate.elements || [],
      width_px: (defaultTemplate.labels as any)?.width_px_203dpi || 812,
      height_px: (defaultTemplate.labels as any)?.height_px_203dpi || 1218,
      dpi: 203 as const,
    }

    // Generate PDF
    const pdfBuffer = await generateBatchPDF({
      template: templateData,
      csvData: orderData,
      columnMapping: {},
    })

    // Upload to storage
    const fileName = `integrations/${integration.user_id}/${integration.id}_${Date.now()}.pdf`
    await supabase.storage
      .from('label_outputs')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    // Update integration last_sync
    await supabase
      .from('integrations')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', id)

    return NextResponse.json({
      success: true,
      message: 'Labels generated successfully',
      labels_count: orderData.length,
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

/**
 * Parse Shopify webhook data
 */
function parseShopifyWebhook(body: any): any[] {
  // Shopify order webhook format
  const order = body.order || body
  const lineItems = order.line_items || []

  return lineItems.map((item: any) => ({
    'Product Name': item.name,
    'SKU': item.sku || item.variant_id,
    'Quantity': item.quantity,
    'Order Number': order.order_number || order.name,
    'Customer': `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
  }))
}

/**
 * Parse WooCommerce webhook data
 */
function parseWooCommerceWebhook(body: any): any[] {
  // WooCommerce order webhook format
  const order = body
  const lineItems = order.line_items || []

  return lineItems.map((item: any) => ({
    'Product Name': item.name,
    'SKU': item.sku,
    'Quantity': item.quantity,
    'Order Number': order.number,
    'Customer': `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim(),
  }))
}

