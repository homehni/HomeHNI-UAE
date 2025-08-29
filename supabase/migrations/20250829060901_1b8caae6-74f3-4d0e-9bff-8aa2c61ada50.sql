-- Fix audit trigger functions using SELECT for void-returning function; replace with PERFORM to avoid "query has no destination for result data" errors

-- property_drafts audit trigger
CREATE OR REPLACE FUNCTION public.property_drafts_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      'Property Draft Created',
      'property_drafts',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      'Property Draft Updated',
      'property_drafts',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      'Property Draft Deleted',
      'property_drafts',
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- properties audit trigger
CREATE OR REPLACE FUNCTION public.properties_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      'Property Created',
      'properties',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM public.log_audit_event(
        'Property Status Changed: ' || COALESCE(OLD.status, 'NULL') || ' → ' || COALESCE(NEW.status, 'NULL'),
        'properties',
        NEW.id,
        to_jsonb(OLD),
        to_jsonb(NEW)
      );
    ELSE
      PERFORM public.log_audit_event(
        'Property Updated',
        'properties',
        NEW.id,
        to_jsonb(OLD),
        to_jsonb(NEW)
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      'Property Deleted',
      'properties',
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- profiles audit trigger
CREATE OR REPLACE FUNCTION public.profiles_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      'User Profile Created',
      'profiles',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      'User Profile Updated',
      'profiles',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- user_roles audit trigger
CREATE OR REPLACE FUNCTION public.user_roles_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      'User Role Assigned: ' || NEW.role::text,
      'user_roles',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      'User Role Changed: ' || OLD.role::text || ' → ' || NEW.role::text,
      'user_roles',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      'User Role Removed: ' || OLD.role::text,
      'user_roles',
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- profiles enhanced audit trigger
CREATE OR REPLACE FUNCTION public.profiles_enhanced_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      'Profile Updated',
      'profiles',
      NEW.id,
      to_jsonb(OLD) - '{id,created_at,updated_at}'::text[],
      to_jsonb(NEW) - '{id,created_at,updated_at}'::text[]
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      'Profile Created',
      'profiles',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      'Profile Deleted',
      'profiles',
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- detect_suspicious_activity: replace SELECT with PERFORM for logging calls
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  suspicious_user_id uuid;
  access_count integer;
BEGIN
  FOR suspicious_user_id IN
    SELECT property_owner_id
    FROM public.leads
    WHERE created_at > (now() - interval '5 minutes')
      AND property_owner_id IS NOT NULL
    GROUP BY property_owner_id
    HAVING COUNT(*) > 10
  LOOP
    PERFORM public.log_audit_event(
      'SECURITY_ALERT: Suspicious Lead Creation Pattern',
      'security_monitoring',
      gen_random_uuid(),
      NULL,
      jsonb_build_object(
        'suspicious_user_id', suspicious_user_id,
        'alert_type', 'excessive_lead_creation',
        'severity', 'high',
        'leads_count', (
          SELECT COUNT(*) FROM public.leads 
          WHERE property_owner_id = suspicious_user_id 
          AND created_at > (now() - interval '5 minutes')
        )
      )
    );
  END LOOP;
  
  FOR suspicious_user_id IN
    SELECT user_id
    FROM public.audit_logs
    WHERE action LIKE 'Property Draft%'
      AND created_at > (now() - interval '10 minutes')
      AND user_id IS NOT NULL
    GROUP BY user_id
    HAVING COUNT(*) > 20
  LOOP
    PERFORM public.log_audit_event(
      'SECURITY_ALERT: Excessive Property Draft Activity',
      'security_monitoring',
      gen_random_uuid(),
      NULL,
      jsonb_build_object(
        'suspicious_user_id', suspicious_user_id,
        'alert_type', 'excessive_draft_activity',
        'severity', 'medium'
      )
    );
  END LOOP;
END;
$$;