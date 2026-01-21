'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { UpgradeButton } from './Pricing/UpgradeButton'
import { AlertCircle } from 'lucide-react'

export interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  title: string
  message: string
  currentPlan?: 'free' | 'pro' | 'enterprise'
  requiredPlan?: 'pro' | 'enterprise'
}

/**
 * UpgradeModal component - shows upgrade prompt when limits are reached
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onClose,
  title,
  message,
  currentPlan = 'free',
  requiredPlan = 'pro',
}) => {
  const planNames = {
    pro: 'Professional',
    enterprise: 'Enterprise',
  }

  const planFeatures: Record<string, string[]> = {
    pro: [
      'Unlimited labels per month',
      '50 batch jobs per month',
      'Print scheduling',
      '2 team members',
      'Priority support',
      'No ads',
    ],
    enterprise: [
      'Everything in Professional',
      'Unlimited batches',
      'API access',
      'Unlimited team members',
      'WMS integrations',
      'Dedicated account manager',
    ],
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-yellow-800">{message}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">
                Upgrade to {planNames[requiredPlan]} to unlock:
              </h3>
              <ul className="space-y-2">
                {planFeatures[requiredPlan].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Maybe Later
              </Button>
              <UpgradeButton
                planId={requiredPlan}
                currentPlan={currentPlan}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradeModal

