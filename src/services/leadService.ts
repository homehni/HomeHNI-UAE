import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CreateLeadData {
  property_id: string;
  interested_user_name: string;
  interested_user_email: string;
  interested_user_phone?: string;
  message?: string;
}

export interface ContactedProperty {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  expected_price: number;
  city: string;
  locality: string;
  created_at: string;
  images?: string[];
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  contact_date: string;
}

// Service to create a new lead
export const createLead = async (leadData: CreateLeadData) => {
  console.log('leadService: Creating lead using RPC function for property:', leadData.property_id);
  
  try {
    // Use the new RPC function to create leads
    const { data, error } = await supabase
      .rpc('create_contact_lead', {
        p_property_id: leadData.property_id,
        p_user_name: leadData.interested_user_name,
        p_user_email: leadData.interested_user_email,
        p_user_phone: leadData.interested_user_phone,
        p_message: leadData.message
      });

    if (error) {
      console.error('leadService: RPC function failed:', error);
      throw error;
    }

    console.log('leadService: Lead created successfully via RPC:', data);
    
    // Return a properly formatted lead object
    return {
      id: data,
      property_id: leadData.property_id,
      interested_user_name: leadData.interested_user_name,
      interested_user_email: leadData.interested_user_email,
      interested_user_phone: leadData.interested_user_phone || '',
      message: leadData.message || '',
      status: 'new',
      created_at: new Date().toISOString()
    };

  } catch (error) {
    console.error('leadService: Error creating lead:', error);
    throw error;
  }
};

// Service to fetch leads for property owners
export const fetchLeadsForOwner = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      properties:properties(title, city, locality)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  return data || [];
};

// Service to fetch properties where the current user has contacted owners
export const fetchContactedOwners = async (userId: string) => {
  console.log('leadService: Fetching properties where user has contacted owners, userId:', userId);
  
  try {
    // First, get leads with property information where the current user is the interested party
    // We'll use the current user's email to match against interested_user_email
    const { data: currentUser, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('leadService: Error getting current user:', userError);
      throw userError;
    }
    
    const userEmail = currentUser.user?.email;
    
    if (!userEmail) {
      console.error('leadService: User email not available');
      return [];
    }
    
    // Get all leads where the email matches the current user
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*, property_id')
      .eq('interested_user_email', userEmail)
      .order('created_at', { ascending: false });
    
    if (leadsError) {
      console.error('leadService: Error fetching leads:', leadsError);
      throw leadsError;
    }
    
    console.log('leadService: Found leads for user email:', leadsData);
    
    // If no leads found, return empty array
    if (!leadsData || leadsData.length === 0) {
      return [];
    }
    
    // Extract property IDs from leads
    const propertyIds = leadsData.map(lead => lead.property_id);
    
    // Get property details using the property IDs
    const properties: ContactedProperty[] = [];
    
    for (const propertyId of propertyIds) {
      try {
        // Fetch the property details using RPC to bypass RLS
        const { data: propertyData, error: propertyError } = await supabase
          .rpc('get_public_property_by_id', { property_id: propertyId });
        
        if (propertyError) {
          console.error(`leadService: Error fetching property ${propertyId}:`, propertyError);
          continue;
        }
        
        if (propertyData && propertyData.length > 0) {
          // Need to use any for this dynamic data structure from RPC
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const property = propertyData[0] as any;
          
          // Find the corresponding lead to get contact date
          const lead = leadsData.find(l => l.property_id === propertyId);
          
          properties.push({
            id: String(property.id || ''),
            title: String(property.title || ''),
            property_type: String(property.property_type || ''),
            listing_type: String(property.listing_type || ''),
            expected_price: Number(property.expected_price || 0),
            city: String(property.city || ''),
            locality: String(property.locality || ''),
            created_at: String(property.created_at || ''),
            images: Array.isArray(property.images) ? property.images : [],
            // Try all possible field names for owner contact details and convert to string
            owner_name: String(property.owner_name || property.user_name || ''),  
            owner_email: String(property.owner_email || property.user_email || ''),
            owner_phone: String(property.owner_phone || property.user_phone || ''),
            contact_date: lead?.created_at || ''
          });
        }
      } catch (error) {
        console.error(`leadService: Error processing property ${propertyId}:`, error);
      }
    }
    
    console.log('leadService: Processed contacted properties:', properties);
    
    return properties;
  } catch (error) {
    console.error('leadService: Error in fetchContactedOwners:', error);
    throw error;
  }
};