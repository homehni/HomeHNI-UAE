-- Activate the content manager employee
UPDATE public.employees 
SET status = 'active'::employee_status, 
    approved_at = now(),
    approved_by = (SELECT id FROM auth.users WHERE email = 'kumar@gmail.com' LIMIT 1)
WHERE email = 'kumar@gmail.com';