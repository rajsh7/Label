import React from 'react'
import { TopNavigation } from '@/components/dashboard/top-navigation'
import { MarketingFooter } from '@/components/marketing/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />
      <main>
        {children}
      </main>
      <MarketingFooter />
    </div>
  )
}

