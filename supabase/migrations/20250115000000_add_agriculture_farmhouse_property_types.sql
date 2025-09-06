-- Add agriculture_lands and farm_house to property_type check constraint
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
