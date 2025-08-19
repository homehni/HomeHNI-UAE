-- Fix Security Definer View Issue
-- The current public_properties view bypasses RLS policies

-- Step 1: Drop the existing problematic view
DROP VIEW IF EXISTS public.public_properties;

-- Step 2: Create a new view with security_invoker = true
-- This ensures the view runs with the caller's permissions, not the creator's
CREATE VIEW public.public_properties 
WITH (security_invoker = true)
AS 
SELECT 
  id,
  expected_price,
  super_area,
  carpet_area,
  bathrooms,
  balconies,
  floor_no,
  total_floors,
  availability_date,
  price_negotiable,
  maintenance_charges,
  security_deposit,
  created_at,
  updated_at,
  title,
  property_type,
  listing_type,
  bhk_type,
  furnishing,
  availability_type,
  city,
  locality,
  state,
  pincode,
  street_address,
  landmarks,
  description,
  images,
  videos,
  status
FROM public.properties
WHERE status = 'approved';

-- Step 3: Set proper permissions - only allow SELECT and only for authenticated users
REVOKE ALL ON public.public_properties FROM anon, authenticated, service_role;
GRANT SELECT ON public.public_properties TO authenticated;

-- Step 4: Enable RLS on the underlying properties table (if not already enabled)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Step 5: Add a policy to allow public read access to approved properties only
CREATE POLICY "Public can view approved properties" ON public.properties
FOR SELECT 
TO authenticated, anon
USING (status = 'approved');

-- Step 6: Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_properties_status_approved 
ON public.properties(status) 
WHERE status = 'approved';