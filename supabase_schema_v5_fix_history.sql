-- Run this in your Supabase SQL Editor to fix Job History & Revenue tracking
-- This adds the missing columns that the application code depends on

-- 1. Add 'updated_at' column to the jobs table (used for tracking when jobs are completed)
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- 2. Add 'is_rated' column to the jobs table (used to track if customer has rated the worker)
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS is_rated BOOLEAN DEFAULT false;

-- 3. Backfill updated_at for existing jobs using created_at
UPDATE public.jobs
SET updated_at = created_at
WHERE updated_at IS NULL;
