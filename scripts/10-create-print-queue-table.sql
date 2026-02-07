-- Create print_queue table
CREATE TABLE IF NOT EXISTS public.print_queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  printer_id UUID REFERENCES public.printers(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'printing', 'completed', 'failed')),
  copies INTEGER DEFAULT 1,
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_print_queue_user_id ON public.print_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_print_queue_printer_id ON public.print_queue(printer_id);
CREATE INDEX IF NOT EXISTS idx_print_queue_status ON public.print_queue(status);

-- Enable RLS
ALTER TABLE public.print_queue ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
DROP POLICY IF EXISTS "Users can view own print jobs" ON public.print_queue;
CREATE POLICY "Users can view own print jobs" ON public.print_queue 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own print jobs" ON public.print_queue;
CREATE POLICY "Users can insert own print jobs" ON public.print_queue 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own print jobs" ON public.print_queue;
CREATE POLICY "Users can update own print jobs" ON public.print_queue 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own print jobs" ON public.print_queue;
CREATE POLICY "Users can delete own print jobs" ON public.print_queue 
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_print_queue_updated_at ON public.print_queue;
CREATE TRIGGER update_print_queue_updated_at 
  BEFORE UPDATE ON public.print_queue 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
