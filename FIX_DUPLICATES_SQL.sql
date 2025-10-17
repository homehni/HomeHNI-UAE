-- ========================================
-- FIX: Remove Duplicate Properties
-- ========================================
-- This will show each property only ONCE (the most recent contact)
-- Copy and paste this into Supabase Dashboard → SQL Editor → Run

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
    -- Get only the most recent contact per property
    SELECT DISTINCT ON (l.property_id)
      l.property_id,
      l.created_at AS contact_date,
      l.message AS lead_message
    FROM public.leads l
    WHERE LOWER(l.interested_user_email) = LOWER(p_user_email)
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

-- ========================================
-- What Changed?
-- ========================================
-- Added "DISTINCT ON (l.property_id)" to get only the most recent contact per property
-- This means if you contacted the same property on multiple dates,
-- only the LATEST contact will be shown
--
-- Result: Each property appears only ONCE in your list
-- ========================================

