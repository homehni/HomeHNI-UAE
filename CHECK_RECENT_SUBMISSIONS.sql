-- Check recent property submissions and their status
SELECT 
  id,
  title,
  status as submission_status,
  created_at,
  user_id
FROM public.property_submissions 
ORDER BY created_at DESC 
LIMIT 5;

-- Check corresponding properties table entries
SELECT 
  id,
  title,
  status as property_status,
  created_at,
  user_id
FROM public.properties 
ORDER BY created_at DESC 
LIMIT 5;
