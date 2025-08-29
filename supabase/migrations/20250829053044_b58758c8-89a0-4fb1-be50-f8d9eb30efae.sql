-- CRITICAL SECURITY FIX: Harden RLS policies and fix data exposure vulnerabilities
-- Fixed version without unsupported SELECT triggers

-- =============================================================================
-- 1. FIX PROPERTY DRAFTS SECURITY (Critical)
-- Problem: Sensitive owner contact info could be accessed by unauthorized users
-- =============================================================================

-- Add audit logging trigger for property_drafts (without SELECT)
CREATE OR REPLACE FUNCTION public.property_drafts_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Create trigger for property drafts auditing
DROP TRIGGER IF EXISTS property_drafts_audit ON public.property_drafts;
CREATE TRIGGER property_drafts_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.property_drafts
  FOR EACH ROW EXECUTE FUNCTION public.property_drafts_audit_trigger();

-- =============================================================================
-- 2. FIX LEADS TABLE SECURITY (Critical)
-- Problem: Customer lead info could be stolen by competitors
-- =============================================================================

-- Drop existing overly permissive policies on leads table
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
DROP POLICY IF EXISTS "Property owners can view their leads" ON public.leads;
DROP POLICY IF EXISTS "Property owners can update their leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update all leads" ON public.leads;

-- Create more secure policies with proper validation
CREATE POLICY "Authenticated users can create leads with validation" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Verify the property exists and is approved
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id 
    AND status = 'approved'
  )
  -- Ensure property_owner_id is set correctly (will be handled by trigger)
);

CREATE POLICY "Property owners can view only their own leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (
  property_owner_id = auth.uid()
);

CREATE POLICY "Property owners can update only their own leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (
  property_owner_id = auth.uid()
)
WITH CHECK (
  property_owner_id = auth.uid()
);

CREATE POLICY "Admins can manage all leads" 
ON public.leads 
FOR ALL 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add rate limiting for lead creation
CREATE OR REPLACE FUNCTION public.check_lead_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Create rate limiting trigger
DROP TRIGGER IF EXISTS check_lead_rate_limit_trigger ON public.leads;
CREATE TRIGGER check_lead_rate_limit_trigger
  BEFORE INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.check_lead_rate_limit();

-- =============================================================================
-- 3. ENHANCE PROFILES TABLE SECURITY
-- =============================================================================

-- Update existing profiles audit trigger to be more comprehensive
DROP TRIGGER IF EXISTS profiles_audit ON public.profiles;

CREATE OR REPLACE FUNCTION public.profiles_enhanced_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Enhanced logging for profile updates
    PERFORM public.log_audit_event(
      'Profile Updated',
      'profiles',
      NEW.id,
      to_jsonb(OLD) - '{id,created_at,updated_at}'::text[], -- Exclude timestamps
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

-- Create enhanced profiles audit trigger
CREATE TRIGGER profiles_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_enhanced_audit_trigger();

-- =============================================================================
-- 4. STRENGTHEN PROPERTY DRAFTS RLS POLICIES
-- =============================================================================

-- Verify and strengthen existing RLS policies on property_drafts
-- Add additional security check to prevent cross-user access

CREATE OR REPLACE FUNCTION public.verify_draft_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Create security verification trigger for drafts
DROP TRIGGER IF EXISTS verify_draft_access_trigger ON public.property_drafts;
CREATE TRIGGER verify_draft_access_trigger
  BEFORE UPDATE OR DELETE ON public.property_drafts
  FOR EACH ROW EXECUTE FUNCTION public.verify_draft_access();

-- =============================================================================
-- 5. CREATE SECURE DATA ACCESS LOGGING FUNCTION
-- =============================================================================

-- Create function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(
  table_name text,
  record_id uuid,
  access_type text,
  details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- =============================================================================
-- 6. ADD SECURITY MONITORING FUNCTION
-- =============================================================================

-- Create function to detect suspicious access patterns
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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

-- =============================================================================
-- 7. CREATE SECURITY VALIDATION FUNCTIONS
-- =============================================================================

-- Function to validate sensitive data access
CREATE OR REPLACE FUNCTION public.validate_sensitive_access(
  user_id uuid,
  target_table text,
  target_record_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- =============================================================================
-- 8. COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON FUNCTION public.property_drafts_audit_trigger() IS 
'Audit trigger for property_drafts table. Logs all modifications to sensitive owner contact information for security monitoring.';

COMMENT ON FUNCTION public.check_lead_rate_limit() IS 
'Rate limiting function to prevent spam lead creation. Limits users to 5 leads per hour.';

COMMENT ON FUNCTION public.log_sensitive_data_access(text, uuid, text, jsonb) IS 
'Centralized function for logging access to sensitive data across all tables.';

COMMENT ON FUNCTION public.detect_suspicious_activity() IS 
'Security monitoring function that detects and alerts on suspicious access patterns.';

COMMENT ON FUNCTION public.validate_sensitive_access(uuid, text, uuid) IS 
'Validates if a user has legitimate access to sensitive data in specified tables.';

-- Add security metadata
INSERT INTO public.platform_settings (key, value, description, is_public, updated_by)
VALUES (
  'security_hardening_applied',
  '{"version": "1.1", "applied_at": "2025-08-29T05:35:00Z", "fixes": ["property_drafts_audit", "leads_rate_limiting", "enhanced_profile_monitoring", "suspicious_activity_detection", "access_validation"]}'::jsonb,
  'Security hardening measures applied to protect sensitive user data - Fixed version without SELECT triggers',
  false,
  auth.uid()
) ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now(),
  updated_by = auth.uid();