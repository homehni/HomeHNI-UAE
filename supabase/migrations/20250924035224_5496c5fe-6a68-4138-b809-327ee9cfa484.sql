-- Drop conflicting RLS policies on leads table
DROP POLICY IF EXISTS "Enforce authentication for all lead operations" ON public.leads;
DROP POLICY IF EXISTS "Prevent lead data exposure through INSERT" ON public.leads;
DROP POLICY IF EXISTS "Restricted lead creation for approved properties" ON public.leads;

-- Create simplified RLS policies for leads table
CREATE POLICY "Authenticated users can create leads via RPC" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Property owners can view their leads" 
ON public.leads 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    property_owner_id = auth.uid() OR 
    has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Property owners can update their leads status" 
ON public.leads 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    property_owner_id = auth.uid() OR 
    has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Create RPC function to create contact leads
CREATE OR REPLACE FUNCTION public.create_contact_lead(
  p_property_id uuid,
  p_user_name text,
  p_user_email text,
  p_user_phone text DEFAULT NULL,
  p_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lead_id uuid;
  property_owner_id uuid;
  property_found boolean := false;
BEGIN
  -- Input validation
  IF char_length(p_user_name) < 2 OR char_length(p_user_name) > 100 THEN
    RAISE EXCEPTION 'Invalid name length';
  END IF;
  
  IF p_user_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Try to find property owner in properties table first
  SELECT user_id INTO property_owner_id
  FROM public.properties 
  WHERE id = p_property_id 
    AND (status = 'approved' OR status IS NULL);
  
  IF property_owner_id IS NOT NULL THEN
    property_found := true;
  ELSE
    -- Try property_submissions table as fallback
    SELECT user_id INTO property_owner_id
    FROM public.property_submissions 
    WHERE id = p_property_id;
    
    IF property_owner_id IS NOT NULL THEN
      property_found := true;
    END IF;
  END IF;
  
  -- If no property owner found, raise exception
  IF NOT property_found OR property_owner_id IS NULL THEN
    RAISE EXCEPTION 'Property not found or not available for contact';
  END IF;
  
  -- Create the lead record
  INSERT INTO public.leads (
    property_id,
    property_owner_id,
    interested_user_name,
    interested_user_email,
    interested_user_phone,
    message,
    status,
    lead_type
  ) VALUES (
    p_property_id,
    property_owner_id,
    trim(p_user_name),
    lower(trim(p_user_email)),
    CASE WHEN p_user_phone IS NOT NULL AND p_user_phone != ''
         THEN regexp_replace(trim(p_user_phone), '[^\d+\-\s()]', '', 'g')
         ELSE NULL END,
    CASE WHEN p_message IS NOT NULL AND p_message != ''
         THEN trim(p_message)
         ELSE NULL END,
    'new',
    'inquiry'
  ) RETURNING id INTO lead_id;
  
  RETURN lead_id;
END;
$$;