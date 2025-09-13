import { supabase } from '@/integrations/supabase/client';

export interface CreatePropertyContactData {
  name: string;
  email: string;
  phone: string;
  city: string;
  whatsapp_opted_in: boolean;
  property_type: string;
  listing_type: string;
}

// Service to create a new property contact
export const createPropertyContact = async (contactData: CreatePropertyContactData) => {
  const { data, error } = await supabase
    .from('property_contacts')
    .insert([contactData])
    .select()
    .single();

  if (error) {
    console.error('Error creating property contact:', error);
    throw error;
  }

  return data;
};

// Service to fetch all property contacts (for admin)
export const fetchAllPropertyContacts = async () => {
  const { data, error } = await supabase
    .from('property_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching property contacts:', error);
    throw error;
  }

  return data || [];
};