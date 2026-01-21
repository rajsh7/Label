-- LabelPro Database Schema
-- Run this in Supabase SQL Editor

-- Users table (managed by Supabase Auth, but add custom fields to profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'trialing', 'paused', 'canceled')),
  trial_ends_at TIMESTAMPTZ,
  labels_used_this_month INTEGER DEFAULT 0,
  batches_used_this_month INTEGER DEFAULT 0,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  language VARCHAR(10) DEFAULT 'en',
  is_admin BOOLEAN DEFAULT false,
  referral_credits DECIMAL(10, 2) DEFAULT 0,
  notification_preferences JSONB DEFAULT '{"email_notifications": true, "batch_complete": true, "system_updates": true, "marketing_emails": false}'::jsonb,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_skipped BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
