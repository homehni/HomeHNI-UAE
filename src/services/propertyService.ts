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

// Service to fetch public properties (no sensitive owner data) - uses secure database function
export const fetchPublicProperties = async () => {
  const { data, error } = await supabase
    .rpc('get_public_properties');
    
  if (error) {
    console.error('Error fetching public properties:', error);
    throw error;
  }
  
  return data || [];
};

// Service to fetch featured properties for the home page - uses secure database function
export const fetchFeaturedProperties = async () => {
  // Fetch all approved public properties via secure RPC
  const { data, error } = await supabase
    .rpc('get_public_properties');
    
  if (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }

  // Also fetch curated featured entries (publicly selectable)
  const { data: curatedRows, error: curatedErr } = await supabase
    .from('featured_properties')
    .select('property_id, is_active, featured_until, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (curatedErr) {
    console.warn('Warning: could not fetch curated featured_properties rows:', curatedErr);
  }

  const today = new Date();
  const curatedIds = new Set(
    (curatedRows || [])
      .filter(r => !r.featured_until || new Date(r.featured_until) >= today)
      .map(r => r.property_id)
  );
  
  // Include properties marked is_featured OR curated in featured_properties
  const featuredData = (data || [])
    .filter((p: any) => Boolean(p.is_featured) || curatedIds.has(p.id))
    .slice(0, 20);
  
  return featuredData;
};

// Service to fetch a single public property by ID - uses secure database function
export const fetchPublicPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .rpc('get_public_property_by_id', { property_id: id });
    
  if (error) {
    console.error('Error fetching public property:', error);
    return null;
  }
  
  return data && data.length > 0 ? data[0] : null;
};