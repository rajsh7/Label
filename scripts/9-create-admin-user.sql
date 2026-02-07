-- Create Admin User - Step by Step Guide
-- ==========================================

-- STEP 1: First, check if you have any existing users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- STEP 2: If you see a user you want to make admin, copy their ID and use it below
-- If you don't have any users, you MUST create one first in Supabase Dashboard:
-- Go to: Authentication > Users > Add User
-- Email: admin@labelpro.com
-- Password: Label@admin
-- Auto Confirm: YES

-- STEP 3: After creating the user in Supabase Dashboard, run this to get the user ID:
SELECT id, email 
FROM auth.users 
WHERE email = 'admin@labelpro.com';

-- STEP 4: Copy the UUID from the result above and paste it in the query below
-- Replace the entire 'PASTE_USER_UUID_HERE' with the actual UUID (including quotes)

-- Example UUID format: '550e8400-e29b-41d4-a716-446655440000'

INSERT INTO profiles (id, email, is_admin, first_name, last_name, created_at, updated_at)
VALUES (
  'PASTE_USER_UUID_HERE', -- Replace this with actual UUID from STEP 3
  'admin@labelpro.com',
  true,
  'Admin',
  'User',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET is_admin = true,
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = NOW();

-- STEP 5: Verify the admin user was created
SELECT p.id, p.email, p.is_admin, p.first_name, p.last_name, u.email as auth_email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;
