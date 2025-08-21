-- Create content elements table for managing all website content
CREATE TABLE public.content_elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  element_type TEXT NOT NULL, -- 'featured_property', 'hero_text', 'section_title', etc.
  element_key TEXT NOT NULL, -- unique identifier for the element
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  images TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  page_location TEXT, -- 'homepage', 'about', etc.
  section_location TEXT, -- 'featured_properties', 'hero', etc.
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(element_key, page_location)
);

-- Enable RLS
ALTER TABLE public.content_elements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all content elements" 
ON public.content_elements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view active content elements" 
ON public.content_elements 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_content_elements_updated_at
BEFORE UPDATE ON public.content_elements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default featured properties data
INSERT INTO public.content_elements (element_type, element_key, title, content, page_location, section_location, sort_order) VALUES
('featured_property', 'property_1', 'Modern Apartment with Delhi', 
'{"location":"Sector 18, KK Road","price":"₹1.2 Cr","area":"1,200 sq ft","bedrooms":3,"bathrooms":2,"image":"photo-1560518883-ce09059eeffa","propertyType":"Apartment","isNew":true}', 
'homepage', 'featured_properties', 1),

('featured_property', 'property_2', 'Modern Villa with Garden', 
'{"location":"DLF Phase 3, Gurgaon","price":"₹2.5 Cr","area":"2,400 sq ft","bedrooms":4,"bathrooms":3,"image":"photo-1613490493576-7fde63acd811","propertyType":"Villa"}', 
'homepage', 'featured_properties', 2),

('featured_property', 'property_3', 'Affordable 2BHK in IT Hub', 
'{"location":"Electronic City, Bangalore","price":"₹75 L","area":"950 sq ft","bedrooms":2,"bathrooms":2,"image":"photo-1512917774080-9991f1c4c750","propertyType":"Apartment"}', 
'homepage', 'featured_properties', 3),

('section_content', 'featured_properties_header', 'Featured Properties', 
'{"heading":"Featured Properties","description":"Discover our handpicked selection of premium properties across India''s top cities"}', 
'homepage', 'featured_properties', 0);