-- LabelPro Complete Database Schema
-- Run this in your NEW Supabase SQL Editor after creating fresh project

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
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

-- ============================================
-- 2. LABELS TABLE (255+ label formats)
-- ============================================
CREATE TABLE IF NOT EXISTS public.labels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  width_inches DECIMAL(6, 3) NOT NULL,
  height_inches DECIMAL(6, 3) NOT NULL,
  width_px_203dpi INTEGER,
  height_px_203dpi INTEGER,
  width_px_300dpi INTEGER,
  height_px_300dpi INTEGER,
  description TEXT,
  use_cases TEXT[],
  compatible_printers TEXT[],
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. LABEL DESIGNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.label_designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  label_base_id INTEGER REFERENCES public.labels(id) ON DELETE SET NULL,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- 4. BATCH JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.batch_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id TEXT,
  design_id UUID REFERENCES public.label_designs(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_labels INTEGER NOT NULL,
  generated_labels INTEGER DEFAULT 0,
  data_rows JSONB,
  column_mapping JSONB,
  output_file_url TEXT,
  file_path TEXT,
  error_message TEXT,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_labels_category ON public.labels(category);
CREATE INDEX IF NOT EXISTS idx_labels_popular ON public.labels(is_popular);
CREATE INDEX IF NOT EXISTS idx_label_designs_user_id ON public.label_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_user_id ON public.batch_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_status ON public.batch_jobs(status);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_created_at ON public.batch_jobs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Labels RLS (public read)
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view labels"
  ON public.labels FOR SELECT
  TO authenticated, anon
  USING (true);

-- Label Designs RLS
ALTER TABLE public.label_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own designs"
  ON public.label_designs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Batch Jobs RLS
ALTER TABLE public.batch_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own batch jobs"
  ON public.batch_jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own batch jobs"
  ON public.batch_jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batch jobs"
  ON public.batch_jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own batch jobs"
  ON public.batch_jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_labels
  BEFORE UPDATE ON public.labels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_label_designs
  BEFORE UPDATE ON public.label_designs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- STORAGE BUCKETS (Run manually in Dashboard)
-- ============================================
-- Go to Storage → Create bucket:
-- 1. Name: "label_outputs" (private)
-- 2. Enable RLS

-- Then run this for storage RLS:
-- CREATE POLICY "Users can upload own files"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'label_outputs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own files"
--   ON storage.objects FOR SELECT
--   TO authenticated
--   USING (bucket_id = 'label_outputs' AND auth.uid()::text = (storage.foldername(name))[1]);
