# Sentry Error Tracking Setup Guide

This guide explains how to set up Sentry for error tracking and monitoring in LabelPro.

## Prerequisites

1. Create a Sentry account at [https://sentry.io](https://sentry.io)
2. Create a new project in Sentry (choose Next.js as the platform)

## Installation

The Sentry SDK is already included in the dependencies. If you need to install it manually:

```bash
npm install @sentry/nextjs
```

## Configuration

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

For different environments:
- **Development**: `NEXT_PUBLIC_SENTRY_ENVIRONMENT=development`
- **Staging**: `NEXT_PUBLIC_SENTRY_ENVIRONMENT=staging`
- **Production**: `NEXT_PUBLIC_SENTRY_ENVIRONMENT=production`

### 2. Get Your Sentry DSN

1. Go to your Sentry project settings
2. Navigate to "Client Keys (DSN)"
3. Copy your DSN
4. Add it to your environment variables

### 3. Sentry Configuration Files

The following Sentry configuration files are already set up:

- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `sentry.edge.config.ts` - Edge runtime configuration
- `src/lib/sentry/config.ts` - Shared configuration utilities

## Features

### Error Tracking

All errors are automatically captured and sent to Sentry:

- **React Errors**: Caught by ErrorBoundary components
- **API Errors**: Captured in API route handlers
- **Server Errors**: Captured in server actions and API routes
- **Client Errors**: Captured in client components

### User Context

User context is automatically set when users are authenticated:

- User ID
- Email address
- Additional metadata

### Session Replay

Session replay is enabled for:
- 10% of normal sessions (production)
- 100% of error sessions
- Text and media are automatically masked for privacy

### Performance Monitoring

Performance monitoring is enabled with:
- 10% trace sampling in production
- 100% trace sampling in development

## Usage

### Manual Error Capture

You can manually capture errors in your code:

```typescript
import { captureException } from '@/lib/sentry/config'

try {
  // Your code
} catch (error) {
  await captureException(error, {
    additionalContext: 'value',
  })
}
```

### Capture Messages

Capture informational messages:

```typescript
import { captureMessage } from '@/lib/sentry/config'

await captureMessage('User performed action', 'info', {
  userId: user.id,
  action: 'label_downloaded',
})
```

### Add Breadcrumbs

Add breadcrumbs for better context:

```typescript
import { addBreadcrumb } from '@/lib/sentry/config'

await addBreadcrumb('User clicked button', 'user-action', 'info', {
  buttonId: 'download-label',
})
```

### Set User Context

Manually set user context:

```typescript
import { setUserContext } from '@/lib/sentry/config'

await setUserContext(userId, userEmail, {
  subscriptionTier: 'pro',
})
```

### API Route Error Handling

Use the error handler wrapper for API routes:

```typescript
import { withErrorTracking, handleApiError } from '@/lib/sentry/apiErrorHandler'

export async function POST(request: NextRequest) {
  return withErrorTracking(async (req) => {
    // Your API logic
    try {
      // ...
    } catch (error) {
      return handleApiError(error, 'Failed to process request')
    }
  })(request)
}
```

## Filtering

Errors are automatically filtered:

- **Development**: No errors sent to Sentry (only logged to console)
- **Production**: Only errors and fatal messages are sent
- Noisy errors can be filtered in the `beforeSend` hook

## Privacy

- Text content in session replays is masked
- Media in session replays is blocked
- User emails are included but can be filtered in Sentry settings
- PII (Personally Identifiable Information) should be avoided in error context

## Monitoring

After setup, monitor your errors in the Sentry dashboard:

1. Go to your Sentry project
2. View Issues for error reports
3. View Performance for performance monitoring
4. View Replays for session replays

## Troubleshooting

### Errors not appearing in Sentry

1. Check that `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify the DSN is valid in your Sentry project
3. Check browser console for Sentry initialization errors
4. Ensure you're in production or staging (development errors are filtered)

### High error volume

1. Adjust the `tracesSampleRate` in configuration files
2. Add filters in the `beforeSend` hook
3. Use release tracking to filter by version

### Performance impact

1. Session replay has minimal performance impact
2. Error tracking has negligible performance impact
3. Performance monitoring uses sampling to reduce overhead

## Best Practices

1. **Don't send sensitive data**: Avoid PII in error context
2. **Use context wisely**: Add relevant context but don't overdo it
3. **Filter noisy errors**: Configure filters for known noisy errors
4. **Monitor actively**: Check Sentry regularly for new issues
5. **Set up alerts**: Configure alerts for critical errors

## Next Steps

1. Set up release tracking for version management
2. Configure alerts for critical errors
3. Set up integrations (Slack, email, etc.)
4. Configure issue assignment rules
5. Set up performance monitoring alerts

