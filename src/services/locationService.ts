/**
 * Location Normalization Service
 * Handles standardization and consolidation of location names across India
 * 
 * This service provides:
 * - Consistent location naming (e.g., "Bengaluru" → "Bangalore")
 * - City and state mapping
 * - Location matching for search filters
 * 
 * @module services/locationService
 */

import { logger } from '@/utils/logger';

/**
 * Location mapping configuration
 * Maps various spellings and variations to canonical names
 * 
 * @internal
 */
const LOCATION_MAPPINGS: Record<string, string> = {
  // Bangalore variations
  'bangalore': 'Bangalore',
  'bengaluru': 'Bangalore',
  'bangalore division': 'Bangalore',
  'bengaluru division': 'Bangalore',
  
  // Karnataka
  'karnataka': 'Karnataka',
  
  // Hyderabad variations
  'hyderabad': 'Hyderabad',
  'hyd': 'Hyderabad',
  
  // Mumbai variations
  'mumbai': 'Mumbai',
  'bombay': 'Mumbai',
  
  // Delhi variations
  'delhi': 'Delhi',
  'new delhi': 'Delhi',
  'ncr': 'Delhi',
  
  // Chennai variations
  'chennai': 'Chennai',
  'madras': 'Chennai',
  
  // Pune variations
  'pune': 'Pune',
  'poona': 'Pune',
  'koregaon park': 'Pune',
  'koregaon': 'Pune',
  
  // Gurgaon/Gurugram
  'gurgaon': 'Gurgaon',
  'gurugram': 'Gurgaon',
  
  // Noida
  'noida': 'Noida',
  'greater noida': 'Greater Noida',
  
  // Kolkata
  'kolkata': 'Kolkata',
  'calcutta': 'Kolkata',
  
  // Ahmedabad
  'ahmedabad': 'Ahmedabad',
  'amdavad': 'Ahmedabad',
  
  // Additional major cities
  'jaipur': 'Jaipur',
  'lucknow': 'Lucknow',
  'kanpur': 'Kanpur',
  'nagpur': 'Nagpur',
  'indore': 'Indore',
  'thane': 'Thane',
  'bhopal': 'Bhopal',
  'visakhapatnam': 'Visakhapatnam',
  'vizag': 'Visakhapatnam',
  'patna': 'Patna',
  'vadodara': 'Vadodara',
  'baroda': 'Vadodara',
  'ludhiana': 'Ludhiana',
  'agra': 'Agra',
  'nashik': 'Nashik',
  'faridabad': 'Faridabad',
  'meerut': 'Meerut',
  'rajkot': 'Rajkot',
  'varanasi': 'Varanasi',
  'banaras': 'Varanasi',
  'srinagar': 'Srinagar',
  'aurangabad': 'Aurangabad',
  'solapur': 'Solapur',
  'vijayawada': 'Vijayawada',
  'chandigarh': 'Chandigarh',
  'coimbatore': 'Coimbatore',
  'mysore': 'Mysore',
  'mysuru': 'Mysore',
  'kochi': 'Kochi',
  'cochin': 'Kochi',
};

/**
 * Major cities that should be treated as city-level filters
 * These cities are important enough to warrant special handling
 * 
 * @internal
 */
const MAJOR_CITIES = new Set([
  'bangalore',
  'hyderabad',
  'mumbai',
  'delhi',
  'chennai',
  'pune',
  'kolkata',
  'ahmedabad',
  'gurgaon',
  'noida',
  'jaipur',
  'chandigarh',
  'kochi',
  'karnataka', // State included for special handling
]);

/**
 * Normalizes a location name to a standard format
 * 
 * This function:
 * 1. Handles null/undefined gracefully
 * 2. Checks for direct mappings first (fastest)
 * 3. Checks for partial matches (e.g., "bangalore division" → "Bangalore")
 * 4. Falls back to title-cased original
 * 
 * @param location - Raw location string from user input or database
 * @returns Normalized location name in Title Case
 * 
 * @example
 * ```typescript
 * normalizeLocation('bengaluru'); // Returns 'Bangalore'
 * normalizeLocation('new delhi'); // Returns 'Delhi'
 * normalizeLocation(null); // Returns ''
 * ```
 */
export function normalizeLocation(location: string | null | undefined): string {
  try {
    // Handle null/undefined cases
    if (!location || typeof location !== 'string') {
      logger.debug('normalizeLocation called with invalid input', { location });
      return '';
    }
    
    const normalized = location.toLowerCase().trim();
    
    // Check for direct mapping (O(1) lookup)
    if (LOCATION_MAPPINGS[normalized]) {
      return LOCATION_MAPPINGS[normalized];
    }
    
    // Check for partial matches (slower, but necessary for complex cases)
    for (const [key, value] of Object.entries(LOCATION_MAPPINGS)) {
      if (normalized.includes(key)) {
        logger.debug('Found partial location match', { 
          input: location, 
          matched: key, 
          output: value 
        });
        return value;
      }
    }
    
    // Return title-cased original if no mapping found
    const titleCased = toTitleCase(location.trim());
    logger.debug('No mapping found, using title case', { 
      input: location, 
      output: titleCased 
    });
    return titleCased;
  } catch (error) {
    logger.error('Error normalizing location', error, { location });
    return location || '';
  }
}

/**
 * Checks if a location is a major city
 * 
 * Major cities receive special handling in search and filtering logic.
 * 
 * @param location - Location name to check
 * @returns True if the location is a major city
 * 
 * @example
 * ```typescript
 * isMajorCity('Bangalore'); // true
 * isMajorCity('Mumbai'); // true
 * isMajorCity('Small Town'); // false
 * ```
 */
export function isMajorCity(location: string): boolean {
  const normalized = location.toLowerCase().trim();
  return MAJOR_CITIES.has(normalized);
}

/**
 * Converts a string to Title Case
 * 
 * @param str - String to convert
 * @returns Title cased string
 * @internal
 * 
 * @example
 * ```typescript
 * toTitleCase('new delhi'); // Returns 'New Delhi'
 * toTitleCase('MUMBAI'); // Returns 'Mumbai'
 * ```
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  
  return str
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Matches a property location against a filter location
 * 
 * Handles both exact and fuzzy matching:
 * - Normalized name comparison
 * - Substring matching
 * - Major city special handling
 * 
 * @param propertyLocation - Location from property data
 * @param filterLocation - Location from user's filter
 * @returns True if property matches filter location
 * 
 * @example
 * ```typescript
 * matchesLocationFilter('Koramangala, Bangalore', 'Bangalore'); // true
 * matchesLocationFilter('Mumbai, Maharashtra', 'Mumbai'); // true
 * matchesLocationFilter('Delhi NCR', 'Delhi'); // true
 * ```
 */
export function matchesLocationFilter(
  propertyLocation: string,
  filterLocation: string
): boolean {
  if (!propertyLocation || !filterLocation) {
    return false;
  }

  const normalizedProperty = normalizeLocation(propertyLocation).toLowerCase();
  const normalizedFilter = normalizeLocation(filterLocation).toLowerCase();

  // Exact match after normalization
  if (normalizedProperty === normalizedFilter) {
    return true;
  }

  // Check if property location contains filter location
  if (normalizedProperty.includes(normalizedFilter)) {
    return true;
  }

  // Check if filter location contains property location
  // (useful for matching "Bangalore Division" filter with "Bangalore" property)
  if (normalizedFilter.includes(normalizedProperty)) {
    return true;
  }

  return false;
}

/**
 * Extracts city name from a full location string
 * 
 * @param location - Full location string (e.g., "Koramangala, Bangalore, Karnataka")
 * @returns Extracted city name
 * 
 * @example
 * ```typescript
 * extractCity('Koramangala, Bangalore, Karnataka'); // Returns 'Bangalore'
 * extractCity('Andheri West, Mumbai'); // Returns 'Mumbai'
 * ```
 */
export function extractCity(location: string): string {
  if (!location) return '';

  // Split by comma and try to find a major city
  const parts = location.split(',').map(p => p.trim());
  
  for (const part of parts) {
    const normalized = normalizeLocation(part);
    if (isMajorCity(normalized)) {
      return normalized;
    }
  }

  // If no major city found, return the last part (usually the city)
  return parts.length > 1 ? normalizeLocation(parts[parts.length - 1]) : normalizeLocation(location);
}
