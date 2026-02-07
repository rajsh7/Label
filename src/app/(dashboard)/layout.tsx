import React from 'react'
import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { TopNavigation } from "@/components/dashboard/top-navigation"
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
        {/* Marketplace Gallery Layout */}
        <div className="flex flex-col min-h-screen bg-[#f6f5f8] dark:bg-[#161022]">
           
          {/* Top Navigation */}
          <TopNavigation />

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-[1440px] mx-auto pt-24 pb-12 px-6 md:px-12">
            {children}
          </main>
          
          {modals}
        </div>
        
        {/* Mobile Layout Override - Using TopNav for mobile too currently, or can keep MobileDashboard if preferred */}
        {/* <div className="md:hidden">
          <MobileDashboard>{children}</MobileDashboard>
          {modals}
        </div> */}
      </ToastProvider>
    </NotificationProvider>
  )
}

