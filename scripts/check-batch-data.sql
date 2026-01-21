-- Check if batch_jobs table exists and has data
SELECT COUNT(*) as total_batch_jobs FROM batch_jobs;

-- Check all batch jobs (without RLS)
SELECT id, user_id, template_id, status, total_labels, created_at 
FROM batch_jobs 
ORDER BY created_at DESC 
LIMIT 10;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'batch_jobs';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'batch_jobs';
