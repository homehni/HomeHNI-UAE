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
  // Note: property_owner_id is automatically set by the set_lead_owner trigger
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      ...leadData,
      property_owner_id: '00000000-0000-0000-0000-000000000000' // Placeholder, will be overridden by trigger
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    throw error;
  }

  return data;
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