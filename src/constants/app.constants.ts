/**
 * Application-wide Constants
 * Centralized location for all magic numbers, strings, and configuration values
 */

/**
 * API and External Services
 */
export const API_CONSTANTS = {
  /** OpenStreetMap Nominatim base URL */
  NOMINATIM_BASE_URL: 'https://nominatim.openstreetmap.org',
  
  /** Required User-Agent for Nominatim API */
  NOMINATIM_USER_AGENT: 'HomeHNI-PropertySearch/1.0',
  
  /** Maximum number of location search results */
  LOCATION_SEARCH_LIMIT: 5,
  
  /** Country code for location searches (India) */
  COUNTRY_CODE: 'in',
  
  /** Batch size for property loading */
  PROPERTY_BATCH_SIZE: 50,
  
  /** Debounce delay for search inputs (ms) */
  SEARCH_DEBOUNCE_MS: 300,
} as const;

/**
 * UI/UX Constants
 */
export const UI_CONSTANTS = {
  /** Maximum number of locations user can select */
  MAX_LOCATIONS: 3,
  
  /** Properties per page in grid/list view */
  ITEMS_PER_PAGE: 12,
  
  /** Maximum number of pagination buttons to show */
  MAX_PAGE_BUTTONS: 5,
  
  /** Number of skeleton loaders during loading */
  SKELETON_COUNT: 6,
  
  /** Duration to show toast notifications (ms) */
  TOAST_DURATION: 3000,
  
  /** Days to consider a property as "new" */
  NEW_PROPERTY_DAYS: 7,
  
  /** Minimum characters before triggering search */
  MIN_SEARCH_CHARS: 2,
} as const;

/**
 * Price and Budget Constants
 */
export const PRICE_CONSTANTS = {
  /** Threshold for displaying in Crores (1 Crore = 10 Million) */
  CRORE_THRESHOLD: 10000000,
  
  /** Threshold for displaying in Lakhs (1 Lakh = 100 Thousand) */
  LAKH_THRESHOLD: 100000,
  
  /** Threshold for displaying in Thousands */
  THOUSAND_THRESHOLD: 1000,
  
  /** Maximum budget for rent listings (5 Lakh) */
  RENT_MAX_BUDGET: 500000,
  
  /** Step size for rent budget slider (10K) */
  RENT_BUDGET_STEP: 10000,
  
  /** Maximum budget for buy/commercial listings (5 Crore) */
  BUY_MAX_BUDGET: 50000000,
  
  /** Step size for buy/commercial budget slider (5 Lakh) */
  BUY_BUDGET_STEP: 500000,
} as const;

/**
 * Database and Query Constants
 */
export const DATABASE_CONSTANTS = {
  /** Status filter for approved properties */
  APPROVED_STATUS: 'approved',
  
  /** Default visibility for public properties */
  PUBLIC_VISIBILITY: true,
  
  /** Essential fields to fetch from properties table */
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
  
  /** Timeout for database queries (ms) */
  QUERY_TIMEOUT: 10000,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  LOCATION_SEARCH_FAILED: 'Failed to search locations. Please try again.',
  PROPERTIES_LOAD_FAILED: 'Failed to load properties. Please refresh the page.',
  NO_PROPERTIES_FOUND: 'No properties found matching your criteria.',
  INVALID_BUDGET_RANGE: 'Invalid budget range selected.',
  MAX_LOCATIONS_REACHED: 'You can select up to 3 locations.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  PROPERTIES_LOADED: 'Properties loaded successfully',
  LOCATION_ADDED: 'Location added to filters',
  FILTERS_CLEARED: 'All filters cleared',
  FILTERS_APPLIED: 'Filters applied successfully',
} as const;

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  PROPERTY_SEARCH: '/property-search',
  PROPERTY_DETAILS: '/property-details/:id',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'homehni_user_preferences',
  RECENT_SEARCHES: 'homehni_recent_searches',
  SAVED_FILTERS: 'homehni_saved_filters',
  VIEW_MODE: 'homehni_view_mode',
} as const;

/**
 * Regular Expressions
 */
export const REGEX_PATTERNS = {
  /** Email validation */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  /** Indian phone number (10 digits) */
  PHONE: /^[6-9]\d{9}$/,
  
  /** Alphanumeric with spaces */
  ALPHANUMERIC_SPACE: /^[a-zA-Z0-9\s]+$/,
  
  /** Numbers only */
  NUMBERS_ONLY: /^\d+$/,
} as const;

/**
 * Property Type Icons/Emojis
 */
export const PROPERTY_ICONS = {
  APARTMENT: '🏢',
  VILLA: '🏡',
  'INDEPENDENT HOUSE': '🏠',
  PENTHOUSE: '🏙️',
  DUPLEX: '🏘️',
  OFFICE: '🏢',
  RETAIL: '🏪',
  WAREHOUSE: '🏭',
  LAND: '🌳',
  DEFAULT: '📍',
} as const;

/**
 * Animation Durations (ms)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

/**
 * Breakpoints for responsive design (matches Tailwind)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Z-Index Layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 2000,
  TOAST: 3000,
  TOOLTIP: 4000,
} as const;
