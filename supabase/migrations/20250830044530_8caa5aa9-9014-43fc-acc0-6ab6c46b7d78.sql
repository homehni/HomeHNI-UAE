-- Fix RLS policies on employee_payouts to avoid referencing auth.users directly
-- and rely on security definer helper functions instead

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Employees can view their own payout requests" ON public.employee_payouts;
DROP POLICY IF EXISTS "Finance admins can manage all payouts" ON public.employee_payouts;
DROP POLICY IF EXISTS "HR admins can create and view payouts" ON public.employee_payouts;
DROP POLICY IF EXISTS "HR admins can create payouts" ON public.employee_payouts;

-- Recreate policies using helper functions
-- 1) Employees can view their own payout requests
CREATE POLICY "Employees can view their own payout requests"
ON public.employee_payouts
FOR SELECT
USING (
  employee_id = public.get_current_employee_id()
);

-- 2) Finance admins can manage all payouts (ALL operations)
CREATE POLICY "Finance admins can manage all payouts"
ON public.employee_payouts
FOR ALL
USING (
  public.is_finance_admin() OR public.has_current_user_role('admin'::app_role)
)
WITH CHECK (
  public.is_finance_admin() OR public.has_current_user_role('admin'::app_role)
);

-- 3) HR admins can view payouts
CREATE POLICY "HR admins can view payouts"
ON public.employee_payouts
FOR SELECT
USING (
  public.is_hr_admin()
);

-- 4) HR admins can create payouts
CREATE POLICY "HR admins can create payouts"
ON public.employee_payouts
FOR INSERT
WITH CHECK (
  public.is_hr_admin()
);
