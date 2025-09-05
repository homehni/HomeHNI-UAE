-- Create a separate table for PG/Hostel properties
CREATE TABLE public.pg_hostel_properties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  property_type text NOT NULL DEFAULT 'pg_hostel',
  expected_rent numeric NOT NULL,
  expected_deposit numeric NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  locality text NOT NULL,
  landmark text,
  place_available_for text NOT NULL, -- male/female/co-living
  preferred_guests text NOT NULL, -- student/working_professional
  available_from date,
  food_included boolean NOT NULL DEFAULT false,
  gate_closing_time text,
  description text,
  available_services jsonb DEFAULT '{}', -- laundry, room_cleaning, warden_facility
  amenities jsonb DEFAULT '{}', -- common_tv, mess, lift, refrigerator, wifi, cooking_allowed, power_backup
  parking text,
  images text[],
  videos text[],
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pg_hostel_properties ENABLE ROW LEVEL SECURITY;

-- Create policies for PG/Hostel properties
CREATE POLICY "Property owners can manage their own PG/Hostel properties" 
ON public.pg_hostel_properties 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all PG/Hostel properties" 
ON public.pg_hostel_properties 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to get public PG/Hostel properties
CREATE OR REPLACE FUNCTION public.get_public_pg_hostel_properties()
RETURNS TABLE(
  id uuid, title text, property_type text, expected_rent numeric, expected_deposit numeric,
  state text, city text, locality text, landmark text, place_available_for text,
  preferred_guests text, available_from date, food_included boolean, gate_closing_time text,
  description text, available_services jsonb, amenities jsonb, parking text,
  images text[], videos text[], status text, created_at timestamp with time zone, updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p.id, p.title, p.property_type, p.expected_rent, p.expected_deposit,
    p.state, p.city, p.locality, p.landmark, p.place_available_for,
    p.preferred_guests, p.available_from, p.food_included, p.gate_closing_time,
    p.description, p.available_services, p.amenities, p.parking,
    p.images, p.videos, p.status, p.created_at, p.updated_at
  FROM public.pg_hostel_properties p
  WHERE p.status = 'approved'
  ORDER BY p.created_at DESC;
$$;

-- Create function to get single PG/Hostel property by ID
CREATE OR REPLACE FUNCTION public.get_public_pg_hostel_property_by_id(property_id uuid)
RETURNS TABLE(
  id uuid, title text, property_type text, expected_rent numeric, expected_deposit numeric,
  state text, city text, locality text, landmark text, place_available_for text,
  preferred_guests text, available_from date, food_included boolean, gate_closing_time text,
  description text, available_services jsonb, amenities jsonb, parking text,
  images text[], videos text[], status text, created_at timestamp with time zone, updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p.id, p.title, p.property_type, p.expected_rent, p.expected_deposit,
    p.state, p.city, p.locality, p.landmark, p.place_available_for,
    p.preferred_guests, p.available_from, p.food_included, p.gate_closing_time,
    p.description, p.available_services, p.amenities, p.parking,
    p.images, p.videos, p.status, p.created_at, p.updated_at
  FROM public.pg_hostel_properties p
  WHERE p.id = property_id AND p.status = 'approved'
  LIMIT 1;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pg_hostel_properties_updated_at
BEFORE UPDATE ON public.pg_hostel_properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();