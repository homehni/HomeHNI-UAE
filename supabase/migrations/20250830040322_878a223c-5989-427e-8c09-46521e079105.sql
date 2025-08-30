-- Create employee management system

-- Employee roles enum
CREATE TYPE employee_role AS ENUM ('hr_admin', 'finance_admin', 'content_manager', 'blog_manager', 'employee_manager', 'employee');

-- Employee status enum  
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'pending_approval', 'terminated');

-- Transaction types enum
CREATE TYPE transaction_type AS ENUM ('salary', 'bonus', 'reimbursement', 'penalty', 'advance');

-- Payout status enum
CREATE TYPE payout_status AS ENUM ('pending', 'approved', 'rejected', 'paid');

-- Employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE NOT NULL, -- Custom employee ID like EMP001
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  role employee_role NOT NULL DEFAULT 'employee',
  join_date DATE NOT NULL,
  status employee_status NOT NULL DEFAULT 'pending_approval',
  salary DECIMAL(10,2),
  manager_id UUID REFERENCES public.employees(id),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Employee transactions table (salary, bonuses, etc.)
CREATE TABLE public.employee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_number TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Employee payouts table (approval workflow)
CREATE TABLE public.employee_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.employee_transactions(id),
  payout_type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status payout_status NOT NULL DEFAULT 'pending',
  requested_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  rejected_by UUID REFERENCES auth.users(id),
  stripe_payment_intent_id TEXT,
  rejection_reason TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table
CREATE POLICY "HR admins can manage all employees" ON public.employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.user_roles ur ON e.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      WHERE ur.user_id = auth.uid() AND ur.role::text = 'admin' 
    )
    OR
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
      AND e.role = 'hr_admin'
    )
  );

CREATE POLICY "Employees can view their own record" ON public.employees
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Employee managers can view their team" ON public.employees
  FOR SELECT USING (
    manager_id = (
      SELECT id FROM public.employees 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies for employee_transactions table  
CREATE POLICY "HR and Finance admins can manage all transactions" ON public.employee_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
      AND e.role IN ('hr_admin', 'finance_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role::text = 'admin'
    )
  );

CREATE POLICY "Employees can view their own transactions" ON public.employee_transactions
  FOR SELECT USING (
    employee_id = (
      SELECT id FROM public.employees 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies for employee_payouts table
CREATE POLICY "Finance admins can manage all payouts" ON public.employee_payouts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
      AND e.role = 'finance_admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role::text = 'admin'
    )
  );

CREATE POLICY "HR admins can create and view payouts" ON public.employee_payouts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
      AND e.role = 'hr_admin'
    )
  );

CREATE POLICY "HR admins can create payouts" ON public.employee_payouts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
      AND e.role = 'hr_admin'
    )
  );

CREATE POLICY "Employees can view their own payout requests" ON public.employee_payouts
  FOR SELECT USING (
    employee_id = (
      SELECT id FROM public.employees 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate employee ID
CREATE OR REPLACE FUNCTION generate_employee_id()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
  new_id TEXT;
BEGIN
  -- Get the next number in sequence
  SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id FROM 4) AS INTEGER)), 0) + 1 
  INTO next_num
  FROM public.employees
  WHERE employee_id ~ '^EMP[0-9]+$';
  
  -- Generate new employee ID
  new_id := 'EMP' || LPAD(next_num::TEXT, 3, '0');
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.employees WHERE employee_id = new_id) LOOP
    next_num := next_num + 1;
    new_id := 'EMP' || LPAD(next_num::TEXT, 3, '0');
  END LOOP;
  
  NEW.employee_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_employee_id_trigger
  BEFORE INSERT ON public.employees
  FOR EACH ROW
  WHEN (NEW.employee_id IS NULL OR NEW.employee_id = '')
  EXECUTE FUNCTION generate_employee_id();