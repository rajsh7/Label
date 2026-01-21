import React from 'react'
import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
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
      <div className="min-h-screen bg-[var(--color-bg-secondary)] flex">
        <DashboardSidebar />
        <main className="flex-1">{children}</main>
        {modals}
      </div>
    </NotificationProvider>
  )
}

