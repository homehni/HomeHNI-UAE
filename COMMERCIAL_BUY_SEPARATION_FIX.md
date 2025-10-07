# Prevent commercial listings from appearing in Buy tab

Issue: A commercial listing (e.g., "Commercial Co-working Space For Sale") was shown in both Buy and Commercial search results.

Root cause: The Buy tab filter only restricted by listing_type (sale/resale) and excluded land/plot, but did not exclude commercial property types. As a result, commercial-for-sale items leaked into the Buy tab.

Change: Updated `src/hooks/useSimplifiedSearch.ts` Buy branch to explicitly exclude commercial types:
- commercial
- office
- shop
- retail
- warehouse
- showroom
- restaurant
- coworking / co-working
- industrial

Impact: Commercial properties (sale or rent) now show only under the Commercial tab, not in Buy.

Files touched:
- src/hooks/useSimplifiedSearch.ts (Buy tab filter extended to exclude commercial types)

How to verify:
1. Start the app and open the Search page.
2. Locate a known commercial listing (e.g., Commercial Co-working Space).
3. Confirm:
   - Buy tab: the listing does NOT appear
   - Commercial tab: the listing DOES appear

Notes:
- If your dataset uses different labels for commercial types, add them to the exclusion list in the Buy filter for consistency.
