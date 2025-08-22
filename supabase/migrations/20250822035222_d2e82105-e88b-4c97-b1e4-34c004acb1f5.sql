-- Simple seed of homepage content into CMS

-- Insert the homepage if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.content_pages WHERE slug = 'home') THEN
    INSERT INTO public.content_pages (
      title,
      slug,
      content,
      meta_title,
      meta_description,
      meta_keywords,
      page_type,
      is_published
    ) VALUES (
      'Homepage',
      'home',
      '{"description": "Main homepage with hero search, featured properties, services, and more"}'::jsonb,
      'HomeHNI - Premium Real Estate Platform | Buy, Rent, Sell Properties',
      'Find premium properties to buy, rent or sell on HomeHNI. Verified listings, expert guidance, and seamless property transactions.',
      ARRAY['real estate', 'property', 'buy', 'rent', 'sell', 'premium', 'verified listings'],
      'page',
      true
    );
  END IF;
END $$;

-- Insert homepage sections
DO $$
DECLARE
  homepage_id uuid;
  section_exists boolean;
BEGIN
  SELECT id INTO homepage_id FROM public.content_pages WHERE slug = 'home';
  
  IF homepage_id IS NOT NULL THEN
    -- Check if sections already exist
    SELECT EXISTS(SELECT 1 FROM public.page_sections WHERE page_id = homepage_id) INTO section_exists;
    
    IF NOT section_exists THEN
      INSERT INTO public.page_sections (page_id, section_type, content, sort_order, is_active) VALUES
        (homepage_id, 'hero_search', '{"title": "Find Your Dream Property", "subtitle": "Buy, Rent, New Launch, PG/Co-living, Commercial & Plots", "background_image": "/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png"}'::jsonb, 0, true),
        (homepage_id, 'directory', '{"title": "Explore Properties by City"}'::jsonb, 1, true),
        (homepage_id, 'mobile_services', '{"title": "Property Services on Mobile"}'::jsonb, 2, true),
        (homepage_id, 'property_slider', '{"title": "Premium Properties"}'::jsonb, 3, true),
        (homepage_id, 'featured_properties', '{"title": "Featured Properties", "subtitle": "Discover handpicked premium properties"}'::jsonb, 4, true),
        (homepage_id, 'services', '{"title": "Our Services", "subtitle": "Complete real estate solutions"}'::jsonb, 5, true),
        (homepage_id, 'why_use', '{"title": "Why Choose HomeHNI", "subtitle": "Your trusted partner in real estate"}'::jsonb, 6, true),
        (homepage_id, 'stats', '{"title": "Platform Statistics"}'::jsonb, 7, true),
        (homepage_id, 'testimonials', '{"title": "What Our Customers Say", "subtitle": "Real experiences from real customers"}'::jsonb, 8, true),
        (homepage_id, 'mobile_app', '{"title": "Download HomeHNI App", "subtitle": "Access all features on your mobile device"}'::jsonb, 9, true);
    END IF;
  END IF;
END $$;

-- Insert navigation and footer elements
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.content_elements WHERE element_key = 'header_nav') THEN
    INSERT INTO public.content_elements (
      element_type,
      element_key, 
      title,
      content,
      page_location,
      section_location,
      sort_order,
      is_active
    ) VALUES (
      'navigation',
      'header_nav',
      'Main Navigation',
      '{"logo": "/lovable-uploads/main-logo-final.png", "brand_name": "HomeHNI"}'::jsonb,
      'homepage',
      'header',
      0,
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.content_elements WHERE element_key = 'footer_content') THEN
    INSERT INTO public.content_elements (
      element_type,
      element_key, 
      title,
      content,
      page_location,
      section_location,
      sort_order,
      is_active
    ) VALUES (
      'footer',
      'footer_content',
      'Footer Content',
      '{"company_info": {"name": "HomeHNI", "description": "Your trusted partner in real estate"}}'::jsonb,
      'homepage',
      'footer',
      0,
      true
    );
  END IF;
END $$;