import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimitAPI, API_RATE_LIMITS } from '@/lib/rateLimit/apiRateLimit'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/user/export-data
 * Export user's data in GDPR-compliant format
 * Returns JSON with all user data for download
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limit check
    const rateLimitResult = rateLimitAPI(request, API_RATE_LIMITS.export)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

    // Collect all user data
    const exportData: any = {
      export_date: new Date().toISOString(),
      user_id: userId,
      email: session.user.email,
      metadata: {},
    }

    // Get user profile
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profile) {
      exportData.profile = {
        full_name: profile.full_name,
        company_name: profile.company_name,
        subscription_tier: profile.subscription_tier,
        subscription_status: profile.subscription_status,
        timezone: profile.timezone,
        language: profile.language,
        notification_preferences: profile.notification_preferences,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }
    }

    // Get label designs
    const { data: designs } = await adminSupabase
      .from('label_designs')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)

    if (designs) {
      exportData.label_designs = designs.map((design) => ({
        id: design.id,
        name: design.name,
        label_base_id: design.label_base_id,
        width_px: design.width_px,
        height_px: design.height_px,
        dpi: design.dpi,
        is_template: design.is_template,
        created_at: design.created_at,
        updated_at: design.updated_at,
        // Note: elements are included but may be large
        elements: design.elements,
      }))
    }

    // Get batch jobs
    const { data: batchJobs } = await adminSupabase
      .from('batch_jobs')
      .select('*')
      .eq('user_id', userId)

    if (batchJobs) {
      exportData.batch_jobs = batchJobs.map((job) => ({
        id: job.id,
        template_id: job.template_id,
        design_id: job.design_id,
        total_labels: job.total_labels,
        generated_labels: job.generated_labels,
        status: job.status,
        created_at: job.created_at,
        completed_at: job.completed_at,
        // Note: data_rows and column_mapping excluded to reduce size
        // They can be included if needed
      }))
    }

    // Get printers
    const { data: printers } = await adminSupabase
      .from('printers')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)

    if (printers) {
      exportData.printers = printers.map((printer) => ({
        id: printer.id,
        name: printer.name,
        printer_type: printer.printer_type,
        connection_type: printer.connection_type,
        network_ip: printer.network_ip,
        dpi: printer.dpi,
        darkness_level: printer.darkness_level,
        label_gap: printer.label_gap,
        is_default: printer.is_default,
        created_at: printer.created_at,
        updated_at: printer.updated_at,
      }))
    }

    // Get favorites
    const { data: favorites } = await adminSupabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)

    if (favorites) {
      exportData.favorites = favorites.map((fav) => ({
        label_id: fav.label_id,
        created_at: fav.created_at,
      }))
    }

    // Return as downloadable JSON
    const jsonData = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })

    const response = new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="labelpro-data-export-${userId}-${Date.now()}.json"`,
      },
    })

    // Note: Rate limit headers are handled by rateLimitAPI function above
    return response
  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to export data' },
      { status: 500 }
    )
  }
}

