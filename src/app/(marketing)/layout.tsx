import React from 'react'
import { TopNavigation } from '@/components/dashboard/top-navigation'
import { MarketingFooter } from '@/components/marketing/footer'
import { NotificationProvider } from '@/lib/notifications/context'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <NotificationProvider>
        <TopNavigation />
      </NotificationProvider>
      <main>
        {children}
      </main>
      <MarketingFooter />
    </div>
  )
}

