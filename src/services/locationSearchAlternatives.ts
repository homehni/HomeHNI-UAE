/**
 * Alternative Location Search Implementations
 * Solutions that don't require exposed Google Maps API keys
 */

// ============================================================================
// OPTION 1: Use Google Maps Platform with HTTP Referrer Restrictions
// ============================================================================
// This is the RECOMMENDED approach - secure and simple

/**
 * Setup Steps:
 * 1. Go to Google Cloud Console
 * 2. Enable Maps JavaScript API
 * 3. Create API key with restrictions:
 *    - Application restrictions: HTTP referrers
 *    - Website restrictions: yourdomain.com/*, localhost:*
 *    - API restrictions: Only Maps JavaScript API
 * 4. The key is safe to expose in frontend with these restrictions
 */

// This is SAFE because the key only works on your domain
const GOOGLE_MAPS_CONFIG = {
  apiKey: 'YOUR_RESTRICTED_API_KEY', // Safe to expose with proper restrictions
  libraries: ['places'],
  restrictions: {
    // Only works on these domains
    allowedReferrers: [
      'yourdomain.com/*',
      'localhost:*',
      '127.0.0.1:*'
    ],
    // Only allows Places API
    allowedAPIs: ['places']
  }
};

// ============================================================================
// OPTION 2: Server-Side Proxy (Most Secure)
// ============================================================================

/**
 * Create a serverless function to proxy Google Maps requests
 * The API key stays on the server, never exposed to frontend
 */

// Frontend code
async function searchLocation(query: string) {
  const response = await fetch('/api/places/autocomplete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return response.json();
}

// Backend (Supabase Edge Function or similar)
// File: supabase/functions/places-autocomplete/index.ts
/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { query } = await req.json()
  
  // API key stays server-side
  const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
  
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}&components=country:in`
  )
  
  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
})
*/

// ============================================================================
// OPTION 3: Use Alternative Services (No Google Maps)
// ============================================================================

/**
 * A. Mapbox Places API
 * - Similar to Google Maps
 * - More generous free tier
 * - Better pricing
 */

interface MapboxConfig {
  accessToken: string; // Can be restricted to domains
  endpoint: string;
}

async function mapboxAutocomplete(query: string, config: MapboxConfig) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${config.accessToken}&country=IN&types=place,locality,neighborhood`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.features.map((feature: any) => ({
    name: feature.place_name,
    coordinates: feature.geometry.coordinates
  }));
}

/**
 * B. OpenStreetMap Nominatim (Free, No API Key)
 * - Completely free
 * - No API key needed
 * - Good for basic searches
 */

async function nominatimAutocomplete(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=in&limit=5`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'HomeHNI-App' // Required by Nominatim
    }
  });
  
  return response.json();
}

/**
 * C. Geoapify (Good free tier)
 * - API key can be restricted
 * - Good autocomplete
 */

async function geoapifyAutocomplete(query: string, apiKey: string) {
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:in&apiKey=${apiKey}`;
  
  const response = await fetch(url);
  return response.json();
}

// ============================================================================
// OPTION 4: Custom Database Search (No External API)
// ============================================================================

/**
 * Use your own location database
 * - Fastest (no external API calls)
 * - Free
 * - Full control
 * - Works offline
 */

// Pre-populate Supabase with Indian cities/localities
interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'city' | 'locality' | 'area';
}

async function customLocationSearch(query: string) {
  const { data } = await supabase
    .from('locations')
    .select('*')
    .or(`name.ilike.%${query}%,city.ilike.%${query}%`)
    .limit(10);
  
  return data;
}

// Seed data from public sources:
// - India Post PIN codes
// - Census data
// - OpenStreetMap exports

// ============================================================================
// RECOMMENDED SOLUTION: Hybrid Approach
// ============================================================================

/**
 * Combine custom database + OpenStreetMap fallback
 * - Fast local search first
 * - Fallback to OSM for new locations
 * - No API key needed
 * - Free
 */

export async function hybridLocationSearch(query: string) {
  // 1. Try local database first (fastest)
  const localResults = await customLocationSearch(query);
  
  if (localResults && localResults.length > 0) {
    return localResults;
  }
  
  // 2. Fallback to OpenStreetMap (free, no key)
  const osmResults = await nominatimAutocomplete(query);
  
  // 3. Optionally cache new locations
  if (osmResults.length > 0) {
    // Save to local database for next time
    await cacheLocationResults(osmResults);
  }
  
  return osmResults;
}

async function cacheLocationResults(osmResults: any[]) {
  const locations = osmResults.map(result => ({
    name: result.display_name.split(',')[0],
    city: result.address?.city || result.address?.town,
    state: result.address?.state,
    lat: result.lat,
    lon: result.lon,
    type: result.type
  }));
  
  await supabase.from('locations').insert(locations);
}

// ============================================================================
// COST COMPARISON
// ============================================================================

/*
Google Maps Places API:
- $17 per 1,000 requests (autocomplete)
- $5 per 1,000 requests (geocoding)

Mapbox:
- 100,000 free requests/month
- $0.60 per 1,000 after that

OpenStreetMap Nominatim:
- FREE (unlimited with fair use)
- No API key required
- Must respect usage policy

Custom Database:
- FREE (uses your Supabase storage)
- Fastest response time
- Works offline
*/

// ============================================================================
// SECURITY BEST PRACTICES
// ============================================================================

/**
 * If you MUST use Google Maps:
 * 
 * 1. Add HTTP Referrer Restrictions:
 *    - yourdomain.com/*
 *    - *.yourdomain.com/*
 *    
 * 2. Add API Restrictions:
 *    - Only enable Maps JavaScript API
 *    - Don't enable other APIs
 *    
 * 3. Set Usage Quotas:
 *    - Daily limit: 1,000 requests
 *    - Alert at 80% usage
 *    
 * 4. Monitor Usage:
 *    - Check Google Cloud Console daily
 *    - Set up billing alerts
 *    
 * 5. Rotate Keys:
 *    - Change API key monthly
 *    - Keep old key active for 24h during rotation
 */

export const SECURE_GOOGLE_MAPS_CONFIG = {
  // This key is SAFE to expose because of restrictions
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries: ['places'] as const,
  
  // Restrictions set in Google Cloud Console:
  restrictions: {
    httpReferrers: [
      'yourdomain.com/*',
      'www.yourdomain.com/*', 
      'localhost:*',
      '127.0.0.1:*'
    ],
    apiRestrictions: ['Maps JavaScript API', 'Places API'],
    quotas: {
      requestsPerDay: 1000,
      requestsPerMinute: 100
    }
  }
};
