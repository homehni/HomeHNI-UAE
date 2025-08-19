-- Security Fixes - Phase 1: Data Integrity and Admin Security
-- Step 1: Remove existing trigger completely to allow data cleanup

-- Drop all existing triggers and functions that might interfere
DROP TRIGGER IF EXISTS prevent_status_update_trigger ON public.properties;
DROP FUNCTION IF EXISTS public.prevent_non_admin_status_update();

-- Now we can safely update invalid property statuses
UPDATE public.properties 
SET status = 'approved' 
WHERE status NOT IN ('pending', 'approved', 'rejected', 'draft');

-- Add database constraints for data integrity
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE public.properties 
ADD CONSTRAINT properties_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'draft'));

-- Add positive value constraints
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_expected_price_positive;
ALTER TABLE public.properties 
ADD CONSTRAINT properties_expected_price_positive 
CHECK (expected_price > 0);

ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_super_area_positive;
ALTER TABLE public.properties 
ADD CONSTRAINT properties_super_area_positive 
CHECK (super_area > 0);

ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_bathrooms_non_negative;
ALTER TABLE public.properties 
ADD CONSTRAINT properties_bathrooms_non_negative 
CHECK (bathrooms >= 0);

-- Create audit log table for property status changes
CREATE TABLE IF NOT EXISTS public.property_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    reason TEXT
);

-- Enable RLS on audit log
ALTER TABLE public.property_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for audit log (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.property_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.property_audit_log;

CREATE POLICY "Admins can view all audit logs" ON public.property_audit_log
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs" ON public.property_audit_log
FOR INSERT 
TO authenticated, service_role
WITH CHECK (true);

-- Create audit log for user role changes
CREATE TABLE IF NOT EXISTS public.user_role_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    old_role app_role,
    new_role app_role NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    reason TEXT
);

-- Enable RLS on user role audit log
ALTER TABLE public.user_role_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for user role audit log (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Admins can view all role audit logs" ON public.user_role_audit_log;
DROP POLICY IF EXISTS "Users can view their own role changes" ON public.user_role_audit_log;
DROP POLICY IF EXISTS "System can insert role audit logs" ON public.user_role_audit_log;

CREATE POLICY "Admins can view all role audit logs" ON public.user_role_audit_log
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own role changes" ON public.user_role_audit_log
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System can insert role audit logs" ON public.user_role_audit_log
FOR INSERT 
TO authenticated, service_role
WITH CHECK (true);

-- Enhanced RLS policy to prevent unauthorized admin role assignment
DROP POLICY IF EXISTS "Prevent unauthorized admin role assignment" ON public.user_roles;
CREATE POLICY "Prevent unauthorized admin role assignment" ON public.user_roles
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Only admins can insert admin roles, regular users can only assign roles to themselves
  CASE WHEN role = 'admin'::app_role 
  THEN has_role(auth.uid(), 'admin'::app_role)
  ELSE user_id = auth.uid() END
);

-- Secure admin role assignment function
CREATE OR REPLACE FUNCTION public.update_user_role(_user_id uuid, _new_role app_role, _reason text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Critical Security Check: Prevent users from assigning admin role to themselves or others
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
$$;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_role_lookup 
ON public.user_roles(user_id, role);

CREATE INDEX IF NOT EXISTS idx_properties_user_status 
ON public.properties(user_id, status);

CREATE INDEX IF NOT EXISTS idx_property_audit_log_property_id 
ON public.property_audit_log(property_id);

CREATE INDEX IF NOT EXISTS idx_user_role_audit_log_user_id 
ON public.user_role_audit_log(user_id);