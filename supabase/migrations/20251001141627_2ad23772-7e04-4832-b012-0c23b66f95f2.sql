-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT token_not_expired CHECK (expires_at > created_at)
);

-- Create index for faster token lookups
CREATE INDEX idx_verification_tokens_token ON public.email_verification_tokens(token);
CREATE INDEX idx_verification_tokens_user_id ON public.email_verification_tokens(user_id);

-- Enable RLS
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only view their own tokens
CREATE POLICY "Users can view own tokens"
  ON public.email_verification_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- Function to generate verification token
CREATE OR REPLACE FUNCTION public.generate_verification_token(p_user_id UUID, p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_token TEXT;
BEGIN
  -- Generate a secure random token
  v_token := encode(gen_random_bytes(32), 'base64');
  v_token := replace(replace(replace(v_token, '+', '-'), '/', '_'), '=', '');
  
  -- Insert token (expires in 24 hours)
  INSERT INTO public.email_verification_tokens (user_id, email, token, expires_at)
  VALUES (p_user_id, p_email, v_token, now() + interval '24 hours');
  
  RETURN v_token;
END;
$$;

-- Function to verify token
CREATE OR REPLACE FUNCTION public.verify_email_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_token_record RECORD;
  v_result JSONB;
BEGIN
  -- Find valid token
  SELECT * INTO v_token_record
  FROM public.email_verification_tokens
  WHERE token = p_token
    AND verified_at IS NULL
    AND expires_at > now()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired token'
    );
  END IF;
  
  -- Mark token as verified
  UPDATE public.email_verification_tokens
  SET verified_at = now()
  WHERE token = p_token;
  
  -- Update user email confirmation in auth.users (requires service role)
  -- This will be done in the edge function
  
  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_token_record.user_id,
    'email', v_token_record.email
  );
END;
$$;