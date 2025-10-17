# Debugging: "Owners You Contacted" Not Showing New Property

## Issue
After applying the fix, new contacts still aren't appearing in the "Owners You Contacted" tab.

## Debugging Steps

### Step 1: Check if SQL Migration Was Applied

**Did you run the SQL script?**
- [ ] Yes, I ran `FINAL_CONTACTED_OWNERS_FIX.sql` in Supabase SQL Editor
- [ ] No, I haven't run it yet

If you **haven't run it yet**, that's the issue! The database still has the old function with the bug.

**To apply the fix:**
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy ALL contents from `FINAL_CONTACTED_OWNERS_FIX.sql`
4. Paste into SQL Editor
5. Click **"Run"**

### Step 2: Verify the Fix Was Applied

Run this query in **Supabase SQL Editor**:
```sql
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'get_contacted_properties_with_owners';
```

**Look for this in the output:**
```sql
WHERE LOWER(l.interested_user_email) = LOWER(p_user_email)
```

- ✅ If you see `LOWER()` → Fix is applied correctly
- ❌ If you don't see `LOWER()` → Fix was NOT applied, run the SQL again

### Step 3: Check Browser Console

1. Open browser DevTools (Press **F12**)
2. Go to **Console** tab
3. Look for these messages when you refresh the page:

**Expected messages:**
```
Dashboard: Fetching contacted properties
leadService: Fetching contacted properties for email: ronit.test001@outlook.com
leadService: Fetched contacted properties from RPC: [...]
```

**If you see errors:**
- Screenshot the error messages
- Look for any red text in console

### Step 4: Check if Lead Was Created

Run this in **Supabase SQL Editor** (replace with your email):
```sql
SELECT 
  l.id,
  l.property_id,
  l.interested_user_email,
  l.created_at,
  p.title,
  p.property_type
FROM public.leads l
LEFT JOIN public.properties p ON l.property_id = p.id
WHERE l.interested_user_email ILIKE '%ronit%'
ORDER BY l.created_at DESC
LIMIT 5;
```

**Check:**
- Do you see the commercial property you just contacted?
- What is the `created_at` timestamp?
- What is the exact `interested_user_email`?

### Step 5: Test the Function Manually

Run this in **Supabase SQL Editor** (replace with YOUR exact auth email):
```sql
SELECT * FROM get_contacted_properties_with_owners('ronit.test001@outlook.com');
```

**Expected result:**
- Should return all properties you've contacted, including the new one

**If no results:**
- Try with lowercase: `SELECT * FROM get_contacted_properties_with_owners('ronit.test001@outlook.com');`
- Check your exact auth email in Supabase Dashboard → Authentication → Users

### Step 6: Check Property Status

The property must be **approved** and **visible** to show up:
```sql
SELECT 
  id,
  title,
  status,
  is_visible,
  property_type
FROM public.properties
WHERE property_type = 'commercial'
  AND title ILIKE '%retail%'  -- Adjust to match your property
ORDER BY created_at DESC
LIMIT 3;
```

**Requirements:**
- `status` must be `'approved'`
- `is_visible` must be `true`

If either is wrong, the property won't appear even if the lead exists.

## Quick Fix Checklist

If the new property still doesn't show:

1. **Hard refresh the page**: Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. **Clear browser cache**: Clear site data for homehni.com
3. **Try incognito/private window**: Open a new private window and login again
4. **Check network tab**: Open DevTools → Network → Look for `get_contacted_properties_with_owners` call

## Common Issues

### Issue 1: SQL Not Applied
**Symptom**: Function still has old code without `LOWER()`  
**Fix**: Run `FINAL_CONTACTED_OWNERS_FIX.sql` in Supabase SQL Editor

### Issue 2: Browser Cache
**Symptom**: Old JavaScript is still running  
**Fix**: Hard refresh (Ctrl+Shift+R) or clear cache

### Issue 3: Email Mismatch
**Symptom**: Auth email doesn't match lead email  
**Fix**: Check both emails are identical (after normalizing to lowercase)

### Issue 4: Property Not Approved
**Symptom**: Lead exists but property doesn't show  
**Fix**: Admin must approve the property first

### Issue 5: Event Not Firing
**Symptom**: No console messages about "Contact created event received"  
**Fix**: Check if `ContactOwnerModal.tsx` changes were saved and deployed

## Need More Help?

Run ALL queries in `DEBUG_QUERY.sql` and share the results:
1. Copy contents of `DEBUG_QUERY.sql`
2. Run in Supabase SQL Editor
3. Take screenshots of each result
4. Share the output

This will help identify exactly where the issue is!

