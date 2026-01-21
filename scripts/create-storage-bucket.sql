-- Create storage bucket for label outputs
-- Note: Create this bucket manually in Supabase Dashboard > Storage
-- Bucket name: label_outputs
-- Public: No (private)
-- File size limit: 50MB
-- Allowed MIME types: application/pdf

-- After creating the bucket manually, run these policies:

-- Policy: Users can upload their own files
CREATE POLICY "Users can upload own files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'label_outputs' AND
    (storage.foldername(name))[1] IN ('labels', 'batch', 'templates', 'exports') AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

-- Policy: Users can view their own files
CREATE POLICY "Users can view own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'label_outputs' AND
    (storage.foldername(name))[1] IN ('labels', 'batch', 'templates', 'exports') AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

-- Policy: Users can update their own files
CREATE POLICY "Users can update own files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'label_outputs' AND
    (storage.foldername(name))[1] IN ('labels', 'batch', 'templates', 'exports') AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'label_outputs' AND
    (storage.foldername(name))[1] IN ('labels', 'batch', 'templates', 'exports') AND
    (storage.foldername(name))[2] = auth.uid()::text
  );
