'use client'

import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'default' | 'success' | 'warning' | 'info' | 'error' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  asChild?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      loading = false,
      asChild = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
      outline: 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
      ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
      success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:ring-yellow-600',
      info: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
      error: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    }
    
    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-10 px-6 text-base',
      lg: 'h-11 px-7 text-lg',
      icon: 'h-10 w-10',
    }

    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export default Button
