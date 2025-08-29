-- Fix critical security issue: Property Database Completely Exposed to Public
-- Enable RLS on public_properties table and implement proper access controls

-- First, enable RLS on the public_properties table
ALTER TABLE public.public_properties ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to approved properties only
-- This ensures only approved properties are visible to the public
CREATE POLICY "Public can view approved properties only" 
ON public.public_properties 
FOR SELECT 
USING (status = 'approved');

-- Policy 2: Prevent any public insertions into this table
-- Only the system should be able to populate this table
CREATE POLICY "Only system can insert public properties" 
ON public.public_properties 
FOR INSERT 
WITH CHECK (false); -- This blocks all direct inserts

-- Policy 3: Prevent any public updates
CREATE POLICY "Only system can update public properties" 
ON public.public_properties 
FOR UPDATE 
USING (false); -- This blocks all direct updates

-- Policy 4: Prevent any public deletions
CREATE POLICY "Only system can delete public properties" 
ON public.public_properties 
FOR DELETE 
USING (false); -- This blocks all direct deletions

-- Policy 5: Allow admins to manage all public properties data
CREATE POLICY "Admins can manage all public properties" 
ON public.public_properties 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add a comment to document the security fix
COMMENT ON TABLE public.public_properties IS 'Secure public view of approved property listings. RLS policies ensure only approved properties are visible and prevent unauthorized modifications. Last updated: 2025-01-29 - Security fix applied.';

-- Verify RLS is enabled
DO $$
BEGIN
  IF NOT (SELECT pg_class.relrowsecurity FROM pg_class WHERE relname = 'public_properties') THEN
    RAISE EXCEPTION 'Failed to enable RLS on public_properties table';
  END IF;
  RAISE NOTICE 'RLS successfully enabled on public_properties table';
END $$;