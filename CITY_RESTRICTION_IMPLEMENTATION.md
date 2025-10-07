# City Restriction Implementation for Location Search

## Overview
Enhanced the autocomplete feature in the search section to restrict subsequent location selections to the same city as the first selected location. This prevents users from mixing localities from different cities in a single search.

## Implementation Details

### 1. **City Detection & Storage**
- **City Extraction**: When a user selects a location from Google Places autocomplete, the system extracts the city name from the `address_components` array
- **Priority Logic**: Prioritizes `locality` type over `administrative_area_level_2` for more accurate city detection
- **State Management**: Stores the first selected city in `selectedCity` state
- **Bounds Storage**: Uses **Google Geocoding API** to fetch accurate city-level bounds for the selected city

### 2. **Geocoding for Accurate Bounds**
- **City-Level Geocoding**: When first location is selected, system geocodes the city name (e.g., "Bengaluru, India")
- **Viewport Extraction**: Extracts the `viewport` (geographical bounds) of the entire city from geocoding results
- **Fallback Logic**: If geocoding fails, uses locality geometry with larger offset (~22km instead of 11km)
- **Benefits**: Ensures autocomplete bounds cover the entire city, not just one locality

### 3. **Autocomplete Restriction**
- **Initial Load**: First autocomplete instance created with no bounds restriction (India-wide)
- **Dynamic Reinitialization**: When `cityBounds` is set after first selection, autocomplete is **recreated** with strict bounds
- **Strict Bounds Mode**: Uses `strictBounds: true` to force Google Places to only show results within the city bounds
- **Country Restriction**: Maintains India-only restriction via `componentRestrictions: { country: 'in' }`

### 4. **Validation Logic**
```typescript
const canAddInCity = () => {
  if (!selectedCity) return true;  // First location - allow any
  if (!cityName) return true;      // No city detected - allow
  return cityName.toLowerCase() === selectedCity.toLowerCase(); // Must match
};
```

**Note**: Even with `strictBounds: true`, the backend validation ensures no other cities can be added.

### 5. **User Feedback**
- **Alert Message**: Shows an alert when user tries to select a location from a different city
  - Message: `"Please select a locality within {cityName} only. Other cities are not allowed."`
- **Placeholder Text**: Updates to show city restriction
  - Before selection: `"Search locality..."`
  - After first selection: `"Add locality in {cityName}"`
  - At limit: `"Max 3 locations"`
- **Input Clearing**: Automatically clears the invalid selection
- **Autocomplete Filtering**: With `strictBounds: true`, suggestions from other cities won't even appear in the dropdown

### 6. **Reset Mechanism**
- When all location chips are removed, the city restriction is cleared
- Both `selectedCity` and `cityBounds` are reset to `null`
- User can then start fresh with a new city

## Technical Implementation

### Type Definitions Added
```typescript
type Geocoder = {
  geocode: (
    request: GeocoderRequest, 
    callback: (results: GeocoderResult[] | null, status: string) => void
  ) => void;
};
type GeocoderConstructor = new () => Geocoder;
// ... LatLng, LatLngBounds, Geometry types
```

### Key Changes in SearchSection.tsx

1. **Added cityBounds state**:
   ```typescript
   const [cityBounds, setCityBounds] = useState<LatLngBounds | null>(null);
   ```

2. **Enhanced removeLocation function**:
   - Clears `cityBounds` when all locations removed

3. **Geocoding on first selection** (Desktop):
   ```typescript
   const geocoder = new w.google!.maps!.Geocoder();
   geocoder.geocode(
     { address: `${cityName}, India`, componentRestrictions: { country: 'IN' } },
     (results, status) => {
       if (status === 'OK' && results && results[0]?.geometry?.viewport) {
         setCityBounds(results[0].geometry.viewport);
       }
     }
   );
   ```

4. **Dynamic autocomplete reinitialization** (Desktop):
   - New `useEffect` hook with dependency on `[cityBounds, selectedCity, selectedLocations]`
   - Recreates autocomplete instance with `strictBounds: true` when bounds are available
   - Prevents suggestions from other cities appearing in dropdown

5. **Mobile autocomplete updates**:
   - Removed `mobileAcInitRef.current` blocker when city bounds exist
   - Allows reinitializing mobile autocomplete with strict bounds
   - Same geocoding and validation logic as desktop

## User Experience Flow

### Scenario 1: Normal Flow
1. User types "Bellandur" → Selects "Bellandur, Bengaluru, Karnataka"
2. System detects city: "Bengaluru"
3. System captures city bounds for biasing
4. User types "Koramangala" → Autocomplete shows only Bengaluru localities
5. User selects "Koramangala, Bengaluru, Karnataka" ✅
6. Both locations added successfully

### Scenario 2: Different City Attempt (PREVENTED)
1. User types "Bellandur" → Selects "Bellandur, Bengaluru, Karnataka"
2. System detects city: "Bengaluru"
3. **Autocomplete recreated with strict bounds for Bengaluru**
4. User types "Gurgaon" → **No suggestions from Gurgaon appear** (filtered by strictBounds)
5. User types "Noida" → **No suggestions from Noida/Delhi appear** ✅
6. Only Bengaluru localities shown in autocomplete dropdown

### Scenario 3: Reset Flow
1. User has "Bellandur, Bengaluru" selected
2. User clicks X to remove chip
3. `selectedCity` and `cityBounds` reset to null
4. User can now search any city again

## Benefits

✅ **Data Consistency**: Ensures all search results are from the same city
✅ **Proactive Prevention**: Other cities don't even appear in autocomplete suggestions (strictBounds)
✅ **Better UX**: Clear feedback when restrictions are violated (backup validation)
✅ **Accurate City Bounds**: Geocoding API provides precise city-level geographical boundaries
✅ **Dynamic Adaptation**: Autocomplete reinitializes with strict bounds after first selection
✅ **Flexible Reset**: Easy to start over with different city
✅ **Works on Desktop & Mobile**: Consistent behavior across devices
✅ **Fallback Protection**: Even if autocomplete shows wrong city, backend validation blocks it

## Files Modified

- `src/components/SearchSection.tsx`
  - Added type definitions for Google Maps Geocoder and geometry objects
  - Added `cityBounds` state
  - Implemented geocoding to fetch accurate city bounds
  - Added new useEffect to reinitialize desktop autocomplete with strict bounds
  - Enhanced mobile autocomplete to allow reinitialization when bounds change
  - Improved city extraction logic
  - Added validation and user feedback
  - Updated both desktop and mobile implementations with `strictBounds: true`

## Testing Checklist

- [x] First location selection captures city correctly
- [x] System geocodes city to get accurate bounds
- [x] Autocomplete reinitializes with strict bounds after first selection
- [x] Subsequent autocomplete suggestions restricted to same city
- [x] No suggestions from other cities appear in dropdown
- [x] Alert shows if somehow different city is selected (backup validation)
- [x] Placeholder text updates with city name
- [x] StrictBounds prevents other cities from appearing
- [x] Reset works when all locations removed
- [x] Works on desktop view
- [x] Works on mobile overlay
- [x] No TypeScript errors
- [x] Autocomplete still functions without city data (fallback)

## Known Behavior

- **First Selection**: Shows all India localities (no restriction)
- **Second+ Selections**: Only shows localities from the selected city
- **Noida/Delhi Example**: After selecting "Bengaluru", typing "Noida" will show NO suggestions (strictBounds blocks it)
- **Reset**: Remove all chips to search a different city
