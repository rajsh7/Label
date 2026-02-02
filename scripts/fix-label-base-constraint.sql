-- Fix for label_designs foreign key constraint error
-- This ensures basic labels exist for label_base_id references

-- Insert basic default labels if they don't exist
INSERT INTO public.labels (id, name, category, print_method, width_mm, height_mm, width_px_203dpi, height_px_203dpi, width_px_300dpi, height_px_300dpi)
VALUES 
  ('custom', 'Custom Label', 'custom', 'thermal', 101.6, 152.4, 812, 1218, 1200, 1800),
  ('avery_5160', 'Avery 5160', 'avery', 'inkjet', 66.675, 25.4, 533, 203, 787, 300),
  ('amazon_fba_001', 'Amazon FBA 2x1', 'amazon_fba', 'thermal', 50.8, 25.4, 406, 203, 600, 300)
ON CONFLICT (id) DO NOTHING;

-- Update any existing label_designs with invalid label_base_id to use 'custom'
UPDATE public.label_designs 
SET label_base_id = 'custom' 
WHERE label_base_id NOT IN (SELECT id FROM public.labels);

-- Update any existing templates with invalid label_base_id to use 'custom'  
UPDATE public.templates 
SET label_base_id = 'custom' 
WHERE label_base_id NOT IN (SELECT id FROM public.labels);