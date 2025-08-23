-- Create table for instant property submissions
CREATE TABLE IF NOT EXISTS public.property_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  title TEXT NULL,
  city TEXT NULL,
  state TEXT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can create submissions"
ON public.property_submissions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
ON public.property_submissions
FOR SELECT
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update submissions"
ON public.property_submissions
FOR UPDATE
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete submissions"
ON public.property_submissions
FOR DELETE
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

-- Optional: allow users to view their own submissions (commented out by default)
-- CREATE POLICY "Users can view their own submissions"
-- ON public.property_submissions
-- FOR SELECT
-- TO public
-- USING (user_id IS NOT NULL AND user_id = auth.uid());

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trg_property_submissions_updated_at ON public.property_submissions;
CREATE TRIGGER trg_property_submissions_updated_at
BEFORE UPDATE ON public.property_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function and trigger to set user_id to auth.uid() when available
CREATE OR REPLACE FUNCTION public.set_submission_user_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

DROP TRIGGER IF EXISTS trg_property_submissions_set_user ON public.property_submissions;
CREATE TRIGGER trg_property_submissions_set_user
BEFORE INSERT ON public.property_submissions
FOR EACH ROW
EXECUTE FUNCTION public.set_submission_user_id();

-- Indexes for faster admin listing
CREATE INDEX IF NOT EXISTS idx_property_submissions_created_at ON public.property_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_submissions_status ON public.property_submissions(status);
