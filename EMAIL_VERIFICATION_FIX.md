# 🔧 Fixing Email Verification Error

## 🚨 The Problem
Email verification is failing with "Server error" even though:
- ✅ User is created in database
- ✅ Edge functions are deployed

## ✅ Solution: Set Edge Function Environment Variables

The `confirm-user` edge function needs environment variables to work. Here's how to fix it:

### Step 1: Go to Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: `smyojibmvrhfbwodvobw`
3. Click **Edge Functions** in the left sidebar

### Step 2: Set Environment Variables for `confirm-user`

1. Find the **`confirm-user`** function in the list
2. Click on it to open function details
3. Go to **Settings** tab (or look for **Environment Variables**)
4. Add these environment variables:

   **Variable 1:**
   - **Name**: `SUPABASE_URL`
   - **Value**: `https://smyojibmvrhfbwodvobw.supabase.co`

   **Variable 2:**
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNteW9qaWJtdnJoZmJ3b2R2b2J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU5MTc4OCwiZXhwIjoyMDc4MTY3Nzg4fQ.ZvjtOZYjfdH1e6TaogX7FWAKVvh-BLyUE3RzdzC--uw`

5. **Save** the environment variables

### Step 3: Verify Function is Deployed

1. Make sure the `confirm-user` function shows as **"Active"** or **"Deployed"**
2. If it's not deployed, you may need to deploy it

### Step 4: Test Again

1. **Wait 30 seconds** for environment variables to take effect
2. Try the email verification link again
3. Check browser console for any new error messages

## 🔍 Debugging: Check Function Logs

If it still doesn't work:

1. In Supabase Dashboard → **Edge Functions** → **`confirm-user`**
2. Click on **Logs** tab
3. Try the verification again
4. Check the logs for error messages

Common errors you might see:
- `Missing required env vars` → Environment variables not set
- `Failed to lookup user` → User not found (check email matches)
- `Failed to confirm user` → Permission issue with service role key

## 🆘 Alternative: Use Supabase Auth Directly

If the edge function continues to have issues, you can use Supabase's built-in email verification:

The user can verify their email through the link sent by Supabase, or you can use the Supabase client directly to confirm users.

## ✅ Quick Checklist

- [ ] `SUPABASE_URL` environment variable is set in `confirm-user` function
- [ ] `SUPABASE_SERVICE_ROLE_KEY` environment variable is set in `confirm-user` function
- [ ] Function is deployed and active
- [ ] Waited 30 seconds after setting variables
- [ ] Checked function logs for specific errors

---

**Most likely fix**: The environment variables aren't set in the edge function. Set them in Supabase Dashboard → Edge Functions → confirm-user → Settings.
