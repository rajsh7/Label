/**
 * Feature gates based on subscription tier
 * Enforces limits and restrictions per plan
 */

import { SubscriptionTier } from '@/lib/constants/pricing'

export interface FeatureLimits {
  labelsPerMonth: number | 'unlimited'
  batchesPerMonth: number | 'unlimited'
  teamMembers: number | 'unlimited'
  hasApiAccess: boolean
  hasScheduling: boolean
  hasWmsIntegration: boolean
  hasPrioritySupport: boolean
  hasNoAds: boolean
}

/**
 * Get feature limits for a subscription tier
 */
export function getFeatureLimits(tier: SubscriptionTier): FeatureLimits {
  switch (tier) {
    case 'free':
      return {
        labelsPerMonth: 200,
        batchesPerMonth: 4,
        teamMembers: 1,
        hasApiAccess: false,
        hasScheduling: false,
        hasWmsIntegration: false,
        hasPrioritySupport: false,
        hasNoAds: false,
      }
    case 'pro':
      return {
        labelsPerMonth: 'unlimited',
        batchesPerMonth: 50,
        teamMembers: 2,
        hasApiAccess: false,
        hasScheduling: true,
        hasWmsIntegration: false,
        hasPrioritySupport: true,
        hasNoAds: true,
      }
    case 'enterprise':
      return {
        labelsPerMonth: 'unlimited',
        batchesPerMonth: 'unlimited',
        teamMembers: 'unlimited',
        hasApiAccess: true,
        hasScheduling: true,
        hasWmsIntegration: true,
        hasPrioritySupport: true,
        hasNoAds: true,
      }
    default:
      return getFeatureLimits('free')
  }
}

/**
 * Check if user has access to a specific feature
 */
export async function checkFeatureAccess(
  feature: string,
  tier: SubscriptionTier
): Promise<boolean> {
  const limits = getFeatureLimits(tier)
  
  switch (feature) {
    case 'schedule_batch':
      return limits.hasScheduling
    case 'use_api':
      return limits.hasApiAccess
    case 'wms_integration':
      return limits.hasWmsIntegration
    case 'add_team_member':
      return tier === 'pro' || tier === 'enterprise'
    default:
      return false
  }
}

/**
 * Check if user can perform an action
 */
export function canPerformAction(
  tier: SubscriptionTier,
  action: 'create_label' | 'create_batch' | 'use_api' | 'schedule_print' | 'schedule_batch' | 'add_team_member',
  currentUsage?: {
    labelsUsed?: number
    batchesUsed?: number
    teamMembers?: number
  }
): { allowed: boolean; reason?: string; upgradeRequired?: SubscriptionTier } {
  const limits = getFeatureLimits(tier)

  switch (action) {
    case 'create_label':
      if (limits.labelsPerMonth === 'unlimited') {
        return { allowed: true }
      }
      if (currentUsage && currentUsage.labelsUsed !== undefined) {
        if (currentUsage.labelsUsed >= limits.labelsPerMonth) {
          return {
            allowed: false,
            reason: `You've reached your monthly limit of ${limits.labelsPerMonth} labels.`,
            upgradeRequired: 'pro',
          }
        }
      }
      return { allowed: true }

    case 'create_batch':
      if (limits.batchesPerMonth === 'unlimited') {
        return { allowed: true }
      }
      if (currentUsage && currentUsage.batchesUsed !== undefined) {
        if (currentUsage.batchesUsed >= limits.batchesPerMonth) {
          return {
            allowed: false,
            reason: `You've reached your monthly limit of ${limits.batchesPerMonth} batches.`,
            upgradeRequired: tier === 'free' ? 'pro' : 'enterprise',
          }
        }
      }
      return { allowed: true }

    case 'use_api':
      if (!limits.hasApiAccess) {
        return {
          allowed: false,
          reason: 'API access is only available on Enterprise plans.',
          upgradeRequired: 'enterprise',
        }
      }
      return { allowed: true }

    case 'schedule_print':
    case 'schedule_batch':
      if (!limits.hasScheduling) {
        return {
          allowed: false,
          reason: 'Scheduling is only available on Professional and Enterprise plans.',
          upgradeRequired: 'pro',
        }
      }
      return { allowed: true }

    case 'add_team_member':
      if (limits.teamMembers === 'unlimited') {
        return { allowed: true }
      }
      if (currentUsage && currentUsage.teamMembers !== undefined) {
        if (currentUsage.teamMembers >= limits.teamMembers) {
          return {
            allowed: false,
            reason: `You've reached your team member limit of ${limits.teamMembers}.`,
            upgradeRequired: tier === 'pro' ? 'enterprise' : 'pro',
          }
        }
      }
      return { allowed: true }

    default:
      return { allowed: false, reason: 'Unknown action' }
  }
}

