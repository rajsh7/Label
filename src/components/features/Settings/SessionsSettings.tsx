'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/Spinner'
import { Monitor, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/Toast'

export interface Session {
  id: string
  user_agent?: string
  ip_address?: string
  created_at: string
  last_activity?: string
  is_current: boolean
}

/**
 * SessionsSettings component - manage active sessions
 */
export const SessionsSettings: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setLoading(true)
    try {
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      // For now, we'll create a mock session list
      // In production, you'd fetch sessions from your database or auth provider
      const mockSessions: Session[] = [
        {
          id: currentSession?.user?.id || 'current',
          user_agent: navigator.userAgent,
          created_at: currentSession?.user?.created_at || new Date().toISOString(),
          is_current: true,
        },
      ]

      setSessions(mockSessions)
    } catch (error) {
      console.error('Load sessions error:', error)
      showToast('Failed to load sessions', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoutAll = async () => {
    if (!confirm('Are you sure you want to logout from all devices?')) return

    try {
      // Sign out will invalidate all sessions
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      showToast('Logged out from all devices', 'success')
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout all error:', error)
      showToast('Failed to logout from all devices', 'error')
    }
  }

  const handleLogoutSession = async (_sessionId: string) => {
    if (!confirm('Are you sure you want to logout from this device?')) return

    // For non-current sessions, you'd call an API to revoke that specific session
    // For now, we'll just sign out completely
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      showToast('Logged out successfully', 'success')
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout session error:', error)
      showToast('Failed to logout', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Active Sessions
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Manage devices that are currently signed in to your account.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-[var(--color-border-primary)] rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Monitor size={24} className="text-[var(--color-text-secondary)]" />
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {session.user_agent || 'Unknown Device'}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Last active: {format(new Date(session.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                    {session.is_current && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">
                        Current Session
                      </span>
                    )}
                  </div>
                </div>

                {!session.is_current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLogoutSession(session.id)}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-1">
                Logout from All Devices
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                This will sign you out from all devices, including this one.
              </p>
            </div>
            <Button variant="destructive" onClick={handleLogoutAll}>
              <LogOut size={18} className="mr-2" />
              Logout All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SessionsSettings

