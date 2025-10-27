-- Enable auto-approve for all property submissions
-- This will auto-approve properties for authenticated and unauthenticated users

-- 1. Enable auto-approve setting
INSERT INTO public.app_settings (key, value, description)
VALUES ('auto_approve_properties', 'true', 'Automatically approve all property submissions')
ON CONFLICT (key) 
DO UPDATE SET value = 'true', updated_at = now();

-- 2. Approve ALL existing pending properties
UPDATE public.properties
SET status = 'approved', updated_at = now()
WHERE status IN ('pending', 'new');

-- 3. Approve ALL existing pending property submissions
UPDATE public.property_submissions
SET status = 'approved', updated_at = now()
WHERE status IN ('pending', 'new');

-- 4. Verify the changes
SELECT 
  'Properties' as table_name,
  status,
  COUNT(*) as count
FROM public.properties
GROUP BY status
UNION ALL
SELECT 
  'Submissions' as table_name,
  status,
  COUNT(*) as count
FROM public.property_submissions
GROUP BY status
ORDER BY table_name, status;