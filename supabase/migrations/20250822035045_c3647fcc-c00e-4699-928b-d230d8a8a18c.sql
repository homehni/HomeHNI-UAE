-- Seed existing website content into CMS
-- This will create the homepage and all its sections in the database

-- Insert the homepage
INSERT INTO public.content_pages (
  id,
  title,
  slug,
  content,
  meta_title,
  meta_description,
  meta_keywords,
  page_type,
  is_published
) VALUES (
  gen_random_uuid(),
  'Homepage',
  'home',
  '{"description": "Main homepage with hero search, featured properties, services, and more"}',
  'HomeHNI - Premium Real Estate Platform | Buy, Rent, Sell Properties',
  'Find premium properties to buy, rent or sell on HomeHNI. Verified listings, expert guidance, and seamless property transactions.',
  ARRAY['real estate', 'property', 'buy', 'rent', 'sell', 'premium', 'verified listings'],
  'page',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Get the homepage ID for sections
DO $$
DECLARE
  homepage_id uuid;
BEGIN
  SELECT id INTO homepage_id FROM public.content_pages WHERE slug = 'home';
  
  -- Insert homepage sections in order
  INSERT INTO public.page_sections (id, page_id, section_type, content, sort_order, is_active) VALUES
  -- Hero Search Section
  (gen_random_uuid(), homepage_id, 'hero_search', '{
    "title": "Find Your Dream Property", 
    "subtitle": "Buy, Rent, New Launch, PG/Co-living, Commercial & Plots",
    "background_image": "/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png",
    "search_placeholder": "Search Sector 150 Noida",
    "tabs": ["BUY", "RENT", "NEW LAUNCH", "PG / CO-LIVING", "COMMERCIAL", "PLOTS/LAND", "PROJECTS"],
    "property_types": ["All Residential", "Flat/Apartment", "Independent Building/ Floor", "Farm House", "Villa", "Plots", "Independent House", "Agriculture Lands"]
  }', 0, true),
  
  -- Directory Section
  (gen_random_uuid(), homepage_id, 'directory', '{
    "title": "Explore Properties by City",
    "cities": [
      {"name": "Delhi NCR", "count": "25000+", "image": "/city-images/delhi.jpg"},
      {"name": "Mumbai", "count": "15000+", "image": "/city-images/mumbai.jpg"},
      {"name": "Bangalore", "count": "18000+", "image": "/city-images/bangalore.jpg"},
      {"name": "Pune", "count": "12000+", "image": "/city-images/pune.jpg"}
    ]
  }', 1, true),
  
  -- Mobile Property Services
  (gen_random_uuid(), homepage_id, 'mobile_services', '{
    "title": "Property Services on Mobile",
    "description": "Access all property services on the go",
    "services": ["Property Search", "Virtual Tours", "Documentation", "Expert Consultation"]
  }', 2, true),
  
  -- Real Estate Slider
  (gen_random_uuid(), homepage_id, 'property_slider', '{
    "title": "Premium Properties",
    "subtitle": "Handpicked premium properties across prime locations"
  }', 3, true),
  
  -- Featured Properties
  (gen_random_uuid(), homepage_id, 'featured_properties', '{
    "title": "Featured Properties", 
    "subtitle": "Discover handpicked premium properties",
    "filters": ["All", "Apartment", "Villa", "Plot", "Commercial"]
  }', 4, true),
  
  -- Services Section
  (gen_random_uuid(), homepage_id, 'services', '{
    "title": "Our Services",
    "subtitle": "Complete real estate solutions",
    "services": [
      {
        "title": "Property Search",
        "description": "Find your perfect property with our advanced search",
        "icon": "search",
        "link": "/search"
      },
      {
        "title": "Verified Listings", 
        "description": "All properties are verified for authenticity",
        "icon": "verified",
        "link": "/verified-properties"
      },
      {
        "title": "Expert Consultation",
        "description": "Get expert advice from real estate professionals",
        "icon": "expert",
        "link": "/consultation"
      },
      {
        "title": "Legal Services",
        "description": "Complete legal support for property transactions", 
        "icon": "legal",
        "link": "/legal-services"
      }
    ]
  }', 5, true),
  
  -- Why Use Section
  (gen_random_uuid(), homepage_id, 'why_use', '{
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
  }', 6, true),
  
  -- Stats Section
  (gen_random_uuid(), homepage_id, 'stats', '{
    "stats": [
      {"label": "Properties Listed", "value": "50000+", "icon": "building"},
      {"label": "Happy Customers", "value": "25000+", "icon": "users"},
      {"label": "Cities Covered", "value": "15+", "icon": "map-pin"},
      {"label": "Years of Experience", "value": "10+", "icon": "calendar"}
    ]
  }', 7, true),
  
  -- Testimonials Section
  (gen_random_uuid(), homepage_id, 'testimonials', '{
    "title": "What Our Customers Say",
    "subtitle": "Real experiences from real customers",
    "testimonials": [
      {
        "name": "Rajesh Kumar",
        "location": "Delhi",
        "text": "HomeHNI helped me find my dream home. The process was smooth and transparent.",
        "rating": 5,
        "image": "/testimonials/customer1.jpg"
      },
      {
        "name": "Priya Sharma", 
        "location": "Mumbai",
        "text": "Excellent service and genuine properties. Highly recommended!",
        "rating": 5,
        "image": "/testimonials/customer2.jpg"
      }
    ]
  }', 8, true),
  
  -- Mobile App Section
  (gen_random_uuid(), homepage_id, 'mobile_app', '{
    "title": "Download HomeHNI App",
    "subtitle": "Access all features on your mobile device",
    "features": ["Property Search", "Virtual Tours", "Document Upload", "Expert Chat"],
    "app_store_link": "#",
    "play_store_link": "#",
    "app_image": "/lovable-uploads/homeAppPromotion.png"
  }', 9, true)
  
  ON CONFLICT (page_id, section_type) DO NOTHING;
END $$;

-- Create content elements for existing homepage components
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
-- Header navigation elements
('navigation', 'header_nav', 'Main Navigation', '{
  "logo": "/lovable-uploads/main-logo-final.png",
  "nav_items": [
    {"label": "Buy", "link": "/search?type=buy", "active": true},
    {"label": "Rent", "link": "/search?type=rent", "active": true}, 
    {"label": "Sell", "link": "/post-property", "active": true},
    {"label": "Services", "submenu": [
      {"label": "Property Management", "link": "/property-management"},
      {"label": "Legal Services", "link": "/legal-services"},
      {"label": "Home Loans", "link": "/loans"}
    ]}
  ]
}', 'homepage', 'header', 0, true),

-- Footer content elements  
('footer', 'footer_content', 'Footer Content', '{
  "company_info": {
    "name": "HomeHNI",
    "description": "Your trusted partner in real estate",
    "logo": "/lovable-uploads/main-logo-final.png"
  },
  "quick_links": [
    {"label": "About Us", "link": "/about-us"},
    {"label": "Contact", "link": "/contact-us"},
    {"label": "Privacy Policy", "link": "/privacy-policy"},
    {"label": "Terms & Conditions", "link": "/terms-and-conditions"}
  ],
  "services": [
    {"label": "Buy Property", "link": "/search?type=buy"},
    {"label": "Rent Property", "link": "/search?type=rent"},
    {"label": "Sell Property", "link": "/post-property"},
    {"label": "Property Management", "link": "/property-management"}
  ],
  "contact": {
    "phone": "+91-XXXXX-XXXXX",
    "email": "info@homehni.com",
    "address": "Delhi NCR, India"
  },
  "social": {
    "facebook": "#",
    "twitter": "#", 
    "instagram": "#",
    "linkedin": "#"
  }
}', 'homepage', 'footer', 0, true)

ON CONFLICT (element_key, page_location) DO NOTHING;