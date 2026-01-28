'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, Activity, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface DashboardStats {
  total_users: number
  active_users_today: number
  total_revenue: number
  monthly_revenue: number
  total_labels: number
  total_batches: number
  user_growth: {
    this_month: number
    last_month: number
    growth_percent: number
  }
  recent_activity: Array<{
    id: string
    type: string
    description: string
    created_at: string
  }>
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      // Get users created today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: activeToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())
      
      // Get total labels
      const { count: totalLabels } = await supabase
        .from('labels')
        .select('*', { count: 'exact', head: true })
      
      // Get total batches
      const { count: totalBatches } = await supabase
        .from('batch_jobs')
        .select('*', { count: 'exact', head: true })
      
      // Get recent activity from print_history
      const { data: recentPrints } = await supabase
        .from('print_history')
        .select('id, printed_at, status')
        .order('printed_at', { ascending: false })
        .limit(5)
      
      const recentActivity = recentPrints?.map(print => ({
        id: print.id,
        type: 'print_job',
        description: `Print job ${print.status}`,
        created_at: print.printed_at
      })) || []
      
      setStats({
        total_users: totalUsers || 0,
        active_users_today: activeToday || 0,
        total_revenue: 0,
        monthly_revenue: 0,
        total_labels: totalLabels || 0,
        total_batches: totalBatches || 0,
        user_growth: {
          this_month: activeToday || 0,
          last_month: 0,
          growth_percent: 0
        },
        recent_activity: recentActivity
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return <div>Failed to load dashboard stats</div>
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">
                  {stats.total_users.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.user_growth.this_month} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Today</p>
                <p className="text-3xl font-bold">
                  {stats.active_users_today.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold">
                  ${stats.monthly_revenue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">MRR</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Labels Created</p>
                <p className="text-3xl font-bold">
                  {stats.total_labels.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">This Month</span>
                <span className="text-2xl font-bold">
                  +{stats.user_growth.this_month}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Month</span>
                <span className="text-xl">
                  {stats.user_growth.last_month}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-muted-foreground">Growth Rate</span>
                <span className="text-xl font-bold text-green-600">
                  +{stats.user_growth.growth_percent.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Label Usage Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Labels Created</span>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.total_labels.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Batch Jobs Processed</span>
                <span className="text-xl text-green-600">
                  {stats.total_batches.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg Labels per User</span>
                <span className="text-xl text-purple-600">
                  {stats.total_users > 0 ? Math.round(stats.total_labels / stats.total_users) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-muted-foreground">Platform Revenue</span>
                <span className="text-xl font-bold text-green-600">
                  ${stats.total_revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recent_activity.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recent_activity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {activity.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard