import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, Users, Code } from 'lucide-react'

export interface UpgradePromoSectionProps {
  currentTier?: 'free' | 'pro' | 'enterprise'
  className?: string
}

/**
 * Upgrade promo section component for dashboard
 * Upgrade prompts for free users with feature highlights
 */
export const UpgradePromoSection: React.FC<UpgradePromoSectionProps> = ({
  currentTier = 'free',
  className,
}) => {
  if (currentTier !== 'free') {
    return null
  }

  const features = [
    {
      icon: Zap,
      title: 'Unlimited Labels',
      description: 'Generate as many labels as you need',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members and work together',
    },
    {
      icon: Code,
      title: 'API Access',
      description: 'Integrate LabelPro into your workflow',
    },
  ]

  return (
    <Card className={`bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-primary-100)] ${className || ''}`}>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              Upgrade to Pro
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Unlock unlimited labels, batch processing, and team collaboration features.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start gap-2">
                    <Icon size={18} className="text-[var(--color-primary-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {feature.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <Link href="/pricing">
            <Button variant="primary">Upgrade Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default UpgradePromoSection
