-- Fix sign-up failure: stop updating auth.users.confirmed_at/email_confirmed_at from public function
-- Reason: Supabase restricts direct updates to auth.users special columns. Existing trigger calling
-- public.handle_new_user_signup causes 500 errors during admin.createUser with message:
-- "column \"confirmed_at\" can only be updated to DEFAULT (SQLSTATE 428C9)"

-- Safest fix: make the function a no-op so any existing trigger will not attempt restricted updates.
-- We avoid altering Supabase-reserved auth schema directly.

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Do not modify auth.users protected columns. Simply return NEW.
  RETURN NEW;
END;
$$;
