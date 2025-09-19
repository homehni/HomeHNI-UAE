-- Check current auth settings and create trigger to auto-confirm emails
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger AS $$
BEGIN
  -- Update the user to be confirmed immediately
  UPDATE auth.users 
  SET email_confirmed_at = now(), 
      confirmed_at = now() 
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-confirm new signups
DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_signup();