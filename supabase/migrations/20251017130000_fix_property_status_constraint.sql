-- Fix property status constraint to allow 'new' status
-- This allows property submissions to use 'new' status as intended

-- Drop the existing constraint
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_status_check;

-- Add the updated constraint with 'new' status included
ALTER TABLE public.properties 
ADD CONSTRAINT properties_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'draft', 'new'));
