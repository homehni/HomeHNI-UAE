import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, BedDouble, Bath, Square, Eye, Trash2 } from 'lucide-react';
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

          // First try to fetch from properties table (without status filter)
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .in('id', propertyIds);

          console.log('Properties from main table:', propertiesData);
          console.log('Properties error:', propertiesError);

          // Also try to fetch from properties table
          const { data: publicPropertiesData, error: publicPropertiesError } = await supabase
            .from('properties')
            .select('*')
            .in('id', propertyIds);

          console.log('Properties from public view:', publicPropertiesData);
          console.log('Public properties error:', publicPropertiesError);

          // Combine results from both queries
          const allProperties = [
            ...(propertiesData || []),
            ...(publicPropertiesData || [])
          ];

          // Remove duplicates by ID
          const uniqueProperties = allProperties.filter((property, index, self) => 
            index === self.findIndex(p => p.id === property.id)
          );

          console.log('All unique properties found:', uniqueProperties);

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

        // Handle demo properties (from local state that aren't in database)
        console.log('Processing local favorites:', Object.entries(localFavorites));
        Object.entries(localFavorites).forEach(([propertyId, isFavorited]) => {
          if (isFavorited && !combinedData.find(f => f.property_id === propertyId)) {
            console.log('Adding missing property as demo:', propertyId);
            // Check if this is likely a demo property (non-UUID format)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            
            if (!uuidRegex.test(propertyId)) {
              // Create a demo property object for non-UUID properties
              combinedData.push({
                id: `demo-${propertyId}`,
                user_id: user.id,
                property_id: propertyId,
                created_at: new Date().toISOString(),
                properties: {
                  id: propertyId,
                  title: "Demo Property - Featured Listing",
                  property_type: "apartment",
                  listing_type: "sale",
                  bhk_type: "3BHK",
                  expected_price: 8500000,
                  super_area: 1200,
                  carpet_area: 1000,
                  bathrooms: 3,
                  balconies: 2,
                  city: "Delhi",
                  locality: "Online Only",
                  state: "Delhi",
                  pincode: "110001",
                  description: "This is a demo property for showcase purposes.",
                  images: ["/placeholder.svg"],
                  status: "approved",
                  created_at: new Date().toISOString()
                }
              });
            } else {
              // This is a valid UUID but not found in database - create a placeholder
              combinedData.push({
                id: `missing-${propertyId}`,
                user_id: user.id,
                property_id: propertyId,
                created_at: new Date().toISOString(),
                properties: {
                  id: propertyId,
                  title: "Saved Property - Currently Unavailable",
                  property_type: "apartment",
                  listing_type: "sale",
                  bhk_type: "3BHK",
                  expected_price: 8500000,
                  super_area: 1200,
                  carpet_area: 1000,
                  bathrooms: 3,
                  balconies: 2,
                  city: "Mumbai",
                  locality: "Property Details Loading...",
                  state: "Maharashtra",
                  pincode: "400001",
                  description: "This property was saved but details are currently unavailable. It may have been removed or is under review.",
                  images: ["/placeholder.svg"],
                  status: "approved",
                  created_at: new Date().toISOString()
                }
              });
            }
          }
        });

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

          {/* Properties Grid */}
          {!loading && favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => {
                const property = favorite.properties;
                return (
                  <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Property Image */}
                    <div className="relative h-48 bg-gray-200">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      
                      {/* Remove Favorite Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(favorite.id, property.title)}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>

                      {/* Property Type Badge */}
                      <Badge className="absolute top-2 left-2 bg-brand-red text-white">
                        {property.listing_type}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      {/* Price */}
                      <div className="text-xl font-bold text-brand-red mb-2">
                        {formatPrice(property.expected_price)}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.locality}</span>
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        {property.bhk_type && (
                          <div className="flex items-center">
                            <BedDouble className="h-4 w-4 mr-1" />
                            {property.bhk_type}
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms}
                          </div>
                        )}
                        {property.super_area && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {property.super_area} sq ft
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleViewProperty(property.id)}
                          className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleRemoveFavorite(favorite.id, property.title)}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};