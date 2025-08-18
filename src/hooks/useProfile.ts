import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentUserProfile, updateUserProfile, updateUserRole, type UserProfile, type UpdateProfileData } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  // Update profile
  const updateProfile = async (updates: UpdateProfileData) => {
    if (!user) return;

    setUpdating(true);
    try {
      await updateUserProfile(updates);
      
      // Refresh profile data
      const updatedProfile = await getCurrentUserProfile();
      setProfile(updatedProfile);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Update role
  const changeRole = async (newRole: 'buyer' | 'seller') => {
    if (!user || !profile) return;

    setUpdating(true);
    try {
      await updateUserRole(user.id, newRole);
      
      // Refresh profile data
      const updatedProfile = await getCurrentUserProfile();
      setProfile(updatedProfile);
      
      toast({
        title: "Success",
        description: `Role updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return {
    profile,
    loading,
    updating,
    updateProfile,
    changeRole,
  };
};