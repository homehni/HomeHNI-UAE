-- Add safety trigger to ensure property edits by non-admin users set status to 'pending'
-- This prevents edited properties from remaining 'approved' and showing in public search

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = is_admin_user.user_id
    AND ur.role = 'admin'::app_role
  );
$$;

-- Create trigger function to automatically set status to 'pending' on property updates
-- unless the user is an admin
CREATE OR REPLACE FUNCTION ensure_property_edit_safety()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only apply this logic for UPDATE operations
  IF TG_OP = 'UPDATE' THEN
    -- If the user is not an admin, force status to 'pending'
    IF NOT is_admin_user(NEW.user_id) THEN
      NEW.status = 'pending';
      NEW.updated_at = NOW();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger on the properties table
DROP TRIGGER IF EXISTS property_edit_safety_trigger ON public.properties;
CREATE TRIGGER property_edit_safety_trigger
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION ensure_property_edit_safety();

-- Also create the same trigger for pg_hostel_properties table
DROP TRIGGER IF EXISTS pg_property_edit_safety_trigger ON public.pg_hostel_properties;
CREATE TRIGGER pg_property_edit_safety_trigger
  BEFORE UPDATE ON public.pg_hostel_properties
  FOR EACH ROW
  EXECUTE FUNCTION ensure_property_edit_safety();
