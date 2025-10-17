# Debug Checklist: Leads Saving But Not Showing

## ✅ Confirmed Working
- Leads ARE being saved to the database
- No syntax errors in frontend

## ❌ Issue
- "Owners You Contacted" tab not showing new contacts in real-time
- Manual refresh might/might not show them

---

## 🔍 Step-by-Step Debugging

### Test 1: Did You Run the SQL Fix?

**CRITICAL**: Run this in Supabase SQL Editor:
```sql
-- Check if the function has the LOWER() fix
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'get_contacted_properties_with_owners';
```

**Look for this text in the output:**
```sql
WHERE LOWER(l.interested_user_email) = LOWER(p_user_email)
```

- ✅ Found `LOWER()` = SQL fix is applied
- ❌ No `LOWER()` = **YOU MUST RUN FINAL_CONTACTED_OWNERS_FIX.sql FIRST!**

---

### Test 2: Check Your Exact Auth Email

```sql
-- Find your user ID and email
SELECT id, email, created_at 
FROM auth.users 
WHERE email ILIKE '%your-email-pattern%'
ORDER BY created_at DESC;
```

**Copy the exact email** (e.g., `ronit.test001@outlook.com`)

---

### Test 3: Check What's in the Leads Table

```sql
-- Check recent leads (replace with YOUR email from Test 2)
SELECT 
  id,
  property_id,
  interested_user_email,
  interested_user_name,
  created_at,
  message
FROM public.leads 
WHERE interested_user_email = 'ronit.test001@outlook.com'  -- Use YOUR email
ORDER BY created_at DESC
LIMIT 10;
```

**Important**: 
- Does `interested_user_email` **exactly match** your auth email (after lowercasing)?
- Are the recent leads showing up?

---

### Test 4: Test the RPC Function Manually

```sql
-- Test with YOUR exact email (case doesn't matter if fix is applied)
SELECT * FROM get_contacted_properties_with_owners('ronit.test001@outlook.com');
```

**Expected**: Should return rows with property details

**If no results**, try:
```sql
-- Try with lowercase
SELECT * FROM get_contacted_properties_with_owners('ronit.test001@outlook.com');

-- Try with the exact email from leads table
SELECT * FROM get_contacted_properties_with_owners(
  (SELECT DISTINCT interested_user_email FROM leads LIMIT 1)
);
```

---

### Test 5: Check Property Status

Properties must be **approved** and **visible** to show up:

```sql
-- Check the properties you contacted
SELECT 
  p.id,
  p.title,
  p.status,
  p.is_visible,
  p.property_type,
  l.interested_user_email,
  l.created_at as contact_date
FROM public.properties p
INNER JOIN public.leads l ON l.property_id = p.id
WHERE l.interested_user_email = 'ronit.test001@outlook.com'  -- YOUR email
ORDER BY l.created_at DESC
LIMIT 10;
```

**Check**:
- Is `status` = `'approved'`?
- Is `is_visible` = `true`?

If either is wrong, the property won't show even if lead exists!

---

### Test 6: Browser Console Debugging

1. Open `/dashboard?tab=interested`
2. Open Console (F12)
3. Look for these messages:

**On page load:**
```
Dashboard: Fetching properties where user has contacted owners
leadService: Fetching contacted properties for email: ronit.test001@outlook.com
leadService: Fetched contacted properties from RPC: [...]
Dashboard: Fetched contacted properties: [...]
```

**After contacting a property:**
```
ContactOwnerModal: Dispatching contactCreated event for property: abc-123
Dashboard: Contact created event received: {propertyId: "abc-123", ...}
Dashboard: Refreshing contacted properties after new contact
Dashboard: Fetching properties where user has contacted owners
Dashboard: Contacted properties refreshed, count: 2
```

**If you see errors** (red text), copy them!

---

### Test 7: Check RPC Response in Console

In the browser console, run this:
```javascript
// Get current user email
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user email:', user.email);

// Test the RPC directly
const { data, error } = await supabase.rpc('get_contacted_properties_with_owners', {
  p_user_email: user.email.toLowerCase()
});

console.log('RPC Result:', { data, error });
console.log('Number of properties:', data?.length);
```

**Expected**: `data` should be an array with your contacted properties

---

## 🚨 Common Issues & Fixes

### Issue 1: RPC Function Not Found
**Error**: `"function get_contacted_properties_with_owners does not exist"`  
**Cause**: SQL migration not applied  
**Fix**: Run `FINAL_CONTACTED_OWNERS_FIX.sql` in Supabase SQL Editor

### Issue 2: Empty Array Returned
**Error**: `data: []` (empty)  
**Cause**: Email mismatch OR property not approved  
**Fix**: 
- Check exact email match (Test 2 & 3)
- Check property status (Test 5)
- Verify `LOWER()` is in SQL function (Test 1)

### Issue 3: Property Not Approved
**Error**: Lead exists but property doesn't show  
**Cause**: `status != 'approved'` OR `is_visible = false`  
**Fix**: Admin needs to approve the property first

### Issue 4: Event Not Firing
**Error**: No console messages after contact  
**Cause**: Modal is redirecting before event fires  
**Fix**: Event is dispatched before redirect, check if you're on correct tab

### Issue 5: Case Mismatch
**Error**: Emails don't match due to case  
**Example**: Lead has `ron@test.com` but auth is `Ron@Test.com`  
**Fix**: Ensure SQL function has `LOWER()` comparison (Test 1)

---

## 🔧 Quick Fix SQL (If RPC Test Fails)

If Test 4 returns no results even though leads exist, run this:

```sql
-- Emergency fix: Ensure function has LOWER() comparison
DROP FUNCTION IF EXISTS public.get_contacted_properties_with_owners(text);

CREATE OR REPLACE FUNCTION public.get_contacted_properties_with_owners(p_user_email text)
RETURNS TABLE(
  property_id uuid,
  property_title text,
  property_type text,
  listing_type text,
  expected_price numeric,
  city text,
  locality text,
  state text,
  images text[],
  property_created_at timestamptz,
  owner_name text,
  owner_email text,
  owner_phone text,
  contact_date timestamptz,
  lead_message text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (l.property_id)
    l.property_id,
    p.title AS property_title,
    p.property_type,
    p.listing_type,
    p.expected_price,
    p.city,
    p.locality,
    p.state,
    p.images,
    p.created_at AS property_created_at,
    COALESCE(NULLIF(p.owner_name, ''), NULLIF(prof.full_name, ''), 'Property Owner') AS owner_name,
    COALESCE(NULLIF(p.owner_email, ''), (SELECT email FROM auth.users WHERE id = p.user_id)) AS owner_email,
    COALESCE(NULLIF(p.owner_phone, ''), NULLIF(prof.phone, '')) AS owner_phone,
    l.created_at AS contact_date,
    l.message AS lead_message
  FROM public.leads l
  INNER JOIN public.properties p ON l.property_id = p.id
  LEFT JOIN public.profiles prof ON prof.user_id = p.user_id
  WHERE LOWER(l.interested_user_email) = LOWER(p_user_email)
    AND p.status = 'approved'
    AND p.is_visible = true
  ORDER BY l.property_id, l.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_contacted_properties_with_owners(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_contacted_properties_with_owners(text) TO anon;
```

---

## 📊 What to Share for Help

If still not working, share:

1. **Result of Test 1** (Does function have LOWER()?)
2. **Result of Test 2** (Your exact auth email)
3. **Result of Test 3** (Recent leads with emails)
4. **Result of Test 4** (RPC function test result)
5. **Result of Test 5** (Property status)
6. **Console messages** (Screenshot or copy-paste)
7. **Any error messages** (Red text in console)

---

## ✅ Expected Working State

When everything works:

1. ✅ SQL function has `LOWER()` comparison
2. ✅ RPC test returns array of properties
3. ✅ Console shows "Fetched contacted properties from RPC"
4. ✅ Properties appear in UI within 2-3 seconds after contact
5. ✅ Owner details (name, email, phone) display correctly
6. ✅ No duplicate entries

---

## 🎯 Most Likely Issues (In Order)

1. **SQL fix not applied** (90% of cases) → Run `FINAL_CONTACTED_OWNERS_FIX.sql`
2. **Property not approved** → Admin needs to approve
3. **Email case mismatch** → Fixed by LOWER() in SQL
4. **Browser cache** → Hard refresh (Ctrl+Shift+R)
5. **Wrong user logged in** → Check you're logged in as the one who contacted

Start with Test 1 and work your way down!

