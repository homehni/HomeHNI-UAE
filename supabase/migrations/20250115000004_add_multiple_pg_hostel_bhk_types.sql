-- Add 'multiple' and 'pg_hostel' to bhk_type check constraint
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
  '10bhk'::text,
  'multiple'::text,
  'pg_hostel'::text
]));
