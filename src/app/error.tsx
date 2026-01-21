'use client'

import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { captureException } from '@/lib/sentry/config'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error, {
      digest: error.digest,
      page: 'error-boundary',
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full bg-card border-border">
        <CardContent className="text-center p-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
              <p className="text-sm font-mono text-destructive">{error.message}</p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>
              )}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={reset}>
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

