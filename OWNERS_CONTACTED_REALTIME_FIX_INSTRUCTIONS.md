# Fix: "Owners You Contacted" Not Updating in Real-Time

## 🐛 The Problem
The "Owners You Contacted" tab was not showing new contacts without a manual page refresh because of a **case-sensitivity bug** in the email matching query.

### Root Cause
- When creating a lead, the email is stored as **lowercase**: `lower(trim(p_user_email))`
- But the query was comparing emails **case-sensitively**: `WHERE l.interested_user_email = p_user_email`
- Example: If your auth email is `Ron.Test@Outlook.com`, but the lead stores it as `ron.test@outlook.com`, the query wouldn't match!

## ✅ The Solution

### 1. Database Fix (Required)
Run the SQL script to fix the case-sensitivity issue:

**Option A: Run the comprehensive script**
```bash
# Open Supabase Dashboard → SQL Editor
# Copy and paste the contents of: FINAL_CONTACTED_OWNERS_FIX.sql
# Click "Run"
```

**Option B: Run just the migration file**
```bash
# In Supabase SQL Editor, run:
supabase/migrations/20251016100000_add_get_contacted_properties_with_owners.sql
```

### 2. Frontend Updates (Already Applied)
The following code changes have been made:

#### `src/pages/Dashboard.tsx`
- Increased refresh delay from 1s to 2s for more reliable DB sync
- Event listener for `contactCreated` custom event

#### `src/components/ContactOwnerModal.tsx`
- Dispatches `contactCreated` event after successful lead creation
- Event includes property ID and timestamp

## 🧪 How to Test

### Step 1: Apply the Database Fix
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `FINAL_CONTACTED_OWNERS_FIX.sql`
4. Paste and click **Run**
5. You should see: ✅ "Success. No rows returned"

### Step 2: Test Real-Time Updates
1. **Open Dashboard**: Navigate to `/dashboard?tab=interested` (Owners You Contacted tab)
2. **Open New Tab**: In a NEW browser tab, go to any property details page
3. **Submit Contact**: Click "Contact" button and fill out the form
4. **Wait 2-3 seconds**
5. **Check Dashboard**: Switch back to the Dashboard tab
6. **✅ Expected Result**: The property should appear automatically!

### Step 3: Verify Email Matching
Run this query in Supabase SQL Editor to verify the fix:
```sql
-- Replace with your actual email
SELECT * FROM get_contacted_properties_with_owners('Your.Email@Example.com');
```

It should now return results regardless of email case!

## 📋 What Changed

### Database Changes
| File | Change | Why |
|------|--------|-----|
| `20251016100000_add_get_contacted_properties_with_owners.sql` | Changed `WHERE l.interested_user_email = p_user_email` to `WHERE LOWER(l.interested_user_email) = LOWER(p_user_email)` | Case-insensitive email matching |
| `FIX_DUPLICATES_SQL.sql` | Same LOWER() fix in CTE | Consistency across all scripts |

### Frontend Changes
| File | Change | Why |
|------|--------|-----|
| `src/pages/Dashboard.tsx` | Increased timeout from 1000ms to 2000ms | Give more time for DB write to complete |
| `src/components/ContactOwnerModal.tsx` | Already dispatching `contactCreated` event | Trigger refresh on new contact |

## 🔍 Debugging

If it still doesn't work after applying the fix:

### Check 1: Verify the Function Updated
```sql
-- Run in Supabase SQL Editor
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'get_contacted_properties_with_owners';
```
Look for `LOWER(l.interested_user_email)` in the output.

### Check 2: Check Browser Console
Open browser DevTools (F12) → Console tab, you should see:
```
Dashboard: Contact created event received: {propertyId: "...", timestamp: ...}
Dashboard: Refreshing contacted properties after new contact
leadService: Fetching contacted properties for email: your@email.com
```

### Check 3: Verify Lead Was Created
```sql
SELECT * FROM leads 
WHERE interested_user_email = 'your@email.com' 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check 4: Check Email Case in Database
```sql
-- See what emails are stored in leads
SELECT DISTINCT interested_user_email FROM leads LIMIT 10;

-- Check your auth email
SELECT email FROM auth.users WHERE id = 'your-user-id';
```

## 🎯 Expected Behavior After Fix

1. ✅ Email matching is **case-insensitive**
2. ✅ No duplicate properties shown (uses `DISTINCT ON`)
3. ✅ Shows only the most recent contact per property
4. ✅ Real-time update within 2-3 seconds after contact
5. ✅ Owner details display correctly (name, email, phone)

## 📝 Summary

The issue was a simple but critical bug: **case-sensitive email comparison**. By converting both sides to lowercase in the SQL query, the matching now works regardless of email capitalization. Combined with the existing event-driven refresh mechanism, the "Owners You Contacted" tab now updates automatically when you contact a new owner!

