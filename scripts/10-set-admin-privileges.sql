-- Set admin privileges for admin@labelpro.com
-- User UID: 0e758c03-1b3b-4923-9f1d-d73da8ef6a5b

INSERT INTO profiles (id, email, is_admin, first_name, last_name, created_at, updated_at)
VALUES (
  '0e758c03-1b3b-4923-9f1d-d73da8ef6a5b',
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

-- Verify the admin user
SELECT p.id, p.email, p.is_admin, p.first_name, p.last_name
FROM profiles p
WHERE p.id = '0e758c03-1b3b-4923-9f1d-d73da8ef6a5b';
