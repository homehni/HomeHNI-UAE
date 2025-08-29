-- Enable public read access to approved properties
-- Remove the restrictive anonymous access policy and add public read access for approved properties

DROP POLICY IF EXISTS "No anonymous access to properties" ON public.properties;
DROP POLICY IF EXISTS "Strict: Property owners and admins only" ON public.properties;

-- Allow public read access to approved properties
CREATE POLICY "Public can view approved properties" 
ON public.properties 
FOR SELECT 
USING (status = 'approved');

-- Property owners can manage their own properties
CREATE POLICY "Property owners can manage their own properties" 
ON public.properties 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Admins can manage all properties
CREATE POLICY "Admins can manage all properties" 
ON public.properties 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role)) 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));