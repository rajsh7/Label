-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================

-- 1. Create the 'labels' bucket
insert into storage.buckets (id, name, public)
values ('labels', 'labels', true)
on conflict (id) do nothing;

-- 2. Enable RLS
-- (Storage tables usually have RLS enabled by default)

-- 3. Policies for 'labels' bucket

-- Allow public access to view files (since bucket is public, this might be redundant but good for explicit controls)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'labels' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload labels"
  on storage.objects for insert
  with check (
    bucket_id = 'labels' 
    and auth.role() = 'authenticated'
  );

-- Allow users to update their own files (optional, for re-processing)
create policy "Users can update own labels"
  on storage.objects for update
  using (
    bucket_id = 'labels' 
    and auth.uid() = owner
  );

-- Allow users to delete their own files
create policy "Users can delete own labels"
  on storage.objects for delete
  using (
    bucket_id = 'labels' 
    and auth.uid() = owner
  );
