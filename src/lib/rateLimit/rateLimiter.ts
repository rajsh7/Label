/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

/**
 * Rate limiter configuration
 */
export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

/**
 * Default rate limits
 */
export const DEFAULT_RATE_LIMITS = {
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  auth: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  batch: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 requests per minute
  export: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 requests per hour
}

/**
 * Clean up expired entries (run periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMITS.api
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier

  // Get or initialize store entry
  if (!store[key] || store[key].resetTime < now) {
    // New window or expired, reset
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime,
    }
  }

  // Increment count
  store[key].count++

  // Check if limit exceeded
  if (store[key].count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    }
  }

  return {
    allowed: true,
    remaining: config.maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: {
  remaining: number
  resetTime: number
  config: RateLimitConfig
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  }
}

