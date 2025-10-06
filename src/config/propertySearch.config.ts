/**
 * Property Search Configuration
 * Centralized configuration for the property search feature
 */

import { BudgetConfig, ListingTab } from '@/types/propertySearch.types';

// API Configuration
export const API_CONFIG = {
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  BATCH_SIZE: 50, // Number of properties to load per batch
  DEBOUNCE_DELAY: 300, // ms for search input debounce
  MAX_LOCATIONS: 3, // Maximum number of locations user can select
} as const;

// Budget Configuration per Tab
export const BUDGET_CONFIG: Record<ListingTab, BudgetConfig> = {
  rent: {
    min: 0,
    max: 500000, // 5 Lakh
    step: 10000, // 10K steps
    presets: [
      { label: 'Under 50K', range: [0, 50000] },
      { label: 'Under 1L', range: [0, 100000] },
      { label: '1L-2L', range: [100000, 200000] },
      { label: '2L-5L', range: [200000, 500000] },
      { label: '5L+', range: [500000, 500000] },
    ],
  },
  buy: {
    min: 0,
    max: 50000000, // 5 Crore
    step: 500000, // 5L steps
    presets: [
      { label: 'Under 50L', range: [0, 5000000] },
      { label: '50L-1Cr', range: [5000000, 10000000] },
      { label: '1-2Cr', range: [10000000, 20000000] },
      { label: '2-5Cr', range: [20000000, 50000000] },
      { label: '5Cr+', range: [50000000, 100000000] },
    ],
  },
  commercial: {
    min: 0,
    max: 50000000, // 5 Crore
    step: 500000, // 5L steps
    presets: [
      { label: 'Under 50L', range: [0, 5000000] },
      { label: '50L-1Cr', range: [5000000, 10000000] },
      { label: '1-2Cr', range: [10000000, 20000000] },
      { label: '2-5Cr', range: [20000000, 50000000] },
      { label: '5Cr+', range: [50000000, 100000000] },
    ],
  },
  land: {
    min: 0,
    max: 50000000, // 5 Crore
    step: 500000, // 5L steps
    presets: [
      { label: 'Under 50L', range: [0, 5000000] },
      { label: '50L-1Cr', range: [5000000, 10000000] },
      { label: '1-2Cr', range: [10000000, 20000000] },
      { label: '2-5Cr', range: [20000000, 50000000] },
      { label: '5Cr+', range: [50000000, 100000000] },
    ],
  },
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 12,
  MAX_PAGE_BUTTONS: 5,
} as const;

// Filter Options
export const FILTER_OPTIONS = {
  BHK_TYPES: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'] as const,
  FURNISHED_OPTIONS: ['Furnished', 'Semi-Furnished', 'Unfurnished'] as const,
  AVAILABILITY_OPTIONS: ['Ready to Move', 'Under Construction'] as const,
  CONSTRUCTION_OPTIONS: [
    'New Project',
    '1-5 Years Old',
    '5-10 Years Old',
    '10+ Years Old',
  ] as const,
  SORT_OPTIONS: [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'area', label: 'Area: Large to Small' },
  ] as const,
} as const;

// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  libraries: ['places'] as const,
  options: {
    fields: ['formatted_address', 'geometry', 'name', 'address_components'],
    types: ['geocode'],
    componentRestrictions: { country: 'in' as const },
  },
} as const;

// Supabase Query Configuration
export const SUPABASE_CONFIG = {
  ESSENTIAL_FIELDS: [
    'id',
    'title',
    'locality',
    'city',
    'expected_price',
    'super_area',
    'bhk_type',
    'bathrooms',
    'images',
    'property_type',
    'furnishing',
    'availability_type',
    'property_age',
    'listing_type',
    'created_at',
  ] as const,
  STATUS_FILTER: 'approved' as const,
  VISIBILITY_FILTER: true,
} as const;

// UI Configuration
export const UI_CONFIG = {
  NEW_PROPERTY_DAYS: 7, // Properties created within this many days are marked as "new"
  SKELETON_COUNT: 6, // Number of skeleton loaders to show
  TOAST_DURATION: 3000, // ms
} as const;

// Price Formatting
export const PRICE_FORMAT = {
  CRORE_THRESHOLD: 10000000, // 1 Crore
  LAKH_THRESHOLD: 100000, // 1 Lakh
  THOUSAND_THRESHOLD: 1000, // 1K
} as const;

// Helper function to get budget config for tab
export function getBudgetConfigForTab(tab: ListingTab): BudgetConfig {
  return BUDGET_CONFIG[tab];
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  if (amount >= PRICE_FORMAT.CRORE_THRESHOLD) {
    const crores = amount / 10000000;
    return `₹${crores.toFixed(crores % 1 === 0 ? 0 : 1)} Cr`;
  } else if (amount >= PRICE_FORMAT.LAKH_THRESHOLD) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)} L`;
  } else if (amount >= PRICE_FORMAT.THOUSAND_THRESHOLD) {
    return `₹${(amount / 1000).toFixed(0)} K`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
}

// Helper function to validate budget range
export function isValidBudgetRange(
  range: [number, number],
  tab: ListingTab
): boolean {
  const config = getBudgetConfigForTab(tab);
  return (
    range[0] >= config.min &&
    range[1] <= config.max &&
    range[0] <= range[1]
  );
}
