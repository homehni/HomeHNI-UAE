-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;

-- Update properties table to add admin-specific fields
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS admin_reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS admin_reviewed_at TIMESTAMP WITH TIME ZONE;

-- Update status to support admin workflow - first add new columns then migrate data
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS new_status TEXT DEFAULT 'pending';

-- Migrate existing status data
UPDATE public.properties 
SET new_status = CASE 
  WHEN status = 'active' THEN 'active'
  ELSE 'pending'
END;

-- Drop old status column and rename new one
ALTER TABLE public.properties DROP COLUMN status;
ALTER TABLE public.properties RENAME COLUMN new_status TO status;

-- Add check constraint for status values
ALTER TABLE public.properties 
ADD CONSTRAINT status_check 
CHECK (status IN ('pending', 'active', 'approved', 'rejected', 'deleted'));

-- Create admin policies for properties
CREATE POLICY "Admins can view all properties" 
ON public.properties 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all properties" 
ON public.properties 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all properties" 
ON public.properties 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));