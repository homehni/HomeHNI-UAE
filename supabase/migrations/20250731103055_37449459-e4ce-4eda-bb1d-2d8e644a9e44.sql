-- Update property_type check constraint to include all required types
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_property_type_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_property_type_check 
CHECK (property_type = ANY (ARRAY[
  'apartment'::text, 
  'villa'::text, 
  'independent_house'::text, 
  'builder_floor'::text, 
  'plot'::text, 
  'commercial'::text, 
  'office'::text, 
  'shop'::text, 
  'warehouse'::text, 
  'showroom'::text
]));

-- Update bhk_type check constraint to include studio
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_bhk_type_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_bhk_type_check 
CHECK (bhk_type = ANY (ARRAY[
  'studio'::text,
  '1rk'::text, 
  '1bhk'::text, 
  '2bhk'::text, 
  '3bhk'::text, 
  '4bhk'::text, 
  '5bhk'::text, 
  '5bhk+'::text, 
  '6bhk'::text, 
  '7bhk'::text, 
  '8bhk'::text, 
  '9bhk'::text, 
  '10bhk'::text
]));

-- Update listing_type check constraint to be explicit
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_listing_type_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_listing_type_check 
CHECK (listing_type = ANY (ARRAY['sale'::text, 'rent'::text]));