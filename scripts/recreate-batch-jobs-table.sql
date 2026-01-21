-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS public.batch_jobs CASCADE;

-- Create batch_jobs table
CREATE TABLE public.batch_jobs (
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

-- Create indexes
CREATE INDEX idx_batch_jobs_user_id ON public.batch_jobs(user_id);
CREATE INDEX idx_batch_jobs_status ON public.batch_jobs(status);
CREATE INDEX idx_batch_jobs_created_at ON public.batch_jobs(created_at DESC);

-- Enable RLS
ALTER TABLE public.batch_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own batch jobs"
  ON public.batch_jobs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own batch jobs"
  ON public.batch_jobs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batch jobs"
  ON public.batch_jobs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own batch jobs"
  ON public.batch_jobs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
