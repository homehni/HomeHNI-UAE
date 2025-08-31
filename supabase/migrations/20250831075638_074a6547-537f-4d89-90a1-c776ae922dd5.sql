-- Allow Content Managers to edit content via RLS
-- 1) Helper function to detect content managers using employees table (like existing is_hr_admin/is_finance_admin)
CREATE OR REPLACE FUNCTION public.is_content_manager()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND e.role = 'content_manager'::employee_role
        AND e.status = 'active'::employee_status
    )
  ) OR public.has_role(auth.uid(), 'admin'::app_role);
$function$;

-- 2) RLS policies for content_elements to allow content managers to manage content
DROP POLICY IF EXISTS "Content managers can manage content elements" ON public.content_elements;
CREATE POLICY "Content managers can manage content elements"
ON public.content_elements
FOR ALL
USING (public.is_content_manager())
WITH CHECK (public.is_content_manager());

-- Note: existing policies remain (Admins can manage all content elements, Public can view active content elements)
-- This policy simply adds Content Manager capability alongside Admins.
