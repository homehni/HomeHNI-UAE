-- Add RLS policy to allow users to view their own submissions
CREATE POLICY "Users can view their own submissions" 
ON public.property_submissions 
FOR SELECT 
USING (user_id = auth.uid());