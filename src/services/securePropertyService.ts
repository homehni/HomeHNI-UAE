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
  rental_status?: 'available' | 'rented' | 'sold';
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
    console.log('SecurePropertyService: Attempting to create lead via RPC');
    
    // First, let's check if the property exists and get its owner
    const { data: propertyCheck, error: propertyError } = await supabase
      .from('properties')
      .select('id, user_id, status')
      .eq('id', leadData.property_id)
      .limit(1);
    
    const property = propertyCheck?.[0] || null;
    console.log('SecurePropertyService: Property check result:', { 
      propertyCheck, 
      propertyError,
      propertyErrorMessage: propertyError?.message,
      propertyErrorCode: propertyError?.code,
      propertyId: leadData.property_id,
      hasProperty: !!property,
      propertyUserId: property?.user_id,
      propertyStatus: property?.status,
      propertyCount: propertyCheck?.length
    });
    
    if (propertyError) {
      console.log('SecurePropertyService: Property not found in main properties table, checking property_submissions...');
      
      // Check if it's in property_submissions table
      const { data: submissionCheck, error: submissionError } = await supabase
        .from('property_submissions')
        .select('id, user_id, status')
        .eq('id', leadData.property_id)
        .limit(1);
      
      const submission = submissionCheck?.[0] || null;
      console.log('SecurePropertyService: Submission check result:', { 
        submissionCheck, 
        submissionError,
        submissionErrorMessage: submissionError?.message,
        submissionErrorCode: submissionError?.code,
        hasSubmission: !!submission,
        submissionUserId: submission?.user_id,
        submissionStatus: submission?.status,
        submissionCount: submissionCheck?.length
      });
      
      if (submissionError) {
        console.log('SecurePropertyService: Property not found in either table. RLS prevents direct insertion.');
        console.log('SecurePropertyService: Attempting RPC function anyway - it might work with different property lookup...');
        
        // The RPC function has its own property lookup logic, let's try it anyway
        // It might find the property in a way our queries don't
      }
      
      if (submission && !submission.user_id) {
        console.log('SecurePropertyService: Property found in submissions but no user_id, proceeding with RPC anyway...');
      } else if (submission) {
        console.log('SecurePropertyService: Found property in submissions table, proceeding with RPC...');
      }
    }
    
    if (property && !property.user_id) {
      console.log('SecurePropertyService: Property found in main table but no user_id, proceeding with RPC anyway...');
    }
    
    // Now try the RPC function
    const { data, error } = await supabase.rpc('create_property_lead', {
      property_id: leadData.property_id,
      interested_user_name: leadData.interested_user_name,
      interested_user_email: leadData.interested_user_email,
      interested_user_phone: leadData.interested_user_phone || null,
      message: leadData.message || null
    });

    console.log('SecurePropertyService: RPC result:', { data, error });
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