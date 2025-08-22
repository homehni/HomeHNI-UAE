-- Create enhanced triggers for comprehensive audit logging

-- Function to log audit events with enhanced details
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action text,
  p_table_name text,
  p_record_id uuid,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_user_id uuid DEFAULT auth.uid(),
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    user_id,
    ip_address,
    user_agent
  ) VALUES (
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    p_user_id,
    p_ip_address,
    p_user_agent
  );
END;
$$;

-- Trigger function for properties table
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
    -- Log status changes specifically
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

-- Trigger function for profiles table
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

-- Trigger function for user_roles table  
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

-- Create triggers
DROP TRIGGER IF EXISTS properties_audit_trigger ON public.properties;
CREATE TRIGGER properties_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.properties_audit_trigger();

DROP TRIGGER IF EXISTS profiles_audit_trigger ON public.profiles;
CREATE TRIGGER profiles_audit_trigger
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_audit_trigger();

DROP TRIGGER IF EXISTS user_roles_audit_trigger ON public.user_roles;
CREATE TRIGGER user_roles_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.user_roles_audit_trigger();

-- Function to log authentication events
CREATE OR REPLACE FUNCTION public.log_auth_event(
  p_event_type text,
  p_user_email text DEFAULT NULL,
  p_success boolean DEFAULT true,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_details text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    user_id,
    ip_address,
    user_agent
  ) VALUES (
    p_event_type,
    'authentication',
    gen_random_uuid(),
    NULL,
    jsonb_build_object(
      'email', p_user_email,
      'success', p_success,
      'details', p_details
    ),
    auth.uid(),
    p_ip_address,
    p_user_agent
  );
END;
$$;

-- Enable realtime for audit_logs if not already enabled
ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;

-- Enable realtime for properties if not already enabled  
ALTER TABLE public.properties REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;

-- Enable realtime for profiles if not already enabled
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Enable realtime for user_roles if not already enabled
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;