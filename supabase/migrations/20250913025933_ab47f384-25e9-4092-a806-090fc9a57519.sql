-- Secure the create_property_lead function by adding authentication checks
CREATE OR REPLACE FUNCTION public.create_property_lead(
  property_id uuid, 
  interested_user_name text, 
  interested_user_email text, 
  interested_user_phone text DEFAULT NULL::text, 
  message text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  lead_id uuid;
  property_owner_id uuid;
  current_user_id uuid;
BEGIN
  -- CRITICAL SECURITY CHECK: Ensure user is authenticated
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to create leads';
  END IF;
  
  -- Input validation and sanitization
  IF char_length(interested_user_name) < 2 OR char_length(interested_user_name) > 100 THEN
    RAISE EXCEPTION 'Invalid name length';
  END IF;
  
  IF interested_user_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Get property owner ID
  SELECT user_id INTO property_owner_id
  FROM public.properties 
  WHERE id = property_id AND status = 'approved';
  
  IF property_owner_id IS NULL THEN
    RAISE EXCEPTION 'Property not found or not available';
  END IF;
  
  -- Additional security check: prevent users from creating leads for their own properties
  IF property_owner_id = current_user_id THEN
    RAISE EXCEPTION 'Cannot create lead for your own property';
  END IF;
  
  -- Rate limiting: Check if user has created too many leads recently
  IF (SELECT COUNT(*) FROM public.leads 
      WHERE created_at > (now() - interval '1 hour')
      AND interested_user_email = (SELECT email FROM auth.users WHERE id = current_user_id)
     ) >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before creating more leads.';
  END IF;
  
  -- Create the lead record
  INSERT INTO public.leads (
    property_id,
    property_owner_id,
    interested_user_name,
    interested_user_email,
    interested_user_phone,
    message,
    status
  ) VALUES (
    property_id,
    property_owner_id,
    trim(interested_user_name),
    lower(trim(interested_user_email)),
    CASE WHEN interested_user_phone IS NOT NULL 
         THEN regexp_replace(trim(interested_user_phone), '[^\d+\-\s()]', '', 'g')
         ELSE NULL END,
    trim(message),
    'new'
  ) RETURNING id INTO lead_id;
  
  RETURN lead_id;
END;
$$;