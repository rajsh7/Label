'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initGA, pageview } from '@/lib/analytics/gtag'

/**
 * Analytics provider component
 * Initializes GA and tracks pageviews
 */
export const Analytics: React.FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    initGA()
  }, [])

  useEffect(() => {
    if (pathname) {
      pageview(pathname)
    }
  }, [pathname])

  return null
}

