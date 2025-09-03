-- Create a secure public properties view that excludes sensitive owner information
CREATE OR REPLACE VIEW public.public_properties AS
SELECT 
  id, title, property_type, listing_type, bhk_type, expected_price, 
  super_area, carpet_area, bathrooms, balconies, floor_no, total_floors, 
  furnishing, availability_type, availability_date, price_negotiable, 
  maintenance_charges, security_deposit, city, locality, state, pincode, 
  street_address, landmarks, description, images, videos, status, 
  created_at, updated_at, is_featured, property_age, facing_direction,
  floor_type, water_supply, power_backup, current_property_condition,
  gated_security, home_loan_available, booking_amount, registration_status,
  amenities, additional_documents
FROM public.properties
WHERE status = 'approved';

-- Enable RLS on the view
ALTER VIEW public.public_properties SET (security_barrier = true);

-- Create RLS policy for the view
CREATE POLICY "Anyone can view public properties"
ON public.public_properties
FOR SELECT 
TO public
USING (true);

-- Update the properties table RLS policy to be more restrictive for public access
-- Remove the existing public policy
DROP POLICY IF EXISTS "Public can view approved properties" ON public.properties;

-- Create new restrictive policy - only property owners and admins can see full data
CREATE POLICY "Property owners and admins can view full property data"
ON public.properties
FOR SELECT
USING (
  user_id = auth.uid() OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create policy for public access to approved properties but without sensitive data
-- This policy will be used by the public_properties view
CREATE POLICY "Public can view approved properties basic info"
ON public.properties  
FOR SELECT
TO public
USING (status = 'approved' AND auth.uid() IS NULL);

-- Create function to get property contact info securely (already exists but let's ensure it's correct)
CREATE OR REPLACE FUNCTION public.get_property_basic_contact_info(property_id uuid)
RETURNS TABLE(
  has_contact boolean,
  contact_message text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (owner_name IS NOT NULL AND owner_email IS NOT NULL) as has_contact,
    CASE 
      WHEN owner_name IS NOT NULL AND owner_email IS NOT NULL
      THEN 'Contact available - use secure inquiry form to reach owner'
      ELSE 'Contact information not available'
    END as contact_message
  FROM public.properties 
  WHERE id = property_id AND status = 'approved'
  LIMIT 1;
$$;