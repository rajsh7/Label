'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/Spinner'
import { Users, UserPlus, Mail, Crown, User, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { InviteMemberModal } from './InviteMemberModal'
import { format } from 'date-fns'

export interface TeamMember {
  id: string
  user_id: string
  email: string
  full_name: string | null
  role: 'admin' | 'member'
  status: 'pending' | 'active'
  invited_by: string
  invited_at: string
  joined_at: string | null
}

/**
 * TeamMemberList component - manage team members
 */
export const TeamMemberList: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [subscriptionTier, setSubscriptionTier] = useState<'pro' | 'enterprise'>('pro')
  const { showToast } = useToast()

  useEffect(() => {
    loadTeamMembers()
    loadSubscriptionTier()
  }, [])

  const loadSubscriptionTier = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()

      if (profile?.subscription_tier === 'enterprise') {
        setSubscriptionTier('enterprise')
      }
    } catch (error) {
      console.error('Load subscription tier error:', error)
    }
  }

  const loadTeamMembers = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('team_members')
        .select('*, profiles!team_members_user_id_fkey(email, full_name)')
        .eq('team_owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedMembers = (data || []).map((member: any) => ({
        id: member.id,
        user_id: member.user_id,
        email: member.profiles?.email || member.invite_email,
        full_name: member.profiles?.full_name || null,
        role: member.role,
        status: member.status,
        invited_by: member.invited_by,
        invited_at: member.invited_at,
        joined_at: member.joined_at,
      }))

      setMembers(formattedMembers)
    } catch (error) {
      console.error('Load team members error:', error)
      showToast('Failed to load team members', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return

    try {
      const response = await fetch(`/api/team/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove team member')
      }

      showToast('Team member removed successfully', 'success')
      loadTeamMembers()
    } catch (error) {
      console.error('Remove member error:', error)
      showToast('Failed to remove team member', 'error')
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      const response = await fetch(`/api/team/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Failed to update role')
      }

      showToast('Role updated successfully', 'success')
      loadTeamMembers()
    } catch (error) {
      console.error('Update role error:', error)
      showToast('Failed to update role', 'error')
    }
  }

  const maxMembers = subscriptionTier === 'pro' ? 2 : Infinity
  const canAddMore = members.length < maxMembers

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Invite Member */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Team Members
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {members.length} / {subscriptionTier === 'pro' ? '2' : 'Unlimited'} members
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setInviteModalOpen(true)}
          disabled={!canAddMore}
        >
          <UserPlus size={18} className="mr-2" />
          Invite Member
        </Button>
      </div>

      {!canAddMore && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent>
            <p className="text-sm text-yellow-800">
              You've reached your team member limit. Upgrade to Enterprise for unlimited team members.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      {members.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-[var(--color-text-secondary)] mb-4">
              No team members yet. Invite your first team member to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        member.role === 'admin'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {member.role === 'admin' ? (
                        <Crown size={20} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {member.full_name || member.email}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {member.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mt-1">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {member.email}
                        </span>
                        <span>•</span>
                        <span>
                          {member.status === 'active'
                            ? `Joined ${format(new Date(member.joined_at!), 'MMM d, yyyy')}`
                            : `Invited ${format(new Date(member.invited_at), 'MMM d, yyyy')}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleUpdateRole(member.id, e.target.value as 'admin' | 'member')
                      }
                      className="px-3 py-1.5 text-sm border border-[var(--color-border-primary)] rounded-lg"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={loadTeamMembers}
        maxMembers={maxMembers}
        currentCount={members.length}
      />
    </div>
  )
}

export default TeamMemberList

