/**
 * Sentry middleware wrapper for Next.js middleware
 * This should be imported in middleware.ts if using Sentry
 */

export async function withSentryMiddleware(handler: (request: any) => Promise<any>) {
  // Sentry middleware wrapper - simplified for compatibility
  return async (request: any) => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('Middleware error:', error)
      throw error
    }
  }
}

