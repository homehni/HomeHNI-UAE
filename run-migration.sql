-- Run this SQL in your Supabase SQL Editor to add rental_status columns

-- Add rental_status column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS rental_status TEXT DEFAULT 'available' 
CHECK (rental_status IN ('available', 'rented', 'sold'));

-- Add rental_status column to property_submissions table  
ALTER TABLE public.property_submissions 
ADD COLUMN IF NOT EXISTS rental_status TEXT DEFAULT 'available' 
CHECK (rental_status IN ('available', 'rented', 'sold'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_rental_status ON public.properties(rental_status);
CREATE INDEX IF NOT EXISTS idx_property_submissions_rental_status ON public.property_submissions(rental_status);

-- Add comments for documentation
COMMENT ON COLUMN public.properties.rental_status IS 'Current rental/sale status of the property (available, rented, sold)';
COMMENT ON COLUMN public.property_submissions.rental_status IS 'Current rental/sale status of the property (available, rented, sold)';

-- Verify the columns were added
SELECT 
  table_name, 
  column_name, 
  column_default, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('properties', 'property_submissions') 
  AND column_name = 'rental_status';
