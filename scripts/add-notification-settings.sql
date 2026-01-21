-- Add notification_settings column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{}'::jsonb;
