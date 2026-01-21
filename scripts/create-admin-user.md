-- Create admin user script
-- This needs to be run in Supabase Auth (not SQL Editor)
-- Go to Authentication > Users > Add User

-- Admin User Details:
-- Email: admin@labelpro.com
-- Password: Label@admin
-- Email Confirm: Yes (check the box)

-- After creating the user, run this SQL to set admin privileges:
UPDATE profiles 
SET 
  is_admin = true,
  full_name = 'System Administrator',
  company_name = 'LabelPro Admin'
WHERE email = 'admin@labelpro.com';