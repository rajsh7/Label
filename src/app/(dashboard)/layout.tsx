import React from 'react'
import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { DashboardHeader } from "@/components/dashboard/header"
import { Footer } from "@/components/dashboard/footer"
import { MobileDashboard } from '@/components/dashboard/mobile-dashboard'
import { NotificationProvider } from '@/lib/notifications/context'
import { ToastProvider } from '@/components/ui/Toast'

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
      <ToastProvider>
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col min-h-screen bg-[var(--color-bg-secondary)]">
          <DashboardHeader />
          <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
          <Footer />
          {modals}
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden">
          <MobileDashboard>{children}</MobileDashboard>
          {modals}
        </div>
      </ToastProvider>
    </NotificationProvider>
  )
}

