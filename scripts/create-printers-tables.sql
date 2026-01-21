-- Create printers table
CREATE TABLE IF NOT EXISTS printers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  printer_type TEXT NOT NULL,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('usb', 'wifi', 'network')),
  network_ip TEXT,
  paper_size TEXT,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'paused')),
  is_default BOOLEAN DEFAULT false,
  labels_remaining INTEGER DEFAULT 0,
  total_printed INTEGER DEFAULT 0,
  firmware TEXT,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create print_queue table
CREATE TABLE IF NOT EXISTS print_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  printer_id UUID NOT NULL REFERENCES printers(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'printing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  copies INTEGER DEFAULT 1,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- RLS policies for printers
ALTER TABLE printers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own printers"
  ON printers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own printers"
  ON printers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own printers"
  ON printers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own printers"
  ON printers FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for print_queue
ALTER TABLE print_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own print jobs"
  ON print_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own print jobs"
  ON print_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own print jobs"
  ON print_queue FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own print jobs"
  ON print_queue FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_printers_user_id ON printers(user_id);
CREATE INDEX idx_print_queue_user_id ON print_queue(user_id);
CREATE INDEX idx_print_queue_printer_id ON print_queue(printer_id);
CREATE INDEX idx_print_queue_status ON print_queue(status);
