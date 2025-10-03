-- Add RLS policy to allow public read access to approved and visible properties
CREATE POLICY "Public can view approved and visible properties"
ON public.properties
FOR SELECT
TO anon, authenticated
USING (status = 'approved' AND is_visible = true);