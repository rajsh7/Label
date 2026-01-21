/**
 * This file configures the Sentry SDK for the client-side.
 * Learn more at https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || ''
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development'

// Only initialize if DSN is provided
if (SENTRY_DSN) {
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
    beforeSend(event) {
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
} else if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Only log in browser and development mode
  console.log('Sentry is not configured. Error tracking disabled.')
}

