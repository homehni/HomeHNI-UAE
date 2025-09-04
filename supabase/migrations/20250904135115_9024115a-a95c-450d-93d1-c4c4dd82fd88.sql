-- Update properties.property_type check constraint to include PG/Hostel and Flatmates
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
      'hotel'
    )
  );

-- Ensure BHK type constraint allows 'multiple' (safe drop if it doesn't exist)
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_bhk_type_check;

ALTER TABLE public.properties
  ADD CONSTRAINT properties_bhk_type_check
  CHECK (
    bhk_type IS NULL OR bhk_type IN (
      'studio','1rk','1bhk','2bhk','3bhk','4bhk','5bhk','5bhk+','6bhk','7bhk','8bhk','9bhk','10bhk','multiple'
    )
  );