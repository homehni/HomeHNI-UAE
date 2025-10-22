-- Add Land/Plot-specific fields to property_drafts table
ALTER TABLE public.property_drafts 
ADD COLUMN IF NOT EXISTS plot_area INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS plot_area_unit TEXT,
ADD COLUMN IF NOT EXISTS plot_length INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS plot_width INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS boundary_wall TEXT,
ADD COLUMN IF NOT EXISTS corner_plot BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS road_facing TEXT,
ADD COLUMN IF NOT EXISTS road_width INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS land_type TEXT,
ADD COLUMN IF NOT EXISTS plot_shape TEXT,
ADD COLUMN IF NOT EXISTS gated_community BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gated_project TEXT,
ADD COLUMN IF NOT EXISTS floors_allowed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS survey_number TEXT,
ADD COLUMN IF NOT EXISTS sub_division TEXT,
ADD COLUMN IF NOT EXISTS village_name TEXT;

-- Add indexes for the new Land/Plot fields for better performance
CREATE INDEX IF NOT EXISTS idx_property_drafts_land_type ON public.property_drafts(land_type);
CREATE INDEX IF NOT EXISTS idx_property_drafts_plot_area ON public.property_drafts(plot_area);
CREATE INDEX IF NOT EXISTS idx_property_drafts_boundary_wall ON public.property_drafts(boundary_wall);
