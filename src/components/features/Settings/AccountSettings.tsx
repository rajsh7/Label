'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { ProfileData } from './SettingsTabs'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export interface AccountSettingsProps {
  initialProfile?: ProfileData | null
  userEmail?: string
}

/**
 * AccountSettings component - manage account information
 */
export const AccountSettings: React.FC<AccountSettingsProps> = ({
  initialProfile,
  userEmail,
}) => {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: initialProfile?.full_name || '',
    company_name: initialProfile?.company_name || '',
    email: userEmail || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setErrors({ submit: 'Not authenticated' })
        setLoading(false)
        return
      }

      // Update email if changed
      if (formData.email !== userEmail && formData.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        })
        if (emailError) {
          setErrors({ submit: emailError.message })
          setLoading(false)
          return
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company_name: formData.company_name,
          email: formData.email !== userEmail ? formData.email : undefined,
        })
        .eq('id', user.id)

      if (error) {
        setErrors({ submit: error.message })
        setLoading(false)
        return
      }

      setSuccess(true)
      router.refresh()
    } catch (error) {
      console.error('Update profile error:', error)
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/export-data')
      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      // Download the JSON file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `labelpro-data-export-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.showToast('Your data has been exported successfully', 'success')
    } catch (error) {
      console.error('Export data error:', error)
      toast.showToast('Failed to export data. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return
    }

    if (
      !confirm(
        'This will permanently delete all your data. Type DELETE to confirm.'
      )
    ) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      // Sign out and redirect
      await supabase.auth.signOut()
      toast.showToast('Your account has been deleted successfully', 'success')
      router.push('/')
    } catch (error) {
      console.error('Delete account error:', error)
      toast.showToast(
        error instanceof Error ? error.message : 'Failed to delete account. Please try again.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Profile Information
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Company Name
              </label>
              <Input
                type="text"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder="My Company Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                A verification email will be sent to the new address.
              </p>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {errors.submit}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                Profile updated successfully!
              </div>
            )}

            <Button type="submit" variant="primary" loading={loading}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Change Password
          </h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              router.push('/reset-password')
            }}
            className="space-y-4"
          >
            <p className="text-sm text-[var(--color-text-secondary)]">
              Use the password reset flow to change your password securely.
            </p>
            <Button type="submit" variant="outline">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Export (GDPR) */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Data Export</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">
                Download Your Data
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Download all of your data in a machine-readable format (JSON). This includes your profile, label designs, batch jobs, printers, and favorites.
              </p>
              <Button variant="outline" onClick={handleExportData} loading={loading}>
                Export My Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountSettings

