-- Check if batch_jobs table exists and its columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'batch_jobs'
ORDER BY ordinal_position;

-- If table exists, check records
SELECT 
  id,
  user_id,
  status,
  total_labels,
  output_file_url,
  created_at,
  completed_at
FROM public.batch_jobs
ORDER BY created_at DESC
LIMIT 10;

-- Check if RLS is blocking the query
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'batch_jobs';
