'use client'

import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfileData } from './SettingsTabs'
import Link from 'next/link'
import { Check } from 'lucide-react'

export interface BillingSettingsProps {
  initialProfile?: ProfileData | null
}

/**
 * BillingSettings component - display subscription tier information
 * Note: Subscription tiers are managed manually via admin panel or database
 */
export const BillingSettings: React.FC<BillingSettingsProps> = ({
  initialProfile,
}) => {
  const tier = (initialProfile?.subscription_tier || 'free') as 'free' | 'pro' | 'enterprise'
  const status = initialProfile?.subscription_status || 'active'

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Current Plan
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] capitalize">
                  {tier === 'free' ? 'Starter' : tier === 'pro' ? 'Professional' : 'Enterprise'}
                </h3>
                <Badge
                  variant={status === 'active' ? 'default' : 'destructive'}
                  className={`text-xs ${status === 'active' ? 'bg-green-100 text-green-800' : ''}`}
                >
                  {status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {tier !== 'free' && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {tier === 'pro' ? '$7.99/month' : '$39.99/month'}
                </p>
              )}
            </div>
          </div>

          {/* Plan Features */}
          <div className="space-y-2 mb-6">
            {tier === 'free' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    200 labels/month
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    4 batch jobs/month
                  </span>
                </div>
              </>
            )}
            {tier === 'pro' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    Unlimited labels
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    50 batch jobs/month
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    2 team members
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    Batch scheduling
                  </span>
                </div>
              </>
            )}
            {tier === 'enterprise' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    Unlimited everything
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    API access
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    WMS integrations
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-[var(--color-success-500)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    Unlimited team members
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-primary)]">
            <p className="text-sm text-[var(--color-text-secondary)]">
              To upgrade or change your subscription tier, please contact support or use the admin panel.
            </p>
          </div>

          {tier === 'free' && (
            <div className="mt-4">
              <Link href="/pricing">
                <Button variant="outline" className="w-full">
                  View All Plans
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BillingSettings
