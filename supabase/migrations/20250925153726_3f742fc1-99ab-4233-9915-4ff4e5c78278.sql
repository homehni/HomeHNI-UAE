-- Allow anonymous lead submissions by relaxing auth requirement in rate limit trigger
-- Update the public.check_lead_rate_limit() trigger function

CREATE OR REPLACE FUNCTION public.check_lead_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_leads INTEGER := 0;
  user_uuid UUID := auth.uid();
  email_to_check TEXT := NULL;
BEGIN
  -- Determine identifier for rate limiting
  IF user_uuid IS NULL THEN
    -- Anonymous submission: use the email from the incoming row
    email_to_check := COALESCE(NULLIF(NEW.interested_user_email, ''), NULL);
  END IF;

  -- If we don't have any identifier (no auth and no email), skip rate limiting
  IF user_uuid IS NULL AND email_to_check IS NULL THEN
    RETURN NEW;
  END IF;

  -- Count recent leads in the last hour based on available identifier
  SELECT COUNT(*) INTO recent_leads
  FROM public.leads
  WHERE created_at > (now() - interval '1 hour')
    AND (
      (user_uuid IS NOT NULL AND NEW.interested_user_email IS NOT NULL AND lower(interested_user_email) = lower(NEW.interested_user_email))
      OR (email_to_check IS NOT NULL AND lower(interested_user_email) = lower(email_to_check))
    );

  -- Limit to 5 leads per hour per identifier
  IF recent_leads >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before creating more leads.';
  END IF;

  RETURN NEW;
END;
$$;