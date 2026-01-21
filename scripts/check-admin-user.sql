-- Check if admin user exists and their current status
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
WHERE email = 'admin@labelpro.com';

-- If no results, check all profiles
SELECT id, email, full_name, is_admin 
FROM profiles 
ORDER BY created_at DESC;