-- Create a function to get user profiles for admins
CREATE OR REPLACE FUNCTION public.get_user_profiles()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamp with time zone,
  raw_user_meta_data jsonb
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data
  FROM auth.users
  WHERE auth.uid() IN (
    SELECT user_id 
    FROM public.user_roles 
    WHERE role = 'admin'
  );
$$;