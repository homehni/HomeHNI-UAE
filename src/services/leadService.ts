import { supabase } from '@/integrations/supabase/client';

export interface CreateLeadData {
  property_id?: string;
  interested_user_name: string;
  interested_user_email: string;
  interested_user_phone?: string;
  message?: string;
  lead_type?: 'inquiry' | 'posting';
  city?: string;
  property_type?: string;
  listing_type?: string;
  whatsapp_opted_in?: boolean;
}

// Service to create a new lead
export const createLead = async (leadData: CreateLeadData) => {
  const insertData: any = { ...leadData };
  
  // Only set placeholder property_owner_id for inquiry leads with property_id
  if (leadData.lead_type === 'inquiry' && leadData.property_id) {
    insertData.property_owner_id = '00000000-0000-0000-0000-000000000000'; // Will be overridden by trigger
  }
  
  const { data, error } = await supabase
    .from('leads')
    .insert([insertData]);

  if (error) {
    console.error('Error creating lead:', error);
    throw error;
  }

  return data;
};

// Service to create a posting lead (for people wanting to post properties)
export const createPostingLead = async (leadData: {
  name: string;
  email: string;
  phone: string;
  city: string;
  whatsapp_opted_in: boolean;
  property_type: string;
  listing_type: string;
}) => {
  const postingLeadData: CreateLeadData = {
    interested_user_name: leadData.name,
    interested_user_email: leadData.email,
    interested_user_phone: leadData.phone,
    city: leadData.city,
    whatsapp_opted_in: leadData.whatsapp_opted_in,
    property_type: leadData.property_type,
    listing_type: leadData.listing_type,
    lead_type: 'posting',
    message: `Interested in posting a ${leadData.property_type} property for ${leadData.listing_type} in ${leadData.city}`
  };
  
  return createLead(postingLeadData);
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