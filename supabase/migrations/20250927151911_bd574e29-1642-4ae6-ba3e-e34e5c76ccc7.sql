-- Create public RPC function to get property owner contact info for approved properties only
CREATE OR REPLACE FUNCTION public.get_property_owner_contact(property_id uuid)
RETURNS TABLE(owner_email text, owner_name text, property_title text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    p.owner_email,
    p.owner_name,
    p.title as property_title
  FROM public.properties p
  WHERE p.id = property_id 
    AND p.status = 'approved' 
    AND p.is_visible = true
    AND p.owner_email IS NOT NULL
  LIMIT 1;
$$;