-- Fix the security definer view issue by recreating public_properties without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_properties;

CREATE OR REPLACE VIEW public.public_properties AS
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
  is_featured,
  images,
  videos,
  furnishing,
  availability_type,
  status,
  city,
  locality,
  title,
  property_type,
  listing_type,
  bhk_type,
  state,
  pincode,
  street_address,
  landmarks,
  description
FROM public.properties
WHERE status = 'approved';

-- Grant appropriate permissions on the view
GRANT SELECT ON public.public_properties TO anon;
GRANT SELECT ON public.public_properties TO authenticated;