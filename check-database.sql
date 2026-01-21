-- Check all tables in your Supabase database
-- Run these queries in Supabase SQL Editor

-- 1. List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check labels table structure  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'labels'
ORDER BY ordinal_position;

-- 4. Check batch_jobs table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'batch_jobs'
ORDER BY ordinal_position;

-- 5. Count rows in each table
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'labels' as table_name, COUNT(*) as row_count FROM labels  
UNION ALL
SELECT 'batch_jobs' as table_name, COUNT(*) as row_count FROM batch_jobs;

-- 6. Check if tables exist
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
         THEN 'EXISTS' ELSE 'MISSING' END as profiles_table,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'labels') 
         THEN 'EXISTS' ELSE 'MISSING' END as labels_table,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'batch_jobs') 
         THEN 'EXISTS' ELSE 'MISSING' END as batch_jobs_table;