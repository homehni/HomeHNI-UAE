// Type guards and helper functions for Property/PGProperty union types

export const isProperty = (property: any): property is Property => {
  return property && 'listing_type' in property;
};

export const isPGProperty = (property: any): property is PGProperty => {
  return property && 'expected_rent' in property;
};

// Safe property accessors
export const getPropertyValue = <T>(
  property: Property | PGProperty | null,
  key: keyof Property,
  fallback?: T
): T | undefined => {
  if (!property || !isProperty(property)) return fallback;
  return (property as any)[key] ?? fallback;
};

export const getPGPropertyValue = <T>(
  property: Property | PGProperty | null,
  key: keyof PGProperty,
  fallback?: T
): T | undefined => {
  if (!property || !isPGProperty(property)) return fallback;
  return (property as any)[key] ?? fallback;
};

// Interface definitions (to be imported where needed)
interface Property {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_role?: string;
  property_age?: string;
  floor_type?: string;
  total_floors?: number;
  floor_no?: number;
  amenities?: string[];
  landmark?: string;
  plot_area?: number;
  length?: number;
  width?: number;
  boundary_wall?: string;
  floors_allowed?: number;
  gated_project?: string;
  water_supply?: string;
  electricity_connection?: string;
  sewage_connection?: string;
  road_width?: number;
  gated_security?: boolean | string;
  directions?: string;
}

interface PGProperty {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  expected_rent: number;
  expected_deposit: number;
  state: string;
  city: string;
  locality: string;
  landmark?: string;
  place_available_for: string;
  preferred_guests: string;
  available_from?: string;
  food_included: boolean;
  gate_closing_time?: string;
  description?: string;
  available_services?: any;
  amenities?: any;
  parking?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}