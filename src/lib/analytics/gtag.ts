/**
 * Google Analytics 4 (gtag) integration
 */

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetId: string | object,
      config?: object
    ) => void
    dataLayer: any[]
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return

  // Load gtag script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag as any

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })
}

/**
 * Track page view
 */
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

/**
 * Track event
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

/**
 * Common event tracking functions
 */
export const analytics = {
  // Authentication events
  signup: (method: 'email' | 'google' | 'amazon') => {
    event({
      action: 'sign_up',
      category: 'auth',
      label: method,
    })
  },
  login: (method: 'email' | 'google' | 'amazon') => {
    event({
      action: 'login',
      category: 'auth',
      label: method,
    })
  },

  // Label events
  labelCreated: (labelType: string) => {
    event({
      action: 'label_created',
      category: 'labels',
      label: labelType,
    })
  },
  labelDownloaded: (labelType: string) => {
    event({
      action: 'label_downloaded',
      category: 'labels',
      label: labelType,
    })
  },

  // Batch events
  batchStarted: (labelCount: number) => {
    event({
      action: 'batch_started',
      category: 'batch',
      value: labelCount,
    })
  },
  batchCompleted: (labelCount: number) => {
    event({
      action: 'batch_completed',
      category: 'batch',
      value: labelCount,
    })
  },

  // Subscription events
  upgradeInitiated: (plan: 'pro' | 'enterprise') => {
    event({
      action: 'upgrade_initiated',
      category: 'subscription',
      label: plan,
    })
  },
  subscriptionStarted: (plan: 'pro' | 'enterprise') => {
    event({
      action: 'subscription_started',
      category: 'subscription',
      label: plan,
    })
  },
}

