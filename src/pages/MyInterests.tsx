import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, BedDouble, Bath, Square, Eye, Trash2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import { Helmet } from 'react-helmet';

interface Property {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  status: string;
  created_at: string;
}

interface FavoriteProperty {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  properties: Property;
}

import { useFavorites } from '@/hooks/useFavorites';

export const MyInterests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const { refetchFavorites, toggleFavorite, favorites: localFavorites } = useFavorites();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Fetch user's favorite properties
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        console.log('Fetching favorites for user:', user.id);
        console.log('Local favorites:', localFavorites);
        
        // First get the favorite property IDs from database
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('user_favorites')
          .select('id, property_id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (favoritesError) {
          console.error('Error fetching favorites from DB:', favoritesError);
          throw favoritesError;
        }

        console.log('Database favorites:', favoritesData);

        // Also get local demo favorites from useFavorites hook        
        let combinedData: FavoriteProperty[] = [];

        // Handle database favorites (real properties)
        if (favoritesData && favoritesData.length > 0) {
          // Get the property IDs
          const propertyIds = favoritesData.map(fav => fav.property_id);
          console.log('Fetching properties for IDs:', propertyIds);

          // Fetch via RPC to bypass RLS and get visible, approved properties
          const publicProps = await Promise.all(
            propertyIds.map(async (id) => {
              const { data, error } = await supabase.rpc('get_public_property_by_id', { property_id: id });
              if (error) {
                console.error('Error fetching property via RPC:', id, error);
                return null;
              }
              // RPC returns an array (TABLE), take first row
              return (data && Array.isArray(data) ? data[0] : null) as any | null;
            })
          );

          const uniqueProperties = (publicProps.filter(Boolean) as any[]);

          if (uniqueProperties.length > 0) {
            // Combine the database data for properties that exist
            const dbFavorites = favoritesData.map(favorite => {
              const property = uniqueProperties.find(p => p.id === favorite.property_id);
              if (property) {
                return {
                  id: favorite.id,
                  user_id: user.id,
                  property_id: favorite.property_id,
                  created_at: favorite.created_at,
                  properties: property
                };
              }
              return null;
            }).filter(Boolean) as FavoriteProperty[];
            
            combinedData = [...combinedData, ...dbFavorites];
            console.log('Successfully mapped database favorites:', dbFavorites.length);
          }
        }

        // Do not include demo/local placeholders – only show real DB favorites
        // This prevents hard-coded placeholder cards from appearing
        // If needed later, we can merge valid UUIDs from local state after verifying their existence in DB.

        console.log('Final combined data:', combinedData);
        setFavorites(combinedData);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast({
          title: "Error",
          description: "Failed to load your saved properties. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, toast, localFavorites]);

  const handleRemoveFavorite = async (favoriteId: string, propertyTitle: string) => {
    try {
      // Check if this is a demo or missing property
      const isDemo = favoriteId.startsWith('demo-');
      const isMissing = favoriteId.startsWith('missing-');
      
      if (isDemo || isMissing) {
        // For demo and missing properties, just toggle the favorite status
        const propertyId = isDemo 
          ? favoriteId.replace('demo-', '')
          : favoriteId.replace('missing-', '');
        await toggleFavorite(propertyId);
        
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        
        toast({
          title: isDemo ? "Demo property removed" : "Property removed",
          description: `"${propertyTitle}" has been removed from your saved properties.`,
        });
      } else {
        // For real properties, delete from database
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('id', favoriteId);

        if (error) throw error;

        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        
        // Refresh the favorites in the global hook
        refetchFavorites();
        
        toast({
          title: "Property removed",
          description: `"${propertyTitle}" has been removed from your saved properties.`,
        });
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove property from favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <>
      <Helmet>
        <title>My Saved Properties | Home HNI</title>
        <meta name="description" content="View and manage all the properties you have saved on Home HNI. Keep track of your favorite homes, rentals, and investments in one place." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${window.location.origin}/my-interests`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <Marquee />
        
        <div className="max-w-7xl mx-auto pt-32 p-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Saved Properties</h1>
                <p className="text-gray-600">
                  {favorites.length > 0 
                    ? `You have saved ${favorites.length} ${favorites.length === 1 ? 'property' : 'properties'}`
                    : 'Keep track of properties you\'re interested in'
                  }
                </p>
              </div>
              <Button onClick={() => navigate('/property-search')} variant="outline">
                Browse Properties
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your saved properties...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && favorites.length === 0 && (
            <Card className="mx-auto max-w-md">
              <CardContent className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Saved Properties Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Click the ❤️ on any property to save it to your interests.
                </p>
                <Button onClick={() => navigate('/property-search')} className="bg-brand-red hover:bg-brand-red-dark text-white">
                  Browse Properties
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Properties Grid - Horizontal Card Layout */}
          {!loading && favorites.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {favorites.map((favorite) => {
                const property = favorite.properties;
                return (
                  <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Property Image */}
                    <div className="relative h-32 bg-gray-200">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                      
                      {/* New Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                          New
                        </span>
                      </div>

                      {/* Heart Icon */}
                      <button
                        onClick={() => handleRemoveFavorite(favorite.id, property.title)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </button>
                    </div>

                    <div className="p-3">
                      {/* Property Title */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="text-xs line-clamp-1">{property.locality}, {property.city}</span>
                      </div>

                      {/* Contact Button with Price */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleViewProperty(property.id)}
                          className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          <span className="text-xs font-medium">Contact</span>
                        </button>
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(property.expected_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};