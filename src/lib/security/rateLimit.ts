/**
 * Rate limiting utilities
 * In-memory rate limiting for development, use Redis for production
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: Request) => string // Custom key generator
}

/**
 * Simple in-memory rate limiter
 * For production, use Redis or a dedicated rate limiting service
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyGenerator } = options

  return async (req: Request): Promise<{ allowed: boolean; remaining: number; resetAt: number }> => {
    const key = keyGenerator ? keyGenerator(req) : getDefaultKey(req)
    const now = Date.now()

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      // 1% chance to clean up
      Object.keys(store).forEach((k) => {
        if (store[k].resetAt < now) {
          delete store[k]
        }
      })
    }

    const entry = store[key]

    if (!entry || entry.resetAt < now) {
      // Create new entry
      store[key] = {
        count: 1,
        resetAt: now + windowMs,
      }
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: now + windowMs,
      }
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      }
    }

    entry.count++
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetAt: entry.resetAt,
    }
  }
}

/**
 * Default key generator based on IP address
 */
function getDefaultKey(req: Request): string {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown'
  return `rate_limit:${ip}`
}

/**
 * Rate limiters for different endpoints
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'
    const path = new URL(req.url).pathname
    return `api:${path}:${ip}`
  },
})

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'
    return `auth:${ip}`
  },
})

export const emailRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 emails per hour
  keyGenerator: (req) => {
    // Use email from request body if available
    return `email:${req.headers.get('x-forwarded-for') || 'unknown'}`
  },
})

