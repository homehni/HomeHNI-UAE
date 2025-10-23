-- Add additional_info JSONB column to properties table for PG/Hostel and other flexible data
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS additional_info JSONB DEFAULT '{}';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_properties_additional_info ON public.properties USING GIN (additional_info);

-- Add comment to document the additional_info field structure
COMMENT ON COLUMN public.properties.additional_info IS 'JSONB field storing flexible property data including PG/Hostel specific fields like room_amenities, gender_preference, etc.';
