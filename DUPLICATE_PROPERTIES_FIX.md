# Duplicate Properties Fix

## Problem Overview
After an administrator approves a property submission, duplicate property listings appear in the system. Specifically, industrial land properties are being duplicated with slightly different titles (e.g., "Industrial Land For SALE" vs. "Industrial Land For Sale").

## Root Cause
The issue was identified in the `AdminProperties.tsx` file's approval process:

1. The code was generating hardcoded property titles for land properties with inconsistent casing:
   ```typescript
   const listingTypeMap: { [key: string]: string } = {
     'Industrial land': 'Industrial Land For SALE',  // Note the all-caps "SALE"
     'Agricultural Land': 'Agricultural Land For SALE',
     'Commercial land': 'Commercial Land For SALE'
   };
   ```

2. When a user submitted a property with a title like "Industrial Land For Sale" (lowercase "sale"), the approval process would create a new entry with the title "Industrial Land For SALE" (uppercase "SALE").

3. This resulted in two nearly identical properties in the database with different title casing, causing duplicates in all listings.

## Fix Implemented

1. **Standardized Title Casing**:
   - Modified the title generation to use consistent casing based on the listing type
   - Used a dynamic approach to set "Sale" or "Rent" with proper casing
   ```typescript
   const saleText = mappedListingType.toLowerCase() === 'sale' ? 'Sale' : 'Rent';
   
   const listingTypeMap: { [key: string]: string } = {
     'Industrial land': `Industrial Land For ${saleText}`,
     'Agricultural Land': `Agricultural Land For ${saleText}`,
     'Commercial land': `Commercial Land For ${saleText}`
   };
   ```

2. **Added Title Reuse**:
   - The system now first checks for an existing title in the submission
   - If a title already exists, it's reused rather than generating a new one
   ```typescript
   if (submission.title) {
     console.log('Using existing submission title:', submission.title);
     return submission.title;
   }
   ```

3. **Added Debug Logging**:
   - Added console logs to help track the title generation process
   - Shows when existing titles are used vs. when new titles are generated

## Next Steps

1. **Clean Existing Duplicates**:
   - Run a database query to identify duplicate properties with similar titles
   - Merge or remove duplicate entries, keeping the most complete information
   - Example SQL to find duplicates:
   ```sql
   SELECT locality, COUNT(*) as count
   FROM properties
   GROUP BY locality, LOWER(REPLACE(title, 'SALE', 'Sale'))
   HAVING COUNT(*) > 1;
   ```

2. **Additional Safeguards**:
   - Consider adding a uniqueness check before insertion
   - Create a database constraint on (title, locality) combinations
   - Implement more robust property matching during submission

## Testing Procedure
After deploying this fix:
1. Submit a new Industrial Land property
2. Have an administrator approve it
3. Verify only one entry appears in the property listings
4. Edit the property and have it approved again
5. Verify no duplicates are created