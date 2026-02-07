-- Create printers table
CREATE TABLE IF NOT EXISTS public.printers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('thermal', 'laser', 'inkjet')),
  connection_type VARCHAR(50) NOT NULL CHECK (connection_type IN ('usb', 'network', 'bluetooth', 'cloud')),
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error', 'printing')),
  model TEXT,
  location TEXT,
  ip_address TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_printers_user_id ON public.printers(user_id);

-- Enable RLS
ALTER TABLE public.printers ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
DROP POLICY IF EXISTS "Users can view own printers" ON public.printers;
CREATE POLICY "Users can view own printers" ON public.printers 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own printers" ON public.printers;
CREATE POLICY "Users can insert own printers" ON public.printers 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own printers" ON public.printers;
CREATE POLICY "Users can update own printers" ON public.printers 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own printers" ON public.printers;
CREATE POLICY "Users can delete own printers" ON public.printers 
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_printers_updated_at ON public.printers;
CREATE TRIGGER update_printers_updated_at 
  BEFORE UPDATE ON public.printers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
