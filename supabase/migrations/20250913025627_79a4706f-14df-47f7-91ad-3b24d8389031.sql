-- Fix customer contact information security in leads table

-- Drop existing policies to rebuild with stronger security
DROP POLICY IF EXISTS "Admins can manage all leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can create leads with validation" ON public.leads;
DROP POLICY IF EXISTS "No anonymous access to leads" ON public.leads;
DROP POLICY IF EXISTS "Property owners can update only their own leads" ON public.leads;
DROP POLICY IF EXISTS "Property owners can view only their own leads" ON public.leads;

-- Create secure policies with explicit authentication checks
-- Admins can manage all leads (view, update, delete)
CREATE POLICY "Authenticated admins can manage all leads" 
ON public.leads 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Property owners can view only their own leads
CREATE POLICY "Authenticated property owners can view their leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  property_owner_id = auth.uid()
);

-- Property owners can update only their own leads
CREATE POLICY "Authenticated property owners can update their leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  property_owner_id = auth.uid()
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  property_owner_id = auth.uid()
);

-- Allow creation of leads for approved properties only
CREATE POLICY "Authenticated users can create validated leads" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = leads.property_id 
    AND properties.status = 'approved'
  )
);

-- Restrictive policy to block all unauthenticated access
CREATE POLICY "Block all unauthenticated access to leads" 
ON public.leads 
AS RESTRICTIVE 
FOR ALL 
TO public
USING (auth.uid() IS NOT NULL);

-- Additional restrictive policy to ensure only authenticated users can access
CREATE POLICY "Enforce authentication for all lead operations" 
ON public.leads 
AS RESTRICTIVE 
FOR ALL 
TO anon, public
USING (false);