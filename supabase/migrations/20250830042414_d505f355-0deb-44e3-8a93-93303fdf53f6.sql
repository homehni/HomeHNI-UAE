-- Fix recursive RLS on employees and add helper functions
-- Helper: current user email
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

-- Helper: current employee id for logged-in user
CREATE OR REPLACE FUNCTION public.get_current_employee_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT e.id
  FROM public.employees e
  WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  LIMIT 1;
$$;

-- Helper: is HR admin (includes super admin)
CREATE OR REPLACE FUNCTION public.is_hr_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND e.role = 'hr_admin'::employee_role
    )
  ) OR public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Helper: is Finance admin (includes super admin)
CREATE OR REPLACE FUNCTION public.is_finance_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND e.role = 'finance_admin'::employee_role
    )
  ) OR public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Recreate employees policies without recursive references
DROP POLICY IF EXISTS "Employee managers can view their team" ON public.employees;
DROP POLICY IF EXISTS "Employees can view their own record" ON public.employees;
DROP POLICY IF EXISTS "HR admins can manage all employees" ON public.employees;

-- Employees can view their own record
CREATE POLICY "Employees can view their own record"
ON public.employees
FOR SELECT
USING (email = public.get_current_user_email());

-- Managers can view their team by manager_id
CREATE POLICY "Employee managers can view their team"
ON public.employees
FOR SELECT
USING (manager_id = public.get_current_employee_id());

-- HR admins and super admins can manage all
CREATE POLICY "HR admins can manage all employees"
ON public.employees
FOR ALL
USING (public.is_hr_admin())
WITH CHECK (public.is_hr_admin());