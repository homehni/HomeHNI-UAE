-- Create a function to assign admin role to a user by email (for setup purposes)
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;