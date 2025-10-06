/**
 * Property Search Domain Types
 * Centralized type definitions for the property search feature
 */

// Database property type (raw from Supabase)
export interface DatabaseProperty {
  id: string;
  title: string;
  locality: string | null;
  city: string | null;
  expected_price: number;
  super_area: number;
  bhk_type: string;
  bathrooms: number;
  images: string[] | null;
  property_type: string;
  furnishing: string | null;
  availability_type: string | null;
  property_age: string | null;
  listing_type: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  is_visible: boolean;
}

// Transformed property for UI display
export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceNumber: number;
  area: string;
  areaNumber: number;
  bedrooms: number;
  bathrooms: number;
  image: string | string[];
  propertyType: string;
  furnished?: string;
  availability?: string;
  ageOfProperty?: string;
  locality: string;
  city: string;
  bhkType: string;
  listingType: string;
  isNew?: boolean;
}

// Search filter types
export type ListingTab = 'buy' | 'rent' | 'commercial' | 'land';

export type PropertyTypeFilter = 
  | 'ALL'
  | 'APARTMENT'
  | 'VILLA'
  | 'INDEPENDENT HOUSE'
  | 'PENTHOUSE'
  | 'DUPLEX'
  | 'GATED COMMUNITY VILLA'
  | 'CO-LIVING'
  | 'BUILDER FLOOR'
  | 'STUDIO APARTMENT'
  | 'CO-WORKING'
  | 'AGRICULTURAL LAND'
  | 'COMMERCIAL LAND'
  | 'INDUSTRIAL LAND'
  | 'OFFICE'
  | 'RETAIL'
  | 'WAREHOUSE'
  | 'SHOWROOM'
  | 'RESTAURANT'
  | 'INDUSTRIAL';

export type BhkType = '1 RK' | '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5+ BHK';

export type FurnishedType = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export type AvailabilityType = 'Ready to Move' | 'Under Construction';

export type ConstructionAge = 'New Project' | '1-5 Years Old' | '5-10 Years Old' | '10+ Years Old';

export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest' | 'area';

export interface SearchFilters {
  propertyType: PropertyTypeFilter[];
  bhkType: BhkType[];
  budget: [number, number];
  locality: string[];
  furnished: FurnishedType[];
  availability: AvailabilityType[];
  construction: ConstructionAge[];
  location: string;
  locations: string[];
  selectedCity: string;
  sortBy: SortOption;
}

// Budget configuration per tab
export interface BudgetConfig {
  min: number;
  max: number;
  step: number;
  presets: Array<{
    label: string;
    range: [number, number];
  }>;
}

// Google Maps types
export interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleMapsPlace {
  formatted_address?: string;
  name?: string;
  address_components?: GoogleMapsAddressComponent[];
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

// API Response types
export interface PropertyLoadResponse {
  data: DatabaseProperty[] | null;
  error: Error | null;
  count: number | null;
}

export interface PropertyCountResponse {
  count: number | null;
  error: Error | null;
}

// Hook return types
export interface UseSimplifiedSearchReturn {
  filters: SearchFilters;
  activeTab: ListingTab;
  setActiveTab: (tab: ListingTab) => void;
  filteredProperties: Property[];
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearAllFilters: () => void;
  availableLocalities: string[];
  isLoading: boolean;
  loadMoreProperties: () => Promise<void>;
  hasMore: boolean;
  propertyCount: number;
  error: Error | null;
}

// Real-time subscription payload
export interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: DatabaseProperty;
  old?: DatabaseProperty;
}

// Error types
export class PropertySearchError extends Error {
  constructor(
    message: string,
    public code: 'LOAD_ERROR' | 'FILTER_ERROR' | 'SUBSCRIPTION_ERROR',
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'PropertySearchError';
  }
}
