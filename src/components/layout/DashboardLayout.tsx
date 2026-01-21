import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils/cn'

export interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    email?: string
    full_name?: string
  }
  userTier?: 'free' | 'pro' | 'enterprise'
  onLogout?: () => void
  className?: string
}

/**
 * Dashboard layout wrapper component
 * Combines Header, Sidebar, and content area
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  userTier = 'free',
  onLogout,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-[var(--color-bg-secondary)]', className)}>
      <Header variant="dashboard" user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar userTier={userTier} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
