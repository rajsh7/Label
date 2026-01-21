-- Database functions for LabelPro
-- Run this in Supabase SQL Editor after creating tables

-- Function to increment API usage
CREATE OR REPLACE FUNCTION increment_api_usage(key_hash TEXT)
RETURNS void AS $$
BEGIN
  UPDATE api_keys
  SET 
    requests_today = requests_today + 1,
    last_used_at = NOW()
  WHERE key_hash = increment_api_usage.key_hash;
END;
$$ LANGUAGE plpgsql;

-- Function to reset daily API usage (run via cron)
CREATE OR REPLACE FUNCTION reset_daily_api_usage()
RETURNS void AS $$
BEGIN
  UPDATE api_keys
  SET requests_today = 0
  WHERE DATE(last_used_at) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

