-- Seed existing website content into CMS (with proper type casting)

-- Insert the homepage
INSERT INTO public.content_pages (
  title,
  slug,
  content,
  meta_title,
  meta_description,
  meta_keywords,
  page_type,
  is_published
) 
SELECT
  'Homepage',
  'home',
  '{"description": "Main homepage with hero search, featured properties, services, and more"}'::jsonb,
  'HomeHNI - Premium Real Estate Platform | Buy, Rent, Sell Properties',
  'Find premium properties to buy, rent or sell on HomeHNI. Verified listings, expert guidance, and seamless property transactions.',
  ARRAY['real estate', 'property', 'buy', 'rent', 'sell', 'premium', 'verified listings'],
  'page',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_pages WHERE slug = 'home'
);

-- Insert homepage sections
INSERT INTO public.page_sections (page_id, section_type, content, sort_order, is_active)
SELECT 
  (SELECT id FROM public.content_pages WHERE slug = 'home'),
  section_type,
  content::jsonb,
  sort_order,
  is_active
FROM (VALUES
  ('hero_search', '{"title": "Find Your Dream Property", "subtitle": "Buy, Rent, New Launch, PG/Co-living, Commercial & Plots", "background_image": "/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png"}', 0, true),
  ('directory', '{"title": "Explore Properties by City"}', 1, true),
  ('mobile_services', '{"title": "Property Services on Mobile"}', 2, true),
  ('property_slider', '{"title": "Premium Properties"}', 3, true),
  ('featured_properties', '{"title": "Featured Properties", "subtitle": "Discover handpicked premium properties"}', 4, true),
  ('services', '{"title": "Our Services", "subtitle": "Complete real estate solutions"}', 5, true),
  ('why_use', '{"title": "Why Choose HomeHNI", "subtitle": "Your trusted partner in real estate"}', 6, true),
  ('stats', '{"title": "Platform Statistics"}', 7, true),
  ('testimonials', '{"title": "What Our Customers Say", "subtitle": "Real experiences from real customers"}', 8, true),
  ('mobile_app', '{"title": "Download HomeHNI App", "subtitle": "Access all features on your mobile device"}', 9, true)
) AS sections(section_type, content, sort_order, is_active)
WHERE EXISTS (SELECT 1 FROM public.content_pages WHERE slug = 'home');

-- Insert navigation and footer elements
INSERT INTO public.content_elements (
  element_type,
  element_key, 
  title,
  content,
  page_location,
  section_location,
  sort_order,
  is_active
) VALUES
  ('navigation', 'header_nav', 'Main Navigation', '{"logo": "/lovable-uploads/main-logo-final.png", "brand_name": "HomeHNI"}'::jsonb, 'homepage', 'header', 0, true),
  ('footer', 'footer_content', 'Footer Content', '{"company_info": {"name": "HomeHNI", "description": "Your trusted partner in real estate"}}'::jsonb, 'homepage', 'footer', 0, true)
ON CONFLICT (element_key) DO NOTHING;