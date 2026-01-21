import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/webhooks/supabase
 * Handle Supabase real-time events
 * Process database changes/triggers
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret if configured
    const webhookSecret = request.headers.get('x-webhook-secret')
    const expectedSecret = process.env.SUPABASE_WEBHOOK_SECRET

    if (expectedSecret && webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, table, record, old_record } = body

    console.log('Supabase webhook received:', { type, table, record })

    // Handle different event types
    switch (type) {
      case 'INSERT':
        // Handle insert events
        if (table === 'batch_jobs' && record.status === 'completed') {
          // Could trigger notifications, analytics, etc.
          console.log('Batch job completed:', record.id)
        }
        break

      case 'UPDATE':
        // Handle update events
        if (table === 'batch_jobs' && record.status === 'completed' && old_record?.status !== 'completed') {
          // Batch job just completed
          console.log('Batch job status changed to completed:', record.id)
        }
        break

      case 'DELETE':
        // Handle delete events
        console.log('Record deleted from', table, ':', record.id)
        break

      default:
        console.log('Unknown webhook type:', type)
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
    })
  } catch (error) {
    console.error('Supabase webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}