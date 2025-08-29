-- Optimize security definer functions to reduce security risk
-- Keep only the essential ones that truly need elevated privileges

-- 1. Remove unnecessary SECURITY DEFINER from get_property_contact_info
-- This function can work without SECURITY DEFINER since it only reads approved properties
DROP FUNCTION IF EXISTS public.get_property_contact_info(uuid);

CREATE OR REPLACE FUNCTION public.get_property_contact_info(property_id uuid)
RETURNS TABLE(owner_name text, contact_message text)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  -- Only return limited contact info for approved properties
  SELECT 
    p.owner_name,
    CASE 
      WHEN p.owner_name IS NOT NULL 
      THEN 'Contact available - use inquiry form to reach owner'
      ELSE 'Contact information not available'
    END as contact_message
  FROM public.properties p
  WHERE p.id = property_id 
    AND p.status = 'approved'
  LIMIT 1;
$function$;

-- 2. Remove the duplicate update_user_role function (there are two versions)
-- Keep only the more secure version with reason parameter
DROP FUNCTION IF EXISTS public.update_user_role(uuid, app_role);

-- 3. Optimize get_user_profiles to be less privileged
-- This function should not need full superuser privileges
DROP FUNCTION IF EXISTS public.get_user_profiles();

CREATE OR REPLACE FUNCTION public.get_user_profiles()
RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, raw_user_meta_data jsonb)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  -- Only allow admins to access this, but without needing SECURITY DEFINER
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.raw_user_meta_data
  FROM auth.users au
  WHERE public.has_current_user_role('admin'::app_role);
$function$;

-- Grant necessary permissions for the optimized functions
GRANT EXECUTE ON FUNCTION public.get_property_contact_info(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profiles() TO authenticated;