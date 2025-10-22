-- Add commercial-specific fields to property_drafts table
ALTER TABLE public.property_drafts 
ADD COLUMN IF NOT EXISTS space_type TEXT,
ADD COLUMN IF NOT EXISTS building_type TEXT,
ADD COLUMN IF NOT EXISTS furnishing_status TEXT,
ADD COLUMN IF NOT EXISTS super_built_up_area INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS power_load TEXT,
ADD COLUMN IF NOT EXISTS ceiling_height TEXT,
ADD COLUMN IF NOT EXISTS entrance_width TEXT,
ADD COLUMN IF NOT EXISTS loading_facility BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS on_main_road BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS corner_property BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preferred_tenant TEXT,
ADD COLUMN IF NOT EXISTS categorized_images JSONB;

-- Add indexes for the new fields for better performance
CREATE INDEX IF NOT EXISTS idx_property_drafts_space_type ON public.property_drafts(space_type);
CREATE INDEX IF NOT EXISTS idx_property_drafts_building_type ON public.property_drafts(building_type);
CREATE INDEX IF NOT EXISTS idx_property_drafts_furnishing_status ON public.property_drafts(furnishing_status);
