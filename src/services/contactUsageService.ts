import { supabase } from '@/integrations/supabase/client';

export interface ContactUsageStatus {
  canContact: boolean;
  remainingUses: number;
}

// Check if user can contact owners (has free uses remaining)
export const checkContactUsage = async (): Promise<ContactUsageStatus> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { canContact: false, remainingUses: 0 };
    }

    const { data, error } = await supabase
      .rpc('can_contact_owner', { user_uuid: user.id });

    if (error) {
      console.error('Error checking contact usage:', error);
      return { canContact: false, remainingUses: 0 };
    }

    // Get remaining uses from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('free_contact_uses')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { canContact: false, remainingUses: 0 };
    }

    return {
      canContact: data,
      remainingUses: profile?.free_contact_uses || 0
    };
  } catch (error) {
    console.error('Error in checkContactUsage:', error);
    return { canContact: false, remainingUses: 0 };
  }
};

// Use a contact attempt (decrements free uses)
export const useContactAttempt = async (): Promise<{ success: boolean; remainingUses: number }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, remainingUses: 0 };
    }

    const { data, error } = await supabase
      .rpc('use_contact_attempt', { user_uuid: user.id });

    if (error) {
      console.error('Error using contact attempt:', error);
      return { success: false, remainingUses: 0 };
    }

    // data is an array, get the first result
    const result = data[0];
    return {
      success: result.success,
      remainingUses: result.remaining_uses
    };
  } catch (error) {
    console.error('Error in useContactAttempt:', error);
    return { success: false, remainingUses: 0 };
  }
};