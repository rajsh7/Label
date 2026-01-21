-- Referrals System Schema
-- Add this to your existing database-schema.sql or run separately

-- Referrals table (track referral codes and usage)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  max_uses INTEGER, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  reward_type VARCHAR(20) DEFAULT 'credit' CHECK (reward_type IN ('credit', 'discount', 'trial')),
  reward_value DECIMAL(10, 2) DEFAULT 0, -- Credits or discount percentage
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_referral_code CHECK (LENGTH(referral_code) >= 6 AND LENGTH(referral_code) <= 50)
);

-- Referral usage tracking (who used which referral code)
CREATE TABLE IF NOT EXISTS public.referral_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_applied BOOLEAN DEFAULT false,
  reward_value DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_referral_per_user UNIQUE(referral_id, referred_user_id)
);

-- User referral credits/balance
-- Add to profiles table instead:
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_credits DECIMAL(10, 2) DEFAULT 0;

-- RLS Policies for referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own referrals
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- Users can create referrals
CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Users can update own referrals
CREATE POLICY "Users can update own referrals" ON public.referrals
  FOR UPDATE USING (auth.uid() = referrer_id);

-- Users can view their own referral usage (as referrer)
CREATE POLICY "Users can view referral usage for own codes" ON public.referral_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.referrals
      WHERE referrals.id = referral_usage.referral_id
      AND referrals.referrer_id = auth.uid()
    )
  );

-- Users can view their own referral usage (as referred user)
CREATE POLICY "Users can view own referral usage" ON public.referral_usage
  FOR SELECT USING (auth.uid() = referred_user_id);

-- Anyone can insert referral usage (for signup process)
CREATE POLICY "Anyone can create referral usage" ON public.referral_usage
  FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referral_usage_referral_id ON public.referral_usage(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_usage_referred_user_id ON public.referral_usage(referred_user_id);

