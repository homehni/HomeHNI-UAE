-- Fix security definer view issue by creating a regular view instead
-- Regular views are safer and still provide the data filtering we need

DROP VIEW IF EXISTS public.public_properties;

-- Create a regular view (not security definer) that filters out sensitive data
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
  updated_at,
  is_featured
  -- Explicitly excluding: owner_name, owner_email, owner_phone, owner_role, user_id
FROM public.properties 
WHERE status = 'approved';

-- Grant public read access to the view
GRANT SELECT ON public.public_properties TO anon;
GRANT SELECT ON public.public_properties TO authenticated;