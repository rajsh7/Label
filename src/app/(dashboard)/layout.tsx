import React from 'react'
import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { MobileDashboard } from '@/components/dashboard/mobile-dashboard'
import { NotificationProvider } from '@/lib/notifications/context'

export default async function DashboardLayout({
  children,
  modals,
}: {
  children: React.ReactNode
  modals: React.ReactNode
}) {
  const { session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  return (
    <NotificationProvider>
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen bg-[var(--color-bg-secondary)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
        {modals}
      </div>
      
      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileDashboard>{children}</MobileDashboard>
        {modals}
      </div>
    </NotificationProvider>
  )
}

