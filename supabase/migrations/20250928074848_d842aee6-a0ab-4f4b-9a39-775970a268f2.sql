-- Update RPC to fallback to account email when properties.owner_email is missing
CREATE OR REPLACE FUNCTION public.get_property_owner_contact(property_id uuid)
RETURNS TABLE(owner_email text, owner_name text, property_title text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    COALESCE(
      NULLIF(p.owner_email, ''),
      (SELECT email FROM auth.users WHERE id = p.user_id)
    ) AS owner_email,
    COALESCE(NULLIF(p.owner_name, ''), prof.full_name, 'Property Owner') AS owner_name,
    p.title AS property_title
  FROM public.properties p
  LEFT JOIN public.profiles prof ON prof.user_id = p.user_id
  WHERE p.id = property_id 
    AND p.status = 'approved' 
    AND p.is_visible = true
    AND COALESCE(
      NULLIF(p.owner_email, ''),
      (SELECT email FROM auth.users WHERE id = p.user_id)
    ) IS NOT NULL
  LIMIT 1;
$function$;