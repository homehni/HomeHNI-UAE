-- Fix status constraint for properties table
-- First, update any invalid status values to valid ones
UPDATE public.properties 
SET status = 'active' 
WHERE status NOT IN (
  'active', 'inactive', 'sold', 'rented'
);

-- Drop the existing status constraint
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_status_check;

-- Add the status constraint with valid values
ALTER TABLE public.properties 
ADD CONSTRAINT properties_status_check 
CHECK (status IN ('active', 'inactive', 'sold', 'rented'));
