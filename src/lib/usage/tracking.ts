/**
 * Usage tracking utilities
 * Handles incrementing usage counters and checking limits
 */

import { createUserClient } from '@/lib/supabase/server'
import { canPerformAction, getFeatureLimits } from '@/lib/features/featureGates'

/**
 * Increment label usage count
 */
export async function incrementLabelUsage(userId: string): Promise<{
  success: boolean
  error?: string
  usage?: {
    labelsUsed: number
    limit: number | 'unlimited'
  }
}> {
  try {
    const { supabase } = await createUserClient()

    // Get current usage
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('subscription_tier, labels_used_this_month')
      .eq('id', userId)
      .single()

    if (fetchError || !profile) {
      return { success: false, error: 'Profile not found' }
    }

    const limits = getFeatureLimits(
      (profile.subscription_tier as 'free' | 'pro' | 'enterprise') || 'free'
    )
    const currentUsage = profile.labels_used_this_month || 0

    // Check if limit reached
    if (limits.labelsPerMonth !== 'unlimited' && currentUsage >= limits.labelsPerMonth) {
      return {
        success: false,
        error: `You've reached your monthly limit of ${limits.labelsPerMonth} labels.`,
        usage: {
          labelsUsed: currentUsage,
          limit: limits.labelsPerMonth,
        },
      }
    }

    // Increment usage
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        labels_used_this_month: currentUsage + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return {
      success: true,
      usage: {
        labelsUsed: currentUsage + 1,
        limit: limits.labelsPerMonth,
      },
    }
  } catch (error) {
    console.error('Increment label usage error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track usage',
    }
  }
}

/**
 * Check if user can create/download a label
 */
export async function checkLabelUsageLimit(userId: string): Promise<{
  allowed: boolean
  error?: string
  usage?: {
    labelsUsed: number
    limit: number | 'unlimited'
  }
}> {
  try {
    const { supabase } = await createUserClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_tier, labels_used_this_month')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return { allowed: false, error: 'Profile not found' }
    }

    const tier = (profile.subscription_tier as 'free' | 'pro' | 'enterprise') || 'free'
    const limits = getFeatureLimits(tier)
    const currentUsage = profile.labels_used_this_month || 0

    const check = canPerformAction(tier, 'create_label', {
      labelsUsed: currentUsage,
    })

    return {
      allowed: check.allowed,
      error: check.reason,
      usage: {
        labelsUsed: currentUsage,
        limit: limits.labelsPerMonth,
      },
    }
  } catch (error) {
    console.error('Check label usage limit error:', error)
    return {
      allowed: false,
      error: error instanceof Error ? error.message : 'Failed to check usage limit',
    }
  }
}

/**
 * Reset monthly usage counters (to be run via cron/scheduled job)
 */
export async function resetMonthlyUsage(): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await createUserClient()

    // Reset all users' monthly usage
    const { error } = await supabase
      .from('profiles')
      .update({
        labels_used_this_month: 0,
        batches_used_this_month: 0,
        updated_at: new Date().toISOString(),
      })
      .not('deleted_at', 'is', null) // Only active users

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Reset monthly usage error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset usage',
    }
  }
}

