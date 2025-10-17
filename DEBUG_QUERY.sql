-- ========================================
-- DEBUG QUERY: Check if the fix was applied
-- ========================================
-- Run these queries one by one to diagnose the issue

-- Step 1: Check if the function exists and has the LOWER() fix
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'get_contacted_properties_with_owners'
AND routine_schema = 'public';

-- Look for "LOWER(l.interested_user_email)" in the output above
-- If you don't see LOWER() in the WHERE clause, the migration wasn't applied

-- ========================================

-- Step 2: Check what email is stored in your recent lead
-- Replace 'your@email.com' with your actual login email
SELECT 
  id,
  property_id,
  interested_user_name,
  interested_user_email,
  created_at,
  message
FROM public.leads 
WHERE interested_user_email ILIKE '%ronit%'  -- Adjust to your email pattern
ORDER BY created_at DESC 
LIMIT 5;

-- Note the exact email stored in interested_user_email

-- ========================================

-- Step 3: Check your auth email
SELECT 
  id,
  email,
  created_at
FROM auth.users
WHERE email ILIKE '%ronit%';  -- Adjust to your email pattern

-- Compare this email with the one from Step 2

-- ========================================

-- Step 4: Test the function directly with your email
-- Replace 'ronit.test001@outlook.com' with your actual auth email
SELECT * FROM get_contacted_properties_with_owners('ronit.test001@outlook.com');

-- This should return all properties you've contacted

-- ========================================

-- Step 5: Check if the commercial property lead exists
SELECT 
  l.id,
  l.property_id,
  l.interested_user_email,
  l.created_at,
  p.title,
  p.property_type,
  p.listing_type
FROM public.leads l
LEFT JOIN public.properties p ON l.property_id = p.id
WHERE l.interested_user_email ILIKE '%ronit%'
  AND p.property_type = 'commercial'
ORDER BY l.created_at DESC
LIMIT 3;

-- This should show your recent commercial property contact

