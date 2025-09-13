-- Fix RLS on property_contacts to allow public inserts
-- and keep admin management for read/update/delete

-- Ensure RLS is enabled
ALTER TABLE public.property_contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Admins can manage all property contacts" ON public.property_contacts;
DROP POLICY IF EXISTS "Admins can view all property contacts" ON public.property_contacts;
DROP POLICY IF EXISTS "Anyone can create property contacts" ON public.property_contacts;

-- Public can create property contacts (no auth required)
CREATE POLICY "Public can insert property contacts"
ON public.property_contacts
AS PERMISSIVE
FOR INSERT
WITH CHECK (true);

-- Admins can view
CREATE POLICY "Admins can select property contacts"
ON public.property_contacts
AS PERMISSIVE
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update
CREATE POLICY "Admins can update property contacts"
ON public.property_contacts
AS PERMISSIVE
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete property contacts"
ON public.property_contacts
AS PERMISSIVE
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));