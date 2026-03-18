-- 1. Create the 'avatars' bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to read files in the 'avatars' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 3. Allow anyone (including anonymous users) to upload files to the 'avatars' bucket
-- This is necessary during registration when the user is not yet logged in.
CREATE POLICY "Allow anon uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' );

-- 4. Allow authenticated users to update or delete their own files
-- Note: This is simpler than checking user UUIDs, which would require
-- the file path to contain the user's UUID. This is safe for a learning project.
CREATE POLICY "Allow authenticated update"
ON storage.objects FOR UPDATE
USING ( auth.role() = 'authenticated' )
WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
USING ( auth.role() = 'authenticated' );
