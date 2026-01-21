/**
 * Centralized logging utility for LabelPro
 * Replaces console.* statements with proper error tracking
 */

import * as Sentry from '@sentry/nextjs'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Log error - sends to Sentry in production, console in development
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.isProduction) {
      // Send to Sentry in production
      if (error instanceof Error) {
        Sentry.captureException(error, {
          extra: { message, ...context },
        })
      } else {
        Sentry.captureMessage(message, {
          level: 'error',
          extra: { error, ...context },
        })
      }
    } else {
      // Log to console in development
      console.error(`[ERROR] ${message}`, error, context)
    }
  }

  /**
   * Log warning - console only in development
   */
  warn(message: string, data?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data)
    }
  }

  /**
   * Log info - console only in development
   */
  info(message: string, data?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data)
    }
  }

  /**
   * Log debug - console only in development
   */
  debug(message: string, data?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, data)
    }
  }

  /**
   * Log API request - useful for debugging
   */
  apiRequest(method: string, path: string, data?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${path}`, data)
    }
  }

  /**
   * Log API response - useful for debugging
   */
  apiResponse(method: string, path: string, status: number, data?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${path} - ${status}`, data)
    }
  }

  /**
   * Set user context for error tracking
   */
  setUser(userId: string, email?: string, metadata?: LogContext): void {
    if (this.isProduction) {
      Sentry.setUser({
        id: userId,
        email,
        ...metadata,
      })
    }
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    if (this.isProduction) {
      Sentry.setUser(null)
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  breadcrumb(message: string, category: string, data?: LogContext): void {
    if (this.isProduction) {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
      })
    } else if (this.isDevelopment) {
      console.log(`[BREADCRUMB] ${category}: ${message}`, data)
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for testing
export { Logger }
