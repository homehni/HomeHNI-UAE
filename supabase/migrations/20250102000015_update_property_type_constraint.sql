-- First, update existing data to match the new constraint
-- Update any invalid property types to valid ones
UPDATE public.properties 
SET property_type = 'apartment' 
WHERE property_type NOT IN (
  'apartment', 'villa', 'plot', 'commercial', 
  'pg_hostel', 'flatmates', 'independent_house', 
  'builder_floor', 'studio_apartment', 'studio',
  'office', 'shop', 'warehouse', 'showroom', 
  'coworking', 'coliving', 'hotel'
);

-- Update property_type constraint to include PG/Hostel and other property types
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_property_type_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_property_type_check 
CHECK (property_type IN (
  'apartment', 'villa', 'plot', 'commercial', 
  'pg_hostel', 'flatmates', 'independent_house', 
  'builder_floor', 'studio_apartment', 'studio',
  'office', 'shop', 'warehouse', 'showroom', 
  'coworking', 'coliving', 'hotel'
));

-- Update availability_type constraint to include more options
-- First, update any invalid availability types
UPDATE public.properties 
SET availability_type = 'immediate' 
WHERE availability_type NOT IN (
  'immediate', 'date', 'ready_to_move', 'under_construction'
);

ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_availability_type_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_availability_type_check 
CHECK (availability_type IN (
  'immediate', 'date', 'ready_to_move', 'under_construction'
));

-- Update furnishing constraint to include more options
-- First, update any invalid furnishing values
UPDATE public.properties 
SET furnishing = NULL 
WHERE furnishing IS NOT NULL 
  AND furnishing NOT IN (
    'fully', 'semi', 'unfurnished', 'fully-furnished', 
    'semi-furnished', 'un-furnished'
  );

ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_furnishing_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_furnishing_check 
CHECK (furnishing IN (
  'fully', 'semi', 'unfurnished', 'fully-furnished', 
  'semi-furnished', 'un-furnished'
) OR furnishing IS NULL);
