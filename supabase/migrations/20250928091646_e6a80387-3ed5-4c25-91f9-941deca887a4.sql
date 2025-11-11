-- Update create_contact_lead function to send email notifications to property owners
CREATE OR REPLACE FUNCTION public.create_contact_lead(
  p_property_id uuid, 
  p_user_name text, 
  p_user_email text, 
  p_user_phone text DEFAULT NULL::text, 
  p_message text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  lead_id uuid;
  property_owner_id uuid;
  property_found boolean := false;
  owner_contact_info record;
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
  
  -- Get property owner contact information
  SELECT * INTO owner_contact_info 
  FROM public.get_property_owner_contact(p_property_id);
  
  -- Send email notification to property owner if contact info is available
  IF owner_contact_info.owner_email IS NOT NULL THEN
    BEGIN
      PERFORM net.http_post(
        url := 'https://smyojibmvrhfbwodvobw.supabase.co/functions/v1/send-lead-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := jsonb_build_object(
          'ownerEmail', owner_contact_info.owner_email,
          'ownerName', owner_contact_info.owner_name,
          'propertyTitle', owner_contact_info.property_title,
          'leadData', jsonb_build_object(
            'inquirerName', p_user_name,
            'inquirerEmail', p_user_email,
            'inquirerPhone', p_user_phone,
            'message', p_message
          )
        )
      );
    EXCEPTION WHEN OTHERS THEN
      -- Log the error but don't fail the lead creation
      PERFORM public.log_audit_event(
        'Lead Email Notification Failed',
        'leads',
        lead_id,
        NULL,
        jsonb_build_object('error', SQLERRM, 'owner_email', owner_contact_info.owner_email)
      );
    END;
  END IF;
  
  RETURN lead_id;
END;
$function$;