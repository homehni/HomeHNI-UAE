-- Add missing fields to developer_pages table for dynamic content

-- Add hero video URL field
ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS hero_video_url text;

-- Add interior images array
ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS interior_images text[] DEFAULT '{}';

-- Add floor plan images array  
ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS floor_plan_images text[] DEFAULT '{}';

-- Add location coordinates
ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS location_lat numeric;

ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS location_lng numeric;

-- Add about builder details (separate from about section)
ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS builder_title text;

ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS builder_description text;

ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS builder_years_in_business text;

ALTER TABLE public.developer_pages 
ADD COLUMN IF NOT EXISTS builder_images text[] DEFAULT '{}';

COMMENT ON COLUMN public.developer_pages.hero_video_url IS 'URL of the hero section video';
COMMENT ON COLUMN public.developer_pages.interior_images IS 'Array of interior image URLs for carousel';
COMMENT ON COLUMN public.developer_pages.floor_plan_images IS 'Array of floor plan image URLs';
COMMENT ON COLUMN public.developer_pages.location_lat IS 'Latitude coordinate for map';
COMMENT ON COLUMN public.developer_pages.location_lng IS 'Longitude coordinate for map';
COMMENT ON COLUMN public.developer_pages.builder_title IS 'Builder company title for "About the Builder" section';
COMMENT ON COLUMN public.developer_pages.builder_description IS 'Builder company description';
COMMENT ON COLUMN public.developer_pages.builder_years_in_business IS 'Years in business display text';
COMMENT ON COLUMN public.developer_pages.builder_images IS 'Array of builder/company images';