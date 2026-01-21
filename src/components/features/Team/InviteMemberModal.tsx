'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, User } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export interface InviteMemberModalProps {
  open: boolean
  onClose: () => void
  onInvite: () => void
  maxMembers: number
  currentCount: number
}

/**
 * InviteMemberModal - invite a new team member
 */
export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  open,
  onClose,
  onInvite,
  maxMembers,
  currentCount,
}) => {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'member'>('member')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleInvite = async () => {
    if (!email.trim()) {
      showToast('Please enter an email address', 'error')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    if (currentCount >= maxMembers) {
      showToast('Team member limit reached', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      showToast('Invitation sent successfully', 'success')
      setEmail('')
      setRole('member')
      onInvite()
      onClose()
    } catch (error) {
      console.error('Invite member error:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to send invitation',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Invite a team member to collaborate on labels. They'll receive an email invitation to join your team.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            <Mail size={16} className="inline mr-2" />
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            <User size={16} className="inline mr-2" />
            Role <span className="text-red-500">*</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
            className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
          >
            <option value="member">Member - Can create and edit labels</option>
            <option value="admin">Admin - Full access including team management</option>
          </select>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Team members will have access to shared templates and designs.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[var(--color-border-primary)]">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleInvite}
            loading={loading}
            disabled={!email.trim() || currentCount >= maxMembers}
            className="flex-1"
          >
            Send Invitation
          </Button>
        </div>
      </div>      </DialogContent>    </Dialog>
  )
}

export default InviteMemberModal

