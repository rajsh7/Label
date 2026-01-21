'use client'

import React, { useState } from 'react'
import { AccountSettings } from './AccountSettings'
import { BillingSettings } from './BillingSettings'
import { NotificationSettings } from './NotificationSettings'
import { SessionsSettings } from './SessionsSettings'
import { ReferralSettings } from './ReferralSettings'

export interface ProfileData {
  id: string
  email?: string
  full_name?: string
  company_name?: string
  subscription_tier?: string
  subscription_status?: string
}

export interface SettingsTabsProps {
  initialProfile?: ProfileData | null
  userEmail?: string
}

/**
 * SettingsTabs component - tabbed settings interface
 */
export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  initialProfile,
  userEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'notifications' | 'sessions' | 'referrals'>('account')

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'billing', label: 'Billing & Subscription' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'referrals', label: 'Referrals' },
    { id: 'sessions', label: 'Sessions' },
  ] as const

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-[var(--color-border-primary)] mb-6">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--color-primary-500)] text-[var(--color-primary-600)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'account' && (
          <AccountSettings initialProfile={initialProfile} userEmail={userEmail} />
        )}
        {activeTab === 'billing' && (
          <BillingSettings initialProfile={initialProfile} />
        )}
        {activeTab === 'notifications' && (
          <NotificationSettings initialProfile={initialProfile} />
        )}
        {activeTab === 'referrals' && (
          <ReferralSettings />
        )}
        {activeTab === 'sessions' && (
          <SessionsSettings />
        )}
      </div>
    </div>
  )
}

export default SettingsTabs

