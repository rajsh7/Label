-- Temporarily disable RLS to check if data exists
ALTER TABLE batch_jobs DISABLE ROW LEVEL SECURITY;

-- Check all batch jobs
SELECT id, user_id, template_id, status, total_labels, created_at 
FROM batch_jobs 
ORDER BY created_at DESC;

-- Re-enable RLS after checking
ALTER TABLE batch_jobs ENABLE ROW LEVEL SECURITY;
