import { NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
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

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get total users
    const { count: totalUsers } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    // Get active users today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const { count: activeToday } = await adminSupabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString())
      .not('user_id', 'is', null)

    // Get user growth
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const { count: thisMonthUsers } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonthStart.toISOString())
      .is('deleted_at', null)

    const { count: lastMonthUsers } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonthStart.toISOString())
      .lte('created_at', lastMonthEnd.toISOString())
      .is('deleted_at', null)

    const growthPercent =
      lastMonthUsers && lastMonthUsers > 0
        ? ((thisMonthUsers! - lastMonthUsers) / lastMonthUsers) * 100
        : 0

    // Get usage stats
    const { count: totalLabels } = await adminSupabase
      .from('label_designs')
      .select('*', { count: 'exact', head: true })

    const { count: totalBatches } = await adminSupabase
      .from('batch_jobs')
      .select('*', { count: 'exact', head: true })

    // Calculate revenue based on active subscriptions
    const { data: subscriptions } = await adminSupabase
      .from('subscriptions')
      .select('plan_id')
      .eq('status', 'active')

    const monthlyRevenue =
      (subscriptions?.filter((s) => s.plan_id === 'pro').length || 0) * 7.99 +
      (subscriptions?.filter((s) => s.plan_id === 'enterprise').length || 0) * 39.99

    const totalRevenue = monthlyRevenue * 12 // Simplified calculation

    // Get recent activity
    const { data: recentActivity } = await adminSupabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      total_users: totalUsers || 0,
      active_users_today: activeToday || 0,
      total_revenue: totalRevenue,
      monthly_revenue: monthlyRevenue,
      total_labels: totalLabels || 0,
      total_batches: totalBatches || 0,
      user_growth: {
        this_month: thisMonthUsers || 0,
        last_month: lastMonthUsers || 0,
        growth_percent: growthPercent,
      },
      recent_activity:
        recentActivity?.map((log) => ({
          id: log.id,
          type: log.action,
          description: `${log.action} - ${log.entity_type || 'unknown'}`,
          created_at: log.created_at,
        })) || [],
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

