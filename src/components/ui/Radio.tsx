'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

/**
 * Radio button component
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            ref={ref}
            className={cn(
              'w-4 h-4 border-[var(--color-border-primary)]',
              'text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]',
              'focus:ring-2 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[var(--color-error-500)]',
              className
            )}
            {...props}
          />
          {label && (
            <span
              className={cn(
                'text-sm text-[var(--color-text-primary)]',
                props.disabled && 'opacity-50',
                error && 'text-[var(--color-error-500)]'
              )}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-xs text-[var(--color-error-500)]">{error}</p>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
