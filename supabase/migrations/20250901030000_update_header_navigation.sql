-- Update header navigation content element with comprehensive navigation structure
UPDATE public.content_elements 
SET content = '{
  "logo": "/lovable-uploads/main-logo-final.png",
  "nav_items": [
    {"label": "Buy", "link": "/search?type=buy", "active": true},
    {"label": "Rent", "link": "/search?type=rent", "active": true}, 
    {"label": "Sell", "link": "/post-property", "active": true},
    {"label": "Services", "submenu": [
      {"label": "Loans", "link": "/loans"},
      {"label": "Home Security Services", "link": "/home-security-services"},
      {"label": "Packers & Movers", "link": "/packers-movers"},
      {"label": "Legal Services", "link": "/legal-services"},
      {"label": "Handover Services", "link": "/handover-services"},
      {"label": "Property Management", "link": "/property-management"},
      {"label": "Architects", "link": "/architects"},
      {"label": "Painting & Cleaning", "link": "/painting-cleaning"},
      {"label": "Interior Designers", "link": "/interior"}
    ]},
    {"label": "Plans", "submenu": [
      {"label": "Agent Plans", "link": "/agent-plans"},
      {"label": "Builder'\''s Lifetime Plan", "link": "/builder-lifetime-plans"},
      {"label": "Property Renting Owner Plans", "link": "/owner-plans"},
      {"label": "Property Seller Plans", "link": "/buyer-plans"},
      {"label": "Property Owner Plans", "link": "/seller-plans"}
    ]},
    {"label": "Service Provider", "link": "/service-suite", "active": true},
    {"label": "Jobs", "link": "/careers", "active": true}
  ]
}'::jsonb,
    updated_at = now()
WHERE element_key = 'header_nav' AND page_location = 'homepage';

-- If the header_nav element doesn't exist, create it
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
  '{
    "logo": "/lovable-uploads/main-logo-final.png",
    "nav_items": [
      {"label": "Buy", "link": "/search?type=buy", "active": true},
      {"label": "Rent", "link": "/search?type=rent", "active": true}, 
      {"label": "Sell", "link": "/post-property", "active": true},
      {"label": "Services", "submenu": [
        {"label": "Loans", "link": "/loans"},
        {"label": "Home Security Services", "link": "/home-security-services"},
        {"label": "Packers & Movers", "link": "/packers-movers"},
        {"label": "Legal Services", "link": "/legal-services"},
        {"label": "Handover Services", "link": "/handover-services"},
        {"label": "Property Management", "link": "/property-management"},
        {"label": "Architects", "link": "/architects"},
        {"label": "Painting & Cleaning", "link": "/painting-cleaning"},
        {"label": "Interior Designers", "link": "/interior"}
      ]},
      {"label": "Plans", "submenu": [
        {"label": "Agent Plans", "link": "/agent-plans"},
        {"label": "Builder'\''s Lifetime Plan", "link": "/builder-lifetime-plans"},
        {"label": "Property Renting Owner Plans", "link": "/owner-plans"},
        {"label": "Property Seller Plans", "link": "/buyer-plans"},
        {"label": "Property Owner Plans", "link": "/seller-plans"}
      ]},
      {"label": "Service Provider", "link": "/service-suite", "active": true},
      {"label": "Jobs", "link": "/careers", "active": true}
    ]
  }'::jsonb,
  'homepage', 
  'header', 
  0, 
  true
) ON CONFLICT (element_key, page_location) DO NOTHING;
