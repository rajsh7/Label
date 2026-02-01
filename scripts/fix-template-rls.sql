-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all public templates
CREATE POLICY "Public templates are viewable by everyone"
ON templates FOR SELECT
USING (is_public = true);

-- Allow authenticated users to view their own templates
CREATE POLICY "Users can view own templates"
ON templates FOR SELECT
USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own templates
CREATE POLICY "Users can insert own templates"
ON templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own templates
CREATE POLICY "Users can update own templates"
ON templates FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own templates
CREATE POLICY "Users can delete own templates"
ON templates FOR DELETE
USING (auth.uid() = user_id);
