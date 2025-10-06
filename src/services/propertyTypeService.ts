/**
 * Property Type Matching Service
 * Handles complex property type filtering logic with configuration
 */

import { PropertyTypeFilter, ListingTab } from '@/types/propertySearch.types';

// Property type configurations per tab
const PROPERTY_TYPES_CONFIG: Record<ListingTab, PropertyTypeFilter[]> = {
  rent: [
    'ALL',
    'APARTMENT',
    'INDEPENDENT HOUSE',
    'VILLA',
  ],
  buy: [
    'ALL',
    'APARTMENT',
    'INDEPENDENT HOUSE',
    'VILLA',
  ],
  commercial: [
    'ALL',
    'OFFICE',
    'RETAIL',
    'WAREHOUSE',
    'SHOWROOM',
    'RESTAURANT',
    'CO-WORKING',
    'INDUSTRIAL',
  ],
  land: [
    'ALL',
    'AGRICULTURAL LAND',
    'COMMERCIAL LAND',
    'INDUSTRIAL LAND',
  ],
};

// Property type matching rules
interface PropertyTypeMatch {
  exact?: string[];
  contains?: string[];
  excludes?: string[];
}

const PROPERTY_TYPE_RULES: Record<string, PropertyTypeMatch> = {
  'PENTHOUSE': {
    exact: ['penthouse'],
  },
  'DUPLEX': {
    exact: ['duplex'],
  },
  'INDEPENDENT HOUSE': {
    exact: ['independenthouse', 'independent'],
    contains: ['independent', 'house'],
    excludes: ['penthouse'],
  },
  'GATED COMMUNITY VILLA': {
    exact: ['gatedcommunityvilla'],
    contains: ['gated', 'community', 'villa'],
  },
  'APARTMENT': {
    contains: ['apartment', 'flat'],
  },
  'VILLA': {
    exact: ['villa'],
    excludes: ['community'],
  },
  'AGRICULTURAL LAND': {
    contains: ['agricultural', 'land'],
  },
  'COMMERCIAL LAND': {
    contains: ['commercial', 'land'],
  },
  'INDUSTRIAL LAND': {
    contains: ['industrial', 'land'],
  },
  'CO-LIVING': {
    contains: ['coliving', 'co-living'],
  },
  'BUILDER FLOOR': {
    contains: ['builderfloor', 'builder', 'floor'],
  },
  'STUDIO APARTMENT': {
    contains: ['studioapartment', 'studio'],
  },
  'CO-WORKING': {
    contains: ['coworking', 'co-working'],
  },
  'OFFICE': {
    contains: ['office'],
  },
  'RETAIL': {
    contains: ['retail'],
  },
  'WAREHOUSE': {
    contains: ['warehouse'],
  },
  'SHOWROOM': {
    contains: ['showroom'],
  },
  'RESTAURANT': {
    contains: ['restaurant'],
  },
  'INDUSTRIAL': {
    exact: ['industrial'],
  },
};

/**
 * Normalizes a property type string for comparison
 */
function normalizePropertyType(type: string): string {
  return type.toLowerCase().replace(/\s+/g, '');
}

/**
 * Gets available property types for a specific tab
 */
export function getPropertyTypesForTab(tab: ListingTab): PropertyTypeFilter[] {
  return PROPERTY_TYPES_CONFIG[tab] || PROPERTY_TYPES_CONFIG.buy;
}

/**
 * Checks if a property type matches a filter
 */
export function matchesPropertyType(
  propertyType: string,
  filterType: PropertyTypeFilter
): boolean {
  if (filterType === 'ALL') {
    return true;
  }

  const normalizedProperty = normalizePropertyType(propertyType);
  const rule = PROPERTY_TYPE_RULES[filterType];

  if (!rule) {
    // Fallback to simple contains match
    return normalizedProperty.includes(normalizePropertyType(filterType));
  }

  // Check exact matches first
  if (rule.exact) {
    if (rule.exact.some(exact => normalizedProperty === exact)) {
      return true;
    }
  }

  // Check excludes
  if (rule.excludes) {
    if (rule.excludes.some(exclude => normalizedProperty.includes(exclude))) {
      return false;
    }
  }

  // Check contains (all must match)
  if (rule.contains) {
    return rule.contains.every(term => normalizedProperty.includes(term));
  }

  return false;
}

/**
 * Filters properties by type
 */
export function filterByPropertyType(
  properties: Array<{ propertyType: string }>,
  filterTypes: PropertyTypeFilter[]
): Array<{ propertyType: string }> {
  if (filterTypes.length === 0 || filterTypes.includes('ALL')) {
    return properties;
  }

  return properties.filter(property =>
    filterTypes.some(filterType =>
      matchesPropertyType(property.propertyType, filterType)
    )
  );
}

/**
 * Gets display name for property type
 */
export function getPropertyTypeDisplayName(type: PropertyTypeFilter): string {
  return type
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Pluralizes property type for display
 */
export function pluralizePropertyType(type: PropertyTypeFilter): string {
  const displayName = getPropertyTypeDisplayName(type).toLowerCase();
  
  const pluralRules: Record<string, string> = {
    'apartment': 'apartments',
    'villa': 'villas',
    'penthouse': 'penthouses',
    'duplex': 'duplexes',
    'independent house': 'independent houses',
    'builder floor': 'builder floors',
    'studio apartment': 'studio apartments',
    'office': 'offices',
    'warehouse': 'warehouses',
    'showroom': 'showrooms',
    'restaurant': 'restaurants',
  };

  return pluralRules[displayName] || displayName + 's';
}
