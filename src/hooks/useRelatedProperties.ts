import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseRelatedPropertiesOptions {
  city: string;
  currentLocality?: string;
  propertyType: string;
  listingType: string;
}

export const useRelatedProperties = ({ 
  city, 
  currentLocality, 
  propertyType, 
  listingType 
}: UseRelatedPropertiesOptions) => {
  
  // Fetch nearby localities based on actual properties in the same city
  const { data: nearbyLocalities = [], isLoading: isLoadingNearby } = useQuery({
    queryKey: ['nearby-localities', city, currentLocality],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('locality')
        .eq('city', city)
        .eq('status', 'approved')
        .not('locality', 'is', null)
        .not('locality', 'eq', '')
        .limit(100);
      
      if (error) throw error;
      
      // Get unique localities and filter out invalid ones
      const localities = [...new Set(data
        .map(p => String(p.locality).trim())
        .filter(loc => {
          // Filter out numbers, very short strings, or current locality
          return loc && 
                 loc.length > 2 && 
                 !/^[\d\s]+$/.test(loc) && 
                 loc !== currentLocality &&
                 loc.toLowerCase() !== city.toLowerCase();
        })
        .map(loc => loc.split(',')[0]) // Take first part if comma-separated
      )].slice(0, 8);
      
      return localities;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch top localities with most properties
  const { data: topLocalities = [], isLoading: isLoadingTop } = useQuery({
    queryKey: ['top-localities', city, propertyType, listingType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('locality')
        .eq('city', city)
        .eq('property_type', propertyType)
        .eq('listing_type', listingType)
        .eq('status', 'approved')
        .not('locality', 'is', null)
        .not('locality', 'eq', '')
        .limit(200);
      
      if (error) throw error;
      
      // Count occurrences and get most popular localities
      const localityCount: { [key: string]: number } = {};
      
      data.forEach(p => {
        const loc = String(p.locality).trim().split(',')[0];
        if (loc && loc.length > 2 && !/^[\d\s]+$/.test(loc)) {
          localityCount[loc] = (localityCount[loc] || 0) + 1;
        }
      });
      
      // Sort by count and return top localities
      const topLocs = Object.entries(localityCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([locality]) => locality);
      
      return topLocs;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch different property types available in the area
  const { data: relatedTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ['related-property-types', city, currentLocality, propertyType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('property_type')
        .eq('city', city)
        .eq('status', 'approved')
        .not('property_type', 'eq', propertyType);
      
      if (error) throw error;
      
      // Get unique property types
      const types = [...new Set(data.map(p => p.property_type))]
        .filter(type => type && type !== propertyType)
        .slice(0, 4);
      
      return types;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    nearbyLocalities,
    topLocalities,
    relatedTypes,
    isLoading: isLoadingNearby || isLoadingTop || isLoadingTypes,
  };
};
