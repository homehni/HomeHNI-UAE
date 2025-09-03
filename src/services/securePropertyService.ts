import { supabase } from '@/integrations/supabase/client';

export interface PublicProperty {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type: string;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  expected_price: number;
  super_area: number;
  carpet_area: number;
  bathrooms: number;
  balconies: number;
  furnishing: string;
  availability_type: string;
  description: string;
  images: string[];
  videos: string[];
  created_at: string;
  status: string;
  price_negotiable: boolean;
  maintenance_charges: number;
  security_deposit: number;
  // Note: owner contact info is NOT included for security
}

export interface PropertyContactInfo {
  owner_name: string;
  contact_message: string;
}

export interface CreateLeadRequest {
  property_id: string;
  interested_user_name: string;
  interested_user_email: string;
  interested_user_phone?: string;
  message?: string;
}

/**
 * Secure service for public property operations
 * Uses the secure public_properties view that excludes sensitive owner data
 */
export class SecurePropertyService {
  
  /**
   * Get all public properties (without owner contact information)
   */
  static async getPublicProperties(): Promise<{ data: PublicProperty[] | null; error: any }> {
    const { data, error } = await supabase
      .rpc('get_public_properties');
      
    return { data, error };
  }

  /**
   * Get a single public property by ID (without owner contact information)
   */
  static async getPublicProperty(id: string): Promise<{ data: PublicProperty | null; error: any }> {
    const { data, error } = await supabase
      .rpc('get_public_property_by_id', { property_id: id });
      
    const result = data && data.length > 0 ? data[0] : null;
    return { data: result, error };
  }

  /**
   * Search public properties with filters (without owner contact information)
   */
  static async searchPublicProperties(filters: {
    city?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    bhkType?: string;
  }): Promise<{ data: PublicProperty[] | null; error: any }> {
    // Get all public properties first using secure function
    const { data, error } = await supabase.rpc('get_public_properties');
    
    if (error) return { data: null, error };
    if (!data) return { data: [], error: null };

    // Apply filters client-side
    let filteredData = data;

    if (filters.city) {
      filteredData = filteredData.filter(p => 
        p.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    if (filters.propertyType) {
      filteredData = filteredData.filter(p => p.property_type === filters.propertyType);
    }
    if (filters.listingType) {
      filteredData = filteredData.filter(p => p.listing_type === filters.listingType);
    }
    if (filters.minPrice) {
      filteredData = filteredData.filter(p => p.expected_price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filteredData = filteredData.filter(p => p.expected_price <= filters.maxPrice!);
    }
    if (filters.bhkType) {
      filteredData = filteredData.filter(p => p.bhk_type === filters.bhkType);
    }

    return { data: filteredData, error: null };
  }

  /**
   * Get limited contact info for a property (secure function)
   * Only returns owner name and generic contact message
   */
  static async getPropertyContactInfo(propertyId: string): Promise<{ data: PropertyContactInfo | null; error: any }> {
    const { data, error } = await supabase.rpc('get_property_contact_info', {
      property_id: propertyId
    });

    if (error) return { data: null, error };
    
    return { data: data?.[0] || null, error };
  }

  /**
   * Create a secure lead inquiry (replaces direct contact access)
   * This is the secure way to connect interested users with property owners
   */
  static async createPropertyLead(leadData: CreateLeadRequest): Promise<{ data: string | null; error: any }> {
    const { data, error } = await supabase.rpc('create_property_lead', {
      property_id: leadData.property_id,
      interested_user_name: leadData.interested_user_name,
      interested_user_email: leadData.interested_user_email,
      interested_user_phone: leadData.interested_user_phone || null,
      message: leadData.message || null
    });

    return { data, error };
  }

  /**
   * Get properties by location (for map view, etc.)
   */
  static async getPropertiesByLocation(city: string, state?: string): Promise<{ data: PublicProperty[] | null; error: any }> {
    // Get all public properties first using secure function
    const { data, error } = await supabase.rpc('get_public_properties');
    
    if (error) return { data: null, error };
    if (!data) return { data: [], error: null };

    // Filter by location client-side
    let filteredData = data.filter(p => 
      p.city.toLowerCase().includes(city.toLowerCase())
    );

    if (state) {
      filteredData = filteredData.filter(p => 
        p.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    return { data: filteredData, error: null };
  }

  /**
   * Get featured properties (newest or highest priced)
   */
  static async getFeaturedProperties(limit: number = 6): Promise<{ data: PublicProperty[] | null; error: any }> {
    const { data, error } = await supabase
      .rpc('get_public_properties');
      
    if (error) {
      return { data: null, error };
    }
    
    // Filter for featured properties and apply limit
    const featuredData = (data || []).filter(property => property.is_featured).slice(0, limit);
    return { data: featuredData, error: null };
  }

  /**
   * Get property statistics (safe aggregated data)
   */
  static async getPropertyStats(): Promise<{ 
    data: { 
      total_properties: number; 
      avg_price: number; 
      cities_count: number; 
    } | null; 
    error: any 
  }> {
    // Use secure function to get property data
    const { data, error } = await supabase.rpc('get_public_properties');

    if (error) return { data: null, error };
    if (!data) return { data: null, error: null };

    const uniqueCities = new Set(data.map(p => p.city));
    const avgPrice = data.reduce((sum, p) => sum + (p.expected_price || 0), 0) / data.length;

    return {
      data: {
        total_properties: data.length,
        avg_price: Math.round(avgPrice),
        cities_count: uniqueCities.size
      },
      error: null
    };
  }
}