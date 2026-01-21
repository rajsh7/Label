# Batch History Setup Instructions

To enable batch processing history and PDF storage, follow these steps:

## Step 1: Create batch_jobs table

Run the SQL script in `scripts/create-batch-jobs-table.sql` in Supabase SQL Editor

This will:
- Create the `batch_jobs` table to store batch processing history
- Add indexes for better query performance
- Enable Row Level Security (RLS)
- Create RLS policies so users can only access their own batch jobs

## Step 2: Create storage bucket manually

1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Set:
   - Name: `label_outputs`
   - Public: **No** (keep it private)
   - File size limit: 50MB
   - Allowed MIME types: `application/pdf`
4. Click "Create bucket"

## Step 3: Add storage policies

After creating the bucket, run the SQL script in `scripts/create-storage-bucket.sql` in Supabase SQL Editor

This will create RLS policies so users can only access their own files.

## Step 4: Verify setup

1. Go to Supabase Dashboard → Database → Tables
   - Verify `batch_jobs` table exists

2. Go to Supabase Dashboard → Storage
   - Verify `label_outputs` bucket exists

3. Test batch processing:
   - Go to `/dashboard/batch` in your app
   - Upload a CSV file and generate labels
   - After download, go to `/dashboard/history`
   - You should see your batch job with a download button

## Folder Structure in Storage

Files are organized as:
```
label_outputs/
├── batch/{user_id}/
│   └── {batch_job_id}_{timestamp}.pdf
├── labels/{user_id}/
│   └── designs/{design_id}_{timestamp}.pdf
├── templates/{user_id}/
│   └── {template_id}_{timestamp}.pdf
└── exports/{user_id}/
    └── {file_id}_{timestamp}.pdf
```

## Troubleshooting

If batch history is not showing:
1. Check browser console for errors
2. Verify RLS policies are created correctly
3. Ensure user is authenticated
4. Check Supabase logs for any database errors
