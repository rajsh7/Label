-- ============================================
-- CLEANUP SCRIPT - Run this FIRST
-- ============================================
-- This will drop all existing tables to start fresh
-- WARNING: This will delete ALL data!

-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS public.print_history CASCADE;
DROP TABLE IF EXISTS public.batches CASCADE;
DROP TABLE IF EXISTS public.templates CASCADE;
DROP TABLE IF EXISTS public.label_designs CASCADE;
DROP TABLE IF EXISTS public.printers CASCADE;
DROP TABLE IF EXISTS public.api_keys CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.usage_tracking CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.labels CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Verify cleanup
SELECT 
    'All tables dropped successfully!' as status,
    COUNT(*) as remaining_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles', 'labels', 'label_designs', 'templates', 
    'batches', 'printers', 'print_history', 'api_keys',
    'team_members', 'usage_tracking', 'audit_logs', 'referrals'
  );
