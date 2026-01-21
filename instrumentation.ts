/**
 * This file configures Next.js to load the Sentry SDK on the server
 * and client. Learn more at https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import server-side Sentry configuration
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Import edge Sentry configuration
    await import('./sentry.edge.config')
  }
}
