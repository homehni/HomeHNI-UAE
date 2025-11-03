import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  preferences?: {
    searchCriteria?: any;
    communicationPrefs?: {
      email: boolean;
      whatsapp: boolean;
      sms: boolean;
    };
  };
  verification_status: 'unverified' | 'pending' | 'verified';
  whatsapp_opted_in: boolean;
  email_notifications: boolean;
  role: 'admin' | 'buyer' | 'seller' | 'consultant' | 'user' | 'owner' | 'agent';
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  preferences?: any;
  whatsapp_opted_in?: boolean;
  email_notifications?: boolean;
}

// Helper to transform database result to UserProfile
const transformDbProfile = (dbProfile: any): UserProfile => ({
  ...dbProfile,
  location: dbProfile.location as UserProfile['location'] || undefined,
  preferences: dbProfile.preferences as UserProfile['preferences'] || undefined,
});

// Get current user's profile with role
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .rpc('get_user_profile_with_role')
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return transformDbProfile(data);
};

// Update current user's profile
export const updateUserProfile = async (updates: UpdateProfileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
};

// Update user role
export const updateUserRole = async (userId: string, newRole: 'buyer' | 'seller' | 'consultant' | 'admin' | 'user' | 'owner' | 'agent') => {
  const { error } = await supabase
    .rpc('update_user_role', {
      _user_id: userId,
      _new_role: newRole
    });

  if (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Create/update profile during signup
export const createUserProfile = async (profileData: Partial<UpdateProfileData>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No authenticated user found');
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      user_id: user.id,
      ...profileData
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating/updating profile:', error);
    throw error;
  }

  return data;
};

// Get user profile by user ID (admin only)
export const getUserProfileById = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .rpc('get_user_profile_with_role', { _user_id: userId })
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return transformDbProfile(data);
};

// Check if user has specific role
export const hasUserRole = async (role: 'admin' | 'buyer' | 'seller' | 'consultant' | 'user' | 'owner' | 'agent'): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('has_current_user_role', { _role: role });

  if (error) {
    console.error('Error checking user role:', error);
    return false;
  }

  return data || false;
};