-- Add PG/Hostel services fields to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS available_services JSONB DEFAULT '{}';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_available_services ON public.properties USING GIN (available_services);

-- Add comment to document the available_services field structure
COMMENT ON COLUMN public.properties.available_services IS 'JSONB field storing PG/Hostel services: {"laundry": "yes/no", "room_cleaning": "yes/no", "warden_facility": "yes/no"}';
