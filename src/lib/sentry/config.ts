/**
 * Sentry configuration for error tracking
 */

export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || ''
export const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development'
export const SENTRY_ENABLED = Boolean(SENTRY_DSN && SENTRY_DSN !== '')

/**
 * Initialize Sentry (client-side)
 */
export async function initSentry() {
  if (!SENTRY_ENABLED) {
    console.log('Sentry is not configured. Error tracking disabled.')
    return
  }

  try {
    const Sentry = await import('@sentry/nextjs')
    
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
      replaysSessionSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 0.5,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      beforeSend(event, _hint) {
        // Filter out noisy errors in development
        if (SENTRY_ENVIRONMENT === 'development') {
          return null
        }
        
        // Don't send non-error events in production
        if (event.level !== 'error' && event.level !== 'fatal') {
          return null
        }
        
        return event
      },
    })
  } catch (error) {
    console.error('Failed to initialize Sentry:', error)
  }
}

/**
 * Initialize Sentry (server-side)
 */
export async function initSentryServer() {
  if (!SENTRY_ENABLED) {
    return
  }

  try {
    const Sentry = await import('@sentry/nextjs')
    
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
      beforeSend(event, _hint) {
        // Filter out development errors
        if (SENTRY_ENVIRONMENT === 'development') {
          return null
        }
        
        return event
      },
    })
  } catch (error) {
    console.error('Failed to initialize Sentry server:', error)
  }
}

/**
 * Capture an exception
 */
export async function captureException(error: Error, context?: Record<string, any>) {
  if (!SENTRY_ENABLED) {
    console.error('Error (Sentry disabled):', error, context)
    return
  }

  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureException(error, {
      extra: context,
    })
  } catch (err) {
    console.error('Failed to capture exception:', err)
  }
}

/**
 * Capture a message
 */
export async function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
  if (!SENTRY_ENABLED) {
    console.log(`[${level.toUpperCase()}] ${message}`, context)
    return
  }

  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureMessage(message, {
      level: level as any,
      extra: context,
    })
  } catch (err) {
    console.error('Failed to capture message:', err)
  }
}

/**
 * Set user context
 */
export async function setUserContext(userId: string, email?: string, additionalData?: Record<string, any>) {
  if (!SENTRY_ENABLED) {
    return
  }

  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.setUser({
      id: userId,
      email: email,
      ...additionalData,
    })
  } catch (err) {
    console.error('Failed to set user context:', err)
  }
}

/**
 * Clear user context
 */
export async function clearUserContext() {
  if (!SENTRY_ENABLED) {
    return
  }

  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.setUser(null)
  } catch (err) {
    console.error('Failed to clear user context:', err)
  }
}

/**
 * Add breadcrumb
 */
export async function addBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>) {
  if (!SENTRY_ENABLED) {
    return
  }

  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.addBreadcrumb({
      message,
      category,
      level: level as any,
      data,
    })
  } catch (err) {
    console.error('Failed to add breadcrumb:', err)
  }
}
