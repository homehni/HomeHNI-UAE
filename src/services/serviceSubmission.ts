import { supabase } from '@/integrations/supabase/client';

export interface ServiceSubmissionData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  serviceType: string;
  serviceSubtype?: string;
  amount?: number;
  message?: string;
  country?: string;
}

export async function submitServiceRequest(data: ServiceSubmissionData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: dbError } = await supabase.from('services').insert({
      name: data.name,
      email: data.email,
      phone: `${data.countryCode} ${data.phone}`,
      service_type: data.serviceType,
      service_subtype: data.serviceSubtype,
      city: data.city,
      amount: data.amount,
      country: data.country || 'India',
      message: data.message,
      details: data.message
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Service submission error:', error);
    return { success: false, error: 'Failed to submit request' };
  }
}
