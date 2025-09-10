-- Fix incorrect listing_type values in existing properties
-- Some properties might have property_type values stored as listing_type due to the bug in mapListingType function

-- Update properties where listing_type is a property type instead of sale/rent
UPDATE public.properties 
SET listing_type = CASE 
  WHEN property_type = 'commercial' AND listing_type = 'commercial' THEN 'rent'
  WHEN property_type = 'office' AND listing_type = 'office' THEN 'rent'  
  WHEN property_type = 'shop' AND listing_type = 'shop' THEN 'rent'
  WHEN property_type = 'warehouse' AND listing_type = 'warehouse' THEN 'rent'
  WHEN property_type = 'showroom' AND listing_type = 'showroom' THEN 'rent'
  WHEN property_type = 'apartment' AND listing_type = 'apartment' THEN 'rent'
  WHEN property_type = 'villa' AND listing_type = 'villa' THEN 'rent'
  WHEN property_type = 'independent_house' AND listing_type = 'independent_house' THEN 'rent'
  WHEN property_type = 'builder_floor' AND listing_type = 'builder_floor' THEN 'rent'
  WHEN property_type = 'studio_apartment' AND listing_type = 'studio_apartment' THEN 'rent'
  WHEN property_type = 'penthouse' AND listing_type = 'penthouse' THEN 'rent'
  WHEN property_type = 'duplex' AND listing_type = 'duplex' THEN 'rent'
  WHEN property_type = 'plot' AND listing_type = 'plot' THEN 'sale'
  WHEN property_type = 'pg_hostel' AND listing_type = 'pg_hostel' THEN 'rent'
  ELSE listing_type -- Keep existing value if it's already correct
END
WHERE listing_type IN (
  'commercial', 'office', 'shop', 'warehouse', 'showroom',
  'apartment', 'villa', 'independent_house', 'builder_floor', 
  'studio_apartment', 'penthouse', 'duplex', 'plot', 'pg_hostel'
);

-- Also update pg_hostel_properties table if it exists
UPDATE public.pg_hostel_properties 
SET listing_type = 'rent'
WHERE listing_type IN (
  'commercial', 'office', 'shop', 'warehouse', 'showroom',
  'apartment', 'villa', 'independent_house', 'builder_floor', 
  'studio_apartment', 'penthouse', 'duplex', 'plot', 'pg_hostel'
);

-- Add a comment explaining the fix
COMMENT ON TABLE public.properties IS 'Properties table - listing_type should be sale/rent, not property_type values';
