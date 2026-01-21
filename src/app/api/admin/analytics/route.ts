import { NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/admin/analytics
 * Get detailed analytics including MRR, churn, CAC
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

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get subscription data (assuming subscriptions table exists)
    // For now, calculate based on profiles table subscription_tier
    const { data: allProfiles } = await adminSupabase
      .from('profiles')
      .select('subscription_tier, subscription_status, created_at')
      .is('deleted_at', null)

    // Calculate MRR (Monthly Recurring Revenue)
    const proUsers = allProfiles?.filter((p) => p.subscription_tier === 'pro' && p.subscription_status === 'active').length || 0
    const enterpriseUsers = allProfiles?.filter((p) => p.subscription_tier === 'enterprise' && p.subscription_status === 'active').length || 0
    const mrr = proUsers * 7.99 + enterpriseUsers * 39.99
    const arr = mrr * 12 // Annual Recurring Revenue

    // Calculate churn rate
    const { count: totalActiveUsers } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .in('subscription_status', ['active', 'trialing'])
      .is('deleted_at', null)

    const { count: canceledThisMonth } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'canceled')
      .gte('updated_at', thisMonthStart.toISOString())
      .is('deleted_at', null)

    const churnRate = totalActiveUsers && totalActiveUsers > 0
      ? ((canceledThisMonth || 0) / totalActiveUsers) * 100
      : 0

    // Calculate CAC (Customer Acquisition Cost)
    // This would ideally come from marketing spend data
    // For now, we'll provide a placeholder calculation
    const { count: newUsersThisMonth } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonthStart.toISOString())
      .is('deleted_at', null)

    // Calculate user growth
    const { count: newUsersLastMonth } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonthStart.toISOString())
      .lte('created_at', lastMonthEnd.toISOString())
      .is('deleted_at', null)

    const lastMonthUsers = newUsersLastMonth || 0
    const userGrowth = lastMonthUsers > 0
      ? ((newUsersThisMonth || 0) - lastMonthUsers) / lastMonthUsers * 100
      : (newUsersThisMonth || 0) > 0 ? 100 : 0

    // Calculate conversion rate (free to paid)
    const { count: freeUsers } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'free')
      .is('deleted_at', null)

    const { count: paidUsers } = await adminSupabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .in('subscription_tier', ['pro', 'enterprise'])
      .is('deleted_at', null)

    const totalUsers = (freeUsers || 0) + (paidUsers || 0)
    const conversionRate = totalUsers > 0
      ? ((paidUsers || 0) / totalUsers) * 100
      : 0

    // Get feature usage statistics
    const { count: totalLabels } = await adminSupabase
      .from('label_designs')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    const { count: totalBatches } = await adminSupabase
      .from('batch_jobs')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    // Get template count (check if templates table exists, otherwise count from label_designs with is_template=true)
    let templateCount = 0
    try {
      const { count: templatesFromTable } = await adminSupabase
        .from('templates')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)
      templateCount = templatesFromTable || 0
    } catch (error) {
      // Templates might be in label_designs with is_template flag
      const { count: templatesFromDesigns } = await adminSupabase
        .from('label_designs')
        .select('*', { count: 'exact', head: true })
        .eq('is_template', true)
        .is('deleted_at', null)
      templateCount = templatesFromDesigns || 0
    }

    // Top features used
    const topFeatures = [
      { name: 'Label Creation', count: totalLabels || 0 },
      { name: 'Batch Processing', count: totalBatches || 0 },
      { name: 'Template Saving', count: templateCount },
    ]

    return NextResponse.json({
      revenue: {
        mrr,
        arr,
        breakdown: {
          pro: {
            users: proUsers,
            revenue: proUsers * 7.99,
          },
          enterprise: {
            users: enterpriseUsers,
            revenue: enterpriseUsers * 39.99,
          },
        },
      },
      churn: {
        rate: churnRate,
        canceled_this_month: canceledThisMonth || 0,
        total_active_users: totalActiveUsers || 0,
      },
      acquisition: {
        new_users_this_month: newUsersThisMonth || 0,
        new_users_last_month: lastMonthUsers || 0,
        growth_percent: userGrowth,
        conversion_rate: conversionRate,
        // CAC would require marketing spend data
        cac: null, // Placeholder - needs marketing spend data
      },
      users: {
        total: totalUsers,
        free: freeUsers || 0,
        paid: paidUsers || 0,
      },
      features: {
        total_labels_created: totalLabels || 0,
        total_batches: totalBatches || 0,
        top_features: topFeatures,
      },
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

