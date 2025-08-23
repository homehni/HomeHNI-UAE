import { supabase } from '@/integrations/supabase/client';

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
  is_featured?: boolean;
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
  
  return (data as PublicProperty[]) || [];
};

// Service to fetch featured properties for the home page
export const fetchFeaturedProperties = async (): Promise<PublicProperty[]> => {
  const { data, error } = await supabase
    .from('public_properties')
    .select(`
      id,
      title,
      property_type,
      listing_type,
      bhk_type,
      expected_price,
      super_area,
      carpet_area,
      bathrooms,
      balconies,
      floor_no,
      total_floors,
      furnishing,
      availability_type,
      availability_date,
      price_negotiable,
      maintenance_charges,
      security_deposit,
      city,
      locality,
      state,
      pincode,
      street_address,
      landmarks,
      description,
      images,
      videos,
      status,
      created_at,
      updated_at,
      is_featured
    `)
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(20);
    
  if (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
  
  return (data as PublicProperty[]) || [];
};

// Service to fetch a single public property by ID
export const fetchPublicPropertyById = async (id: string): Promise<PublicProperty | null> => {
  const { data, error } = await supabase
    .from('public_properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching public property:', error);
    return null;
  }
  
  return data as PublicProperty | null;
};