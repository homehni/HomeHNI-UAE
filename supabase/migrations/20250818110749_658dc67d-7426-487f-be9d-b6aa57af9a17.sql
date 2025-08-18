-- Extend the app_role enum to include buyer and seller
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'buyer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'seller';

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  bio text,
  location jsonb, -- {city, state, country}
  preferences jsonb, -- User preferences like search criteria, communication preferences
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  verification_documents jsonb, -- Store document info for verification
  whatsapp_opted_in boolean DEFAULT false,
  email_notifications boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      NEW.email
    )
  );
  
  -- Assign default role as 'buyer' for new users (can be changed later)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile and assign role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Add updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get user profile with role
CREATE OR REPLACE FUNCTION public.get_user_profile_with_role(_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  id uuid,
  user_id uuid,
  full_name text,
  phone text,
  avatar_url text,
  bio text,
  location jsonb,
  preferences jsonb,
  verification_status text,
  whatsapp_opted_in boolean,
  email_notifications boolean,
  role app_role,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.phone,
    p.avatar_url,
    p.bio,
    p.location,
    p.preferences,
    p.verification_status,
    p.whatsapp_opted_in,
    p.email_notifications,
    ur.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
  WHERE p.user_id = _user_id;
$$;

-- Create function to update user role
CREATE OR REPLACE FUNCTION public.update_user_role(_user_id uuid, _new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is updating their own role or if admin
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized to update user role';
  END IF;
  
  -- Remove existing roles for this user
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  
  -- Insert new role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _new_role);
END;
$$;