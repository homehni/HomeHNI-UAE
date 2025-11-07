import { supabase } from '@/integrations/supabase/client';

export interface LeadAccessStatus {
  hasBasicAccess: boolean;
  hasPremiumAccess: boolean;
  accessType: 'none' | 'basic' | 'premium';
}

export interface PostRequirementLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  locality: string | null;
  intent: string;
  property_types: string[];
  service_category: string;
  budget_min: number | null;
  budget_max: number | null;
  notes: string | null;
  reference_id: string;
  created_at: string;
}

// Check if user has access to leads
export const checkLeadAccess = async (userId: string): Promise<LeadAccessStatus> => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('plan_name, status, expires_at')
      .eq('user_id', userId)
      .eq('status', 'SUCCESS')
      .or('plan_name.ilike.%Basic Leads Package%,plan_name.ilike.%Premium Leads Package%')
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error checking lead access:', error);
      return { hasBasicAccess: false, hasPremiumAccess: false, accessType: 'none' };
    }

    if (!payments || payments.length === 0) {
      return { hasBasicAccess: false, hasPremiumAccess: false, accessType: 'none' };
    }

    // Check for premium first (premium includes basic access)
    const hasPremium = payments.some(payment => 
      payment.plan_name.toLowerCase().includes('premium leads') &&
      (!payment.expires_at || new Date(payment.expires_at) > new Date())
    );

    const hasBasic = payments.some(payment => 
      payment.plan_name.toLowerCase().includes('basic leads') &&
      (!payment.expires_at || new Date(payment.expires_at) > new Date())
    );

    return {
      hasBasicAccess: hasBasic || hasPremium,
      hasPremiumAccess: hasPremium,
      accessType: hasPremium ? 'premium' : hasBasic ? 'basic' : 'none'
    };
  } catch (error) {
    console.error('Error in checkLeadAccess:', error);
    return { hasBasicAccess: false, hasPremiumAccess: false, accessType: 'none' };
  }
};

// Fetch leads from post_requirement table
export const fetchAvailableLeads = async (): Promise<PostRequirementLead[]> => {
  try {
    // Note: RLS policy needs to be updated to allow users with lead access to view
    // For now, we'll try to fetch leads - if RLS blocks it, we'll get an error
    const { data, error } = await supabase
      .from('post_requirement')
      .select('*')
      .in('intent', ['Buy', 'Sell', 'Lease'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      // If RLS policy blocks access, return empty array
      if (error.code === '42501' || error.message?.includes('permission')) {
        console.warn('RLS policy may need to be updated to allow lead access');
      }
      return [];
    }

    return (data || []) as PostRequirementLead[];
  } catch (error) {
    console.error('Error in fetchAvailableLeads:', error);
    return [];
  }
};

// Send follow-up email (placeholder - backend will implement)
export const sendLeadFollowUp = async (leadId: string, leadEmail: string, leadName: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // TODO: Replace with actual backend API call
    // For now, this is a placeholder
    console.log('Sending follow-up email to:', leadEmail, 'for lead:', leadId);
    
    // This will be replaced with actual API call:
    // const response = await fetch('/api/leads/follow-up', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ leadId, leadEmail, leadName })
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending follow-up:', error);
    return { success: false, error: 'Failed to send follow-up email' };
  }
};

