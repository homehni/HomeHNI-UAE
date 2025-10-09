# Search Functionality Smoke Test Matrix

## BUY Tab Testing with Merged Commercial & Land Properties

| Test Case | Expected Behavior |
|-----------|------------------|
| 1. Go to homepage, click BUY tab, select "OFFICE" property type | Property filter should show OFFICE option in dropdown; results should only show commercial office properties |
| 2. Go to homepage, click BUY tab, select "AGRICULTURAL LAND" property type | Property filter should show AGRICULTURAL LAND option in dropdown; results should only show agricultural land properties |
| 3. On search results page, verify filters change based on property type | When "APARTMENT" is selected, BHK filter should appear; when "COMMERCIAL LAND" is selected, Land Area filter should appear instead |
| 4. On search results page in BUY tab with MERGE_COMM_LAND_IN_BUY_RENT=true, verify property counts | Total count should include residential + commercial + land properties for sale |
| 5. Using URL parameters: /search?type=buy&propertyTypes=OFFICE,RETAIL | Should show only commercial office and retail properties in BUY tab |
| 6. Using URL parameters: /search?type=buy&propertyTypes=AGRICULTURAL LAND | Should show only agricultural land properties in BUY tab |

## RENT Tab Testing with Merged Commercial Properties

| Test Case | Expected Behavior |
|-----------|------------------|
| 1. Go to homepage, click RENT tab, select "OFFICE" property type | Property filter should show OFFICE option in dropdown; results should only show commercial office rentals |
| 2. On search results page, verify filters change based on property type | When "APARTMENT" is selected, BHK filter should appear; when "OFFICE" is selected, Floor filter should appear instead |
| 3. On search results page in RENT tab with MERGE_COMM_LAND_IN_BUY_RENT=true, verify property counts | Total count should include residential + commercial rental properties |
| 4. Using URL parameters: /search?type=rent&propertyTypes=WAREHOUSE | Should show only warehouse rental properties in RENT tab |

## Legacy Tab Visibility Testing

| Test Case | Expected Behavior |
|-----------|------------------|
| 1. With SHOW_LEGACY_COMMERCIAL_LAND_TABS=true | Commercial and Land/Plot tabs should be visible in both home page and search results |
| 2. Navigate to /search?type=commercial with SHOW_LEGACY_COMMERCIAL_LAND_TABS=true | Should show commercial tab with only commercial properties |
| 3. With SHOW_LEGACY_COMMERCIAL_LAND_TABS=false | Commercial and Land/Plot tabs should NOT be visible in home page or search results |
| 4. Navigate to /search?type=commercial with SHOW_LEGACY_COMMERCIAL_LAND_TABS=false | Should redirect to BUY tab and preserve other search parameters |

## Filter Interaction Testing

| Test Case | Expected Behavior |
|-----------|------------------|
| 1. In BUY tab, select APARTMENT then select BHK types | Results should filter to show only apartments with selected BHK counts |
| 2. In BUY tab, select OFFICE then verify BHK filters | BHK filters should be hidden when commercial property type is selected |
| 3. In BUY tab, select AGRICULTURAL LAND then verify Land Area filter | Land Area filter should appear when land property type is selected |
| 4. In BUY tab, set a budget filter, then switch property types | Budget filter should be preserved and applied appropriately across different property types |
| 5. In RENT tab, select APARTMENT, set a BHK filter, then switch to OFFICE | BHK filter should be cleared or hidden when switching to a commercial property type |

## Mobile View Testing 

| Test Case | Expected Behavior |
|-----------|------------------|
| 1. On mobile view, verify filter chips in BUY tab | Filter chips should update based on selected property type (e.g., BHK chips should not show when commercial property is selected) |
| 2. On mobile view, open filter drawer when AGRICULTURAL LAND is selected | Should show Land Area filter instead of regular Area filter |
| 3. On mobile view with SHOW_LEGACY_COMMERCIAL_LAND_TABS=false | Only BUY and RENT tabs should be visible in the tab list |

## Verification Steps

For each test case:
1. Verify the correct properties appear in the results
2. Verify filter options update correctly based on property type selection
3. Verify property counts match expected totals
4. Verify UI correctly reflects current selection state
5. Verify no console errors or UI glitches occur

## Final Flag Change (Pending Approval)

Once all testing passes successfully:
1. Set `SHOW_LEGACY_COMMERCIAL_LAND_TABS = false` in both SearchSection.tsx and PropertySearch.tsx
2. Run a final verification that the Commercial and Land/Plot tabs are no longer visible
3. Verify that URLs like `/search?type=commercial` redirect properly to the BUY tab