import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateBatchPDF } from '@/lib/pdf/generator'
import type { TemplateData } from '@/lib/pdf/generator'

/**
 * POST /api/cron/process-scheduled-batches
 * This endpoint should be called by a cron job to process scheduled batch jobs
 * Can be called manually or via Vercel Cron
 */
export async function POST(request: NextRequest) {
  // Verify cron secret if needed
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Service role key not configured' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const now = new Date().toISOString()

    // Find all scheduled jobs that are due
    const { data: scheduledJobs, error: fetchError } = await supabase
      .from('scheduled_batch_jobs')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .limit(50) // Process 50 at a time

    if (fetchError) {
      console.error('Fetch scheduled jobs error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch scheduled jobs' },
        { status: 500 }
      )
    }

    if (!scheduledJobs || scheduledJobs.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No scheduled jobs to process',
      })
    }

    let processed = 0
    let failed = 0

    // Process each scheduled job
    for (const scheduledJob of scheduledJobs) {
      try {
        // Update status to processing
        await supabase
          .from('scheduled_batch_jobs')
          .update({ status: 'processing' })
          .eq('id', scheduledJob.id)

        // Get template or design
        let template = null
        if (scheduledJob.template_id) {
          const { data } = await supabase
            .from('templates')
            .select('*, labels(*)')
            .eq('id', scheduledJob.template_id)
            .single()

          if (data) {
            template = {
              id: data.id,
              name: data.name,
              elements: data.elements || [],
              width_px: data.labels?.width_px_203dpi || 812,
              height_px: data.labels?.height_px_203dpi || 1218,
              dpi: 203,
            } as TemplateData
          }
        } else if (scheduledJob.design_id) {
          const { data } = await supabase
            .from('label_designs')
            .select('*, labels(*)')
            .eq('id', scheduledJob.design_id)
            .single()

          if (data) {
            template = {
              id: data.id,
              name: data.name,
              elements: data.elements || [],
              width_px: data.labels?.width_px_203dpi || 812,
              height_px: data.labels?.height_px_203dpi || 1218,
              dpi: 203,
            } as TemplateData
          }
        }

        if (!template) {
          throw new Error('Template or design not found')
        }

        // Generate PDF
        const pdfBuffer = await generateBatchPDF({
          template,
          csvData: scheduledJob.data_rows || [],
          columnMapping: scheduledJob.column_mapping || {},
        })

        // Upload PDF to storage using the storage utility
        const { storePDF } = await import('@/lib/storage/pdfStorage')
        const uploadResult = await storePDF({
          supabase,
          buffer: pdfBuffer,
          userId: scheduledJob.user_id,
          batchJobId: scheduledJob.id,
          folder: 'batch',
          skipAuthCheck: true, // Using service role client
        })

        if (!uploadResult.success || !uploadResult.url) {
          throw new Error(`Upload failed: ${uploadResult.error || 'Unknown error'}`)
        }

        // Create batch job record
        const { data: batchJob, error: batchJobError } = await supabase
          .from('batch_jobs')
          .insert({
            user_id: scheduledJob.user_id,
            template_id: scheduledJob.template_id,
            design_id: scheduledJob.design_id,
            data_rows: scheduledJob.data_rows,
            column_mapping: scheduledJob.column_mapping,
            total_labels: scheduledJob.total_labels,
            generated_labels: scheduledJob.total_labels,
            status: 'completed',
            output_file_url: uploadResult.url,
            file_path: uploadResult.path,
            completed_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (batchJobError) {
          throw new Error(`Batch job creation failed: ${batchJobError.message}`)
        }

        // Update scheduled job
        await supabase
          .from('scheduled_batch_jobs')
          .update({
            status: 'completed',
            batch_job_id: batchJob.id,
            executed_at: new Date().toISOString(),
          })
          .eq('id', scheduledJob.id)

        processed++
      } catch (error) {
        console.error(`Error processing scheduled job ${scheduledJob.id}:`, error)

        // Update scheduled job with error
        await supabase
          .from('scheduled_batch_jobs')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            executed_at: new Date().toISOString(),
          })
          .eq('id', scheduledJob.id)

        failed++
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      failed,
      total: scheduledJobs.length,
    })
  } catch (error) {
    console.error('Process scheduled batches error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process scheduled batches' },
      { status: 500 }
    )
  }
}

