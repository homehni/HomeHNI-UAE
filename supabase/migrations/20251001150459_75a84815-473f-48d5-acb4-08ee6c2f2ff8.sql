-- Enable pgcrypto extension for secure random token generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update the generate_verification_token function to use pgcrypto correctly
CREATE OR REPLACE FUNCTION public.generate_verification_token(p_user_id UUID, p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_token TEXT;
BEGIN
  -- Generate a secure random token using pgcrypto
  v_token := encode(gen_random_bytes(32), 'base64');
  v_token := replace(replace(replace(v_token, '+', '-'), '/', '_'), '=', '');
  
  -- Insert token (expires in 24 hours)
  INSERT INTO public.email_verification_tokens (user_id, email, token, expires_at)
  VALUES (p_user_id, p_email, v_token, now() + interval '24 hours');
  
  RETURN v_token;
END;
$$;