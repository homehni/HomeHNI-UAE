-- ========================================
-- FINAL FIX FOR "OWNERS YOU CONTACTED" TAB
-- ========================================
-- This script fixes the case-sensitivity issue in email matching
-- and ensures no duplicate entries are shown.
--
-- Run this SQL in your Supabase SQL Editor to apply all fixes.
-- ========================================

-- Step 1: Drop existing function to allow modifications
DROP FUNCTION IF EXISTS public.get_contacted_properties_with_owners(text);

-- Step 2: Create updated function with case-insensitive email matching
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
  WITH latest_contacts AS (
    -- Get only the most recent contact per property (fixes duplicates)
    SELECT DISTINCT ON (l.property_id)
      l.property_id,
      l.created_at AS contact_date,
      l.message AS lead_message
    FROM public.leads l
    WHERE LOWER(l.interested_user_email) = LOWER(p_user_email)  -- Case-insensitive comparison
    ORDER BY l.property_id, l.created_at DESC
  )
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
    lc.contact_date,
    lc.lead_message
  FROM latest_contacts lc
  INNER JOIN public.properties p ON lc.property_id = p.id
  LEFT JOIN public.profiles prof ON prof.user_id = p.user_id
  WHERE p.status = 'approved'
    AND p.is_visible = true
  ORDER BY lc.contact_date DESC;
END;
$$;

-- Step 3: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_contacted_properties_with_owners(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_contacted_properties_with_owners(text) TO anon;

-- Step 4: Add helpful comment
COMMENT ON FUNCTION public.get_contacted_properties_with_owners IS 
'Returns properties that the user has contacted with owner details. 
Uses case-insensitive email matching and shows only the most recent contact per property.
Used for "Owners You Contacted" dashboard tab.';

-- ========================================
-- VERIFICATION QUERY
-- ========================================
-- Run this to test the function (replace with your email):
-- SELECT * FROM get_contacted_properties_with_owners('your-email@example.com');

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
-- If you see "Query executed successfully" above, the fix is complete!
-- 
-- What was fixed:
-- 1. ✅ Case-insensitive email matching (LOWER comparison)
-- 2. ✅ Duplicate entries removed (DISTINCT ON property_id)
-- 3. ✅ Shows only most recent contact per property
-- 4. ✅ Proper owner details with fallbacks
-- 
-- Now test by:
-- 1. Go to Dashboard → "Owners You Contacted" tab
-- 2. Contact a new property
-- 3. Wait 2-3 seconds
-- 4. Property should appear automatically!

