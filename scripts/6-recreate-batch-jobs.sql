-- ============================================
-- 6. RECREATE BATCH JOBS (Clean Slate)
-- ============================================

-- 1. Drop existing table to clear any bad state
DROP TABLE IF EXISTS public.batch_jobs CASCADE;

-- 2. Recreate with simplest valid schema
CREATE TABLE public.batch_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  template_id TEXT NOT NULL,
  printer_id UUID,
  status VARCHAR(20) DEFAULT 'pending',
  total_count INTEGER DEFAULT 0,
  processed_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Grant explicit permissions
GRANT ALL ON TABLE public.batch_jobs TO authenticated;
GRANT ALL ON TABLE public.batch_jobs TO service_role;
GRANT ALL ON TABLE public.batch_jobs TO anon;

-- 4. Enable RLS but create open policy for debugging
ALTER TABLE public.batch_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users" ON public.batch_jobs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Force cache reload
NOTIFY pgrst, 'reload config';
