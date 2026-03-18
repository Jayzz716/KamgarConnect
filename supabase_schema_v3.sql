-- Run this in your Supabase SQL Editor to add Worker Profile Enhancements

-- 1. Add new columns to the Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certificates TEXT;

-- 2. Create the Storage Bucket for Profile Pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Security Policies for 'avatars' bucket
-- Allow public viewing of avatars
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
  );

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars."
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
  );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars."
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
  );

-- 4. Update Automatic Profile Creation Trigger
-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function to include the new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, role, full_name, phone, age, location, 
    profession, experience_years, aadhar_number,
    blood_group, profile_picture_url, certificates
  )
  VALUES (
    new.id,
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'age')::INTEGER,
    new.raw_user_meta_data->>'location',
    
    -- Worker specific fields
    new.raw_user_meta_data->>'profession',
    (new.raw_user_meta_data->>'experience_years')::INTEGER,
    new.raw_user_meta_data->>'aadhar_number',
    
    -- New Profile fields
    new.raw_user_meta_data->>'blood_group',
    new.raw_user_meta_data->>'profile_picture_url',
    new.raw_user_meta_data->>'certificates'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
