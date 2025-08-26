import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FavoriteStatus {
  [propertyId: string]: boolean;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteStatus>({});
  const [loading, setLoading] = useState(false);

  // Fetch user's favorites on mount
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites({});
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const favoriteMap: FavoriteStatus = {};
      data?.forEach(fav => {
        favoriteMap[fav.property_id] = true;
      });
      
      setFavorites(favoriteMap);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if property ID is a valid UUID
  const isValidUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Helper function to generate a consistent UUID for demo properties
  const generateConsistentUUID = (propertyId: string): string => {
    // Create a consistent UUID based on the property ID
    // This ensures the same property always gets the same UUID
    const hash = Array.from(propertyId).reduce((hash, char) => {
      hash = ((hash << 5) - hash) + char.charCodeAt(0);
      return hash & hash; // Convert to 32bit integer
    }, 0);
    
    // Convert to a valid UUID format (this is a demo UUID, not cryptographically secure)
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hexHash}-1234-5678-9abc-${hexHash}${hexHash.substring(0, 4)}`;
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save properties to your favorites.",
        variant: "destructive",
      });
      return false;
    }

    // Check if this is a demo property (non-UUID) or real property (UUID)
    const isDemo = !isValidUUID(propertyId);
    
    if (isDemo) {
      // For demo properties, just handle locally without database interaction
      const currentlyFavorited = favorites[propertyId] || false;
      const newStatus = !currentlyFavorited;
      
      setFavorites(prev => ({
        ...prev,
        [propertyId]: newStatus
      }));

      // Show appropriate toast message
      if (newStatus) {
        toast({
          title: "Demo Property Saved",
          description: "This is a demo property. In the real app, this would be saved to your favorites.",
        });
      } else {
        toast({
          title: "Demo Property Removed",
          description: "This demo property has been removed from your favorites.",
        });
      }

      return newStatus;
    }

    // Handle real properties with database interaction
    const currentlyFavorited = favorites[propertyId] || false;
    
    // Optimistically update UI
    setFavorites(prev => ({
      ...prev,
      [propertyId]: !currentlyFavorited
    }));

    try {
      const { data, error } = await supabase.rpc('toggle_property_favorite', {
        property_id: propertyId
      });

      if (error) throw error;

      // Update local state based on server response
      setFavorites(prev => ({
        ...prev,
        [propertyId]: data
      }));

      // Show appropriate toast message
      if (data) {
        toast({
          title: "Property Saved",
          description: "Property has been added to your favorites.",
        });
      } else {
        toast({
          title: "Property Removed",
          description: "Property has been removed from your favorites.",
        });
      }

      return data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Revert optimistic update on error
      setFavorites(prev => ({
        ...prev,
        [propertyId]: currentlyFavorited
      }));

      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      });

      return currentlyFavorited;
    }
  };

  const isFavorite = (propertyId: string): boolean => {
    return favorites[propertyId] || false;
  };

  const getFavoriteCount = (): number => {
    return Object.values(favorites).filter(Boolean).length;
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
    refetchFavorites: fetchFavorites
  };
};