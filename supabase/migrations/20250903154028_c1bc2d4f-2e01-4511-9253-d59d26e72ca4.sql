-- Update the properties table RLS policy to be more restrictive for public access
-- Remove the existing public policy that exposes all data
DROP POLICY IF EXISTS "Public can view approved properties" ON public.properties;

-- Create new restrictive policy - only property owners and admins can see full data including sensitive info
CREATE POLICY "Property owners and admins can view full property data"
ON public.properties
FOR SELECT
USING (
  user_id = auth.uid() OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create a secure function to get public property data without sensitive information
CREATE OR REPLACE FUNCTION public.get_public_properties()
RETURNS TABLE(
  id uuid, title text, property_type text, listing_type text, bhk_type text, 
  expected_price numeric, super_area numeric, carpet_area numeric, 
  bathrooms integer, balconies integer, floor_no integer, total_floors integer, 
  furnishing text, availability_type text, availability_date date, 
  price_negotiable boolean, maintenance_charges numeric, security_deposit numeric, 
  city text, locality text, state text, pincode text, street_address text, 
  landmarks text, description text, images text[], videos text[], 
  status text, created_at timestamp with time zone, updated_at timestamp with time zone, 
  is_featured boolean, property_age text, facing_direction text, floor_type text, 
  water_supply text, power_backup text, current_property_condition text, 
  gated_security boolean, home_loan_available boolean, booking_amount numeric, 
  registration_status text, amenities jsonb, additional_documents jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id, p.title, p.property_type, p.listing_type, p.bhk_type, 
    p.expected_price, p.super_area, p.carpet_area, p.bathrooms, p.balconies, 
    p.floor_no, p.total_floors, p.furnishing, p.availability_type, p.availability_date, 
    p.price_negotiable, p.maintenance_charges, p.security_deposit, 
    p.city, p.locality, p.state, p.pincode, p.street_address, p.landmarks, 
    p.description, p.images, p.videos, p.status, p.created_at, p.updated_at, 
    p.is_featured, p.property_age, p.facing_direction, p.floor_type, 
    p.water_supply, p.power_backup, p.current_property_condition, 
    p.gated_security, p.home_loan_available, p.booking_amount, 
    p.registration_status, p.amenities, p.additional_documents
  FROM public.properties p
  WHERE p.status = 'approved'
  ORDER BY p.created_at DESC;
$$;

-- Create a secure function to get a single public property by ID without sensitive information
CREATE OR REPLACE FUNCTION public.get_public_property_by_id(property_id uuid)
RETURNS TABLE(
  id uuid, title text, property_type text, listing_type text, bhk_type text, 
  expected_price numeric, super_area numeric, carpet_area numeric, 
  bathrooms integer, balconies integer, floor_no integer, total_floors integer, 
  furnishing text, availability_type text, availability_date date, 
  price_negotiable boolean, maintenance_charges numeric, security_deposit numeric, 
  city text, locality text, state text, pincode text, street_address text, 
  landmarks text, description text, images text[], videos text[], 
  status text, created_at timestamp with time zone, updated_at timestamp with time zone, 
  is_featured boolean, property_age text, facing_direction text, floor_type text, 
  water_supply text, power_backup text, current_property_condition text, 
  gated_security boolean, home_loan_available boolean, booking_amount numeric, 
  registration_status text, amenities jsonb, additional_documents jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id, p.title, p.property_type, p.listing_type, p.bhk_type, 
    p.expected_price, p.super_area, p.carpet_area, p.bathrooms, p.balconies, 
    p.floor_no, p.total_floors, p.furnishing, p.availability_type, p.availability_date, 
    p.price_negotiable, p.maintenance_charges, p.security_deposit, 
    p.city, p.locality, p.state, p.pincode, p.street_address, p.landmarks, 
    p.description, p.images, p.videos, p.status, p.created_at, p.updated_at, 
    p.is_featured, p.property_age, p.facing_direction, p.floor_type, 
    p.water_supply, p.power_backup, p.current_property_condition, 
    p.gated_security, p.home_loan_available, p.booking_amount, 
    p.registration_status, p.amenities, p.additional_documents
  FROM public.properties p
  WHERE p.id = property_id AND p.status = 'approved'
  LIMIT 1;
$$;