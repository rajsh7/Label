-- Skip print_history for now - check constraint issue
-- Insert sample printers
INSERT INTO printers (id, name, printer_type, connection_type, status, user_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Office DYMO', 'DYMO LabelWriter 450', 'usb', 'online', (SELECT id FROM profiles LIMIT 1)),
('660e8400-e29b-41d4-a716-446655440002', 'Warehouse Zebra', 'Zebra ZD420', 'network', 'online', (SELECT id FROM profiles LIMIT 1));

-- Insert sample batch jobs
INSERT INTO batch_jobs (id, status, total_labels, generated_labels, user_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'completed', 150, 150, (SELECT id FROM profiles LIMIT 1)),
('770e8400-e29b-41d4-a716-446655440002', 'processing', 75, 45, (SELECT id FROM profiles LIMIT 1)),
('770e8400-e29b-41d4-a716-446655440003', 'pending', 200, 0, (SELECT id FROM profiles LIMIT 1));

-- Insert sample print history
INSERT INTO print_history (id, quantity, status, user_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', 25, 'success', (SELECT id FROM profiles LIMIT 1)),
('880e8400-e29b-41d4-a716-446655440002', 100, 'success', (SELECT id FROM profiles LIMIT 1)),
('880e8400-e29b-41d4-a716-446655440003', 50, 'failed', (SELECT id FROM profiles LIMIT 1));

-- Update profiles with sample usage data
UPDATE profiles SET 
  labels_used_this_month = 175,
  batches_used_this_month = 3,
  subscription_tier = 'pro',
  subscription_status = 'active'
WHERE id = (SELECT id FROM profiles LIMIT 1);