-- Add is_premium column to pg_hostel_properties table if table exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'pg_hostel_properties'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'pg_hostel_properties' 
      AND column_name = 'is_premium'
    ) THEN
      ALTER TABLE public.pg_hostel_properties 
      ADD COLUMN is_premium boolean DEFAULT false;
    END IF;
  END IF;
END $$;

-- Drop and recreate get_public_property_by_id to include is_premium column
DROP FUNCTION IF EXISTS public.get_public_property_by_id(uuid);

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
  booking_amount numeric, registration_status text, amenities jsonb, 
  additional_documents jsonb, plot_area_unit text, is_premium boolean, user_id uuid
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
    p.registration_status, p.amenities, p.additional_documents,
    p.plot_area_unit, p.is_premium, p.user_id
  FROM public.properties p
  WHERE p.id = property_id AND p.is_visible = true
  LIMIT 1;
$$;

-- Drop and recreate get_public_pg_hostel_property_by_id to include is_premium column (only if both function AND table exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'get_public_pg_hostel_property_by_id'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'pg_hostel_properties'
  ) THEN
    EXECUTE 'DROP FUNCTION IF EXISTS public.get_public_pg_hostel_property_by_id(uuid)';
    EXECUTE '
    CREATE OR REPLACE FUNCTION public.get_public_pg_hostel_property_by_id(property_id uuid)
    RETURNS TABLE(
      id uuid, title text, property_type text, expected_rent numeric, expected_deposit numeric,
      state text, city text, locality text, landmark text, place_available_for text,
      preferred_guests text, available_from date, food_included boolean, gate_closing_time text,
      description text, available_services jsonb, amenities jsonb, parking text,
      images text[], videos text[], status text, created_at timestamp with time zone, 
      updated_at timestamp with time zone, is_premium boolean, user_id uuid
    )
    LANGUAGE sql
    STABLE SECURITY DEFINER
    SET search_path TO ''public''
    AS $func$
      SELECT 
        p.id, p.title, p.property_type, p.expected_rent, p.expected_deposit,
        p.state, p.city, p.locality, p.landmark, p.place_available_for,
        p.preferred_guests, p.available_from, p.food_included, p.gate_closing_time,
        p.description, p.available_services, p.amenities, p.parking,
        p.images, p.videos, p.status, p.created_at, p.updated_at,
        p.is_premium, p.user_id
      FROM public.pg_hostel_properties p
      WHERE p.id = property_id AND p.status = ''approved''
      LIMIT 1;
    $func$;
    ';
  ELSIF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'get_public_pg_hostel_property_by_id'
  ) THEN
    -- If function exists but table doesn't, just drop the function
    EXECUTE 'DROP FUNCTION IF EXISTS public.get_public_pg_hostel_property_by_id(uuid)';
  END IF;
END $$;
