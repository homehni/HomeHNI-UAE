-- Fix Security Definer View issue by recreating view without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_properties;

CREATE VIEW public.public_properties AS
SELECT 
  id,
  title,
  property_type,
  listing_type,
  bhk_type,
  expected_price,
  super_area,
  carpet_area,
  bathrooms,
  balconies,
  floor_no,
  total_floors,
  furnishing,
  availability_type,
  availability_date,
  price_negotiable,
  maintenance_charges,
  security_deposit,
  city,
  locality,
  state,
  pincode,
  street_address,
  landmarks,
  description,
  images,
  videos,
  status,
  created_at,
  updated_at
FROM public.properties
WHERE status IN ('approved', 'active');

-- Grant public access to the view instead of using RLS on properties table
GRANT SELECT ON public.public_properties TO anon, authenticated;