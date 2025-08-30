-- Insert sample content elements for the main website sections if they don't exist

-- Mobile App Section
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
  'mobile_app', 
  'mobile_app_section', 
  'Mobile App Promotion', 
  jsonb_build_object(
    'headline', 'Homes, Wherever You Are',
    'description', 'Download our app and discover properties anytime, anywhere. Get instant notifications for new listings that match your preferences.',
    'googlePlayLink', 'https://play.google.com/store/apps',
    'appStoreLink', 'https://apps.apple.com/',
    'comingSoon', 'Coming Soon! Get ready for the ultimate property experience'
  ),
  'homepage',
  'mobile_app',
  1,
  true
) ON CONFLICT (element_key) DO NOTHING;

-- Statistics Section
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
  'stats', 
  'stats_section', 
  'Platform Statistics', 
  jsonb_build_object(
    'propertiesListed', '1,000+',
    'happyCustomers', '10,000+',
    'countriesCovered', '15+',
    'awardsWon', '50+'
  ),
  'homepage',
  'statistics',
  2,
  true
) ON CONFLICT (element_key) DO NOTHING;

-- Testimonials Section
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
  'testimonial', 
  'testimonials_section', 
  'Customer Testimonials', 
  jsonb_build_object(
    'title', 'Our customers love us',
    'subtitle', 'Real stories from verified buyers & owners.',
    'rating', '4.8/5',
    'reviewCount', '2,143 reviews',
    'ownersMatched', '12k+ owners matched',
    'brokerageSaved', '₹18+ crore brokerage saved'
  ),
  'homepage',
  'testimonials',
  3,
  true
) ON CONFLICT (element_key) DO NOTHING;

-- Home Services Section
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
  'service', 
  'home_services_section', 
  'Home Services', 
  jsonb_build_object(
    'title', 'Home Services',
    'services', jsonb_build_array(
      jsonb_build_object('name', 'Home Security Services', 'description', 'Professional security solutions for your property'),
      jsonb_build_object('name', 'Legal Services', 'description', 'Expert legal assistance for property transactions'),
      jsonb_build_object('name', 'Handover Services', 'description', 'Smooth property handover and documentation'),
      jsonb_build_object('name', 'Property Management', 'description', 'Complete property management solutions')
    )
  ),
  'homepage',
  'services',
  4,
  true
) ON CONFLICT (element_key) DO NOTHING;