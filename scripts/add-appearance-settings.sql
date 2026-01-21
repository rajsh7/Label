-- Add appearance_settings column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS appearance_settings JSONB DEFAULT '{
  "theme": "system",
  "accentColor": "#3b82f6",
  "defaultView": "grid",
  "labelsPerPage": 24
}'::jsonb;
