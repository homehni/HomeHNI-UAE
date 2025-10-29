-- Create admin user with specified credentials
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  last_sign_in_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'homehni8@gmail.com',
  crypt('HomeHNI@2025', gen_salt('bf')),
  now(),
  now(),
  '',
  '',
  '',
  '',
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  now()
);

-- Insert admin role for the created user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'homehni8@gmail.com';