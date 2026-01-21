/**
 * CSRF protection utilities
 */

import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

const CSRF_TOKEN_NAME = 'csrf-token'
const CSRF_TOKEN_EXPIRY = 60 * 60 * 24 // 24 hours

/**
 * Generate and store CSRF token
 */
export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString('hex')
  
  // In production, store in secure httpOnly cookie
  // For now, we'll use a simple approach
  const cookieStore = await cookies()
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_EXPIRY,
    path: '/',
  })

  return token
}

/**
 * Verify CSRF token from request
 */
export async function verifyCsrfToken(request: Request, token?: string): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value

  if (!cookieToken) {
    return false
  }

  // Get token from header or body
  const requestToken = token || 
                       request.headers.get('x-csrf-token') || 
                       (await request.json().catch(() => ({}))).csrf_token

  if (!requestToken) {
    return false
  }

  return cookieToken === requestToken
}

/**
 * Middleware helper for CSRF protection
 */
export async function csrfProtection(
  request: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  // Skip CSRF for GET requests
  if (request.method === 'GET' || request.method === 'HEAD') {
    return handler()
  }

  const isValid = await verifyCsrfToken(request)

  if (!isValid) {
    return new Response(
      JSON.stringify({ error: 'Invalid CSRF token' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return handler()
}

