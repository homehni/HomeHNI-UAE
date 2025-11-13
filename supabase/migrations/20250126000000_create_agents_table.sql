-- Create agents table for independent agent verification and details
CREATE TABLE IF NOT EXISTS public.agents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  previous_work text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  rera_number text,
  verification_documents jsonb, -- Store document URLs and metadata
  documents jsonb, -- Store additional documents/IDs
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on agents table
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for agents
CREATE POLICY "Users can view their own agent profile"
ON public.agents
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent profile"
ON public.agents
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent profile"
ON public.agents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all agent profiles"
ON public.agents
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all agent profiles"
ON public.agents
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);

-- Create index on verification_status for filtering
CREATE INDEX IF NOT EXISTS idx_agents_verification_status ON public.agents(verification_status);

-- Add updated_at trigger for agents
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

