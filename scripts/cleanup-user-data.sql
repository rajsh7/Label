-- Cleanup script to remove all user-created labels and templates
-- Run this in Supabase SQL Editor

-- Delete all user label designs
DELETE FROM public.label_designs;

-- Delete all user templates (keep only system templates where user_id is null)
DELETE FROM public.templates;

-- Reset usage counters
UPDATE public.profiles 
SET labels_used_this_month = 0, 
    batches_used_this_month = 0;

-- Delete print history
DELETE FROM public.print_history;

-- Delete batch jobs
DELETE FROM public.batches;

-- Optional: Delete printers
DELETE FROM public.printers;

-- Success message
SELECT 'All user data cleaned up successfully' as message;
