# Syntax Error Fix: "Illegal return statement"

## 🐛 Error You Saw
```
Uncaught SyntaxError: Illegal return statement (at dashboard?tab=interested:74)
```

## 🔍 Root Cause
The `fetchContactedOwnersData` function was defined **after** the useEffect hooks that were trying to call it. This created a scoping issue where:

1. useEffect at line 203 called `fetchContactedOwnersData()` ✅
2. useEffect at line 259 (realtime subscription) called `fetchContactedOwnersData()` ❌ (not defined yet)
3. Function was defined at line 270

JavaScript was confused about the function scope and threw a syntax error.

## ✅ Fix Applied

### Changed:
1. **Moved** `fetchContactedOwnersData` function **before** all useEffect hooks
2. **Wrapped** it in `useCallback` to memoize and prevent unnecessary re-renders
3. **Added** proper dependencies to useEffect hooks
4. **Imported** `useCallback` from React

### Code Changes:

**Before** (Lines 200-291):
```typescript
const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

useEffect(() => {
  // ... calls fetchContactedOwnersData()
}, [user]);

useEffect(() => {
  // ... calls fetchContactedOwnersData()
}, [user?.id]);

useEffect(() => {
  // ... calls fetchContactedOwnersData()
}, [user?.email]);

const fetchContactedOwnersData = async () => {
  // Function defined HERE (too late!)
};
```

**After**:
```typescript
const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

// Function defined FIRST using useCallback
const fetchContactedOwnersData = useCallback(async () => {
  if (!user) return;
  // ... function body
}, [user]);

useEffect(() => {
  // ... calls fetchContactedOwnersData() ✅
}, [user]);

useEffect(() => {
  // ... calls fetchContactedOwnersData() ✅
}, [fetchContactedOwnersData]);

useEffect(() => {
  // ... calls fetchContactedOwnersData() ✅
}, [user?.email, fetchContactedOwnersData]);
```

## 📋 Files Modified

| File | Change |
|------|--------|
| `src/pages/Dashboard.tsx` | Added `useCallback` import |
| `src/pages/Dashboard.tsx` | Moved `fetchContactedOwnersData` before useEffect hooks |
| `src/pages/Dashboard.tsx` | Wrapped function in `useCallback` |
| `src/pages/Dashboard.tsx` | Updated dependency arrays |

## 🧪 Testing

### Step 1: Check Error is Gone
1. Open your app: `http://localhost:5173/dashboard?tab=interested`
2. Open Console (F12)
3. ✅ Should **NOT** see "Illegal return statement" error anymore

### Step 2: Test Real-Time Updates
1. Keep Dashboard open at `/dashboard?tab=interested`
2. Open browser console (F12)
3. You should see:
   ```
   Dashboard: Fetching properties where user has contacted owners
   Dashboard: Fetched contacted properties: [...]
   ```
4. In a NEW tab, go to a property and click "Contact"
5. Submit the form
6. Switch back to Dashboard tab
7. You should see in console:
   ```
   ContactOwnerModal: Dispatching contactCreated event for property: abc-123
   Dashboard: Contact created event received: {propertyId: "abc-123", ...}
   Dashboard: Refreshing contacted properties after new contact
   Dashboard: Fetching properties where user has contacted owners
   Dashboard: Fetched contacted properties: [...]
   Dashboard: Contacted properties refreshed, count: 2
   ```

## ⚠️ IMPORTANT: Don't Forget the Database Fix!

This fix only resolves the **syntax error**. You still need to apply the **database fix** for the real-time updates to work:

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy contents of **`FINAL_CONTACTED_OWNERS_FIX.sql`**
3. Paste and click **"Run"**

Without the database fix, the event system will work but won't find the new contacts due to the case-sensitivity bug!

## 🎯 Expected Behavior After Both Fixes

1. ✅ No syntax errors in console
2. ✅ Dashboard loads without errors
3. ✅ Event system works (see console logs)
4. ✅ New contacts appear within 2-3 seconds (after DB fix)

## 📝 Summary

**Problem**: Function was defined after it was being called → Syntax error  
**Solution**: Move function before useEffect hooks + wrap in useCallback  
**Result**: Clean code execution + proper React memoization  

Now the event listener and realtime subscription can both call `fetchContactedOwnersData()` without errors! 🎉

