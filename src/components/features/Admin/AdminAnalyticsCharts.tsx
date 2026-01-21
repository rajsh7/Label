'use client'

import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsChartsProps {
  data: {
    revenue?: {
      mrr: number
      arr: number
      breakdown: {
        pro: { users: number; revenue: number }
        enterprise: { users: number; revenue: number }
      }
    }
    users?: {
      total: number
      free: number
      paid: number
    }
    features?: {
      total_labels_created: number
      total_batches: number
      top_features: Array<{ name: string; count: number }>
    }
  }
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

/**
 * Analytics Charts Component - Visualizes analytics data with charts
 */
export const AdminAnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  // Prepare revenue breakdown data for pie chart
  const revenueData = data.revenue
    ? [
        {
          name: 'Pro Plan',
          value: data.revenue.breakdown.pro.revenue,
          users: data.revenue.breakdown.pro.users,
        },
        {
          name: 'Enterprise Plan',
          value: data.revenue.breakdown.enterprise.revenue,
          users: data.revenue.breakdown.enterprise.users,
        },
      ]
    : []

  // Prepare user distribution data
  const userDistributionData = data.users
    ? [
        { name: 'Free', value: data.users.free, color: COLORS[0] },
        { name: 'Paid', value: data.users.paid, color: COLORS[1] },
      ]
    : []

  // Prepare feature usage data for bar chart
  const featureUsageData = data.features?.top_features || []

  // Mock time series data for revenue growth (in production, this would come from the API)
  const revenueGrowthData = [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 500 },
    { month: 'Mar', revenue: 1200 },
    { month: 'Apr', revenue: 2100 },
    { month: 'May', revenue: 3200 },
    { month: 'Jun', revenue: data.revenue?.mrr || 4500 },
  ]

  return (
    <div className="space-y-6">
      {/* Revenue Growth Chart */}
      <div className="bg-white rounded-lg border border-[var(--color-border-primary)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Monthly Recurring Revenue Growth
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              name="MRR ($)"
              dot={{ fill: '#3B82F6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Breakdown Pie Chart */}
        <div className="bg-white rounded-lg border border-[var(--color-border-primary)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Revenue by Plan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {revenueData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-[var(--color-text-primary)]">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[var(--color-text-primary)]">
                    ${item.value.toFixed(2)}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    {item.users} users
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-lg border border-[var(--color-border-primary)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            User Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {userDistributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-[var(--color-text-primary)]">{item.name}</span>
                </div>
                <div className="font-semibold text-[var(--color-text-primary)]">
                  {item.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Usage Bar Chart */}
      {featureUsageData.length > 0 && (
        <div className="bg-white rounded-lg border border-[var(--color-border-primary)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Feature Usage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Usage Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default AdminAnalyticsCharts

