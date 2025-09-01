-- Add recommended properties for post-service page real-time matches
INSERT INTO content_elements (
  element_type,
  element_key, 
  title,
  content,
  page_location,
  section_location,
  sort_order,
  is_active
) VALUES (
  'recommended_properties',
  'post_service_matches',
  'Recommended Properties for Post Service',
  jsonb_build_object(
    'property_ids', ARRAY['fcdbb28b-d486-4a5a-bfd4-08a674113081']::uuid[],
    'description', 'Top recommended properties for real-time matches'
  ),
  'post-service',
  'recommended_properties',
  1,
  true
) ON CONFLICT DO NOTHING;