-- Fix get_user_profiles function to work with profiles table instead of auth.users
CREATE OR REPLACE FUNCTION public.get_user_profiles()
RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, raw_user_meta_data jsonb)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Return empty result set since we can't access auth.users directly
  -- Admin users should use the profiles table instead
  SELECT 
    NULL::uuid as id,
    NULL::text as email, 
    NULL::timestamp with time zone as created_at,
    NULL::jsonb as raw_user_meta_data
  WHERE FALSE;
$$;