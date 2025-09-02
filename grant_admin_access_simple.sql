-- Simple script to grant admin access to ronitpathak12345@gmail.com
-- Run this in your Supabase SQL Editor

-- Step 1: Find the user ID
SELECT id, email FROM auth.users WHERE email = 'ronitpathak12345@gmail.com';

-- Step 2: Grant admin role (replace USER_ID_HERE with the actual user ID from step 1)
-- INSERT INTO public.user_roles (user_id, role, created_at)
-- VALUES ('USER_ID_HERE', 'admin', now());

-- Step 3: Add content manager role in employees table
-- INSERT INTO public.employees (
--     employee_id, full_name, email, department, designation, role, join_date, status, user_id
-- ) VALUES (
--     'EMP001', 'Ronit Pathak', 'ronitpathak12345@gmail.com', 'Administration', 'System Administrator', 'content_manager', CURRENT_DATE, 'active', 'USER_ID_HERE'
-- );

-- Step 4: Verify the roles
-- SELECT 
--     u.email,
--     ur.role as user_role,
--     e.role as employee_role
-- FROM auth.users u
-- LEFT JOIN public.user_roles ur ON u.id = ur.user_id
-- LEFT JOIN public.employees e ON u.id = e.user_id
-- WHERE u.email = 'ronitpathak12345@gmail.com';
