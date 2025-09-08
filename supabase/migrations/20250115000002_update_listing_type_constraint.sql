-- Update properties.listing_type check constraint to allow property types as listing types
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_listing_type_check;

ALTER TABLE public.properties
  ADD CONSTRAINT properties_listing_type_check
  CHECK (
    listing_type IN (
      'sale',
      'rent',
      'apartment',
      'villa',
      'independent_house',
      'builder_floor',
      'plot',
      'studio',
      'pg_hostel',
      'commercial',
      'office',
      'shop',
      'warehouse',
      'showroom',
      'coworking',
      'hotel'
    )
  );

-- Update existing Flatmates properties to use correct property_type and listing_type
UPDATE public.properties 
SET 
  property_type = 'apartment',
  listing_type = 'apartment'
WHERE property_type = 'flatmates' OR listing_type = 'Flatmates';

-- Update existing properties to match listing_type with property_type where appropriate
UPDATE public.properties 
SET listing_type = property_type
WHERE property_type IN (
  'apartment', 'villa', 'independent_house', 'builder_floor', 
  'plot', 'studio', 'pg_hostel', 'commercial', 'office', 
  'shop', 'warehouse', 'showroom', 'coworking', 'hotel'
) AND listing_type NOT IN ('sale', 'rent');
