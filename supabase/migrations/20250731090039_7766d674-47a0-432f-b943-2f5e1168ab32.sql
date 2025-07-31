-- Add admin access policy for property_drafts table
CREATE POLICY "Admins can view all drafts" 
ON public.property_drafts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));