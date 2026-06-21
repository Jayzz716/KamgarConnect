-- Run this in your Supabase SQL Editor ONLY if certificate uploads are still failing
-- This fixes Storage policies to allow authenticated users to upload any file type

-- Drop potentially conflicting policies (from schema_v3)
DROP POLICY IF EXISTS "Users can upload their own avatars." ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads" ON storage.objects;

-- Allow any authenticated user to upload files to 'avatars' bucket
-- This is needed because during registration, the file is uploaded right after sign-in
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
);

-- Ensure the bucket has no file size or MIME type restrictions
-- (Go to Supabase Dashboard -> Storage -> avatars bucket -> Settings to verify)
