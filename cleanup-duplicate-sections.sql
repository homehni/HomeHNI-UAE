-- Cleanup script to remove duplicate type-specific featured property sections
-- This script removes entries that were created in separate type-specific sections
-- and keeps only the main featured_properties section entries

-- Delete type-specific featured property entries
DELETE FROM content_elements 
WHERE page_location = 'homepage' 
  AND section_location IN (
    'featured_apartments',
    'featured_villas', 
    'featured_houses',
    'featured_builder_floors',
    'featured_plots',
    'featured_commercial',
    'featured_offices',
    'featured_shops',
    'featured_warehouses',
    'featured_showrooms'
  )
  AND element_type = 'featured_property';

-- Verify the cleanup
SELECT 
  section_location,
  COUNT(*) as count
FROM content_elements 
WHERE page_location = 'homepage' 
  AND element_type = 'featured_property'
GROUP BY section_location
ORDER BY section_location;
