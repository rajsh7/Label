-- Check actual table structures
SELECT 'templates' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'templates'
UNION ALL
SELECT 'printers' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'printers'
UNION ALL
SELECT 'batch_jobs' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'batch_jobs'
UNION ALL
SELECT 'print_history' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'print_history'
ORDER BY table_name, column_name;