'use client'

import React from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  onClose?: () => void
  children: React.ReactNode
}

/**
 * Alert component for displaying important messages to users
 * Used for inline alerts (unlike Toast which is for notifications)
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, onClose, children, className, ...props }, ref) => {
    const variants = {
      success: {
        container: 'bg-[var(--color-success-50)] border-[var(--color-success-200)] text-[var(--color-success-800)]',
        icon: CheckCircle,
        iconColor: 'text-[var(--color-success-600)]',
      },
      error: {
        container: 'bg-[var(--color-error-50)] border-[var(--color-error-200)] text-[var(--color-error-800)]',
        icon: AlertCircle,
        iconColor: 'text-[var(--color-error-600)]',
      },
      warning: {
        container: 'bg-[var(--color-warning-50)] border-[var(--color-warning-200)] text-[var(--color-warning-800)]',
        icon: AlertTriangle,
        iconColor: 'text-[var(--color-warning-600)]',
      },
      info: {
        container: 'bg-[var(--color-info-50)] border-[var(--color-info-200)] text-[var(--color-info-800)]',
        icon: Info,
        iconColor: 'text-[var(--color-info-600)]',
      },
    }

    const variantStyles = variants[variant]
    const Icon = variantStyles.icon

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-md border p-4',
          variantStyles.container,
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', variantStyles.iconColor)} />
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold mb-1">{title}</h4>
            )}
            <div className="text-sm">{children}</div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
              aria-label="Close alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

