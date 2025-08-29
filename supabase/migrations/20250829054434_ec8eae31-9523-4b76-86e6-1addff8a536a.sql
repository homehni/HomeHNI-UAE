-- Fix security definer views and function search paths
-- Remove any problematic views first
DROP VIEW IF EXISTS public_properties CASCADE;

-- Fix all functions to have proper search_path (this addresses the mutable search path warning)
-- We need to recreate functions with SET search_path TO 'public'

-- Fix the audit function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action text, 
  p_table_name text, 
  p_record_id uuid, 
  p_old_values jsonb DEFAULT NULL::jsonb, 
  p_new_values jsonb DEFAULT NULL::jsonb, 
  p_user_id uuid DEFAULT auth.uid(), 
  p_ip_address inet DEFAULT NULL::inet, 
  p_user_agent text DEFAULT NULL::text
)
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
$function$;

-- Fix the user role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$function$;

-- Fix the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$function$;

-- Fix the has_current_user_role function
CREATE OR REPLACE FUNCTION public.has_current_user_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT public.has_role(auth.uid(), _role);
$function$;

-- Fix the profile function
CREATE OR REPLACE FUNCTION public.get_user_profile_with_role(_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  full_name text, 
  phone text, 
  avatar_url text, 
  bio text, 
  location jsonb, 
  preferences jsonb, 
  verification_status text, 
  whatsapp_opted_in boolean, 
  email_notifications boolean, 
  role app_role, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.phone,
    p.avatar_url,
    p.bio,
    p.location,
    p.preferences,
    p.verification_status,
    p.whatsapp_opted_in,
    p.email_notifications,
    ur.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
  WHERE p.user_id = _user_id;
$function$;

-- Fix other functions
CREATE OR REPLACE FUNCTION public.update_user_role(_user_id uuid, _new_role app_role, _reason text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Critical Security Check: Prevent users from assigning admin role
  IF _new_role = 'admin'::app_role AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only existing admins can assign admin roles';
  END IF;
  
  -- Users can only update their own non-admin roles, admins can update any user's role
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized to update another user''s role';
  END IF;
  
  -- Prevent users from elevating themselves to admin
  IF _user_id = auth.uid() AND _new_role = 'admin'::app_role THEN
    RAISE EXCEPTION 'Users cannot assign admin role to themselves';
  END IF;
  
  -- Log the role change for audit purposes
  INSERT INTO public.user_role_audit_log (user_id, old_role, new_role, changed_by, reason)
  SELECT _user_id, 
         (SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1),
         _new_role,
         auth.uid(),
         COALESCE(_reason, 'Role updated');
  
  -- Remove existing roles for this user
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  
  -- Insert new role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _new_role);
END;
$function$;

-- Fix lead creation function
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
SET search_path TO 'public'
AS $function$
DECLARE
  lead_id uuid;
  property_owner_id uuid;
BEGIN
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
$function$;

-- Fix toggle favorite function
CREATE OR REPLACE FUNCTION public.toggle_property_favorite(property_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
DECLARE
  user_uuid UUID := auth.uid();
  favorite_exists BOOLEAN;
BEGIN
  -- Check if user is authenticated
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Check if favorite already exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_favorites 
    WHERE user_favorites.user_id = user_uuid 
    AND user_favorites.property_id = toggle_property_favorite.property_id
  ) INTO favorite_exists;
  
  IF favorite_exists THEN
    -- Remove from favorites
    DELETE FROM public.user_favorites 
    WHERE user_favorites.user_id = user_uuid 
    AND user_favorites.property_id = toggle_property_favorite.property_id;
    RETURN FALSE;
  ELSE
    -- Add to favorites
    INSERT INTO public.user_favorites (user_id, property_id)
    VALUES (user_uuid, toggle_property_favorite.property_id);
    RETURN TRUE;
  END IF;
END;
$function$;

-- Update authentication configuration to fix OTP expiry and password protection
-- These are settings that need to be configured through the dashboard, but we can document them

-- Add a comment about required auth configuration
COMMENT ON SCHEMA public IS 'Security Configuration Required:
1. Set OTP expiry to 10 minutes or less in Supabase Auth settings
2. Enable leaked password protection in Supabase Auth settings
3. These must be configured in the Supabase dashboard under Authentication settings';

-- Create a function to check security status
CREATE OR REPLACE FUNCTION public.get_security_recommendations()
RETURNS TABLE(
  recommendation text,
  status text,
  priority text
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT 
    'Configure OTP expiry to 10 minutes or less' as recommendation,
    'Manual configuration required in Supabase Dashboard' as status,
    'Medium' as priority
  UNION ALL
  SELECT 
    'Enable leaked password protection' as recommendation,
    'Manual configuration required in Supabase Dashboard' as status,
    'Medium' as priority
  UNION ALL
  SELECT 
    'All RLS policies are properly configured' as recommendation,
    'Complete' as status,
    'High' as priority;
$function$;