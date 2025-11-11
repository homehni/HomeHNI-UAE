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
  message?: string;
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
    // Get the current user's email
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
    
    console.log('leadService: Fetching contacted properties for email:', userEmail);
    
    // Normalize email to lowercase for consistent matching
    const normalizedEmail = userEmail.toLowerCase();
    
    // Try to use the new RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_contacted_properties_with_owners' as any, { p_user_email: normalizedEmail });
    
    // If RPC function exists and works, use it
    if (!rpcError && rpcData && Array.isArray(rpcData)) {
      console.log('leadService: Fetched contacted properties from RPC:', rpcData);
      
      // Transform the RPC response to match the ContactedProperty interface
      const properties: ContactedProperty[] = (rpcData as any[]).map((item: any) => ({
        id: String(item.property_id || ''),
        title: String(item.property_title || ''),
        property_type: String(item.property_type || ''),
        listing_type: String(item.listing_type || ''),
        expected_price: Number(item.expected_price || 0),
        city: String(item.city || ''),
        locality: String(item.locality || ''),
        created_at: String(item.property_created_at || ''),
        images: Array.isArray(item.images) ? item.images : [],
        owner_name: String(item.owner_name || 'Property Owner'),
        owner_email: String(item.owner_email || ''),
        owner_phone: String(item.owner_phone || ''),
        contact_date: String(item.contact_date || ''),
        message: String(item.lead_message || '')
      }));
      
      console.log('leadService: Processed contacted properties:', properties);
      return properties;
    }
    
    // Fallback: If RPC function doesn't exist, use manual approach
    console.log('leadService: RPC function not available, using fallback approach');
    console.log('leadService: RPC Error:', rpcError);
    
    // Get all leads where the email matches the current user
    // Use normalized (lowercase) email for matching since leads store emails in lowercase
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*, property_id')
      .eq('interested_user_email', normalizedEmail)
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
    
    // Extract unique property IDs from leads (deduplicate)
    const propertyIds = [...new Set(leadsData.map(lead => lead.property_id))];
    
    console.log('leadService: Unique property IDs:', propertyIds);
    
    // Get property details and owner information
    const properties: ContactedProperty[] = [];
    
    for (const propertyId of propertyIds) {
      try {
        // Fetch the property details using RPC
        const { data: propertyData, error: propertyError } = await supabase
          .rpc('get_public_property_by_id', { property_id: propertyId });
        
        if (propertyError) {
          console.error(`leadService: Error fetching property ${propertyId}:`, propertyError);
          continue;
        }
        
        if (propertyData && propertyData.length > 0) {
          const property = propertyData[0] as any;
          
          // Get owner contact details using the secure RPC
          let ownerName = 'Property Owner';
          let ownerEmail = '';
          let ownerPhone = '';
          
          try {
            const { data: ownerData, error: ownerError } = await supabase
              .rpc('get_property_owner_contact', { property_id: propertyId });
            
            console.log(`leadService: Owner data for property ${propertyId}:`, ownerData);
            
            if (!ownerError && ownerData && ownerData.length > 0) {
              ownerName = ownerData[0].owner_name || 'Property Owner';
              ownerEmail = ownerData[0].owner_email || '';
              ownerPhone = (ownerData[0] as any).owner_phone || ''; // Phone will be available after migration
            } else {
              console.warn(`Could not fetch owner contact for property ${propertyId}:`, ownerError);
            }
          } catch (ownerErr) {
            console.warn(`Error fetching owner details for property ${propertyId}:`, ownerErr);
          }
          
          // Fallback: Try to get owner info directly from property data if RPC didn't work
          if (!ownerEmail && property.owner_email) {
            ownerEmail = String(property.owner_email);
          }
          if (ownerName === 'Property Owner' && property.owner_name) {
            ownerName = String(property.owner_name);
          }
          if (!ownerPhone && property.owner_phone) {
            ownerPhone = String(property.owner_phone);
          }
          
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
            owner_name: ownerName,
            owner_email: ownerEmail,
            owner_phone: ownerPhone,
            contact_date: lead?.created_at || '',
            message: lead?.message || ''
          });
        }
      } catch (error) {
        console.error(`leadService: Error processing property ${propertyId}:`, error);
      }
    }
    
    console.log('leadService: Processed contacted properties (fallback):', properties);
    
    return properties;
  } catch (error) {
    console.error('leadService: Error in fetchContactedOwners:', error);
    throw error;
  }
};
