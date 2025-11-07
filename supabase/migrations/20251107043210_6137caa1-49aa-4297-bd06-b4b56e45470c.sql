-- Enable RLS on post_requirement table
ALTER TABLE public.post_requirement ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert post requirement records (public form submission)
CREATE POLICY "Anyone can submit post requirements"
ON public.post_requirement
FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated admins to view all post requirements
CREATE POLICY "Admins can view all post requirements"
ON public.post_requirement
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);