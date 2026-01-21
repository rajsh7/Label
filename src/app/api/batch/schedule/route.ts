import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { checkFeatureAccess } from '@/lib/features/featureGates'

/**
 * POST /api/batch/schedule
 * Schedule a batch job for later execution
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { template_id, design_id, data_rows, column_mapping, scheduled_for } = body

    // Check if user has access to batch scheduling
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const hasAccess = await checkFeatureAccess(
      'schedule_batch',
      profile.subscription_tier
    )

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Batch scheduling is available for Pro and Enterprise users only',
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // Check scheduled job limit for Pro users
    if (profile.subscription_tier === 'pro') {
      const { count } = await supabase
        .from('scheduled_batch_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('status', 'scheduled')

      if ((count || 0) >= 2) {
        return NextResponse.json(
          {
            error: 'You have reached the limit of 2 scheduled batch jobs. Upgrade to Enterprise for unlimited scheduling.',
            upgradeRequired: true,
          },
          { status: 403 }
        )
      }
    }

    // Validate scheduled_for is in the future
    const scheduledDate = new Date(scheduled_for)
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      )
    }

    // Create scheduled batch job
    const { data: scheduledJob, error: scheduleError } = await supabase
      .from('scheduled_batch_jobs')
      .insert({
        user_id: session.user.id,
        template_id: template_id || null,
        design_id: design_id || null,
        data_rows,
        column_mapping,
        total_labels: data_rows?.length || 0,
        scheduled_for: scheduledDate.toISOString(),
        status: 'scheduled',
      })
      .select()
      .single()

    if (scheduleError) {
      console.error('Schedule batch job error:', scheduleError)
      return NextResponse.json(
        { error: 'Failed to schedule batch job' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      scheduled_job_id: scheduledJob.id,
      message: 'Batch job scheduled successfully',
    })
  } catch (error) {
    console.error('Schedule batch API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to schedule batch job' },
      { status: 500 }
    )
  }
}

