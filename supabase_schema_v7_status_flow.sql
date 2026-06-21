-- Run this in your Supabase SQL Editor to update the job application status flow

-- 1. Drop the existing CHECK constraint on the job_applications table
ALTER TABLE public.job_applications DROP CONSTRAINT IF EXISTS job_applications_status_check;

-- 2. Add the updated CHECK constraint with the new statuses
ALTER TABLE public.job_applications ADD CONSTRAINT job_applications_status_check 
CHECK (status IN ('pending', 'offered', 'accepted', 'rejected', 'worker_rejected'));
