-- Final optimization to address security definer view linter issue
-- Reduce the number of SECURITY DEFINER functions to only those absolutely necessary

-- 1. The core role functions MUST remain SECURITY DEFINER to avoid RLS recursion
-- These are: has_role, has_current_user_role, get_current_user_role, get_user_profile_with_role

-- 2. All trigger functions MUST remain SECURITY DEFINER to function properly
-- These are: handle_new_user_profile, set_lead_owner, prevent_lead_ids_update, 
--            set_submission_user_id, update_updated_at_column, profiles_audit_trigger,
--            properties_audit_trigger, user_roles_audit_trigger

-- 3. Audit functions should remain SECURITY DEFINER for proper logging
-- These are: log_audit_event, log_auth_event

-- 4. Critical security functions that need to remain SECURITY DEFINER:
-- create_property_lead (needs to bypass RLS to create leads securely)
-- update_user_role (needs elevated privileges for role changes)
-- assign_admin_role_by_email (needs elevated privileges)

-- 5. Try to optimize get_property_owner if possible
-- This function might not need SECURITY DEFINER if we adjust the approach
DROP FUNCTION IF EXISTS public.get_property_owner(uuid);

-- Recreate without SECURITY DEFINER - let RLS handle the access control
CREATE OR REPLACE FUNCTION public.get_property_owner(_property_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT user_id FROM public.properties WHERE id = _property_id;
$function$;

-- Add a comment to document why we've reduced SECURITY DEFINER functions
COMMENT ON VIEW public.public_properties IS 'Secure view that exposes only approved properties without sensitive owner contact information. Access is controlled by underlying table RLS policies.';

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_property_owner(uuid) TO authenticated;

-- Final verification: List remaining SECURITY DEFINER functions for documentation
-- These should only be the absolutely necessary ones for security and functionality