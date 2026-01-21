/**
 * API error handler wrapper for Next.js API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { captureException, addBreadcrumb } from './config'

export interface ApiHandler {
  (request: NextRequest, context?: any): Promise<NextResponse>
}

/**
 * Wrapper for API route handlers to automatically capture errors
 */
export function withErrorTracking(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      // Add breadcrumb for API request
      await addBreadcrumb(
        `${request.method} ${request.nextUrl.pathname}`,
        'api',
        'info',
        {
          method: request.method,
          path: request.nextUrl.pathname,
          query: Object.fromEntries(request.nextUrl.searchParams),
        }
      )

      const response = await handler(request, context)
      return response
    } catch (error) {
      // Capture the error
      await captureException(error as Error, {
        method: request.method,
        path: request.nextUrl.pathname,
        url: request.url,
        query: Object.fromEntries(request.nextUrl.searchParams),
      })

      // Re-throw to let Next.js handle it
      throw error
    }
  }
}

/**
 * Handle API errors and return appropriate response
 */
export async function handleApiError(error: unknown, defaultMessage = 'Internal server error') {
  const errorMessage = error instanceof Error ? error.message : defaultMessage
  
  // Capture to Sentry
  if (error instanceof Error) {
    await captureException(error)
  } else {
    await captureException(new Error(String(error)))
  }

  return NextResponse.json(
    {
      error: errorMessage,
      success: false,
    },
    { status: 500 }
  )
}

