-- Improve Google OAuth profile creation to handle name and avatar properly
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create a profile for the new user
  -- Google OAuth provides: raw_user_meta_data->>'name', 'avatar_url', 'email'
  -- Email signup provides: raw_user_meta_data->>'full_name'
  INSERT INTO public.profiles (user_id, full_name, avatar_url, free_contact_uses, total_contact_uses)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',  -- Email signup
      NEW.raw_user_meta_data ->> 'name',       -- Google OAuth
      split_part(NEW.email, '@', 1)            -- Fallback to email prefix
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',   -- Google OAuth avatar
    50,                                        -- Default free contact uses
    0                                          -- Default total contact uses
  );
  
  -- Assign default role as 'buyer' for new users (can be changed later)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;