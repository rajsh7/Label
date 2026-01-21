import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { format } from 'date-fns'

export interface ActivityItem {
  id: string
  type: 'label' | 'batch' | 'template' | 'print'
  title: string
  description?: string
  timestamp: string
  href?: string
}

export interface RecentActivitySectionProps {
  activities: ActivityItem[]
  className?: string
}

/**
 * Recent activity section component for dashboard
 * Show recent labels, batches, prints
 */
export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  activities,
  className,
}) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'label':
        return '📄'
      case 'batch':
        return '📦'
      case 'template':
        return '📋'
      case 'print':
        return '🖨️'
      default:
        return '📄'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Recent Activity</h2>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--color-text-secondary)]">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const content = (
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] truncate">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-sm text-[var(--color-text-secondary)] truncate">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                    {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                  </div>
                </div>
              )

              if (activity.href) {
                return (
                  <Link
                    key={activity.id}
                    href={activity.href}
                    className="block hover:bg-[var(--color-gray-50)] p-2 rounded-lg -m-2 transition-colors"
                  >
                    {content}
                  </Link>
                )
              }

              return <div key={activity.id}>{content}</div>
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivitySection
