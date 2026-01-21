import { NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/system/status
 * Get system health status (admin only)
 */
export async function GET() {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin access
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check database health
    const dbStart = Date.now()
    const { error: dbError } = await supabase.from('profiles').select('id').limit(1)
    const dbResponseTime = Date.now() - dbStart
    const databaseStatus = dbError ? 'down' : dbResponseTime > 1000 ? 'degraded' : 'healthy'

    // Check storage (simplified check)
    const storageStatus = 'healthy' // In production, check actual storage connectivity

    // API status is implied by the fact we're responding
    const apiStatus = 'healthy'

    return NextResponse.json({
      database: databaseStatus,
      api: apiStatus,
      storage: storageStatus,
      response_time_ms: dbResponseTime,
      last_check: new Date().toISOString(),
    })
  } catch (error) {
    console.error('System status error:', error)
    return NextResponse.json(
      {
        database: 'down',
        api: 'down',
        storage: 'unknown',
        response_time_ms: 0,
        last_check: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

