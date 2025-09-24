import { supabase } from '@/integrations/supabase/client';

export interface CreateLeadData {
  property_id: string;
  interested_user_name: string;
  interested_user_email: string;
  interested_user_phone?: string;
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