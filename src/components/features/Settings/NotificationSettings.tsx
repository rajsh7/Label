'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProfileData } from './SettingsTabs'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export interface NotificationSettingsProps {
  initialProfile?: ProfileData | null
}

/**
 * NotificationSettings component - manage notification preferences
 */
export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  initialProfile,
}) => {
  const { showToast } = useToast()
  const [settings, setSettings] = useState({
    email_notifications: (initialProfile as any)?.notification_preferences?.email_notifications ?? true,
    batch_complete: (initialProfile as any)?.notification_preferences?.batch_complete ?? true,
    system_updates: (initialProfile as any)?.notification_preferences?.system_updates ?? true,
    marketing_emails: (initialProfile as any)?.notification_preferences?.marketing_emails ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Save notification preferences to database
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: settings,
        })
        .eq('id', user.id)

      if (error) throw error

      setSuccess(true)
      showToast('Notification preferences saved successfully', 'success')
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Save notification settings error:', error)
      showToast('Failed to save notification preferences', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Notification Preferences
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)]">
                  Email Notifications
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Receive email notifications for important updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email_notifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary-200)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-500)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)]">
                  Batch Processing Complete
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Get notified when batch jobs finish processing
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.batch_complete}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      batch_complete: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                  disabled={!settings.email_notifications}
                />
                <div className={`w-11 h-6 rounded-full peer ${
                  !settings.email_notifications
                    ? 'bg-gray-200 opacity-50'
                    : 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary-200)] peer-checked:bg-[var(--color-primary-500)]'
                }`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)]">
                  System Updates
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Receive notifications about new features and system updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.system_updates}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      system_updates: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                  disabled={!settings.email_notifications}
                />
                <div className={`w-11 h-6 rounded-full peer ${
                  !settings.email_notifications
                    ? 'bg-gray-200 opacity-50'
                    : 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary-200)] peer-checked:bg-[var(--color-primary-500)]'
                }`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)]">
                  Marketing Emails
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Receive tips, best practices, and product updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marketing_emails}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      marketing_emails: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary-200)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-500)]"></div>
              </label>
            </div>
          </div>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              Notification preferences saved successfully!
            </div>
          )}

          <Button variant="primary" onClick={handleSave} loading={loading}>
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationSettings

