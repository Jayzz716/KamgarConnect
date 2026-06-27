-- Run this in your Supabase SQL Editor to enable Worker Accept/Reject functionality
-- This uses SECURITY DEFINER to safely bypass RLS for these specific actions.

-- 1. Create the Accept Job function
CREATE OR REPLACE FUNCTION public.accept_job_offer(p_job_id UUID, p_worker_id UUID)
RETURNS void AS $$
BEGIN
  -- Verify the application is offered to this worker
  IF NOT EXISTS (
    SELECT 1 FROM public.job_applications 
    WHERE job_id = p_job_id AND worker_id = p_worker_id AND status = 'offered'
  ) THEN
    RAISE EXCEPTION 'Job offer not found or not in offered state.';
  END IF;

  -- Update the job
  UPDATE public.jobs 
  SET assigned_worker_id = p_worker_id, status = 'in_progress'
  WHERE id = p_job_id;

  -- Update the accepted application
  UPDATE public.job_applications
  SET status = 'accepted'
  WHERE job_id = p_job_id AND worker_id = p_worker_id;

  -- Reject all other applications for this job
  UPDATE public.job_applications
  SET status = 'rejected'
  WHERE job_id = p_job_id AND worker_id != p_worker_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Create the Reject Job function
CREATE OR REPLACE FUNCTION public.reject_job_offer(p_job_id UUID, p_worker_id UUID)
RETURNS void AS $$
BEGIN
  -- Verify the application is offered to this worker
  IF NOT EXISTS (
    SELECT 1 FROM public.job_applications 
    WHERE job_id = p_job_id AND worker_id = p_worker_id AND status = 'offered'
  ) THEN
    RAISE EXCEPTION 'Job offer not found or not in offered state.';
  END IF;

  -- Update the application to worker_rejected
  UPDATE public.job_applications
  SET status = 'worker_rejected'
  WHERE job_id = p_job_id AND worker_id = p_worker_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
