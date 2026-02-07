-- ============================================
-- 3. BATCH JOBS & PRINTERS SETUP
-- ============================================

-- Create Printers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.printers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  model TEXT,
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'printing', 'error')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Batch Jobs table
CREATE TABLE IF NOT EXISTS public.batch_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  template_id TEXT NOT NULL, -- TEXT to support both UUIDs (custom) and String IDs (static)
  printer_id UUID REFERENCES public.printers(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_count INTEGER DEFAULT 0,
  processed_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_batch_jobs_user ON public.batch_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_printers_user ON public.printers(user_id);

-- Enable RLS
ALTER TABLE public.batch_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Batch Jobs
DROP POLICY IF EXISTS "Users can view own batch jobs" ON public.batch_jobs;
CREATE POLICY "Users can view own batch jobs" ON public.batch_jobs 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own batch jobs" ON public.batch_jobs;
CREATE POLICY "Users can insert own batch jobs" ON public.batch_jobs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own batch jobs" ON public.batch_jobs;
CREATE POLICY "Users can update own batch jobs" ON public.batch_jobs 
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Printers
DROP POLICY IF EXISTS "Users can view own printers" ON public.printers;
CREATE POLICY "Users can view own printers" ON public.printers 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own printers" ON public.printers;
CREATE POLICY "Users can insert own printers" ON public.printers 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own printers" ON public.printers;
CREATE POLICY "Users can update own printers" ON public.printers 
  FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_batch_jobs_updated_at ON public.batch_jobs;
CREATE TRIGGER update_batch_jobs_updated_at 
  BEFORE UPDATE ON public.batch_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_printers_updated_at ON public.printers;
CREATE TRIGGER update_printers_updated_at 
  BEFORE UPDATE ON public.printers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
