/**
 * Token handling utilities
 * Note: Supabase handles JWT tokens internally, but this provides
 * utility functions for token operations if needed
 */

import { Session } from '@supabase/supabase-js'

/**
 * Get access token from session
 */
export function getAccessToken(session: Session | null): string | null {
  return session?.access_token || null
}

/**
 * Get refresh token from session
 */
export function getRefreshToken(session: Session | null): string | null {
  return session?.refresh_token || null
}

/**
 * Decode JWT token (basic decode, doesn't verify signature)
 * For verification, use Supabase's built-in methods
 */
export function decodeToken(token: string): any | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Token decode error:', error)
    return null
  }
}

/**
 * Get token expiration date
 */
export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return null
  
  return new Date(decoded.exp * 1000)
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token)
  if (!expiration) return false
  
  return expiration < new Date()
}

/**
 * Get time until token expires (in seconds)
 */
export function getTokenExpiresIn(token: string): number | null {
  const expiration = getTokenExpiration(token)
  if (!expiration) return null
  
  const now = new Date()
  const diff = Math.floor((expiration.getTime() - now.getTime()) / 1000)
  
  return diff > 0 ? diff : 0
}

