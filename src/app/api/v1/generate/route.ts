import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateBatchPDF } from '@/lib/pdf/generator'
import { authenticateApiKey, checkRateLimit, incrementApiUsage } from '@/lib/api/apiAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * POST /api/v1/generate
 * Generate labels from template and data
 * Requires: API key authentication
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { template_id, data_rows, column_mapping } = body

    if (!template_id || !data_rows || !Array.isArray(data_rows)) {
      return NextResponse.json(
        { error: 'Missing required fields: template_id, data_rows' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*, labels(*)')
      .eq('id', template_id)
      .eq('user_id', authenticatedUser.userId)
      .single()

    if (templateError || !template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Prepare template data for PDF generation
    const templateData = {
      id: template.id,
      name: template.name,
      elements: template.elements || [],
      width_px: (template.labels as any)?.width_px_203dpi || 812,
      height_px: (template.labels as any)?.height_px_203dpi || 1218,
      dpi: 203 as const,
    }

    // Generate PDF
    const pdfBuffer = await generateBatchPDF({
      template: templateData,
      csvData: data_rows,
      columnMapping: column_mapping || {},
    })

    // Upload to storage
    const fileName = `api/${authenticatedUser.userId}/${template_id}_${Date.now()}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('label_outputs')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload generated PDF' }, { status: 500 })
    }

    // Get signed URL (valid for 1 hour)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('label_outputs')
      .createSignedUrl(fileName, 3600)

    if (urlError || !urlData) {
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
    }

    // Record batch job
    await supabase.from('batch_jobs').insert({
      user_id: authenticatedUser.userId,
      template_id,
      data_rows,
      column_mapping: column_mapping || {},
      total_labels: data_rows.length,
      generated_labels: data_rows.length,
      status: 'completed',
      output_file_url: urlData.signedUrl,
      completed_at: new Date().toISOString(),
    })

    await incrementApiUsage(authenticatedUser.userId)

    return NextResponse.json({
      success: true,
      data: {
        download_url: urlData.signedUrl,
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        total_labels: data_rows.length,
      },
    })
  } catch (error) {
    console.error('API generate error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

