/**
 * Utility functions for generating SEO-friendly property URLs
 */

interface PropertyUrlData {
  propertyType?: string;
  property_type?: string;
  listingType?: string;
  listing_type?: string;
  locality?: string;
  city?: string;
  bhkType?: string;
  bhk_type?: string;
  spaceType?: string;
  space_type?: string;
  landType?: string;
  land_type?: string;
}

/**
 * Converts a string to URL-friendly slug format
 * Example: "2 BHK Apartment" -> "2-bhk-apartment"
 */
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Normalizes property type for URL generation
 */
const normalizePropertyType = (propertyType: string): string => {
  const typeMap: Record<string, string> = {
    'independent_house': 'independent-house',
    'builder_floor': 'builder-floor',
    'apartment': 'apartment',
    'villa': 'villa',
    'penthouse': 'penthouse',
    'studio_apartment': 'studio-apartment',
    'residential': 'residential',
    'commercial': 'commercial',
    'land': 'land',
    'plot': 'plot',
    'land/plot': 'land',
    'pg': 'pg',
    'hostel': 'hostel',
    'flatmates': 'flatmates',
  };
  
  const normalized = propertyType.toLowerCase().replace(/\s+/g, '_');
  return typeMap[normalized] || slugify(propertyType);
};

/**
 * Generates a SEO-friendly URL slug from property data
 * Example output: "2-bhk-apartment-for-rent-in-koramangala-bangalore"
 */
export const generatePropertySlug = (data: PropertyUrlData): string => {
  const propertyType = data.propertyType || data.property_type || '';
  const listingType = data.listingType || data.listing_type || '';
  const locality = data.locality || '';
  const city = data.city || '';
  const bhkType = data.bhkType || data.bhk_type || '';
  const spaceType = data.spaceType || data.space_type || '';
  const landType = data.landType || data.land_type || '';

  const parts: string[] = [];

  // Handle different property types
  if (landType && (propertyType.toLowerCase() === 'land/plot' || propertyType.toLowerCase() === 'land' || propertyType.toLowerCase() === 'plot')) {
    // Land/Plot properties
    const landTypeMap: Record<string, string> = {
      'industrial': 'industrial-land',
      'commercial': 'commercial-land',
      'agricultural': 'agricultural-land',
      'residential': 'residential-land',
      'institutional': 'institutional-land',
    };
    parts.push(landTypeMap[landType.toLowerCase()] || `${slugify(landType)}-land`);
  } else if (propertyType.toLowerCase() === 'commercial' && spaceType) {
    // Commercial properties with space type
    const spaceTypeMap: Record<string, string> = {
      'office': 'office-space',
      'retail': 'retail-shop',
      'warehouse': 'warehouse',
      'showroom': 'showroom',
      'restaurant': 'restaurant',
      'co-working': 'coworking-space',
      'industrial': 'industrial-space',
    };
    parts.push(spaceTypeMap[spaceType.toLowerCase()] || slugify(spaceType));
  } else if (bhkType && propertyType && propertyType.toLowerCase() !== 'pg' && propertyType.toLowerCase() !== 'hostel') {
    // Residential with BHK
    parts.push(slugify(bhkType));
    parts.push(normalizePropertyType(propertyType));
  } else if (propertyType) {
    // Other property types
    parts.push(normalizePropertyType(propertyType));
  }

  // Add listing type
  if (listingType) {
    const listingMap: Record<string, string> = {
      'rent': 'for-rent',
      'sale': 'for-sale',
    };
    parts.push(listingMap[listingType.toLowerCase()] || `for-${slugify(listingType)}`);
  }

  // Add location
  if (locality) {
    parts.push('in');
    parts.push(slugify(locality));
  }
  
  if (city) {
    parts.push(slugify(city));
  }

  // Join all parts with hyphens
  return parts.filter(Boolean).join('-');
};

/**
 * Generates the full property URL with slug
 * Example: "/property/2-bhk-apartment-for-rent-in-koramangala-bangalore/abc-123-def"
 */
export const generatePropertyUrl = (propertyId: string, propertyData: PropertyUrlData): string => {
  const slug = generatePropertySlug(propertyData);
  
  if (slug) {
    return `/property/${slug}/${propertyId}`;
  }
  
  // Fallback to simple URL if slug generation fails
  return `/property/${propertyId}`;
};

/**
 * Extracts property ID from URL params (supports both slug and non-slug formats)
 * Handles: /property/:id or /property/:slug/:id
 */
export const extractPropertyIdFromParams = (params: { id?: string; slug?: string }): string | null => {
  // New format: /property/:slug/:id
  if (params.slug) {
    return params.id || null;
  }
  
  // Old format: /property/:id (backward compatibility)
  // Check if the id param looks like a UUID
  const id = params.id;
  if (id && id.includes('-') && id.length >= 32) {
    return id;
  }
  
  return id || null;
};
