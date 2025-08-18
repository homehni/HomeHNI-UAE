-- Fix the security definer view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_properties;

CREATE VIEW public.public_properties AS
SELECT 
  p.id,
  p.expected_price,
  p.super_area,
  p.carpet_area,
  p.bathrooms,
  p.balconies,
  p.floor_no,
  p.total_floors,
  p.availability_date,
  p.price_negotiable,
  p.maintenance_charges,
  p.security_deposit,
  p.created_at,
  p.updated_at,
  p.title,
  p.property_type,
  p.listing_type,
  p.bhk_type,
  p.furnishing,
  p.availability_type,
  p.city,
  p.locality,
  p.state,
  p.pincode,
  p.street_address,
  p.landmarks,
  p.description,
  p.images,
  p.videos,
  p.status
FROM public.properties p
WHERE p.status = 'approved';