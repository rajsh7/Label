-- Set admin privileges for admin@labelpro.com
UPDATE profiles 
SET 
  is_admin = true,
  full_name = 'System Administrator',
  company_name = 'LabelPro Admin'
WHERE email = 'admin@labelpro.com';