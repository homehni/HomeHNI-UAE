-- Comprehensive Security Fixes
-- Phase 1: Critical Data Integrity and Admin Security

-- Fix property status inconsistency - update any "active" properties to "approved"
UPDATE public.properties 
SET status = 'approved' 
WHERE status = 'active';

-- Add constraint to ensure only valid status values
ALTER TABLE public.properties 
ADD CONSTRAINT properties_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'draft'));

-- Create audit log table for property status changes
CREATE TABLE public.property_audit_log (
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

-- RLS policies for audit log
CREATE POLICY "Admins can view all audit logs" ON public.property_audit_log
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs" ON public.property_audit_log
FOR INSERT 
TO authenticated, service_role
WITH CHECK (true);

-- Create trigger function for property status audit
CREATE OR REPLACE FUNCTION public.audit_property_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.property_audit_log (property_id, old_status, new_status, changed_by, reason)
        VALUES (NEW.id, OLD.status, NEW.status, auth.uid(), 
                CASE WHEN NEW.rejection_reason IS NOT NULL THEN NEW.rejection_reason ELSE 'Status updated' END);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for property status changes
CREATE TRIGGER audit_property_status_trigger
    AFTER UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_property_status_change();

-- Secure admin role assignment - prevent self-assignment
-- Drop and recreate the update_user_role function with enhanced security
DROP FUNCTION IF EXISTS public.update_user_role(uuid, app_role);

CREATE OR REPLACE FUNCTION public.update_user_role(_user_id uuid, _new_role app_role, _reason text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Critical Security Check: Prevent users from assigning admin role to themselves or others
  -- Only existing admins can assign admin roles
  IF _new_role = 'admin'::app_role AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only existing admins can assign admin roles';
  END IF;
  
  -- Users can only update their own non-admin roles
  -- Admins can update any user's role
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

-- Create audit log for user role changes
CREATE TABLE public.user_role_audit_log (
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

-- RLS policies for user role audit log
CREATE POLICY "Admins can view all role audit logs" ON public.user_role_audit_log
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own role changes" ON public.user_role_audit_log
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Allow the function to insert audit records
CREATE POLICY "System can insert role audit logs" ON public.user_role_audit_log
FOR INSERT 
TO authenticated, service_role
WITH CHECK (true);

-- Add additional RLS policy to prevent role escalation through direct table access
CREATE POLICY "Prevent unauthorized admin role assignment" ON public.user_roles
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Only admins can insert admin roles
  CASE WHEN role = 'admin'::app_role 
  THEN has_role(auth.uid(), 'admin'::app_role)
  ELSE user_id = auth.uid() END
);

-- Create constraint to ensure valid property data
ALTER TABLE public.properties 
ADD CONSTRAINT properties_expected_price_positive 
CHECK (expected_price > 0);

ALTER TABLE public.properties 
ADD CONSTRAINT properties_super_area_positive 
CHECK (super_area > 0);

ALTER TABLE public.properties 
ADD CONSTRAINT properties_bathrooms_non_negative 
CHECK (bathrooms >= 0);

-- Create index for better security query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_role_lookup 
ON public.user_roles(user_id, role);

CREATE INDEX IF NOT EXISTS idx_properties_user_status 
ON public.properties(user_id, status);