-- Assign admin role to homehni8@gmail.com
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID from auth.users by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = 'homehni8@gmail.com';
  
  IF target_user_id IS NULL THEN
    RAISE NOTICE 'User with email homehni8@gmail.com not found';
  ELSE
    -- Remove any existing roles for this user
    DELETE FROM public.user_roles WHERE user_id = target_user_id;
    
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin'::app_role);
    
    -- Log the role assignment
    INSERT INTO public.user_role_audit_log (user_id, old_role, new_role, changed_by, reason)
    VALUES (target_user_id, NULL, 'admin'::app_role, target_user_id, 'Admin role assigned to homehni8@gmail.com');
    
    -- Also ensure they have content manager access in employees table if needed
    INSERT INTO public.employees (
        employee_id, full_name, email, department, designation, role, join_date, status, user_id
    ) VALUES (
        'EMP002', 'Admin User', 'homehni8@gmail.com', 'Administration', 'System Administrator', 'content_manager', CURRENT_DATE, 'active', target_user_id
    ) ON CONFLICT (email) DO UPDATE SET
        role = 'content_manager'::employee_role,
        status = 'active'::employee_status;
    
    RAISE NOTICE 'Admin role successfully assigned to homehni8@gmail.com';
  END IF;
END;
$$;