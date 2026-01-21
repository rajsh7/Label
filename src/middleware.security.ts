/**
 * Security middleware - applies security headers and rate limiting
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiRateLimiter, authRateLimiter, emailRateLimiter } from '@/lib/security/rateLimit'
import { applySecurityHeaders } from '@/lib/security/headers'

/**
 * Apply security middleware to requests
 */
export async function securityMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()

  // Apply security headers
  applySecurityHeaders(response)

  // Rate limiting based on route
  if (pathname.startsWith('/api/auth')) {
    const limit = await authRateLimiter(request)
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
            ...Object.fromEntries(response.headers.entries()),
          },
        }
      )
    }
    response.headers.set('X-RateLimit-Remaining', String(limit.remaining))
    response.headers.set('X-RateLimit-Reset', String(limit.resetAt))
  } else if (pathname.startsWith('/api/email')) {
    const limit = await emailRateLimiter(request)
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many email requests. Please try again later.',
          retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
            ...Object.fromEntries(response.headers.entries()),
          },
        }
      )
    }
    response.headers.set('X-RateLimit-Remaining', String(limit.remaining))
    response.headers.set('X-RateLimit-Reset', String(limit.resetAt))
  } else if (pathname.startsWith('/api/')) {
    const limit = await apiRateLimiter(request)
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many API requests. Please try again later.',
          retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
            ...Object.fromEntries(response.headers.entries()),
          },
        }
      )
    }
    response.headers.set('X-RateLimit-Remaining', String(limit.remaining))
    response.headers.set('X-RateLimit-Reset', String(limit.resetAt))
  }

  return response
}

