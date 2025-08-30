-- Add user_id column to employees table to link with auth.users
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);