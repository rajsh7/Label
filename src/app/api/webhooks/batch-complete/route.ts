import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendBatchCompleteEmail } from '@/server/actions/email'

/**
 * POST /api/webhooks/batch-complete
 * Handle batch completion webhooks
 * Send notifications and update batch status
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret if configured
    const webhookSecret = request.headers.get('x-webhook-secret')
    const expectedSecret = process.env.BATCH_WEBHOOK_SECRET

    if (expectedSecret && webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { batchId, status, outputFileUrl, errorMessage } = body

    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Missing batchId' },
        { status: 400 }
      )
    }

    // Use service role client to update batch status
    const supabase = await createServerClient()

    // Update batch job status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
      if (outputFileUrl) {
        updateData.file_path = outputFileUrl
      }
    }

    if (status === 'failed' && errorMessage) {
      updateData.error_message = errorMessage
    }

    const { data: batchJob, error } = await supabase
      .from('batch_jobs')
      .update(updateData)
      .eq('id', batchId)
      .select('*, profiles(email)')
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to update batch job' },
        { status: 500 }
      )
    }

    // Send notification email if batch completed successfully
    if (status === 'completed' && batchJob && typeof batchJob.profiles === 'object' && 'email' in batchJob.profiles) {
      try {
        await sendBatchCompleteEmail({
          email: (batchJob.profiles as any).email,
          batchJobName: batchJob.id,
          totalLabels: batchJob.total_labels || 0,
          downloadUrl: outputFileUrl,
        })
      } catch (emailError) {
        // Email failure should not fail the webhook
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Batch completion processed',
      data: batchJob,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process batch completion' },
      { status: 500 }
    )
  }
}