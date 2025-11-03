-- Create developer_pages table for builder/developer company pages
CREATE TABLE IF NOT EXISTS public.developer_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  tagline TEXT,
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_video_url TEXT,
  hero_image_url TEXT,
  hero_cta_text TEXT DEFAULT 'Contact Us',
  
  -- Company Info
  founded_year TEXT,
  headquarters TEXT,
  description TEXT,
  highlights TEXT,
  
  -- About Section
  about_title TEXT DEFAULT 'About Us',
  about_content TEXT,
  about_images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  
  -- Video Section
  video_section_title TEXT,
  video_section_subtitle TEXT,
  video_url TEXT,
  video_thumbnail_url TEXT,
  
  -- Stats/Highlights
  stats JSONB DEFAULT '[]'::jsonb, -- Array of {label, value, icon}
  
  -- Specializations
  specializations JSONB DEFAULT '[]'::jsonb, -- Array of strings
  
  -- Key Projects
  key_projects JSONB DEFAULT '[]'::jsonb, -- Array of {title, description, image}
  
  -- Awards
  awards JSONB DEFAULT '[]'::jsonb, -- Array of strings
  
  -- Gallery
  gallery_images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  
  -- Floor Plans
  floor_plans JSONB DEFAULT '[]'::jsonb, -- Array of {title, image_url}
  
  -- Amenities
  amenities JSONB DEFAULT '[]'::jsonb, -- Array of {name, icon, description}
  
  -- Location Info
  location_title TEXT,
  location_description TEXT,
  location_map_url TEXT,
  location_highlights JSONB DEFAULT '[]'::jsonb,
  
  -- Contact Information
  contact_phone TEXT,
  contact_email TEXT,
  contact_website TEXT,
  contact_address TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- Status
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.developer_pages ENABLE ROW LEVEL SECURITY;

-- Allow public to view published pages
CREATE POLICY "Anyone can view published developer pages"
  ON public.developer_pages
  FOR SELECT
  USING (is_published = true);

-- Allow authenticated users to view all pages
CREATE POLICY "Authenticated users can view all developer pages"
  ON public.developer_pages
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow admins to manage developer pages
CREATE POLICY "Admins can manage developer pages"
  ON public.developer_pages
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_developer_pages_updated_at
  BEFORE UPDATE ON public.developer_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on slug for faster lookups
CREATE INDEX idx_developer_pages_slug ON public.developer_pages(slug);
CREATE INDEX idx_developer_pages_published ON public.developer_pages(is_published, display_order);

-- Insert the Canny Forest Edge page as example
INSERT INTO public.developer_pages (
  slug,
  company_name,
  tagline,
  hero_title,
  hero_subtitle,
  hero_video_url,
  description,
  video_url,
  is_published,
  is_featured
) VALUES (
  'canny-forest-edge',
  'Canny Forest Edge',
  'Nature Meets Modern Living',
  'Experience Luxury Living at Canny Forest Edge',
  '2 & 3 BHK Premium Apartments in Bachupally, Hyderabad',
  '/videos/WhatsApp Video 2025-10-29 at 17.06.17_b8cc3ca2.mp4',
  'Discover your dream home at Canny Forest Edge, where modern architecture meets natural serenity in the heart of Bachupally, Hyderabad.',
  '/videos/2 and 3 BHK flats for sale Bachupally, Hyderabad ｜ Canny Forest Edge ｜ Canny Life Spaces.mp4',
  true,
  true
);