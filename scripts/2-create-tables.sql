-- ============================================
-- CREATE TABLES SCRIPT - Run this SECOND
-- ============================================
-- This creates all necessary tables for the Label application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. LABELS TABLE (Template Reference Data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.labels (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50),
  print_method VARCHAR(20) NOT NULL CHECK (print_method IN ('thermal', 'inkjet', 'desktop')),
  width_mm DECIMAL(8, 2) NOT NULL,
  height_mm DECIMAL(8, 2) NOT NULL,
  width_inch DECIMAL(8, 2),
  height_inch DECIMAL(8, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. LABEL_DESIGNS TABLE (User Saved Labels)
-- ============================================
CREATE TABLE IF NOT EXISTS public.label_designs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label_base_id VARCHAR(50) DEFAULT 'custom',
  name TEXT NOT NULL,
  description TEXT,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  width_px INTEGER NOT NULL DEFAULT 812,
  height_px INTEGER NOT NULL DEFAULT 1218,
  dpi INTEGER DEFAULT 203,
  thumbnail_url TEXT,
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_labels_category ON public.labels(category);
CREATE INDEX IF NOT EXISTS idx_label_designs_user ON public.label_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_label_designs_created ON public.label_designs(created_at DESC);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.label_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels DISABLE ROW LEVEL SECURITY; -- Public reference data

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Users can only see and edit their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Label designs: Users can only access their own designs
DROP POLICY IF EXISTS "Users can view own designs" ON public.label_designs;
CREATE POLICY "Users can view own designs" ON public.label_designs 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own designs" ON public.label_designs;
CREATE POLICY "Users can create own designs" ON public.label_designs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own designs" ON public.label_designs;
CREATE POLICY "Users can update own designs" ON public.label_designs 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own designs" ON public.label_designs;
CREATE POLICY "Users can delete own designs" ON public.label_designs 
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_labels_updated_at ON public.labels;
CREATE TRIGGER update_labels_updated_at 
  BEFORE UPDATE ON public.labels 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_label_designs_updated_at ON public.label_designs;
CREATE TRIGGER update_label_designs_updated_at 
  BEFORE UPDATE ON public.label_designs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFY SETUP
-- ============================================
SELECT 
    'Database setup complete!' as status,
    COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'labels', 'label_designs');

-- Show table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'label_designs'
ORDER BY ordinal_position;
