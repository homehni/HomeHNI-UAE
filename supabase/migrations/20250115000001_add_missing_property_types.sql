-- Add studio_apartment, penthouse, and duplex to property_type check constraint
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
