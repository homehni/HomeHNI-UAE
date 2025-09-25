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

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save properties to your favorites.",
        className: "bg-white border border-red-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(var(--primary))",
        },
      });
      return false;
    }

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

      if (error) {
        // Handle the case where property doesn't exist in database (demo properties)
        if (error.message?.includes('invalid input syntax for type uuid') || 
            error.message?.includes('does not exist') ||
            error.message?.includes('violates foreign key constraint')) {
          
          // For demo properties, just handle locally
          const newStatus = !currentlyFavorited;
          setFavorites(prev => ({
            ...prev,
            [propertyId]: newStatus
          }));

          toast({
            title: newStatus ? "Demo Property Saved" : "Demo Property Removed", 
            description: newStatus 
              ? "This is a demo property. In the real app, this would be saved to your favorites."
              : "This demo property has been removed from your favorites.",
            className: "bg-white border border-red-200 shadow-lg rounded-lg",
            style: {
              borderLeft: "8px solid hsl(var(--primary))",
            },
          });

          return newStatus;
        }
        
        throw error;
      }

      // Update local state based on server response for real properties
      setFavorites(prev => ({
        ...prev,
        [propertyId]: data
      }));

      // Show appropriate toast message for real properties
      if (data) {
        toast({
          title: "Property Saved",
          description: "Property has been added to your favorites.",
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(var(--primary))",
          },
        });
      } else {
        toast({
          title: "Property Removed",
          description: "Property has been removed from your favorites.",
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(var(--primary))",
          },
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
        className: "bg-white border border-red-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(var(--primary))",
        },
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