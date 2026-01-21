/**
 * API Rate Limiting Helper
 * Wraps API route handlers with rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, DEFAULT_RATE_LIMITS, getRateLimitHeaders } from './rateLimiter'

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from session if available
  // For now, use IP address as fallback
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

  // If we have a user session, we could use user ID here for more accurate limiting
  return ip
}

/**
 * Rate limit configuration for different API endpoints
 */
export const API_RATE_LIMITS = {
  default: DEFAULT_RATE_LIMITS.api,
  auth: DEFAULT_RATE_LIMITS.auth,
  batch: DEFAULT_RATE_LIMITS.batch,
  export: DEFAULT_RATE_LIMITS.export,
}

/**
 * Rate limit middleware for API routes
 * Returns null if allowed, or a NextResponse with error if rate limited
 */
export function rateLimitAPI(
  request: NextRequest,
  config = API_RATE_LIMITS.default
): NextResponse | null {
  const identifier = getClientIdentifier(request)
  const result = checkRateLimit(identifier, config)

  if (!result.allowed) {
    const headers = getRateLimitHeaders({ ...result, config })
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again after ${new Date(result.resetTime).toISOString()}`,
      },
      {
        status: 429,
        headers,
      }
    )
  }

  return null
}

/**
 * Helper to add rate limit headers to successful responses
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: { remaining: number; resetTime: number },
  config = API_RATE_LIMITS.default
): NextResponse {
  const headers = getRateLimitHeaders({ ...result, config })
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

/**
 * Check API rate limit for a specific user
 */
export async function checkApiRateLimit(userId: string): Promise<{ allowed: boolean; error?: string }> {
  const result = checkRateLimit(userId, API_RATE_LIMITS.default)
  return {
    allowed: result.allowed,
    error: result.allowed ? undefined : 'Rate limit exceeded',
  }
}

