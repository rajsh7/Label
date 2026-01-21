/**
 * Pricing plan definitions
 * Matches LabelPro_Elite_Implementation_P2 specification
 */

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export interface PricingPlan {
  id: SubscriptionTier
  name: string
  tagline: string
  monthlyPrice: number
  annualPrice: number
  annualDiscount: number // Percentage discount
  labelsPerMonth: number | 'unlimited'
  batchesPerMonth: number | 'unlimited'
  teamMembers: number | 'unlimited'
  hasScheduling: boolean
  hasApiAccess: boolean
  hasWmsIntegration: boolean
  hasPrioritySupport: boolean
  hasNoAds: boolean
  supportResponseTime: string // e.g., "48h", "12h", "4h (phone)"
  features: string[]
  timeSavedPerMonth: number // Hours
  revenueImpact: string // e.g., "$960/year in saved labor"
  popular?: boolean // For highlighting in UI
}

/**
 * All pricing plans
 */
export const PRICING_PLANS: Record<SubscriptionTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Starter',
    tagline: "I'm Just Trying",
    monthlyPrice: 0,
    annualPrice: 0,
    annualDiscount: 0,
    labelsPerMonth: 200,
    batchesPerMonth: 4,
    teamMembers: 1,
    hasScheduling: false,
    hasApiAccess: false,
    hasWmsIntegration: false,
    hasPrioritySupport: false,
    hasNoAds: false,
    supportResponseTime: '48h',
    timeSavedPerMonth: 8,
    revenueImpact: '$0 upfront',
    features: [
      '200 labels/month',
      '4 batch jobs/month',
      'Basic label editor',
      'Email support (48h)',
      'Free forever',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    tagline: 'Time Freedom',
    monthlyPrice: 7.99,
    annualPrice: 71.91, // (Monthly × 12) × 0.74 = 26% discount
    annualDiscount: 26,
    labelsPerMonth: 'unlimited',
    batchesPerMonth: 50,
    teamMembers: 2,
    hasScheduling: true,
    hasApiAccess: false,
    hasWmsIntegration: false,
    hasPrioritySupport: true,
    hasNoAds: true,
    supportResponseTime: '12h',
    timeSavedPerMonth: 40,
    revenueImpact: '$960/year in saved labor',
    popular: true, // Highlighted in UI
    features: [
      'Unlimited labels',
      '50 batches/month',
      'Print scheduling (3 jobs)',
      'Priority email support (12h)',
      'Advanced analytics',
      'Label quality validation',
      'Custom templates (20 max)',
      'Monthly ROI report',
      '2 team members',
      'No ads',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Revenue Scale',
    monthlyPrice: 39.99,
    annualPrice: 359.91, // 25% discount
    annualDiscount: 25,
    labelsPerMonth: 'unlimited',
    batchesPerMonth: 'unlimited',
    teamMembers: 'unlimited',
    hasScheduling: true,
    hasApiAccess: true,
    hasWmsIntegration: true,
    hasPrioritySupport: true,
    hasNoAds: true,
    supportResponseTime: '4h (phone)',
    timeSavedPerMonth: 200, // Team of 5
    revenueImpact: '$4,800/year in avoided labor',
    features: [
      'Everything in Pro',
      'Unlimited batches',
      'Unlimited scheduled jobs',
      'API access (2,000 req/day)',
      'Webhook integrations',
      'WMS integrations (Shopify, WooCommerce)',
      'Unlimited team members',
      'Dedicated account manager',
      'Priority phone support (4h)',
      'Custom domain branding',
      'Advanced analytics + BigQuery export',
      'SLA guarantee (99.5% uptime)',
      'Quarterly business review',
    ],
  },
}

/**
 * Get pricing plan by tier
 */
export function getPricingPlan(tier: SubscriptionTier): PricingPlan {
  return PRICING_PLANS[tier]
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price === 0) return 'Free'
  return `$${price.toFixed(2)}`
}

/**
 * Calculate annual savings
 */
export function calculateAnnualSavings(tier: SubscriptionTier): number {
  const plan = PRICING_PLANS[tier]
  if (plan.monthlyPrice === 0) return 0
  const monthlyTotal = plan.monthlyPrice * 12
  return monthlyTotal - plan.annualPrice
}

/**
 * Get all pricing plans as array
 */
export function getAllPricingPlans(): PricingPlan[] {
  return Object.values(PRICING_PLANS)
}

/**
 * Get upgrade path
 */
export function getUpgradePath(fromTier: SubscriptionTier): SubscriptionTier | null {
  switch (fromTier) {
    case 'free':
      return 'pro'
    case 'pro':
      return 'enterprise'
    case 'enterprise':
      return null // No upgrade available
    default:
      return 'pro'
  }
}

