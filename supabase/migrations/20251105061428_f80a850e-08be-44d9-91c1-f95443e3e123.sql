-- Update Alpine Infratech developer page with correct GMR Springfield content
UPDATE developer_pages
SET
  company_name = 'GMR Springfield',
  tagline = 'Live in Leisure',
  hero_title = 'GMR Springfield - Live in Leisure',
  hero_subtitle = '2 & 3 BHK Apartments at Kompally-Bollarum, Hyderabad',
  hero_cta_text = 'Contact Us',
  description = 'The Project is with 2 & 3 BHK Apartments at Kompally-Bollarum, Hyderabad. Ready to move in with 370 flats across 4 acres.',
  highlights = '✦ 4 Acres, 4 Blocks, G+5, 370 Flats
✦ Price@ Rs.5200/- + Amenities
✦ 47% Of our Project is open area with lavish Landscaping
✦ 2420 Sqyd Party Lawn
✦ 2BHK - 1120 Sft
✦ Ready to move in
✦ TS RERA Approved: P02200003938',
  specializations = '[]'::jsonb,
  key_projects = '[]'::jsonb,
  stats = '[]'::jsonb,
  awards = '[]'::jsonb,
  gallery_images = '[]'::jsonb,
  floor_plans = '[]'::jsonb,
  amenities = '[]'::jsonb,
  about_images = '[]'::jsonb,
  location_highlights = '[
    "1.5 kms from Bolaraum MMTS Station",
    "5mins Drive to D-Mart, Cineplanet, Shopping Malls",
    "Easy Connectivity with Banks, Schools, Hospitals etc.",
    "Bank Approvals: SBI, HDFC, Sundaram Finance, LIC, Bajaj Finance"
  ]'::jsonb,
  location_map_url = 'https://maps.app.goo.gl/UgG3mEKWBvaecW3D9',
  is_published = true,
  updated_at = now()
WHERE slug = 'alpine-infratech';