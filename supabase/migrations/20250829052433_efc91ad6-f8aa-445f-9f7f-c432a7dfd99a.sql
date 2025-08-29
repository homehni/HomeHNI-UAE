-- Fix critical security vulnerability in public_properties view
-- Remove sensitive data exposure and ensure proper access control

-- Drop the existing insecure view
DROP VIEW IF EXISTS public.public_properties;

-- Create a secure public_properties view that:
-- 1. Only shows approved properties
-- 2. Excludes sensitive owner contact information
-- 3. Excludes precise street addresses for privacy
-- 4. Only shows data appropriate for public consumption
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
    -- Exclude street_address for privacy - only show general locality
    landmarks,
    description,
    images,
    videos,
    'approved'::text as status, -- Always 'approved' since we filter for it
    created_at,
    updated_at,
    is_featured
FROM public.properties
WHERE status = 'approved'
  AND (
    -- Additional security: only show properties that are properly configured
    title IS NOT NULL 
    AND city IS NOT NULL 
    AND locality IS NOT NULL
    AND expected_price > 0
  );

-- Add security comment
COMMENT ON VIEW public.public_properties IS 
'Secure public view of approved property listings. Excludes sensitive owner contact information and precise addresses. Only shows properties that are approved and properly configured. Updated: 2025-01-29 - Security fix applied.';

-- Grant appropriate permissions
GRANT SELECT ON public.public_properties TO anon;
GRANT SELECT ON public.public_properties TO authenticated;