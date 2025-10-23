-- Fix conflicting property and listing type constraints
-- This migration ensures proper separation between property_type and listing_type

-- First, fix any existing data that might have incorrect values
UPDATE public.properties 
SET listing_type = CASE 
  WHEN listing_type IN ('apartment', 'villa', 'independent_house', 'builder_floor', 'studio_apartment', 'penthouse', 'duplex', 'plot', 'studio', 'pg_hostel', 'commercial', 'office', 'shop', 'warehouse', 'showroom', 'coworking', 'hotel', 'agriculture_lands', 'farm_house') 
  THEN CASE 
    WHEN property_type IN ('apartment', 'villa', 'independent_house', 'builder_floor', 'studio_apartment', 'penthouse', 'duplex', 'studio', 'pg_hostel', 'commercial', 'office', 'shop', 'warehouse', 'showroom', 'coworking', 'hotel') THEN 'rent'
    WHEN property_type IN ('plot', 'agriculture_lands', 'farm_house') THEN 'sale'
    ELSE 'rent'
  END
  -- Fix land properties that might have land type as listing_type
  WHEN listing_type IN ('Industrial land', 'Commercial land', 'Agricultural Land') THEN 'sale'
  ELSE listing_type
END
WHERE listing_type NOT IN ('sale', 'rent');

-- Drop the conflicting listing_type constraint
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_listing_type_check;

-- Add the correct listing_type constraint (only sale/rent)
ALTER TABLE public.properties
  ADD CONSTRAINT properties_listing_type_check
  CHECK (listing_type IN ('sale', 'rent'));

-- Ensure property_type constraint is correct
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_property_type_check;

ALTER TABLE public.properties
  ADD CONSTRAINT properties_property_type_check
  CHECK (
    property_type IN (
      'apartment',
      'villa',
      'independent_house',
      'builder_floor',
      'studio_apartment',
      'penthouse',
      'duplex',
      'plot',
      'studio',
      'pg_hostel',
      'flatmates',
      'commercial',
      'office',
      'shop',
      'warehouse',
      'showroom',
      'coworking',
      'hotel',
      'agriculture_lands',
      'farm_house'
    )
  );

-- Add comment explaining the separation
COMMENT ON COLUMN public.properties.property_type IS 'Type of property (apartment, villa, etc.)';
COMMENT ON COLUMN public.properties.listing_type IS 'Type of listing (sale or rent only)';
