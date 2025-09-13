-- Fix employee financial data security by adding proper authentication checks to RLS policies

-- First, drop existing policies for employee_payouts
DROP POLICY IF EXISTS "Employees can view their own payout requests" ON public.employee_payouts;
DROP POLICY IF EXISTS "Finance admins can manage all payouts" ON public.employee_payouts;
DROP POLICY IF EXISTS "HR admins can create payouts" ON public.employee_payouts;
DROP POLICY IF EXISTS "HR admins can view payouts" ON public.employee_payouts;

-- First, drop existing policies for employee_transactions  
DROP POLICY IF EXISTS "Employees can view their own transactions" ON public.employee_transactions;
DROP POLICY IF EXISTS "HR and Finance admins can manage all transactions" ON public.employee_transactions;

-- Create secure policies for employee_payouts with proper authentication checks
CREATE POLICY "Authenticated employees can view their own payout requests" 
ON public.employee_payouts 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  employee_id = get_current_employee_id()
);

CREATE POLICY "Authenticated finance admins can manage all payouts" 
ON public.employee_payouts 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  (is_finance_admin() OR has_current_user_role('admin'::app_role))
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (is_finance_admin() OR has_current_user_role('admin'::app_role))
);

CREATE POLICY "Authenticated HR admins can create and view payouts" 
ON public.employee_payouts 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  is_hr_admin()
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  is_hr_admin()
);

-- Create secure policies for employee_transactions with proper authentication checks
CREATE POLICY "Authenticated employees can view their own transactions" 
ON public.employee_transactions 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  employee_id = get_current_employee_id()
);

CREATE POLICY "Authenticated HR and Finance admins can manage all transactions" 
ON public.employee_transactions 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  (is_hr_admin() OR is_finance_admin() OR has_current_user_role('admin'::app_role))
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (is_hr_admin() OR is_finance_admin() OR has_current_user_role('admin'::app_role))
);

-- Add restrictive policies to ensure no access for unauthenticated users
CREATE POLICY "Block all unauthenticated access to payouts" 
ON public.employee_payouts 
AS RESTRICTIVE 
FOR ALL 
TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block all unauthenticated access to transactions" 
ON public.employee_transactions 
AS RESTRICTIVE 
FOR ALL 
TO public
USING (auth.uid() IS NOT NULL);