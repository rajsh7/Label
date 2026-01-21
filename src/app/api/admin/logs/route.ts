import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/admin/logs
 * Get audit logs (admin only)
 */
export async function GET(request: NextRequest) {
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

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

    const { searchParams } = request.nextUrl
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = adminSupabase
      .from('audit_logs')
      .select(`
        *,
        profiles!audit_logs_user_id_fkey(email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (action && action !== 'all') {
      query = query.eq('action', action)
    }

    const { data: logs, error } = await query

    if (error) {
      console.error('List audit logs error:', error)
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }

    const formattedLogs = (logs || []).map((log: any) => ({
      ...log,
      user_email: log.profiles?.email || null,
    }))

    return NextResponse.json({
      logs: formattedLogs,
    })
  } catch (error) {
    console.error('Admin logs error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

