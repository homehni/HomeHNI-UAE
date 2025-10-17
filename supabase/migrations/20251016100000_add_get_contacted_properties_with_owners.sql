-- RPC function to get properties that the current user has contacted with owner details
-- This function returns property information along with owner details for properties
-- where the authenticated user has submitted a contact lead

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
    -- Get owner details with fallbacks
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_contacted_properties_with_owners(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_contacted_properties_with_owners(text) TO anon;

-- Add comment
COMMENT ON FUNCTION public.get_contacted_properties_with_owners IS 
'Returns properties that the user has contacted with owner details. Used for "Owners You Contacted" dashboard tab.';

