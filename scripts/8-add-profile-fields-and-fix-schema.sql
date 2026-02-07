-- ============================================
-- MIGRATION: ADD MISSING PROFILE FIELDS
-- ============================================

-- Add first_name, last_name, and bio to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Refresh the schema cache (notify PostgREST)
NOTIFY pgrst, 'reload schema';

SELECT 'Migration completed successfully' as status;
