'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export interface UpgradeButtonProps {
  planId: 'pro' | 'enterprise'
  currentPlan?: 'free' | 'pro' | 'enterprise'
  className?: string
}

/**
 * Upgrade button component
 * Note: Payment processing has been removed. Tiers are managed manually.
 * This button is kept for UI consistency but shows "Contact Us" message.
 */
export const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  planId,
  currentPlan,
  className,
}) => {
  const isCurrentPlan = currentPlan === planId
  const isDowngrade = currentPlan === 'enterprise' && planId === 'pro'

  if (isCurrentPlan) {
    return (
      <Button variant="outline" className={className} disabled>
        Current Plan
      </Button>
    )
  }

  return (
    <Button
      variant={isDowngrade ? 'outline' : 'primary'}
      className={className || 'w-full'}
      disabled
      title="Please contact support to upgrade your plan"
    >
      Contact Us to {isDowngrade ? 'Downgrade' : 'Upgrade'} to {planId === 'pro' ? 'Professional' : 'Enterprise'}
    </Button>
  )
}

export default UpgradeButton
