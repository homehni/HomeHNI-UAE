# 🔧 Fixing CORS Errors with Supabase

## 🚨 The Problem
You're seeing CORS errors like:
- `Access to fetch at 'https://smyojibmvrhfbwodvobw.supabase.co/rest/v1/' from origin 'http://localhost:8080' has been blocked by CORS policy`
- `Failed to load resource: net::ERR_FAILED`

## ✅ Solution Steps

### Step 1: Check if Your Supabase Project is Active

**This is the most common cause!**

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `smyojibmvrhfbwodvobw`
3. **Check the project status**:
   - If you see **"Paused"** or **"Inactive"** → Click **"Restore"** or **"Resume"**
   - If you see **"Active"** → Continue to Step 2

**Note**: Free tier projects can be paused after inactivity. You need to restore them.

### Step 2: Verify Project Settings

1. In Supabase Dashboard, go to **Settings → API**
2. Verify:
   - **Project URL**: `https://smyojibmvrhfbwodvobw.supabase.co`
   - **anon public key**: Matches your `client.ts` file
3. Check **Settings → General**:
   - Project status should be **"Active"**
   - No warnings about project being paused

### Step 3: Check Edge Functions

1. Go to **Edge Functions** in Supabase Dashboard
2. Verify your functions are **deployed**:
   - `create-user`
   - `confirm-user`
   - `assign-user-role`
   - etc.
3. **If functions are missing**, you need to deploy them (or they may not be needed yet)

### Step 4: Test After Restoring

After restoring your project:

1. **Wait 1-2 minutes** for the project to fully activate
2. **Refresh your app** (hard refresh: Ctrl+Shift+R)
3. **Try signing up again**

## 🔍 Why This Happens

- **Free tier projects** are automatically paused after 7 days of inactivity
- When paused, the REST API and Edge Functions don't respond properly
- CORS errors appear because the server isn't fully active

## ✅ Quick Checklist

- [ ] Project is **Active** (not Paused) in Supabase Dashboard
- [ ] Project URL matches: `https://smyojibmvrhfbwodvobw.supabase.co`
- [ ] API keys match between dashboard and `client.ts`
- [ ] Waited 1-2 minutes after restoring
- [ ] Hard refreshed the browser (Ctrl+Shift+R)

## 🆘 If Still Not Working

If you've restored the project and still see errors:

1. **Check Supabase Status Page**: https://status.supabase.com
2. **Verify your project region** is accessible
3. **Try a different browser** or **incognito mode**
4. **Check browser console** for more specific error messages

## 📝 Note About Edge Functions

If you're getting CORS errors specifically on edge functions:
- Make sure the functions are **deployed** to your new project
- Edge functions need to be deployed separately for each project
- You may need to deploy them using Supabase CLI or Dashboard

---

**Most likely fix**: Your project is paused. Go to Supabase Dashboard and click "Restore" or "Resume" on your project.




