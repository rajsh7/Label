-- Add integration columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS connected_integrations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS api_key_prod TEXT,
ADD COLUMN IF NOT EXISTS api_key_test TEXT;
