'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

export interface HeaderProps {
  variant?: 'marketing' | 'dashboard'
  user?: {
    email?: string
    full_name?: string
  } | null
  onLogout?: () => void
  className?: string
}

/**
 * Header component - navigation bar
 * Supports marketing and dashboard variants
 */
export const Header: React.FC<HeaderProps> = ({
  variant = 'marketing',
  user,
  onLogout,
  className,
}) => {
  if (variant === 'dashboard') {
    return (
      <nav
        className={cn(
          'bg-white border-b border-[var(--color-border-primary)] sticky top-0 z-sticky',
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-[var(--color-text-primary)]">
                LabelPro
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/labels"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Labels
                </Link>
                <Link
                  href="/editor"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Editor
                </Link>
                <Link
                  href="/batch"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Batch
                </Link>
                <Link
                  href="/templates"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Templates
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  Settings
                </Button>
              </Link>
              {user && (
                <span className="text-sm text-[var(--color-text-secondary)] hidden sm:inline">
                  {user.full_name || user.email}
                </span>
              )}
              {onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Marketing variant
  return (
    <nav
      className={cn(
        'border-b border-[var(--color-border-primary)] bg-white sticky top-0 z-sticky',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-[var(--color-text-primary)]">
              LabelPro
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Pricing
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Testimonials
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
