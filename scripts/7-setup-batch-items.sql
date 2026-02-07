-- ============================================
-- 7. BATCH JOB ITEMS
-- ============================================

CREATE TABLE IF NOT EXISTS public.batch_job_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  batch_job_id UUID REFERENCES public.batch_jobs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  row_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  generated_pdf_url TEXT,
  tracking_number TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_batch_job_items_job ON public.batch_job_items(batch_job_id);
CREATE INDEX IF NOT EXISTS idx_batch_job_items_user ON public.batch_job_items(user_id);

-- RLS
ALTER TABLE public.batch_job_items ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own batch items" ON public.batch_job_items;
CREATE POLICY "Users can view own batch items" ON public.batch_job_items 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own batch items" ON public.batch_job_items;
CREATE POLICY "Users can insert own batch items" ON public.batch_job_items 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own batch items" ON public.batch_job_items;
CREATE POLICY "Users can update own batch items" ON public.batch_job_items 
  FOR UPDATE USING (auth.uid() = user_id);

-- Permissions
GRANT ALL ON TABLE public.batch_job_items TO authenticated;
GRANT ALL ON TABLE public.batch_job_items TO anon;
GRANT ALL ON TABLE public.batch_job_items TO service_role;

-- Trigger for update
DROP TRIGGER IF EXISTS update_batch_job_items_updated_at ON public.batch_job_items;
CREATE TRIGGER update_batch_job_items_updated_at 
  BEFORE UPDATE ON public.batch_job_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Force reload
NOTIFY pgrst, 'reload config';
