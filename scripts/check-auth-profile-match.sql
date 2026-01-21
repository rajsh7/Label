-- Check auth.users table to see the actual user ID
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@labelpro.com';

-- Check if the profile ID matches the auth user ID
SELECT 
  au.id as auth_id,
  au.email as auth_email,
  p.id as profile_id,
  p.email as profile_email,
  p.is_admin
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'admin@labelpro.com';