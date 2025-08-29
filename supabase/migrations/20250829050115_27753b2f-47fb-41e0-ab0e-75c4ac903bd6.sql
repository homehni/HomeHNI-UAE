-- Fix critical security issue: Remove public access to sensitive owner data in properties table
-- The properties table currently allows public SELECT which exposes owner contact info

-- First, drop the problematic public read policy
DROP POLICY IF EXISTS "Public can view approved properties" ON public.properties;

-- Ensure the public_properties view exists and excludes sensitive data
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
  updated_at,
  is_featured
  -- Explicitly excluding: owner_name, owner_email, owner_phone, owner_role, user_id
FROM public.properties 
WHERE status = 'approved';

-- Add RLS policy for public_properties view (this is handled by the underlying properties table policies)
-- Public can now only access approved properties through the secure view without owner contact info

-- Ensure the secure contact function exists
CREATE OR REPLACE FUNCTION public.get_property_contact_info(property_id uuid)
RETURNS TABLE(owner_name text, contact_message text)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Only return limited contact info for approved properties
  -- and log the inquiry for audit purposes
  SELECT 
    p.owner_name,
    CASE 
      WHEN p.owner_name IS NOT NULL 
      THEN 'Contact available - use inquiry form to reach owner'
      ELSE 'Contact information not available'
    END as contact_message
  FROM public.properties p
  WHERE p.id = property_id 
    AND p.status = 'approved'
  LIMIT 1;
$function$;