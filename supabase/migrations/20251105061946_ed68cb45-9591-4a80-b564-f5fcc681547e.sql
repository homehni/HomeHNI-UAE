-- Update to properly distinguish Alpine Infratech (developer) from Alpine GMR Springfield (property)
UPDATE developer_pages
SET
  company_name = 'Alpine Infratech',
  tagline = 'Building Dreams, Creating Homes',
  hero_title = 'Alpine GMR Springfield - Live in Leisure',
  hero_subtitle = 'Premium 2 & 3 BHK Apartments at Kompally-Bollarum, Hyderabad',
  description = 'Alpine Infratech presents Alpine GMR Springfield, a premium residential project with 2 & 3 BHK Apartments at Kompally-Bollarum, Hyderabad. Ready to move in with 370 flats across 4 acres.',
  updated_at = now()
WHERE slug = 'alpine-infratech';