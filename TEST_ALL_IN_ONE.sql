-- ========================================
-- ALL-IN-ONE DEBUG SCRIPT
-- ========================================
-- Run this entire script in Supabase SQL Editor
-- It will show you exactly what's wrong
-- ========================================

-- TEST 1: Check if SQL function has LOWER() fix
-- ========================================
SELECT '=== TEST 1: Function Definition ===' as test;
SELECT 
  CASE 
    WHEN routine_definition LIKE '%LOWER(l.interested_user_email)%' THEN '✅ SQL FIX APPLIED - Function has LOWER()'
    ELSE '❌ SQL FIX NOT APPLIED - Run FINAL_CONTACTED_OWNERS_FIX.sql!'
  END as result
FROM information_schema.routines 
WHERE routine_name = 'get_contacted_properties_with_owners';

-- TEST 2: Your Auth Emails
-- ========================================
SELECT '=== TEST 2: Your Auth Emails ===' as test;
SELECT 
  email as "Your Auth Email",
  id as "User ID",
  created_at as "Account Created"
FROM auth.users 
WHERE email ILIKE '%ronit%' OR email ILIKE '%test%'
ORDER BY created_at DESC
LIMIT 5;

-- TEST 3: Recent Leads (All Users)
-- ========================================
SELECT '=== TEST 3: Recent Leads ===' as test;
SELECT 
  interested_user_email as "Email in Leads",
  interested_user_name as "Name",
  property_id as "Property ID",
  created_at as "Contact Date",
  CASE 
    WHEN interested_user_email IN (SELECT email FROM auth.users) THEN '✅ Matches auth user'
    ELSE '⚠️  No matching auth user'
  END as "Email Match Status"
FROM public.leads 
ORDER BY created_at DESC
LIMIT 10;

-- TEST 4: Properties You Contacted (Status Check)
-- ========================================
SELECT '=== TEST 4: Properties & Their Status ===' as test;
SELECT 
  p.title as "Property Title",
  p.status as "Status",
  p.is_visible as "Visible",
  l.interested_user_email as "Your Email",
  l.created_at as "Contacted On",
  CASE 
    WHEN p.status = 'approved' AND p.is_visible = true THEN '✅ Should show'
    WHEN p.status != 'approved' THEN '❌ NOT APPROVED'
    WHEN p.is_visible = false THEN '❌ NOT VISIBLE'
    ELSE '⚠️  Check status'
  END as "Display Status"
FROM public.properties p
INNER JOIN public.leads l ON l.property_id = p.id
WHERE l.interested_user_email ILIKE '%ronit%' OR l.interested_user_email ILIKE '%test%'
ORDER BY l.created_at DESC
LIMIT 10;

-- TEST 5: Test RPC Function (All Possible Emails)
-- ========================================
SELECT '=== TEST 5: RPC Function Test ===' as test;

-- Try with each email found in leads
WITH user_emails AS (
  SELECT DISTINCT interested_user_email 
  FROM public.leads 
  WHERE interested_user_email ILIKE '%ronit%' OR interested_user_email ILIKE '%test%'
  LIMIT 5
)
SELECT 
  ue.interested_user_email as "Testing Email",
  COUNT(result.*) as "Properties Found",
  CASE 
    WHEN COUNT(result.*) > 0 THEN '✅ RPC Returns Results'
    ELSE '❌ RPC Returns Empty'
  END as "RPC Status"
FROM user_emails ue
LEFT JOIN LATERAL get_contacted_properties_with_owners(ue.interested_user_email) as result ON true
GROUP BY ue.interested_user_email;

-- TEST 6: Email Case Comparison Test
-- ========================================
SELECT '=== TEST 6: Email Case Sensitivity Test ===' as test;
SELECT 
  l.interested_user_email as "Email in Leads (stored)",
  au.email as "Email in Auth (original)",
  CASE 
    WHEN l.interested_user_email = au.email THEN '✅ Exact match'
    WHEN LOWER(l.interested_user_email) = LOWER(au.email) THEN '⚠️  Case mismatch (LOWER() needed)'
    ELSE '❌ Different emails'
  END as "Match Status"
FROM public.leads l
LEFT JOIN auth.users au ON LOWER(l.interested_user_email) = LOWER(au.email)
WHERE l.interested_user_email ILIKE '%ronit%' OR l.interested_user_email ILIKE '%test%'
LIMIT 10;

-- SUMMARY & RECOMMENDATIONS
-- ========================================
SELECT '=== SUMMARY ===' as test;
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_name = 'get_contacted_properties_with_owners' 
      AND routine_definition LIKE '%LOWER(l.interested_user_email)%'
    ) THEN '✅'
    ELSE '❌'
  END as "SQL Fix Applied",
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.leads 
      WHERE created_at > NOW() - INTERVAL '1 day'
    ) THEN '✅ ' || (
      SELECT COUNT(*)::text || ' leads in last 24h'
      FROM public.leads 
      WHERE created_at > NOW() - INTERVAL '1 day'
    )
    ELSE '⚠️  No recent leads'
  END as "Recent Activity",
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.properties p
      INNER JOIN public.leads l ON l.property_id = p.id
      WHERE p.status = 'approved' AND p.is_visible = true
    ) THEN '✅ ' || (
      SELECT COUNT(*)::text || ' approved properties'
      FROM public.properties p
      INNER JOIN public.leads l ON l.property_id = p.id
      WHERE p.status = 'approved' AND p.is_visible = true
    )
    ELSE '❌ No approved properties with leads'
  END as "Approved Properties";

-- ========================================
-- INTERPRETATION GUIDE
-- ========================================
/*

TEST 1: Function Definition
  ✅ Should say "SQL FIX APPLIED"
  ❌ If not, run FINAL_CONTACTED_OWNERS_FIX.sql

TEST 2: Your Auth Emails
  - Copy your exact email from this list
  - Use it in Test 5

TEST 3: Recent Leads
  - Should show your recent contacts
  - Check if "Email Match Status" is ✅
  - Email should match one from Test 2

TEST 4: Properties & Status
  - All should say "✅ Should show"
  - If "❌ NOT APPROVED", admin needs to approve
  - If "❌ NOT VISIBLE", property is hidden

TEST 5: RPC Function Test
  - Should say "✅ RPC Returns Results"
  - Number should match leads count
  - If "❌ RPC Returns Empty", SQL fix not applied

TEST 6: Email Case Test
  - Should say "✅ Exact match" OR "⚠️ Case mismatch"
  - If case mismatch, LOWER() fix is essential
  - If "❌ Different emails", wrong account

SUMMARY:
  - All should be ✅ green checkmarks
  - If any ❌, follow the fix instructions above

*/

