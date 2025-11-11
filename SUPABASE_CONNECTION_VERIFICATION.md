# 🔗 Supabase Connection Verification Guide

This guide helps you verify that your project repository is properly connected to your Supabase project using the online dashboard.

## ✅ Step 1: Verify Project Configuration in Supabase Dashboard

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `smyojibmvrhfbwodvobw`
3. **Go to Settings → API**:
   - Verify the **Project URL** matches: `https://smyojibmvrhfbwodvobw.supabase.co`
   - Verify the **anon/public key** matches the one in `src/integrations/supabase/client.ts`
   - Copy the **service_role key** (you'll need this for edge functions)

## ✅ Step 2: Verify Database Connection

### Test 1: Check Database Access
1. In Supabase Dashboard, go to **SQL Editor**
2. Run this simple query:
   ```sql
   SELECT current_database(), version();
   ```
3. ✅ **Expected**: Should return database name and PostgreSQL version
4. ❌ **If error**: Database connection issue

### Test 2: Check if Tables Exist
Run this query to see your database structure:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
✅ **Expected**: Should show tables like `properties`, `leads`, `users`, etc.

## ✅ Step 3: Verify API Keys Match

### Check in Your Code:
- **File**: `HomeHNI-UAE/src/integrations/supabase/client.ts`
- **URL**: Should be `https://smyojibmvrhfbwodvobw.supabase.co`
- **Anon Key**: Should match the anon/public key from Supabase Dashboard → Settings → API

### Verify Keys Match:
1. Supabase Dashboard → **Settings → API**
2. Compare:
   - **Project URL** with `SUPABASE_URL` in `client.ts`
   - **anon public** key with `SUPABASE_PUBLISHABLE_KEY` in `client.ts`

## ✅ Step 4: Test Authentication Connection

### Test in Browser Console:
1. **Start your app** (if not running):
   ```bash
   npm run dev
   ```
2. **Open browser** and go to your app
3. **Open Developer Console** (F12)
4. **Run this test**:
   ```javascript
   // Import supabase client (or use window if available)
   import { supabase } from '@/integrations/supabase/client';
   
   // Test connection
   supabase.auth.getSession().then(({ data, error }) => {
     console.log('Connection test:', error ? '❌ Failed' : '✅ Success');
     console.log('Session:', data);
   });
   ```

### Or Test Directly:
1. Go to your app's **login/signup page**
2. Try to **sign up** with a test email
3. ✅ **Expected**: Should create user in Supabase Dashboard → Authentication → Users
4. ❌ **If error**: Check browser console for connection errors

## ✅ Step 5: Verify Edge Functions Environment Variables

1. **Supabase Dashboard → Edge Functions**
2. **Check Environment Variables** for each function:
   - `SUPABASE_URL` = `https://smyojibmvrhfbwodvobw.supabase.co`
   - `SUPABASE_ANON_KEY` = (your anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)

### Functions to Check:
- `confirm-user`
- `create-user`
- `assign-user-role`
- `send-lead-notification`
- `employee-invite`
- `employee-payout`
- `search-listings`
- `create-property-owner-conversation`
- `update-auth-phone`
- `delete-employee`

## ✅ Step 6: Test Database Queries from Your App

### Test Query from Browser Console:
1. **Open your app** in browser
2. **Open Developer Console** (F12)
3. **Run this test**:
   ```javascript
   // Test a simple query
   const { data, error } = await supabase
     .from('properties')
     .select('id, title')
     .limit(5);
   
   if (error) {
     console.error('❌ Query failed:', error);
   } else {
     console.log('✅ Query successful:', data);
   }
   ```

✅ **Expected**: Should return property data or empty array (if no properties)
❌ **If error**: Check:
- RLS (Row Level Security) policies
- Table permissions
- API key permissions

## ✅ Step 7: Verify Storage Buckets (if using)

1. **Supabase Dashboard → Storage**
2. **Check buckets exist**:
   - `property-media` (for property images)
   - `developer-media` (for developer videos)
   - Any other buckets your app uses

3. **Verify bucket policies** are set correctly

## ✅ Step 8: Check Row Level Security (RLS)

1. **Supabase Dashboard → Authentication → Policies**
2. **Verify RLS is enabled** on tables:
   - `properties`
   - `leads`
   - `users`
   - Other sensitive tables

3. **Check policies** allow appropriate access

## ✅ Step 9: Test Real-time Subscriptions (if using)

If your app uses real-time features:
1. **Supabase Dashboard → Database → Replication**
2. **Enable replication** for tables that need real-time updates
3. **Test in your app** - changes should appear in real-time

## ✅ Step 10: Verify Project ID in Config

**File**: `HomeHNI-UAE/supabase/config.toml`
- **project_id** should be: `smyojibmvrhfbwodvobw`

## 🧪 Quick Connection Test Script

Run this in your browser console (on your app):

```javascript
async function testSupabaseConnection() {
  const { supabase } = await import('/src/integrations/supabase/client.ts');
  
  console.log('🧪 Testing Supabase Connection...');
  
  // Test 1: Auth
  const { data: session, error: authError } = await supabase.auth.getSession();
  console.log('1. Auth:', authError ? '❌' : '✅', authError?.message || 'Connected');
  
  // Test 2: Database
  const { data: dbData, error: dbError } = await supabase
    .from('properties')
    .select('count')
    .limit(1);
  console.log('2. Database:', dbError ? '❌' : '✅', dbError?.message || 'Connected');
  
  // Test 3: Storage
  const { data: storageData, error: storageError } = await supabase
    .storage
    .from('property-media')
    .list('', { limit: 1 });
  console.log('3. Storage:', storageError ? '❌' : '✅', storageError?.message || 'Connected');
  
  return { session, dbData, storageData };
}

testSupabaseConnection();
```

## 🐛 Troubleshooting

### Problem: "Invalid API key" error
**Solution**: 
- Verify the anon key in `client.ts` matches Supabase Dashboard → Settings → API → anon public key
- Make sure there are no extra spaces or characters

### Problem: "Failed to fetch" error
**Solution**:
- Check if Supabase URL is correct: `https://smyojibmvrhfbwodvobw.supabase.co`
- Verify CORS settings in Supabase Dashboard → Settings → API
- Check browser console for network errors

### Problem: "Row Level Security policy violation"
**Solution**:
- Go to Supabase Dashboard → Authentication → Policies
- Check if RLS policies allow the operation you're trying to perform
- Verify user is authenticated if required

### Problem: Edge functions not working
**Solution**:
- Verify environment variables are set in Supabase Dashboard → Edge Functions
- Check function logs in Supabase Dashboard → Edge Functions → Logs
- Verify service role key is set correctly

## ✅ Connection Checklist

- [ ] Project URL matches in `client.ts` and Supabase Dashboard
- [ ] Anon key matches in `client.ts` and Supabase Dashboard
- [ ] Service role key is set in edge function environment variables
- [ ] Database is accessible (can run queries)
- [ ] Authentication works (can sign up/login)
- [ ] Database queries work from the app
- [ ] Storage buckets exist and are accessible
- [ ] Edge functions have correct environment variables
- [ ] RLS policies are configured correctly
- [ ] Project ID in `config.toml` matches Supabase project

## 📝 Next Steps After Verification

1. **Run database migrations** (if needed):
   - Copy SQL from migration files
   - Run in Supabase Dashboard → SQL Editor

2. **Set up edge function environment variables**:
   - Go to each edge function
   - Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

3. **Configure RLS policies** (if not already done)

4. **Test your app** end-to-end to ensure everything works

---

**Your current configuration:**
- **Project ID**: `smyojibmvrhfbwodvobw`
- **URL**: `https://smyojibmvrhfbwodvobw.supabase.co`
- **Config file**: `HomeHNI-UAE/src/integrations/supabase/client.ts`

