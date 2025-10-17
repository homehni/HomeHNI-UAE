# How to Apply the Database Migration

## Issue
The "Owners You Contacted" feature requires a new database function (`get_contacted_properties_with_owners`) that hasn't been applied to the production Supabase database yet.

## Current Status
- ✅ Migration file created: `supabase/migrations/20251016100000_add_get_contacted_properties_with_owners.sql`
- ✅ Fallback code implemented: The app will work even without the migration, but with reduced performance
- ⚠️ Migration not yet applied to production database

## Solution 1: Apply Migration via Supabase Dashboard (Recommended)

### Steps:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/geenmplkdgmlovvgwzai

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Create New Query**
   - Click "+ New query"

4. **Copy Migration SQL**
   - Open the file: `supabase/migrations/20251016100000_add_get_contacted_properties_with_owners.sql`
   - Copy the entire contents

5. **Paste and Execute**
   - Paste the SQL into the editor
   - Click "Run" button
   - Verify success message appears

6. **Verify Function Created**
   - Run this query to verify:
   ```sql
   SELECT proname 
   FROM pg_proc 
   WHERE proname = 'get_contacted_properties_with_owners';
   ```
   - Should return 1 row

## Solution 2: Use Supabase CLI

### Steps:

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Link to Project**
   ```bash
   supabase link --project-ref geenmplkdgmlovvgwzai
   ```

3. **Apply Migration**
   ```bash
   supabase db push
   ```

4. **Verify**
   ```bash
   supabase db diff
   ```

## What Happens Without the Migration?

The app will still work, but:
- **Performance**: Multiple database queries instead of one optimized query
- **Efficiency**: Each property requires 2 separate RPC calls (property details + owner contact)
- **Speed**: Slower loading time for the "Owners You Contacted" tab

## What Happens After Applying the Migration?

- ✅ **Single Query**: All data fetched in one optimized database call
- ✅ **Faster Loading**: Significantly improved performance
- ✅ **Better UX**: Instant display of contacted properties with owner details
- ✅ **Reduced API Calls**: Lower database load and API usage

## Migration Content

The migration creates a secure PostgreSQL function that:
- Joins `leads`, `properties`, and `profiles` tables
- Returns property details with owner contact information
- Filters by user's email to show only their contacted properties
- Uses `SECURITY DEFINER` to bypass RLS while maintaining security
- Orders results by contact date (newest first)

## Testing After Migration

1. **Login to your account**
2. **Navigate to**: `/dashboard?tab=interested`
3. **Verify**:
   - Properties load without errors
   - Owner names are displayed
   - Owner emails are shown
   - Owner phone numbers appear (if available)
   - Contact dates are visible
   - Loading is fast (< 1 second)

## Rollback (If Needed)

If you need to remove the function:

```sql
DROP FUNCTION IF EXISTS public.get_contacted_properties_with_owners(text);
```

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify your database permissions
3. Ensure you're connected to the correct project
4. Review the console logs for detailed error messages

