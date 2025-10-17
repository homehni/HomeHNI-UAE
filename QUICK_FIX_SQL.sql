-- ========================================
-- QUICK FIX: Owner Details Not Showing
-- ========================================
-- Copy and paste this entire SQL into Supabase Dashboard → SQL Editor → Run
-- This will fix the issue where owner contact details aren't displayed

-- Step 1: Create optimized function for "Owners You Contacted" feature
CREATE OR REPLACE FUNCTION public.get_contacted_properties_with_owners(p_user_email text)
RETURNS TABLE(
  property_id uuid,
  property_title text,
  property_type text,
  listing_type text,
  expected_price numeric,
  city text,
  locality text,
  state text,
  images text[],
  property_created_at timestamptz,
  owner_name text,
  owner_email text,
  owner_phone text,
  contact_date timestamptz,
  lead_message text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS property_id,
    p.title AS property_title,
    p.property_type,
    p.listing_type,
    p.expected_price,
    p.city,
    p.locality,
    p.state,
    p.images,
    p.created_at AS property_created_at,
    -- Get owner details with proper NULL handling
    COALESCE(NULLIF(p.owner_name, ''), NULLIF(prof.full_name, ''), 'Property Owner') AS owner_name,
    COALESCE(
      NULLIF(p.owner_email, ''),
      NULLIF((SELECT email FROM auth.users WHERE id = p.user_id), '')
    ) AS owner_email,
    COALESCE(NULLIF(p.owner_phone, ''), NULLIF(prof.phone, '')) AS owner_phone,
    l.created_at AS contact_date,
    l.message AS lead_message
  FROM public.leads l
  INNER JOIN public.properties p ON l.property_id = p.id
  LEFT JOIN public.profiles prof ON prof.user_id = p.user_id
  WHERE l.interested_user_email = p_user_email
    AND p.status = 'approved'
    AND p.is_visible = true
  ORDER BY l.created_at DESC;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_contacted_properties_with_owners(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_contacted_properties_with_owners(text) TO anon;

-- Step 2: Update owner contact function to include phone number
-- IMPORTANT: Must drop first because we're changing the return type!
DROP FUNCTION IF EXISTS public.get_property_owner_contact(uuid);

CREATE FUNCTION public.get_property_owner_contact(property_id uuid)
RETURNS TABLE(owner_email text, owner_name text, owner_phone text, property_title text)
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
    COALESCE(NULLIF(p.owner_phone, ''), prof.phone, '') AS owner_phone,
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

-- ========================================
-- Verification Query (Optional - Run after the above)
-- ========================================
-- Check if functions were created successfully
SELECT 
  proname as function_name,
  pronargs as num_arguments
FROM pg_proc 
WHERE proname IN (
  'get_contacted_properties_with_owners',
  'get_property_owner_contact'
)
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Should return 2 rows:
-- get_contacted_properties_with_owners | 1
-- get_property_owner_contact | 1

-- ========================================
-- SUCCESS! 
-- ========================================
-- Now refresh your browser and check /dashboard?tab=interested
-- Owner names, emails, and phone numbers should now be visible!

