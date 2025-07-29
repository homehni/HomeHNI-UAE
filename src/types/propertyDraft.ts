export interface PropertyDraft {
  id?: string;
  user_id?: string;
  step_completed: number;
  status?: 'draft' | 'submitted';
  
  // Property Info
  title?: string;
  property_type?: string;
  listing_type?: 'sale' | 'rent';
  bhk_type?: string;
  bathrooms?: number;
  balconies?: number;
  super_area?: number;
  carpet_area?: number;
  expected_price?: number;
  state?: string;
  city?: string;
  locality?: string;
  pincode?: string;
  description?: string;
  images?: string[];
  videos?: string[];
  
  created_at?: string;
  updated_at?: string;
}

export interface StepData {
  step1: {
    title: string;
    property_type: string;
    listing_type: 'sale' | 'rent';
    bhk_type: string;
    bathrooms: number;
    balconies: number;
    super_area: number;
    carpet_area: number;
    expected_price: number;
    state: string;
    city: string;
    locality: string;
    pincode: string;
    description: string;
    images: string[];
    videos: string[];
  };
}