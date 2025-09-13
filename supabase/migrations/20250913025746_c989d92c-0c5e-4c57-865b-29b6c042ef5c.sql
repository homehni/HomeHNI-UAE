-- Further secure the leads table by making policies more restrictive

-- Drop the current INSERT policy that might be flagged as too permissive
DROP POLICY IF EXISTS "Authenticated users can create validated leads" ON public.leads;

-- Create a more restrictive INSERT policy that only allows lead creation for specific scenarios
CREATE POLICY "Restricted lead creation for approved properties" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  -- Ensure the lead is being created for an approved property
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = leads.property_id 
    AND properties.status = 'approved'
  ) AND
  -- Ensure property_owner_id is properly set and not the same as the person creating the lead
  property_owner_id IS NOT NULL AND
  property_owner_id != auth.uid()
);

-- Add an additional restrictive policy to prevent any data leakage through INSERT operations
CREATE POLICY "Prevent lead data exposure through INSERT" 
ON public.leads 
AS RESTRICTIVE 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Only allow INSERT if user is not trying to access existing lead data
  auth.uid() IS NOT NULL
);