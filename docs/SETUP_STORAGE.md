# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage buckets and policies for LabelPro.

## Required Storage Buckets

### 1. `label_outputs` Bucket

This bucket stores all generated PDF files:
- Individual label PDFs
- Batch job PDFs
- Template exports
- Scheduled batch outputs

**Setup Steps:**

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `label_outputs`
3. Set it as **Private** (not public)
4. Configure the following RLS policies:

#### Policy 1: Users can upload their own PDFs

```sql
CREATE POLICY "Users can upload their own PDFs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'label_outputs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Users can read their own PDFs

```sql
CREATE POLICY "Users can read their own PDFs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'label_outputs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Users can delete their own PDFs

```sql
CREATE POLICY "Users can delete their own PDFs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'label_outputs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 4: Users can update their own PDFs

```sql
CREATE POLICY "Users can update their own PDFs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'label_outputs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 2. `user_images` Bucket

This bucket stores user-uploaded images for label designs.

**Setup Steps:**

1. Create a new bucket named `user_images`
2. Set it as **Private**
3. Configure similar RLS policies as above

## Folder Structure

The storage uses the following folder structure:

```
label_outputs/
├── labels/
│   └── {userId}/
│       └── designs/
│           └── {designId}_{timestamp}.pdf
├── batch/
│   └── {userId}/
│       └── batch/
│           └── {batchJobId}_{timestamp}.pdf
├── templates/
│   └── {userId}/
│       └── templates/
│           └── {templateId}_{timestamp}.pdf
└── exports/
    └── {userId}/
        └── {fileId}_{timestamp}.pdf

user_images/
└── {userId}/
    └── designs/
        └── {designId}/
            └── {imageId}_{timestamp}.{ext}
```

## Storage Configuration

### File Size Limits

- Maximum file size: 50MB per file
- Recommended: 10MB for PDFs, 5MB for images

### Retention Policy

- PDFs: Retained for 90 days by default (configurable)
- Images: Retained indefinitely (or until user deletes design)

### Signed URLs

All PDFs are accessed via signed URLs with expiration:
- Default expiration: 7 days (604800 seconds)
- Maximum expiration: 30 days (2592000 seconds)

## Testing Storage Setup

After setting up the buckets, test the storage:

```typescript
import { storePDF } from '@/lib/storage/pdfStorage'

const testBuffer = Buffer.from('test pdf content')
const result = await storePDF({
  buffer: testBuffer,
  userId: 'your-user-id',
  folder: 'labels',
  designId: 'test-design-id',
})

if (result.success) {
  console.log('PDF stored at:', result.path)
  console.log('Access URL:', result.url)
}
```

## Troubleshooting

### Error: "new row violates row-level security policy"

- Check that RLS policies are correctly configured
- Verify the folder structure matches `{folder}/{userId}/...`
- Ensure the user is authenticated

### Error: "The resource already exists"

- Files are not overwritten by default
- Each upload creates a new file with a unique timestamp
- Use `deletePDF` to remove old files before uploading new ones

### Signed URLs not working

- Check that the file path is correct
- Verify the expiration time is valid (not expired)
- Ensure the user has read permissions on the file

## Cleanup Script

To clean up old PDFs (older than 90 days):

```sql
-- This should be run as a scheduled job
DELETE FROM storage.objects
WHERE bucket_id = 'label_outputs'
AND created_at < NOW() - INTERVAL '90 days';
```

Note: Use Supabase Storage API or admin functions to delete files, not direct SQL.
