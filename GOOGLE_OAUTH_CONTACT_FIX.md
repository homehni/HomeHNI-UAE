# Google OAuth "Contact Limit Reached" Fix

## 🚨 **Problem Identified**

Google OAuth users were getting "Contact limit reached" errors because:

1. **Missing Contact Uses**: The database trigger `handle_new_user_profile()` wasn't setting `free_contact_uses` for new users
2. **NULL Values**: Google OAuth users had `free_contact_uses = NULL` in their profiles
3. **Contact Check Failed**: The `can_contact_owner()` function returns `FALSE` when `free_contact_uses` is `NULL`
4. **Feature Broken**: Contact functionality didn't work for Google OAuth users

## ✅ **Solution Implemented**

### **1. Fixed Database Trigger**
**File**: `supabase/migrations/20251001124945_c6c0b0be-3d66-41bd-b9be-26f130764d11.sql`

**Before:**
```sql
INSERT INTO public.profiles (user_id, full_name, avatar_url)
VALUES (
  NEW.id, 
  COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',  -- Email signup
    NEW.raw_user_meta_data ->> 'name',       -- Google OAuth
    split_part(NEW.email, '@', 1)            -- Fallback to email prefix
  ),
  NEW.raw_user_meta_data ->> 'avatar_url'    -- Google OAuth avatar
);
```

**After:**
```sql
INSERT INTO public.profiles (user_id, full_name, avatar_url, free_contact_uses, total_contact_uses)
VALUES (
  NEW.id, 
  COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',  -- Email signup
    NEW.raw_user_meta_data ->> 'name',       -- Google OAuth
    split_part(NEW.email, '@', 1)            -- Fallback to email prefix
  ),
  NEW.raw_user_meta_data ->> 'avatar_url',   -- Google OAuth avatar
  50,                                        -- Default free contact uses
  0                                          -- Default total contact uses
);
```

### **2. Fixed Existing Users**
**File**: `supabase/migrations/20250120000000_fix_google_oauth_contact_uses.sql`

```sql
-- Update profiles where free_contact_uses is NULL (Google OAuth users)
UPDATE public.profiles 
SET 
  free_contact_uses = 50,
  total_contact_uses = COALESCE(total_contact_uses, 0)
WHERE free_contact_uses IS NULL;
```

## 🔄 **How Contact Limits Work**

### **Contact Usage Check:**
```typescript
// In contactUsageService.ts
const { data, error } = await supabase
  .rpc('can_contact_owner', { user_uuid: user.id });
```

### **Database Function:**
```sql
-- In can_contact_owner function
SELECT free_contact_uses INTO remaining_uses
FROM public.profiles
WHERE user_id = user_uuid;

-- If profile doesn't exist or uses is null, return false
IF remaining_uses IS NULL THEN
    RETURN FALSE;
END IF;

RETURN remaining_uses > 0;
```

## 🎯 **What This Fixes**

### **Before Fix:**
- ❌ **Google OAuth users**: `free_contact_uses = NULL` → Contact blocked
- ❌ **Email signup users**: `free_contact_uses = 50` → Contact works
- ❌ **Inconsistent behavior**: Different signup methods had different limits

### **After Fix:**
- ✅ **Google OAuth users**: `free_contact_uses = 50` → Contact works
- ✅ **Email signup users**: `free_contact_uses = 50` → Contact works
- ✅ **Consistent behavior**: All users get same contact limits

## 🚀 **Deployment Steps**

### **1. Apply Database Migrations**
```bash
# Apply the trigger fix
supabase db push

# Or run migrations manually
supabase migration up
```

### **2. Verify the Fix**
```sql
-- Check that all users have contact uses set
SELECT 
  COUNT(*) as total_users,
  COUNT(free_contact_uses) as users_with_contact_uses,
  COUNT(*) - COUNT(free_contact_uses) as users_without_contact_uses
FROM public.profiles;
```

### **3. Test Contact Functionality**
1. **Sign up with Google OAuth** → Should get 50 free contacts
2. **Click "Contact" on property** → Should open contact modal
3. **Submit contact form** → Should work without "Contact limit reached" error

## 🧪 **Testing**

### **Test Google OAuth Signup:**
1. **Sign up with Google** → New user created
2. **Check profile** → `free_contact_uses = 50`
3. **Try to contact** → Should work normally

### **Test Existing Google OAuth Users:**
1. **Login with existing Google account** → Profile updated
2. **Check contact functionality** → Should now work
3. **Verify contact uses** → Should show 50 remaining

## 📊 **Expected Results**

- ✅ **New Google OAuth users**: Get 50 free contacts immediately
- ✅ **Existing Google OAuth users**: Get 50 free contacts after migration
- ✅ **Contact functionality**: Works for all users regardless of signup method
- ✅ **Consistent experience**: Same contact limits for all users

## 🎉 **Summary**

The "Contact limit reached" issue for Google OAuth users is now fixed! The problem was that the database trigger wasn't setting contact usage limits for new users, causing the contact functionality to fail. Now all users, regardless of how they signed up, will have proper contact limits and the contact feature will work as expected.
