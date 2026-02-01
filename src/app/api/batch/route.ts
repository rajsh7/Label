import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { loadDesign } from '@/server/actions/designs'
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


    // Determine dimensions based on template or label base

    // Generate PDF
    const pdfBuffer = generateSimplePDF(csv_data, template, column_mapping || {})

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

function generateSimplePDF(data: any[], _template: any, mapping: Record<string, string>) {
  const content = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 300>>stream
BT
/F1 12 Tf
50 750 Td
(Batch Labels - ${data.length} items) Tj
${data.map((row, i) => {
    const lines = Object.entries(mapping).map(([field, col]) => 
      `0 -20 Td (${field}: ${String(row[col] || '').replace(/[()\\]/g, '')}) Tj`
    ).join('\n')
    return `0 -30 Td (--- Label ${i + 1} ---) Tj\n${lines}`
  }).join('\n')}
ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000600 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
665
%%EOF`
  
  return Buffer.from(content)
}

