-- Update RLS for employee_transactions to remove auth.users references and use helper functions
-- And allow finance admins to view employees for joins

-- 1) Fix employee_transactions policies
DROP POLICY IF EXISTS "Employees can view their own transactions" ON public.employee_transactions;
DROP POLICY IF EXISTS "HR and Finance admins can manage all transactions" ON public.employee_transactions;

CREATE POLICY "Employees can view their own transactions"
ON public.employee_transactions
FOR SELECT
USING (
  employee_id = public.get_current_employee_id()
);

CREATE POLICY "HR and Finance admins can manage all transactions"
ON public.employee_transactions
FOR ALL
USING (
  public.is_hr_admin() OR public.is_finance_admin() OR public.has_current_user_role('admin'::app_role)
)
WITH CHECK (
  public.is_hr_admin() OR public.is_finance_admin() OR public.has_current_user_role('admin'::app_role)
);

-- 2) Allow finance admins to view all employees (for UI joins)
DROP POLICY IF EXISTS "Finance admins can view all employees" ON public.employees;
CREATE POLICY "Finance admins can view all employees"
ON public.employees
FOR SELECT
USING (
  public.is_finance_admin() OR public.has_current_user_role('admin'::app_role)
);
