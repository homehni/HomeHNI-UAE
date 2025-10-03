/**
 * Free Location Autocomplete Service
 * Uses OpenStreetMap Nominatim - No API key required!
 * 
 * @module services/freeLocationAutocomplete
 * @see https://nominatim.org/release-docs/develop/api/Search/
 */

import { logger } from '@/utils/logger';
import { API_CONSTANTS, ERROR_MESSAGES } from '@/constants/app.constants';

/**
 * Represents a location suggestion from search results
 */
export interface LocationSuggestion {
  /** Unique identifier for the location */
  id: string;
  /** Short name of the location */
  name: string;
  /** Full formatted address */
  displayName: string;
  /** City name if available */
  city?: string;
  /** State name if available */
  state?: string;
  /** Country name */
  country: string;
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lon: number;
  /** Type of location (city, town, suburb, etc.) */
  type: string;
}

/**
 * Raw response from Nominatim API
 * @internal
 */
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    city?: string;
    town?: string;
    state?: string;
    country: string;
    suburb?: string;
    neighbourhood?: string;
  };
}

/**
 * Search locations using OpenStreetMap Nominatim (FREE, no API key)
 * 
 * This service uses the free Nominatim API which has the following limitations:
 * - Maximum 1 request per second
 * - Usage Policy: https://operations.osmfoundation.org/policies/nominatim/
 * 
 * @param query - Search query (minimum 2 characters)
 * @param limit - Maximum number of results (default: 5, max: 50)
 * @returns Promise resolving to array of location suggestions
 * @throws Does not throw - returns empty array on error
 * 
 * @example
 * ```typescript
 * const results = await searchLocations('Mumbai', 5);
 * console.log(results); // [{ id: '123', name: 'Mumbai', ... }, ...]
 * ```
 */
export async function searchLocations(
  query: string,
  limit: number = API_CONSTANTS.LOCATION_SEARCH_LIMIT
): Promise<LocationSuggestion[]> {
  // Validate input
  if (!query || query.length < 2) {
    logger.debug('Search query too short', { query, minLength: 2 });
    return [];
  }

  const endTimer = logger.performance('searchLocations');

  try {
    // Build Nominatim API URL
    const url = new URL(`${API_CONSTANTS.NOMINATIM_BASE_URL}/search`);
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('countrycodes', API_CONSTANTS.COUNTRY_CODE);
    url.searchParams.set('limit', Math.min(limit, 50).toString());
    url.searchParams.set('addressdetails', '1');

    logger.debug('Fetching location suggestions', { query, limit, url: url.toString() });

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': API_CONSTANTS.NOMINATIM_USER_AGENT,
      },
    });

    if (!response.ok) {
      logger.warn('Location search API request failed', {
        status: response.status,
        statusText: response.statusText,
      });
      return [];
    }

    const results: NominatimResult[] = await response.json();
    const suggestions = results.map(transformNominatimResult);

    logger.info('Location search completed', {
      query,
      resultsCount: suggestions.length,
    });

    return suggestions;
  } catch (error) {
    logger.error(ERROR_MESSAGES.LOCATION_SEARCH_FAILED, error, { query });
    return [];
  } finally {
    endTimer();
  }
}

/**
 * Transform Nominatim result to our LocationSuggestion format
 * 
 * @param result - Raw Nominatim API result
 * @returns Transformed location suggestion
 * @internal
 */
function transformNominatimResult(result: NominatimResult): LocationSuggestion {
  const city = result.address.city || result.address.town;
  const locality = result.address.suburb || result.address.neighbourhood;
  
  // Extract the most specific location name
  const name = locality || city || result.display_name.split(',')[0].trim();

  return {
    id: result.place_id.toString(),
    name,
    displayName: result.display_name,
    city,
    state: result.address.state,
    country: result.address.country,
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    type: result.type,
  };
}

/**
 * Get detailed information for a specific location
 * 
 * @param placeId - The place ID from a previous search
 * @returns Promise resolving to location details or null if not found
 * 
 * @example
 * ```typescript
 * const details = await getLocationDetails('123456');
 * if (details) {
 *   console.log(details.displayName);
 * }
 * ```
 */
export async function getLocationDetails(placeId: string): Promise<LocationSuggestion | null> {
  if (!placeId) {
    logger.warn('getLocationDetails called with empty placeId');
    return null;
  }

  try {
    const url = new URL(`${API_CONSTANTS.NOMINATIM_BASE_URL}/lookup`);
    url.searchParams.set('osm_ids', `N${placeId}`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');

    logger.debug('Fetching location details', { placeId });

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': API_CONSTANTS.NOMINATIM_USER_AGENT,
      },
    });

    if (!response.ok) {
      logger.warn('Location details API request failed', {
        placeId,
        status: response.status,
      });
      return null;
    }

    const results: NominatimResult[] = await response.json();
    
    if (results.length === 0) {
      logger.debug('No location found for placeId', { placeId });
      return null;
    }

    return transformNominatimResult(results[0]);
  } catch (error) {
    logger.error('Failed to fetch location details', error, { placeId });
    return null;
  }
}
