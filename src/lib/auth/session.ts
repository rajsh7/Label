/**
 * Session management utilities
 * Wraps Supabase session functionality for consistency
 */

import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Get session error:', error)
    return null
  }
  
  return session
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Get user error:', error)
    return null
  }
  
  return user
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Get session expiration time
 */
export function getSessionExpiration(session: Session): Date | null {
  if (!session.expires_at) return null
  return new Date(session.expires_at * 1000)
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: Session): boolean {
  const expiration = getSessionExpiration(session)
  if (!expiration) return false
  return expiration < new Date()
}

/**
 * Refresh session
 */
export async function refreshSession(): Promise<Session | null> {
  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession()
  
  if (error || !session) {
    console.error('Refresh session error:', error)
    return null
  }
  
  return session
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

