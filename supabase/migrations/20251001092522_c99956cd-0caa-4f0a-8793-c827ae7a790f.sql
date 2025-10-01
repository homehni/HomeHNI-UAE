-- Create helper to check if an auth user exists by email
CREATE OR REPLACE FUNCTION public.does_auth_user_exist(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE lower(email) = lower(_email)
  );
$$;