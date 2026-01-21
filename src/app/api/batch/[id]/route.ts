import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/batch/[id]
 * Fetch batch job status and details by ID
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: batchJob, error } = await supabase
      .from('batch_jobs')
      .select('*, templates(name), labels(name, category)')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error || !batchJob) {
      return NextResponse.json(
        { success: false, error: 'Batch job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: batchJob,
    })
  } catch (error) {
    console.error('Get batch job error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch batch job' },
      { status: 500 }
    )
  }
}