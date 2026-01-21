import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface QuickAction {
  label: string
  href: string
  variant?: 'primary' | 'secondary' | 'outline'
}

export interface QuickActionsSectionProps {
  actions?: QuickAction[]
  className?: string
}

/**
 * Quick actions section component for dashboard
 * Quick action buttons (Create Label, Start Batch, etc.)
 */
export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions: customActions,
  className,
}) => {
  const defaultActions: QuickAction[] = [
    { label: 'Browse Labels', href: '/labels', variant: 'primary' },
    { label: 'Create New Label', href: '/editor', variant: 'secondary' },
    { label: 'Batch Process Labels', href: '/batch', variant: 'secondary' },
    { label: 'Browse Templates', href: '/templates', variant: 'outline' },
  ]

  const actions = customActions || defaultActions

  return (
    <Card className={className}>
      <CardHeader>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Quick Actions</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button variant={action.variant || 'outline'} className="w-full">
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActionsSection
