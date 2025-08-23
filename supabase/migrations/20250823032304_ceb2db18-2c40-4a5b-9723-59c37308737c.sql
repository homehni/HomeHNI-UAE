-- Update public_properties view to include is_featured column
DROP VIEW IF EXISTS public_properties;

CREATE VIEW public_properties AS
SELECT 
  id,
  title,
  property_type,
  listing_type,
  bhk_type,
  expected_price,
  super_area,
  carpet_area,
  bathrooms,
  balconies,
  floor_no,
  total_floors,
  furnishing,
  availability_type,
  availability_date,
  price_negotiable,
  maintenance_charges,
  security_deposit,
  city,
  locality,
  state,
  pincode,
  street_address,
  landmarks,
  description,
  images,
  videos,
  status,
  created_at,
  updated_at,
  is_featured
FROM properties
WHERE status = 'approved';