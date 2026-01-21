'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard,
  Tag,
  Edit,
  Files,
  Printer,
  Settings,
  Users,
  Code,
  Package,
} from 'lucide-react'

export interface SidebarProps {
  userTier?: 'free' | 'pro' | 'enterprise'
  className?: string
}

/**
 * Sidebar navigation component for dashboard
 * Menu items based on user role/tier
 */
export const Sidebar: React.FC<SidebarProps> = ({ userTier = 'free', className }) => {
  const pathname = usePathname()

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Labels',
      href: '/labels',
      icon: Tag,
    },
    {
      label: 'Editor',
      href: '/editor',
      icon: Edit,
    },
    {
      label: 'Batch',
      href: '/batch',
      icon: Files,
    },
    {
      label: 'Templates',
      href: '/templates',
      icon: Package,
    },
    {
      label: 'Printers',
      href: '/printers',
      icon: Printer,
    },
    {
      label: 'Print History',
      href: '/print-history',
      icon: Printer,
    },
    {
      label: 'Batch History',
      href: '/batch/history',
      icon: Files,
    },
    {
      label: 'Team',
      href: '/team',
      icon: Users,
      requiresPro: true,
    },
    {
      label: 'API',
      href: '/settings/api',
      icon: Code,
      requiresEnterprise: true,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }

  const canAccess = (item: typeof menuItems[0]) => {
    if (item.requiresEnterprise && userTier !== 'enterprise') return false
    if (item.requiresPro && userTier === 'free') return false
    return true
  }

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-[var(--color-border-primary)] h-screen sticky top-0 overflow-y-auto',
        className
      )}
    >
      <nav className="p-4 space-y-1">
        {menuItems
          .filter(canAccess)
          .map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-gray-50)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
      </nav>
    </aside>
  )
}

export default Sidebar
