-- LabelPro Database Schema - Complete Reset
-- Run this in Supabase SQL Editor

-- Drop all existing tables in correct order (reverse dependency order)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.usage_tracking CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.api_keys CASCADE;
DROP TABLE IF EXISTS public.print_history CASCADE;
DROP TABLE IF EXISTS public.printers CASCADE;
DROP TABLE IF EXISTS public.batches CASCADE;
DROP TABLE IF EXISTS public.templates CASCADE;
DROP TABLE IF EXISTS public.label_designs CASCADE;
DROP TABLE IF EXISTS public.labels CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth, but add custom fields to profiles)
CREATE TABLE public.profiles (
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

-- Label base formats table (255 predefined label types)
CREATE TABLE public.labels (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50),
  print_method VARCHAR(20) NOT NULL CHECK (print_method IN ('thermal', 'inkjet', 'desktop')),
  printer_type VARCHAR(50),
  width_mm DECIMAL(8, 2) NOT NULL,
  height_mm DECIMAL(8, 2) NOT NULL,
  width_inch DECIMAL(8, 2),
  height_inch DECIMAL(8, 2),
  width_px_203dpi INTEGER,
  height_px_203dpi INTEGER,
  width_px_300dpi INTEGER,
  height_px_300dpi INTEGER,
  barcode_position VARCHAR(50),
  barcode_format VARCHAR(20),
  product_reference VARCHAR(100),
  supported_printers TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User label designs table
CREATE TABLE public.label_designs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label_base_id VARCHAR(50) REFERENCES public.labels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  width_px INTEGER NOT NULL,
  height_px INTEGER NOT NULL,
  dpi INTEGER DEFAULT 203,
  thumbnail_url TEXT,
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Templates table (public and private templates)
CREATE TABLE public.templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  label_base_id VARCHAR(50) REFERENCES public.labels(id) ON DELETE CASCADE NOT NULL,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  category VARCHAR(50),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Batch processing table
CREATE TABLE public.batches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'scheduled')),
  total_labels INTEGER NOT NULL,
  processed_labels INTEGER DEFAULT 0,
  failed_labels INTEGER DEFAULT 0,
  data_source JSONB,
  column_mapping JSONB,
  output_format VARCHAR(20) DEFAULT 'pdf' CHECK (output_format IN ('pdf', 'png', 'jpg')),
  output_url TEXT,
  error_message TEXT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Printers table
CREATE TABLE public.printers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  model VARCHAR(100),
  connection_type VARCHAR(20) CHECK (connection_type IN ('usb', 'network', 'bluetooth')),
  ip_address INET,
  port INTEGER,
  is_default BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}'::jsonb,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Print history table
CREATE TABLE public.print_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  printer_id UUID REFERENCES public.printers(id) ON DELETE SET NULL,
  label_design_id UUID REFERENCES public.label_designs(id) ON DELETE SET NULL,
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  labels_printed INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'printing', 'completed', 'failed')),
  error_message TEXT,
  printed_at TIMESTAMPTZ DEFAULT now()
);

-- API keys table
CREATE TABLE public.api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix VARCHAR(10) NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read', 'write'],
  requests_today INTEGER DEFAULT 0,
  rate_limit INTEGER DEFAULT 1000,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team members table
CREATE TABLE public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  permissions TEXT[] DEFAULT ARRAY['read'],
  invited_at TIMESTAMPTZ DEFAULT now(),
  joined_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  UNIQUE(team_owner_id, member_id)
);

-- Usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Referrals table
CREATE TABLE public.referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  reward_amount DECIMAL(10, 2) DEFAULT 0,
  reward_credited BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_labels_category ON public.labels(category);
CREATE INDEX idx_labels_marketplace ON public.labels(marketplace);
CREATE INDEX idx_label_designs_user ON public.label_designs(user_id);
CREATE INDEX idx_templates_public ON public.templates(is_public) WHERE is_public = true;
CREATE INDEX idx_batches_user ON public.batches(user_id);
CREATE INDEX idx_printers_user ON public.printers(user_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.label_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own designs" ON public.label_designs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own designs" ON public.label_designs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own designs" ON public.label_designs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own designs" ON public.label_designs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view public templates" ON public.templates FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create templates" ON public.templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON public.templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON public.templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own batches" ON public.batches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own printers" ON public.printers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own print history" ON public.print_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own API keys" ON public.api_keys FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own usage" ON public.usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_labels_updated_at BEFORE UPDATE ON public.labels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_label_designs_updated_at BEFORE UPDATE ON public.label_designs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON public.batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_printers_updated_at BEFORE UPDATE ON public.printers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();