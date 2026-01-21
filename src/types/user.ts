/**
 * User and Profile type definitions
 * Based on database schema
 */

import { SubscriptionTier } from '@/lib/constants/pricing'

export type SubscriptionStatus = 'active' | 'trialing' | 'paused' | 'canceled'

export interface NotificationPreferences {
  email_notifications: boolean
  batch_complete: boolean
  system_updates: boolean
  marketing_emails: boolean
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  avatar_url?: string
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  trial_ends_at?: string
  labels_used_this_month: number
  batches_used_this_month: number
  timezone: string
  language: string
  is_admin: boolean
  referral_credits: number
  notification_preferences: NotificationPreferences
  onboarding_completed: boolean
  onboarding_skipped: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CreateUserProfileInput {
  email: string
  full_name?: string
  company_name?: string
  avatar_url?: string
  timezone?: string
  language?: string
}

export interface UpdateUserProfileInput {
  full_name?: string
  company_name?: string
  avatar_url?: string
  timezone?: string
  language?: string
  notification_preferences?: Partial<NotificationPreferences>
}

