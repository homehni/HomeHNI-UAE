-- Update the RPC function to get owner email from auth.users instead of properties table
CREATE OR REPLACE FUNCTION public.get_property_owner_contact(property_id uuid)
RETURNS TABLE(owner_email text, owner_name text, property_title text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    u.email as owner_email,
    COALESCE(p.owner_name, pr.full_name, u.email) as owner_name,
    p.title as property_title
  FROM public.properties p
  JOIN auth.users u ON u.id = p.user_id
  LEFT JOIN public.profiles pr ON pr.user_id = p.user_id
  WHERE p.id = property_id 
    AND p.status = 'approved' 
    AND p.is_visible = true
    AND u.email IS NOT NULL
  LIMIT 1;
$$;