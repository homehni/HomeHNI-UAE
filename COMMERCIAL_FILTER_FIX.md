# Commercial Property Type Filter Fix

## 🐛 Issue Identified

The commercial property type filters (OFFICE, CO-WORKING, RETAIL, RESTAURANT, WAREHOUSE, SHOWROOM, INDUSTRIAL) were not in sync with the actual filtering logic.

### Root Cause

In `src/hooks/useSimplifiedSearch.ts`, the commercial tab filter (lines 347-362) was **missing several property types** that were available in the UI:

**Missing from filter logic:**
- ❌ 'retail'
- ❌ 'restaurant' 
- ❌ 'coworking' / 'co-working'
- ❌ 'industrial'

**Only checking for:**
- ✅ 'commercial'
- ✅ 'office'
- ✅ 'shop'
- ✅ 'warehouse'
- ✅ 'showroom'

### Impact

Users selecting **RETAIL**, **RESTAURANT**, **CO-WORKING**, or **INDUSTRIAL** filters would see **zero results** even if matching properties existed in the database, because the tab-level filter was excluding them before the property type filter could run.

## ✅ Fix Applied

Updated the commercial tab filter in `useSimplifiedSearch.ts`:

```typescript
} else if (activeTab === 'commercial') {
  // For commercial tab, show commercial properties
  filtered = filtered.filter(property => {
    const listingType = property.listingType?.toLowerCase();
    const propertyType = property.propertyType.toLowerCase();
    const isMatch = listingType === 'commercial' ||
           propertyType.includes('commercial') ||
           propertyType.includes('office') ||
           propertyType.includes('shop') ||
           propertyType.includes('retail') ||           // ✅ ADDED
           propertyType.includes('warehouse') ||
           propertyType.includes('showroom') ||
           propertyType.includes('restaurant') ||       // ✅ ADDED
           propertyType.includes('coworking') ||        // ✅ ADDED
           propertyType.includes('co-working') ||       // ✅ ADDED
           propertyType.includes('industrial');         // ✅ ADDED
    if (!isMatch) {
      console.log('❌ Filtered out for commercial:', property.title, 'listing_type:', listingType, 'property_type:', propertyType);
    }
    return isMatch;
  });
}
```

## 🔍 Filter Logic Overview

The property filtering happens in **two stages**:

### Stage 1: Tab-Level Filter (FIXED)
Filters properties based on the active tab (rent/buy/commercial).
- **Location**: `useSimplifiedSearch.ts` lines 323-362
- **Purpose**: Show only relevant properties for the tab
- **Commercial Tab**: Now includes all commercial property types

### Stage 2: Property Type Filter (Already Working)
Filters based on user-selected property types (OFFICE, RETAIL, etc.).
- **Location**: `useSimplifiedSearch.ts` lines 367-446
- **Purpose**: Further refine by specific property types
- **Status**: Was already working correctly

## 🎯 Result

Now all commercial property type filters work correctly:

| Filter | Status | Matches |
|--------|--------|---------|
| OFFICE | ✅ Working | Properties with 'office' in type |
| RETAIL | ✅ **FIXED** | Properties with 'retail' in type |
| WAREHOUSE | ✅ Working | Properties with 'warehouse' in type |
| SHOWROOM | ✅ Working | Properties with 'showroom' in type |
| RESTAURANT | ✅ **FIXED** | Properties with 'restaurant' in type |
| CO-WORKING | ✅ **FIXED** | Properties with 'coworking' or 'co-working' in type |
| INDUSTRIAL | ✅ **FIXED** | Properties with 'industrial' in type |

## 🧪 Testing

To verify the fix works:

1. Navigate to **Commercial** tab
2. Select **RETAIL** filter
   - Should show properties with property_type containing 'retail'
3. Select **RESTAURANT** filter
   - Should show properties with property_type containing 'restaurant'
4. Select **CO-WORKING** filter
   - Should show properties with property_type containing 'coworking' or 'co-working'
5. Select **INDUSTRIAL** filter
   - Should show properties with property_type containing 'industrial'

## 📋 Related Files

- `src/hooks/useSimplifiedSearch.ts` - Main filtering logic (FIXED)
- `src/pages/PropertySearch.tsx` - UI property type options (Already correct)
- `src/services/propertyTypeService.ts` - Property type matching service (Already correct)

## 🔄 Future Improvement

Consider using the `propertyTypeService.ts` for tab-level filtering to maintain a **single source of truth**:

```typescript
import { getPropertyTypesForTab } from '@/services/propertyTypeService';

// In useSimplifiedSearch.ts
const commercialTypes = getPropertyTypesForTab('commercial');
// Use this to build the tab filter dynamically
```

This would prevent future sync issues between UI and filtering logic.
