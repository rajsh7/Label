-- ============================================
-- 4. RELOAD SCHEMA CACHE
-- ============================================
-- Run this if you see errors like:
-- "Could not find the 'name' column of 'batch_jobs' in the schema cache"

NOTIFY pgrst, 'reload config';
