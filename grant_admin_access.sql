-- Grant Admin and Content Manager Access to ronitpathak12345@gmail.com
-- Run this script directly in your Supabase SQL Editor

-- First, let's check if the user exists in auth.users
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Get user ID from auth.users by email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = 'ronitpathak12345@gmail.com';
    
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User with email ronitpathak12345@gmail.com not found in auth.users';
        RAISE NOTICE 'Please ensure the user has signed up and is authenticated first';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user with ID: %', target_user_id;
    
    -- Remove any existing roles for this user
    DELETE FROM public.user_roles WHERE user_id = target_user_id;
    
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (target_user_id, 'admin'::app_role, now());
    
    RAISE NOTICE 'Admin role assigned successfully to user %', target_user_id;
    
    -- Also add content_manager role in employees table for additional permissions
    INSERT INTO public.employees (
        employee_id,
        full_name,
        email,
        phone,
        department,
        designation,
        role,
        join_date,
        status,
        user_id,
        created_at,
        updated_at
    ) VALUES (
        'EMP001',
        'Ronit Pathak',
        'ronitpathak12345@gmail.com',
        NULL,
        'Administration',
        'System Administrator',
        'content_manager'::employee_role,
        CURRENT_DATE,
        'active'::employee_status,
        target_user_id,
        now(),
        now()
    ) ON CONFLICT (email) DO UPDATE SET
        role = 'content_manager'::employee_role,
        status = 'active'::employee_status,
        user_id = target_user_id,
        updated_at = now();
    
    RAISE NOTICE 'Content manager role also assigned in employees table';
    
    -- Log the role assignment for audit purposes
    INSERT INTO public.user_role_audit_log (user_id, old_role, new_role, changed_by, reason, created_at)
    VALUES (target_user_id, NULL, 'admin'::app_role, target_user_id, 'Admin role assigned during setup by direct database script', now());
    
    RAISE NOTICE 'Role assignment logged in audit log';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE NOTICE 'SQL State: %', SQLSTATE;
END $$;

-- Verify the role assignment
SELECT 
    u.email,
    ur.role as user_role,
    e.role as employee_role,
    e.status as employee_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.employees e ON u.id = e.user_id
WHERE u.email = 'ronitpathak12345@gmail.com';

-- Show all roles for this user
SELECT 
    'user_roles' as source,
    user_id,
    role,
    created_at
FROM public.user_roles 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'ronitpathak12345@gmail.com')

UNION ALL

SELECT 
    'employees' as source,
    user_id,
    role::text,
    created_at
FROM public.employees 
WHERE email = 'ronitpathak12345@gmail.com';
