-- Get labels table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'labels'
ORDER BY ordinal_position;

-- Get batch_jobs table structure  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'batch_jobs'
ORDER BY ordinal_position;

-- Get row counts for all tables
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'labels' as table_name, COUNT(*) as row_count FROM labels  
UNION ALL
SELECT 'batch_jobs' as table_name, COUNT(*) as row_count FROM batch_jobs
UNION ALL
SELECT 'templates' as table_name, COUNT(*) as row_count FROM templates
UNION ALL
SELECT 'printers' as table_name, COUNT(*) as row_count FROM printers
UNION ALL
SELECT 'print_history' as table_name, COUNT(*) as row_count FROM print_history;