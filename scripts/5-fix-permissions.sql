-- ============================================
-- 5. FIX PERMISSIONS & RELOAD
-- ============================================

-- Grant permissions to authenticated users (and anon just in case)
GRANT ALL ON TABLE public.batch_jobs TO authenticated;
GRANT ALL ON TABLE public.batch_jobs TO anon;
GRANT ALL ON TABLE public.batch_jobs TO service_role;

GRANT ALL ON TABLE public.printers TO authenticated;
GRANT ALL ON TABLE public.printers TO anon;
GRANT ALL ON TABLE public.printers TO service_role;

-- Force schema cache reload again
NOTIFY pgrst, 'reload config';
