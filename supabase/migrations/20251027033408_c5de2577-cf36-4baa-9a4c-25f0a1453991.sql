-- Approve ALL pending properties (including the one just posted)
UPDATE public.properties
SET status = 'approved', updated_at = now()
WHERE status = 'pending';

UPDATE public.property_submissions  
SET status = 'approved', updated_at = now()
WHERE status = 'pending';

-- Show count of approved properties
SELECT 
  'Properties' as table_name,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count
FROM public.properties
UNION ALL
SELECT 
  'Submissions' as table_name,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count
FROM public.property_submissions;