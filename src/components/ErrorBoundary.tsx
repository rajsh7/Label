'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component
 * Catches React errors and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Send to Sentry with context
    const { captureException } = await import('@/lib/sentry/config')
    await captureException(error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-secondary)]">
          <Card className="max-w-md w-full">
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Something went wrong
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                We're sorry, but something unexpected happened. Please try again.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-800">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <Button variant="primary" onClick={this.handleReset}>
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

    return this.props.children
  }
}

