-- Clear the incorrect homepage and create component-based content management

-- Remove the homepage page we created (not needed - we want to manage live components)
DELETE FROM public.content_pages WHERE slug = 'home';

-- Create content entries for actual existing React components on the live homepage
-- These will be picked up by the components themselves to show editable content

-- Hero Search Section Content
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
  'hero_search',
  'hero_search_main',
  'Hero Search Section',
  '{
    "title": "Find Your Dream Property",
    "subtitle": "Buy, Rent, New Launch, PG/Co-living, Commercial & Plots", 
    "background_image": "/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png",
    "search_placeholder": "Search Sector 150 Noida",
    "tabs": ["BUY", "RENT", "NEW LAUNCH", "PG / CO-LIVING", "COMMERCIAL", "PLOTS/LAND", "PROJECTS"]
  }'::jsonb,
  'live_homepage',
  'hero',
  0,
  true
),

-- Services Section Content  
(
  'services',
  'services_main',
  'Services Section',
  '{
    "title": "Our Services",
    "subtitle": "Complete real estate solutions",
    "services": [
      {
        "title": "Property Search", 
        "description": "Find your perfect property with advanced search",
        "icon": "search"
      },
      {
        "title": "Verified Listings",
        "description": "All properties are verified for authenticity", 
        "icon": "shield-check"
      },
      {
        "title": "Expert Consultation",
        "description": "Get expert advice from real estate professionals",
        "icon": "user-check"
      },
      {
        "title": "Legal Services",
        "description": "Complete legal support for property transactions",
        "icon": "file-text"
      }
    ]
  }'::jsonb,
  'live_homepage',
  'services',
  1,
  true
),

-- Why Use Section Content
(
  'why_use',
  'why_use_main', 
  'Why Use HomeHNI Section',
  '{
    "title": "Why Choose HomeHNI",
    "subtitle": "Your trusted partner in real estate",
    "reasons": [
      {
        "title": "Verified Properties",
        "description": "Every property is thoroughly verified",
        "icon": "shield-check"
      },
      {
        "title": "Expert Guidance",
        "description": "Professional real estate consultants", 
        "icon": "user-check"
      },
      {
        "title": "Transparent Process",
        "description": "No hidden charges, complete transparency",
        "icon": "eye"
      },
      {
        "title": "End-to-End Support", 
        "description": "From search to registration, we support you",
        "icon": "headphones"
      }
    ]
  }'::jsonb,
  'live_homepage',
  'why_use', 
  2,
  true
),

-- Stats Section Content
(
  'stats',
  'stats_main',
  'Statistics Section', 
  '{
    "stats": [
      {"label": "Properties Listed", "value": "50000+", "icon": "building"},
      {"label": "Happy Customers", "value": "25000+", "icon": "users"}, 
      {"label": "Cities Covered", "value": "15+", "icon": "map-pin"},
      {"label": "Years of Experience", "value": "10+", "icon": "calendar"}
    ]
  }'::jsonb,
  'live_homepage',
  'stats',
  3, 
  true
),

-- Testimonials Section Content
(
  'testimonials',
  'testimonials_main',
  'Customer Testimonials Section',
  '{
    "title": "What Our Customers Say",
    "subtitle": "Real experiences from real customers",
    "testimonials": [
      {
        "name": "Rajesh Kumar",
        "location": "Delhi",
        "text": "HomeHNI helped me find my dream home. The process was smooth and transparent.",
        "rating": 5
      },
      {
        "name": "Priya Sharma",
        "location": "Mumbai", 
        "text": "Excellent service and genuine properties. Highly recommended!",
        "rating": 5
      },
      {
        "name": "Amit Singh",
        "location": "Bangalore",
        "text": "Professional team and quick property verification process.",
        "rating": 5
      }
    ]
  }'::jsonb,
  'live_homepage',
  'testimonials',
  4,
  true
),

-- Mobile App Section Content
(
  'mobile_app',
  'mobile_app_main',
  'Mobile App Section',
  '{
    "title": "Download HomeHNI App", 
    "subtitle": "Access all features on your mobile device",
    "features": ["Property Search", "Virtual Tours", "Document Upload", "Expert Chat"],
    "app_image": "/lovable-uploads/homeAppPromotion.png"
  }'::jsonb,
  'live_homepage',
  'mobile_app',
  5,
  true
)

ON CONFLICT (element_key) DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  is_active = EXCLUDED.is_active;