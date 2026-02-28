-- Run this in your Supabase SQL Editor to upgrade to Phase 3 features

-- 1. Update Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating_sum INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- 2. Update Jobs Table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS assigned_worker_id UUID REFERENCES public.profiles(id);

-- 3. Create Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(job_id, worker_id) -- A worker can only apply once per job
);

-- Turn on RLS for Job Applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for Job Applications
CREATE POLICY "Job applications viewable by everyone."
  ON public.job_applications FOR SELECT
  USING ( true );

CREATE POLICY "Workers can insert their own applications."
  ON public.job_applications FOR INSERT
  WITH CHECK ( auth.uid() = worker_id );

CREATE POLICY "Customers can update applications for their jobs."
  ON public.job_applications FOR UPDATE
  USING ( 
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = job_applications.job_id AND jobs.customer_id = auth.uid()
    ) 
  );
