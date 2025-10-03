# Location Search Without Google Maps API Key

## 🎯 Problem
Exposing Google Maps API keys in frontend code is a security risk and costs money ($17 per 1,000 autocomplete requests).

## ✅ Solution
Use **OpenStreetMap Nominatim** - completely FREE and no API key required!

---

## 🆓 Option 1: OpenStreetMap Nominatim (RECOMMENDED)

### **Pros:**
- ✅ **100% FREE** - No API key needed
- ✅ **No costs** - Unlimited requests (with fair use)
- ✅ **No signup** - Works immediately
- ✅ **Good coverage** - Excellent Indian location data
- ✅ **No security risks** - Nothing to expose

### **Cons:**
- ⚠️ Rate limited (1 request per second)
- ⚠️ Must include User-Agent header
- ⚠️ Slower than Google Maps

### **Implementation:**

```typescript
// src/services/freeLocationAutocomplete.ts
export async function searchLocations(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&countrycodes=in&limit=5`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'HomeHNI-PropertySearch/1.0'
    }
  });
  
  return response.json();
}
```

### **Usage in PropertySearch.tsx:**

```typescript
import { searchLocations } from '@/services/freeLocationAutocomplete';

// In your component
const [locationSuggestions, setLocationSuggestions] = useState([]);

const handleLocationInput = async (value: string) => {
  if (value.length < 2) return;
  
  const suggestions = await searchLocations(value);
  setLocationSuggestions(suggestions);
};
```

---

## 🔐 Option 2: Google Maps with Proper Restrictions (If you must use it)

### **Making Google Maps API Key Safe:**

1. **Go to Google Cloud Console**
2. **Set HTTP Referrer Restrictions:**
   ```
   yourdomain.com/*
   www.yourdomain.com/*
   localhost:*
   127.0.0.1:*
   ```

3. **Set API Restrictions:**
   - Enable ONLY "Maps JavaScript API" and "Places API"
   - Disable all other APIs

4. **Set Quotas:**
   - Daily limit: 1,000 requests
   - Per minute: 100 requests

5. **Now the key is SAFE to expose** because:
   - Only works on your domain
   - Only works with specific APIs
   - Has usage limits

### **Updated .env:**
```env
# This key is SAFE because of Google Cloud restrictions
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### **In code:**
```typescript
// This is now safe because key is restricted
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

---

## 💡 Option 3: Server-Side Proxy (Most Secure)

### **Create Supabase Edge Function:**

```typescript
// supabase/functions/location-search/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { query } = await req.json()
  
  // API key stays server-side (never exposed)
  const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
  
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}&components=country:in`
  )
  
  const data = await response.json()
  return new Response(JSON.stringify(data))
})
```

### **Frontend usage:**
```typescript
async function searchLocation(query: string) {
  const response = await fetch('/api/location-search', {
    method: 'POST',
    body: JSON.stringify({ query })
  });
  return response.json();
}
```

---

## 📊 Cost Comparison

| Service | Free Tier | Cost After | API Key | Setup |
|---------|-----------|------------|---------|-------|
| **OpenStreetMap** | ∞ | $0 | ❌ Not needed | ⭐ Easy |
| **Google Maps** | $200/mo | $17/1K | ⚠️ Exposed (with restrictions) | Medium |
| **Mapbox** | 100K/mo | $0.60/1K | ✅ Can restrict | Easy |
| **Google (Proxy)** | $200/mo | $17/1K | ✅ Hidden | Hard |

---

## 🚀 Quick Migration Steps

### **Step 1: Replace Google Maps with OpenStreetMap**

```typescript
// REMOVE from PropertySearch.tsx:
const apiKey = 'AIzaSyD2rlXeHN4cm0CQD-y4YGTsob9a_27YcwY';

// ADD this import:
import { searchLocations, LocationSuggestion } from '@/services/freeLocationAutocomplete';
```

### **Step 2: Update autocomplete logic**

```typescript
// OLD (Google Maps):
const autocomplete = new google.maps.places.Autocomplete(input);

// NEW (OpenStreetMap):
const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

const handleSearch = async (query: string) => {
  const results = await searchLocations(query);
  setSuggestions(results);
};
```

### **Step 3: Update location selection**

```typescript
const handleSelectLocation = (suggestion: LocationSuggestion) => {
  const locationName = suggestion.name;
  
  if (filters.locations.length < 3) {
    updateFilter('locations', [...filters.locations, locationName]);
  }
};
```

### **Step 4: Render suggestions dropdown**

```typescript
{suggestions.length > 0 && (
  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
    {suggestions.map((suggestion) => (
      <button
        key={suggestion.id}
        onClick={() => handleSelectLocation(suggestion)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        <div className="font-medium">{suggestion.name}</div>
        <div className="text-sm text-gray-500">
          {suggestion.city}, {suggestion.state}
        </div>
      </button>
    ))}
  </div>
)}
```

---

## 🎨 Complete Example Component

```typescript
import { useState } from 'react';
import { searchLocations, LocationSuggestion } from '@/services/freeLocationAutocomplete';
import { useDebounce } from '@/hooks/useDebounce';

export function LocationSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    
    searchLocations(debouncedQuery).then(setSuggestions);
  }, [debouncedQuery]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        placeholder="Search location..."
        className="w-full px-4 py-2 border rounded-lg"
      />
      
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => {
                // Handle selection
                setQuery(suggestion.name);
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              <div className="font-medium">{suggestion.name}</div>
              <div className="text-sm text-gray-500">
                {suggestion.city}, {suggestion.state}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## ⚡ Performance Tips

### **1. Debounce Input**
```typescript
const debouncedQuery = useDebounce(query, 300);
// Only search after user stops typing for 300ms
```

### **2. Cache Results**
```typescript
const cache = new Map<string, LocationSuggestion[]>();

async function searchWithCache(query: string) {
  if (cache.has(query)) {
    return cache.get(query);
  }
  
  const results = await searchLocations(query);
  cache.set(query, results);
  return results;
}
```

### **3. Limit Requests**
```typescript
// Only search if query is at least 2 characters
if (query.length < 2) return;

// Only show top 5 results
const results = await searchLocations(query, 5);
```

---

## 🔒 Security Benefits

### **With OpenStreetMap:**
- ✅ No API key to steal
- ✅ No costs to rack up
- ✅ No quotas to exceed
- ✅ No restrictions to configure
- ✅ Works immediately

### **With Restricted Google Maps:**
- ✅ Key only works on your domain
- ✅ Usage limits prevent abuse
- ✅ API restrictions prevent misuse
- ✅ Monitoring alerts you to issues

---

## 📝 Testing

```typescript
// Test OpenStreetMap search
const results = await searchLocations('Bangalore');
console.log(results); // Array of LocationSuggestion

// Test with Indian cities
await searchLocations('Mumbai');
await searchLocations('Delhi');
await searchLocations('Koramangala'); // Bangalore locality
```

---

## 🎯 Recommendation

**Use OpenStreetMap Nominatim** because:
1. ✅ It's FREE forever
2. ✅ No API key management
3. ✅ No security risks
4. ✅ Good Indian location data
5. ✅ Simple to implement

**Only use Google Maps if:**
- You need extremely accurate geocoding
- You're already paying for Google Cloud
- You need additional Google Maps features

---

## 🚨 Important Notes

### **OpenStreetMap Usage Policy:**
1. Include proper User-Agent header
2. Don't exceed 1 request per second
3. Consider donating if heavy usage
4. Don't abuse the service

### **Fair Use Example:**
```typescript
// Good ✅
- Autocomplete on user input (debounced)
- 10-100 searches per user session
- Reasonable usage

// Bad ❌
- Bulk geocoding thousands of addresses
- No rate limiting
- Automated scraping
```

---

## 📚 Resources

- [Nominatim Documentation](https://nominatim.org/release-docs/latest/api/Search/)
- [OpenStreetMap Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [Google Maps API Restrictions](https://cloud.google.com/docs/authentication/api-keys)
- [Mapbox Pricing](https://www.mapbox.com/pricing)

---

**Next Steps:**
1. Use `freeLocationAutocomplete.ts` service
2. Remove Google Maps API key from code
3. Test with Indian locations
4. Deploy without security concerns! 🎉

---

**Last Updated**: October 3, 2025
