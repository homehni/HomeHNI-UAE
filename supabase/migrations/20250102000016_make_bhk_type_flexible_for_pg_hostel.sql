-- Make BHK type constraint more flexible for PG/Hostel properties
-- Drop the existing BHK type constraint
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_bhk_type_check;

-- Add a new flexible BHK type constraint that allows NULL and more values
ALTER TABLE public.properties 
ADD CONSTRAINT properties_bhk_type_check 
CHECK (
  bhk_type IS NULL OR 
  bhk_type IN (
    '1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+',
    'studio', 'multiple', 'pg_hostel', 'flatmates'
  )
);

-- Update any existing invalid BHK types to NULL for PG/Hostel properties
UPDATE public.properties 
SET bhk_type = NULL 
WHERE property_type = 'pg_hostel' 
  AND bhk_type NOT IN (
    '1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+',
    'studio', 'multiple', 'pg_hostel', 'flatmates'
  );

-- Also update any existing invalid BHK types for other property types
UPDATE public.properties 
SET bhk_type = '1bhk' 
WHERE property_type != 'pg_hostel' 
  AND bhk_type IS NOT NULL
  AND bhk_type NOT IN (
    '1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+',
    'studio', 'multiple'
  );
