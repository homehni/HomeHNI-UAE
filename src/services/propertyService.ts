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

// Service to fetch featured properties for the home page - ONLY from properties table with is_featured=true
export const fetchFeaturedProperties = async () => {
  // Fetch ONLY approved properties from properties table where is_featured is explicitly true
  // This ensures property_submissions are excluded and only show in dashboard/search
  const { data, error } = await supabase
    .rpc('get_public_properties');
    
  if (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }

  // Also fetch curated featured entries (publicly selectable) - only visible properties
  const { data: curatedRows, error: curatedErr } = await supabase
    .from('featured_properties')
    .select(`
      property_id, is_active, featured_until, sort_order,
      properties!inner(is_visible, status)
    `)
    .eq('is_active', true)
    .eq('properties.is_visible', true)
    .eq('properties.status', 'approved')
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
  
  // ONLY include approved properties from properties table with is_featured=true OR curated
  // New submissions (property_submissions) are excluded - they only appear in dashboard and search
  const featuredData = (data || [])
    .filter((p: any) => 
      (Boolean(p.is_featured) || curatedIds.has(p.id)) && 
      p.status === 'approved'
    );
  
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