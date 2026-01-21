'use client'

/**
 * Sentry provider component
 * Client-side Sentry initialization is handled by sentry.client.config.ts
 * This component is just a wrapper for consistency
 */
export function SentryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
