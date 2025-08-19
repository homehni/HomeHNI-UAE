-- Fix Security Definer View Issue
-- The current public_properties view bypasses RLS policies and grants access to anonymous users

-- Step 1: Drop the existing problematic view
DROP VIEW IF EXISTS public.public_properties;

-- Step 2: Create a new view that respects RLS policies
-- This view will only show approved properties and will respect user permissions
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

-- Step 3: Enable RLS on the view
ALTER VIEW public.public_properties SET (security_invoker = true);

-- Step 4: Create RLS policies for the view
-- Allow public read access to approved properties only
CREATE POLICY "Public can view approved properties"
ON public.public_properties
FOR SELECT
TO public
USING (true);

-- Step 5: Enable RLS on the view (if not already enabled)
-- Note: Views inherit RLS from underlying tables when using security_invoker = true

-- Step 6: Ensure proper permissions - only allow SELECT for public users
REVOKE ALL ON public.public_properties FROM anon, authenticated, service_role;
GRANT SELECT ON public.public_properties TO anon, authenticated;

-- Optional: Create an index on status column for better performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status) 
WHERE status = 'approved';