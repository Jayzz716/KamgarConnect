-- Run this in your Supabase SQL Editor to add monthly_revenue to worker profiles
-- This column stores the cumulative revenue earned by a worker (updated on each job completion)

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS monthly_revenue NUMERIC DEFAULT 0;

-- Optional: Set existing workers' monthly_revenue based on their completed jobs
-- Run this to backfill existing data
UPDATE public.profiles p
SET monthly_revenue = COALESCE((
    SELECT SUM(j.budget)
    FROM job_applications ja
    JOIN jobs j ON j.id = ja.job_id
    WHERE ja.worker_id = p.id
      AND ja.status = 'accepted'
      AND j.status = 'completed'
      AND j.budget IS NOT NULL
), 0)
WHERE p.role = 'worker';
