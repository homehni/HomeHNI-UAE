-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these queries to check the current state

-- 1. Check if auto-approve setting is enabled
SELECT key, value, value::boolean as boolean_value 
FROM public.app_settings 
WHERE key = 'auto_approve_properties';

-- 2. Check current status of all properties
SELECT 
  status,
  COUNT(*) as count
FROM public.properties 
GROUP BY status
ORDER BY status;

-- 3. Check current status of all submissions
SELECT 
  status,
  COUNT(*) as count
FROM public.property_submissions 
GROUP BY status
ORDER BY status;

-- 4. Check recent properties (last 5)
SELECT 
  id,
  title,
  status as property_status,
  created_at
FROM public.properties 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Check recent submissions (last 5)
SELECT 
  id,
  title,
  status as submission_status,
  created_at
FROM public.property_submissions 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. Check if "Agricultural Land For Sale" exists and its status
SELECT 
  id,
  title,
  status,
  created_at
FROM public.properties 
WHERE title ILIKE '%Agricultural Land%'
ORDER BY created_at DESC;

-- 7. Check if "Agricultural Land For Sale" exists in submissions
SELECT 
  id,
  title,
  status,
  created_at
FROM public.property_submissions 
WHERE title ILIKE '%Agricultural Land%'
ORDER BY created_at DESC;
