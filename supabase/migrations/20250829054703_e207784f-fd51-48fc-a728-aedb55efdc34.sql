-- Fix remaining functions that still don't have proper search_path

-- Fix all remaining trigger functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_lead_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  owner uuid;
BEGIN
  owner := public.get_property_owner(NEW.property_id);
  IF owner IS NULL THEN
    RAISE EXCEPTION 'Invalid property_id: %', NEW.property_id;
  END IF;
  NEW.property_owner_id := owner;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.prevent_lead_ids_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_admin boolean := false;
BEGIN
  IF NEW.property_id IS DISTINCT FROM OLD.property_id OR NEW.property_owner_id IS DISTINCT FROM OLD.property_owner_id THEN
    SELECT public.has_role(auth.uid(), 'admin') INTO is_admin;
    IF NOT is_admin THEN
      RAISE EXCEPTION 'Not allowed to change property_id or property_owner_id';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      NEW.email
    )
  );
  
  -- Assign default role as 'buyer' for new users (can be changed later)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.property_drafts_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT public.log_audit_event(
      'Property Draft Created',
      'property_drafts',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    SELECT public.log_audit_event(
      'Property Draft Updated',
      'property_drafts',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT public.log_audit_event(
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
$function$;

CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID from auth.users by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = _email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', _email;
  END IF;
  
  -- Remove existing roles for this user
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role);
  
  -- Log the role assignment
  INSERT INTO public.user_role_audit_log (user_id, old_role, new_role, changed_by, reason)
  VALUES (target_user_id, NULL, 'admin'::app_role, target_user_id, 'Admin role assigned during setup');
END;
$function$;

CREATE OR REPLACE FUNCTION public.properties_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT public.log_audit_event(
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
      SELECT public.log_audit_event(
        'Property Status Changed: ' || COALESCE(OLD.status, 'NULL') || ' → ' || COALESCE(NEW.status, 'NULL'),
        'properties',
        NEW.id,
        to_jsonb(OLD),
        to_jsonb(NEW)
      );
    ELSE
      SELECT public.log_audit_event(
        'Property Updated',
        'properties',
        NEW.id,
        to_jsonb(OLD),
        to_jsonb(NEW)
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT public.log_audit_event(
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
$function$;

CREATE OR REPLACE FUNCTION public.profiles_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT public.log_audit_event(
      'User Profile Created',
      'profiles',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    SELECT public.log_audit_event(
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
$function$;

CREATE OR REPLACE FUNCTION public.user_roles_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT public.log_audit_event(
      'User Role Assigned: ' || NEW.role::text,
      'user_roles',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    SELECT public.log_audit_event(
      'User Role Changed: ' || OLD.role::text || ' → ' || NEW.role::text,
      'user_roles',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT public.log_audit_event(
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
$function$;

CREATE OR REPLACE FUNCTION public.log_auth_event(p_event_type text, p_user_email text DEFAULT NULL::text, p_success boolean DEFAULT true, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_details text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.check_lead_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  recent_leads INTEGER;
  user_uuid UUID := auth.uid();
BEGIN
  -- Check if authenticated user exists
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Authentication required to create leads';
  END IF;
  
  -- Count recent leads from this user (last 1 hour)
  SELECT COUNT(*)
  INTO recent_leads
  FROM public.leads
  WHERE created_at > (now() - interval '1 hour')
    AND (
      -- Check by authenticated user if they are the property owner
      property_owner_id = user_uuid
      OR 
      -- Check by similar email pattern for anonymous submissions
      interested_user_email = (
        SELECT email FROM auth.users WHERE id = user_uuid
      )
    );
  
  -- Limit to 5 leads per hour per user
  IF recent_leads >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before creating more leads.';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.profiles_enhanced_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Enhanced logging for profile updates
    SELECT public.log_audit_event(
      'Profile Updated',
      'profiles',
      NEW.id,
      to_jsonb(OLD) - '{id,created_at,updated_at}'::text[], -- Exclude timestamps
      to_jsonb(NEW) - '{id,created_at,updated_at}'::text[]
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    SELECT public.log_audit_event(
      'Profile Created',
      'profiles',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT public.log_audit_event(
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
$function$;

CREATE OR REPLACE FUNCTION public.verify_draft_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Additional security check for property drafts
  IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    -- Ensure only the owner or admin can modify
    IF OLD.user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
      RAISE EXCEPTION 'Access denied: You can only modify your own property drafts';
    END IF;
  END IF;
  
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_property_contact_info(property_id uuid)
RETURNS TABLE(owner_name text, contact_message text)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  -- Only return limited contact info for approved properties
  SELECT 
    p.owner_name,
    CASE 
      WHEN p.owner_name IS NOT NULL 
      THEN 'Contact available - use inquiry form to reach owner'
      ELSE 'Contact information not available'
    END as contact_message
  FROM public.properties p
  WHERE p.id = property_id 
    AND p.status = 'approved'
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_profiles()
RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, raw_user_meta_data jsonb)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  -- Only allow admins to access this, but without needing SECURITY DEFINER
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.raw_user_meta_data
  FROM auth.users au
  WHERE public.has_current_user_role('admin'::app_role);
$function$;

CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(table_name text, record_id uuid, access_type text, details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.audit_logs (
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    user_id,
    created_at
  ) VALUES (
    'SENSITIVE_DATA_ACCESS: ' || access_type,
    table_name,
    record_id,
    NULL,
    COALESCE(details, '{}'::jsonb) || jsonb_build_object(
      'timestamp', now(),
      'user_id', auth.uid(),
      'session_info', 'logged'
    ),
    auth.uid(),
    now()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  suspicious_user_id uuid;
  access_count integer;
BEGIN
  -- Detect users creating too many leads in short time
  FOR suspicious_user_id IN
    SELECT property_owner_id
    FROM public.leads
    WHERE created_at > (now() - interval '5 minutes')
      AND property_owner_id IS NOT NULL
    GROUP BY property_owner_id
    HAVING COUNT(*) > 10
  LOOP
    -- Log security alert
    SELECT public.log_audit_event(
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
  
  -- Detect excessive property draft modifications
  FOR suspicious_user_id IN
    SELECT user_id
    FROM public.audit_logs
    WHERE action LIKE 'Property Draft%'
      AND created_at > (now() - interval '10 minutes')
      AND user_id IS NOT NULL
    GROUP BY user_id
    HAVING COUNT(*) > 20
  LOOP
    -- Log security alert
    SELECT public.log_audit_event(
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
$function$;

CREATE OR REPLACE FUNCTION public.validate_sensitive_access(user_id uuid, target_table text, target_record_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_valid boolean := false;
  is_admin boolean := false;
BEGIN
  -- Check if user is admin
  SELECT has_role(user_id, 'admin'::app_role) INTO is_admin;
  
  IF is_admin THEN
    RETURN true;
  END IF;
  
  -- Table-specific access validation
  CASE target_table
    WHEN 'property_drafts' THEN
      SELECT EXISTS(
        SELECT 1 FROM public.property_drafts 
        WHERE id = target_record_id AND user_id = validate_sensitive_access.user_id
      ) INTO is_valid;
      
    WHEN 'profiles' THEN
      SELECT EXISTS(
        SELECT 1 FROM public.profiles 
        WHERE id = target_record_id AND user_id = validate_sensitive_access.user_id
      ) INTO is_valid;
      
    WHEN 'leads' THEN
      SELECT EXISTS(
        SELECT 1 FROM public.leads 
        WHERE id = target_record_id AND property_owner_id = validate_sensitive_access.user_id
      ) INTO is_valid;
      
    ELSE
      -- Default deny for unknown tables
      is_valid := false;
  END CASE;
  
  RETURN is_valid;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_property_owner(_property_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT user_id FROM public.properties WHERE id = _property_id;
$function$;

CREATE OR REPLACE FUNCTION public.check_security_status()
RETURNS TABLE(table_name text, rls_enabled boolean, policy_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    t.tablename::text,
    c.relrowsecurity,
    COUNT(p.policyname)
  FROM pg_tables t
  JOIN pg_class c ON c.relname = t.tablename
  LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = t.schemaname
  WHERE t.schemaname = 'public' 
    AND t.tablename IN ('property_drafts', 'profiles', 'properties', 'leads')
  GROUP BY t.tablename, c.relrowsecurity
  ORDER BY t.tablename;
$function$;

CREATE OR REPLACE FUNCTION public.set_submission_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$function$;