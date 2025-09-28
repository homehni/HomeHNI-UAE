-- Enable RLS on email_templates table for security compliance
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for email_templates - only admins can manage email templates
CREATE POLICY "Admin access to email templates"
ON public.email_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));