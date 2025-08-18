import { supabase } from '@/integrations/supabase/client';

// Sanitized property interface (matches public_properties view)
export interface PublicProperty {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  floor_no?: number;
  total_floors?: number;
  furnishing?: string;
  availability_type: string;
  availability_date?: string;
  price_negotiable?: boolean;
  maintenance_charges?: number;
  security_deposit?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  street_address?: string;
  landmarks?: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

// Service to fetch public properties (no sensitive owner data)
export const fetchPublicProperties = async (): Promise<PublicProperty[]> => {
  const { data, error } = await supabase
    .from('public_properties')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching public properties:', error);
    throw error;
  }
  
  return data || [];
};

// Service to fetch a single public property by ID
export const fetchPublicPropertyById = async (id: string): Promise<PublicProperty | null> => {
  const { data, error } = await supabase
    .from('public_properties')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching public property:', error);
    return null;
  }
  
  return data;
};