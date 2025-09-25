-- Adjust RPCs to include plot_area_unit: drop and recreate with new return signatures
DROP FUNCTION IF EXISTS public.get_public_properties();
DROP FUNCTION IF EXISTS public.get_public_property_by_id(property_id uuid);

CREATE OR REPLACE FUNCTION public.get_public_properties()
RETURNS TABLE(
  id uuid, title text, property_type text, listing_type text, bhk_type text,
  expected_price numeric, super_area numeric, carpet_area numeric, bathrooms integer,
  balconies integer, floor_no integer, total_floors integer, furnishing text,
  availability_type text, availability_date date, price_negotiable boolean,
  maintenance_charges numeric, security_deposit numeric, city text, locality text,
  state text, pincode text, street_address text, landmarks text, description text,
  images text[], videos text[], status text, created_at timestamp with time zone,
  updated_at timestamp with time zone, is_featured boolean, property_age text,
  facing_direction text, floor_type text, water_supply text, power_backup text,
  current_property_condition text, gated_security boolean, home_loan_available boolean,
  booking_amount numeric, registration_status text, amenities jsonb, additional_documents jsonb,
  plot_area_unit text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    p.registration_status, p.amenities, p.additional_documents,
    p.plot_area_unit
  FROM public.properties p
  WHERE p.is_visible = true
  ORDER BY p.created_at DESC;
$function$;

CREATE OR REPLACE FUNCTION public.get_public_property_by_id(property_id uuid)
RETURNS TABLE(
  id uuid, title text, property_type text, listing_type text, bhk_type text,
  expected_price numeric, super_area numeric, carpet_area numeric, bathrooms integer,
  balconies integer, floor_no integer, total_floors integer, furnishing text,
  availability_type text, availability_date date, price_negotiable boolean,
  maintenance_charges numeric, security_deposit numeric, city text, locality text,
  state text, pincode text, street_address text, landmarks text, description text,
  images text[], videos text[], status text, created_at timestamp with time zone,
  updated_at timestamp with time zone, is_featured boolean, property_age text,
  facing_direction text, floor_type text, water_supply text, power_backup text,
  current_property_condition text, gated_security boolean, home_loan_available boolean,
  booking_amount numeric, registration_status text, amenities jsonb, additional_documents jsonb,
  plot_area_unit text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    p.registration_status, p.amenities, p.additional_documents,
    p.plot_area_unit
  FROM public.properties p
  WHERE p.id = property_id AND p.is_visible = true
  LIMIT 1;
$function$;