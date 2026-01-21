import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { loadDesign } from '@/server/actions/designs'
import { generateBatchPDF } from '@/lib/pdf/generator'
import { rateLimitAPI, API_RATE_LIMITS } from '@/lib/rateLimit/apiRateLimit'
import type { PDFStorageResult } from '@/lib/storage/pdfStorage'

/**
 * POST /api/batch
 * Generate batch labels from template and CSV data
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const rateLimitResult = rateLimitAPI(request, API_RATE_LIMITS.batch)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { template_id, csv_data, column_mapping } = body

    // Validate input
    if (!template_id || !csv_data || !Array.isArray(csv_data) || csv_data.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: template_id, csv_data' },
        { status: 400 }
      )
    }

    // Check usage limits (free tier: 4 batches/month)
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, batches_used_this_month')
      .eq('id', session.user.id)
      .single()

    const isFreeTier = !profile || profile.subscription_tier === 'free'
    const batchesUsed = profile?.batches_used_this_month || 0

    // Check limits based on tier
    const isProTier = profile?.subscription_tier === 'pro'
    const batchLimit = isFreeTier ? 4 : isProTier ? 50 : Infinity

    if (batchesUsed >= batchLimit) {
      const upgradePlan = isFreeTier ? 'pro' : 'enterprise'
      return NextResponse.json(
        {
          error: `Batch limit exceeded. You've used ${batchesUsed} of ${batchLimit} batches this month.`,
          upgradeRequired: true,
          upgradePlan,
        },
        { status: 403 }
      )
    }

    // Load template
    const templateResult = await loadDesign(template_id)
    if (!templateResult.success || !templateResult.data) {
      return NextResponse.json(
        { error: templateResult.error || 'Template not found' },
        { status: 404 }
      )
    }

    const template = templateResult.data

    // Get label base info for dimensions
    const { data: labelBase } = await supabase
      .from('labels')
      .select('*')
      .eq('id', template.label_base_id || 1)
      .single()

    // Determine dimensions based on template or label base
    const dpi = 203 // Default, can be stored in template
    const width_px = labelBase ? (dpi === 203 ? labelBase.width_px_203dpi : labelBase.width_px_300dpi) : 812
    const height_px = labelBase ? (dpi === 203 ? labelBase.height_px_203dpi : labelBase.height_px_300dpi) : 1218

    // Generate PDF
    const pdfBuffer = await generateBatchPDF({
      template: {
        id: template.id,
        name: template.name,
        elements: template.elements as any,
        width_px: width_px || 812,
        height_px: height_px || 1218,
        dpi,
      },
      csvData: csv_data,
      columnMapping: column_mapping || {},
    })

    // Create batch job record (minimal fields only due to schema cache issue)
    const batchJobData = {
      user_id: session.user.id,
      template_id: template_id,
      total_labels: csv_data.length,
      status: 'completed' as const,
      completed_at: new Date().toISOString(),
    }

    // Save batch job to database first to get the ID
    console.log('Attempting to save batch job with data:', batchJobData)
    const { data: batchJob, error: batchError } = await supabase
      .from('batch_jobs')
      .insert(batchJobData)
      .select()
      .single()

    if (batchError) {
      console.error('❌ Batch job save error:', batchError)
      console.error('Error details:', JSON.stringify(batchError, null, 2))
      console.error('Batch job data:', JSON.stringify(batchJobData, null, 2))
      // Continue anyway - still return the PDF even if history save fails
    } else {
      console.log('✅ Batch job saved successfully:', batchJob?.id)
      console.log('Batch job details:', batchJob)
    }

    // Upload PDF to Supabase Storage
    let uploadResult: PDFStorageResult = { success: false }
    if (batchJob) {
      const { storePDF } = await import('@/lib/storage/pdfStorage')
      uploadResult = await storePDF({
        supabase,
        buffer: pdfBuffer,
        userId: session.user.id,
        batchJobId: batchJob.id,
        folder: 'batch',
      })

      // Update batch job with file URL if upload succeeded
      if (uploadResult.success && uploadResult.url) {
        await supabase
          .from('batch_jobs')
          .update({
            output_file_url: uploadResult.url,
            file_path: uploadResult.path,
          })
          .eq('id', batchJob.id)
      }
    }

    // Update user's batch count (only increment if not unlimited)
    if (profile?.subscription_tier !== 'enterprise') {
      await supabase
        .from('profiles')
        .update({ batches_used_this_month: batchesUsed + 1 })
        .eq('id', session.user.id)
    }

    // Send completion email if user has email notifications enabled
    if (batchJob && uploadResult.url) {
      try {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('email, full_name, notification_preferences')
          .eq('id', session.user.id)
          .single()

        const notificationPrefs = userProfile?.notification_preferences as any
        const shouldSendEmail = notificationPrefs?.email_notifications !== false && 
                                 notificationPrefs?.batch_complete !== false

        if (userProfile?.email && shouldSendEmail) {
          const { sendBatchCompleteEmail } = await import('@/server/actions/email')
          await sendBatchCompleteEmail({
            email: userProfile.email,
            batchJobName: 'Batch Job',
            totalLabels: csv_data.length,
            downloadUrl: uploadResult.url,
            userName: userProfile.full_name || undefined,
          })
        }
      } catch (emailError) {
        // Don't fail the request if email fails
        console.error('Failed to send batch complete email:', emailError)
      }
    }

    // Return PDF data (base64 for immediate download, URL for future access)
    return NextResponse.json({
      success: true,
      batch_id: batchJob?.id,
      pdf_base64: pdfBuffer.toString('base64'),
      pdf_url: uploadResult.url,
      pdf_path: uploadResult.path,
      total_labels: csv_data.length,
      message: `Successfully generated ${csv_data.length} labels`,
    })
  } catch (error) {
    console.error('Batch generation error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate batch labels',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/batch
 * Get user's batch job history
 */
export async function GET(_request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: batchJobs, error } = await supabase
      .from('batch_jobs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: batchJobs || [] })
  } catch (error) {
    console.error('Get batch jobs error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get batch jobs' },
      { status: 500 }
    )
  }
}

