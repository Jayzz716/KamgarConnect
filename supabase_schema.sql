-- Run this in your Supabase SQL Editor

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID references auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('customer', 'worker')),
  full_name TEXT,
  phone TEXT,
  age INTEGER,
  location TEXT,
  
  -- Worker specific fields
  profession TEXT,
  experience_years INTEGER,
  aadhar_number TEXT,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Turn on RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 2. Create Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_profession TEXT NOT NULL,
  location TEXT NOT NULL,
  budget NUMERIC,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Turn on RLS for Jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policies for Jobs
CREATE POLICY "Jobs are viewable by everyone."
  ON public.jobs FOR SELECT
  USING ( true );

CREATE POLICY "Customers can insert jobs."
  ON public.jobs FOR INSERT
  WITH CHECK ( auth.uid() = customer_id );

CREATE POLICY "Customers can update their own jobs."
  ON public.jobs FOR UPDATE
  USING ( auth.uid() = customer_id );

-- 3. Automatic Profile Creation Trigger (Optional but recommended)
-- This automatically creates a profile row when a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone, age, location, profession, experience_years, aadhar_number)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'age')::INTEGER,
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'profession',
    (new.raw_user_meta_data->>'experience_years')::INTEGER,
    new.raw_user_meta_data->>'aadhar_number'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
