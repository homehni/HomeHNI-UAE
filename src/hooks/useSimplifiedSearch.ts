import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceNumber: number;
  area: string;
  areaNumber: number;
  bedrooms: number;
  bathrooms: number;
  image: string | string[];
  propertyType: string;
  furnished?: string;
  availability?: string;
  ageOfProperty?: string;
  locality: string;
  city: string;
  bhkType: string;
  listingType: string;
  isNew?: boolean;
}

interface SearchFilters {
  propertyType: string[];
  bhkType: string[];
  budget: [number, number];
  locality: string[];
  furnished: string[];
  availability: string[];
  construction: string[];
  location: string;
  sortBy: string;
}

export const useSimplifiedSearch = () => {
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: searchParams.get('propertyType') ? [searchParams.get('propertyType')!] : [],
    bhkType: [],
    budget: [0, 50000000],
    locality: [],
    furnished: [],
    availability: [],
    construction: [],
    location: searchParams.get('location') || '',
    sortBy: 'relevance'
  });

  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'buy');
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all properties on mount
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        // Load both regular properties and PG/Hostel properties
        const [propertiesResult, pgResult] = await Promise.all([
          supabase.rpc('get_public_properties'),
          supabase.rpc('get_public_pg_hostel_properties')
        ]);

        if (propertiesResult.error) throw propertiesResult.error;
        if (pgResult.error) throw pgResult.error;

        // Transform regular properties
        const transformedProperties = (propertiesResult.data || []).map((property: any) => {
          console.log('🏠 Regular Property:', {
            id: property.id,
            title: property.title,
            listing_type: property.listing_type,
            property_type: property.property_type
          });
          
          let displayPropertyType = property.property_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Property';
          
          return {
            id: property.id,
            title: property.title,
            location: `${property.locality || ''}, ${property.city || ''}`.replace(/^,\s*|,\s*$/g, ''),
            price: (() => {
              const price = property.expected_price;
              if (price === 10000000) {
                return '₹1 Cr';
              } else if (price >= 10000000) {
                return `₹${(price / 10000000).toFixed(1)} Cr`;
              } else if (price >= 100000) {
                return `₹${(price / 100000).toFixed(1)} L`;
              } else if (price >= 1000) {
                return `₹${(price / 1000).toFixed(0)} K`;
              } else {
                return `₹${price?.toLocaleString() || '0'}`;
              }
            })(),
            priceNumber: property.expected_price || 0,
            area: `${property.super_area || 0} sq ft`,
            areaNumber: property.super_area || 0,
            bedrooms: parseInt(property.bhk_type?.replace(/[^\d]/g, '') || '0'),
            bathrooms: property.bathrooms || 0,
            image: property.images && property.images.length > 0 
              ? property.images[0] 
              : '/placeholder.svg',
            propertyType: displayPropertyType,
            furnished: property.furnishing?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            availability: property.availability_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            ageOfProperty: property.property_age?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            locality: property.locality || '',
            city: property.city || '',
            bhkType: property.bhk_type || '1bhk',
            listingType: property.listing_type || 'sale',
            isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          };
        });

        // Transform PG/Hostel properties
        const transformedPGProperties = (pgResult.data || []).map((property: any) => {
          console.log('🏠 PG Property:', {
            id: property.id,
            title: property.title,
            property_type: property.property_type,
            expected_rent: property.expected_rent
          });
          
          return {
            id: property.id,
            title: property.title,
            location: `${property.locality || ''}, ${property.city || ''}`.replace(/^,\s*|,\s*$/g, ''),
            price: `₹${property.expected_rent?.toLocaleString() || '0'}/month`,
            priceNumber: property.expected_rent || 0,
            area: `PG/Hostel`,
            areaNumber: 1,
            bedrooms: 1,
            bathrooms: 1,
            image: property.images && property.images.length > 0 
              ? property.images[0] 
              : '/placeholder.svg',
            propertyType: 'PG Hostel',
            furnished: 'Furnished',
            availability: 'Available',
            ageOfProperty: 'New',
            locality: property.locality || '',
            city: property.city || '',
            bhkType: '1rk',
            listingType: 'rent', // PG/Hostels are always rentals
            isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          };
        });

        // Combine both types
        const allTransformedProperties = [...transformedProperties, ...transformedPGProperties];
        console.log('📊 Total properties loaded:', allTransformedProperties.length);
        console.log('📊 Listing types:', [...new Set(allTransformedProperties.map(p => p.listingType))]);
        
        setAllProperties(allTransformedProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    let filtered = [...allProperties];

    // Filter by active tab (buy/rent/commercial) using listing_type
    console.log('🔍 Filtering by activeTab:', activeTab);
    console.log('📊 Total properties before filter:', filtered.length);
    
    if (activeTab === 'buy') {
      // For buy tab, show only sale properties
      filtered = filtered.filter(property => {
        const listingType = property.listingType?.toLowerCase();
        const isMatch = listingType === 'sale' || listingType === 'resale';
        if (!isMatch) {
          console.log('❌ Filtered out for buy:', property.title, 'listing_type:', listingType);
        }
        return isMatch;
      });
    } else if (activeTab === 'rent') {
      // For rent tab, show rental properties and PG/Hostels
      filtered = filtered.filter(property => {
        const listingType = property.listingType?.toLowerCase();
        const propertyType = property.propertyType.toLowerCase();
        const isMatch = listingType === 'rent' || 
               listingType === 'pg/hostel' || 
               propertyType.includes('pg') || 
               propertyType.includes('hostel');
        if (!isMatch) {
          console.log('❌ Filtered out for rent:', property.title, 'listing_type:', listingType, 'property_type:', propertyType);
        }
        return isMatch;
      });
    } else if (activeTab === 'commercial') {
      // For commercial tab, show commercial properties
      filtered = filtered.filter(property => {
        const listingType = property.listingType?.toLowerCase();
        const propertyType = property.propertyType.toLowerCase();
        const isMatch = listingType === 'commercial' ||
               propertyType.includes('commercial') ||
               propertyType.includes('office') ||
               propertyType.includes('shop') ||
               propertyType.includes('warehouse') ||
               propertyType.includes('showroom');
        if (!isMatch) {
          console.log('❌ Filtered out for commercial:', property.title, 'listing_type:', listingType, 'property_type:', propertyType);
        }
        return isMatch;
      });
    }
    
    console.log('📊 Properties after tab filter:', filtered.length);

    // Apply property type filter
    if (filters.propertyType.length > 0 && !filters.propertyType.includes('ALL')) {
      filtered = filtered.filter(property => {
        return filters.propertyType.some(filterType => {
          const normalizedFilter = filterType.toLowerCase().replace(/\s+/g, '');
          const normalizedProperty = property.propertyType.toLowerCase().replace(/\s+/g, '');
          
          // Special mappings
          if (normalizedFilter.includes('apartment') || normalizedFilter.includes('flat')) {
            return normalizedProperty.includes('apartment') || normalizedProperty.includes('flat');
          }
          if (normalizedFilter.includes('villa')) {
            return normalizedProperty.includes('villa');
          }
          if (normalizedFilter.includes('plot')) {
            return normalizedProperty.includes('plot');
          }
          if (normalizedFilter.includes('pghosted') || normalizedFilter.includes('pg')) {
            return normalizedProperty.includes('pg') || normalizedProperty.includes('hostel');
          }
          if (normalizedFilter.includes('independenthouse') || normalizedFilter.includes('house')) {
            return normalizedProperty.includes('house') || normalizedProperty.includes('independent');
          }
          
          return normalizedProperty.includes(normalizedFilter);
        });
      });
    }

    // Apply budget filter
    if (filters.budget[0] > 0 || filters.budget[1] < 50000000) {
      filtered = filtered.filter(property => {
        const price = property.priceNumber || 0;
        return price >= filters.budget[0] && price <= filters.budget[1];
      });
    }

    // Apply BHK filter
    if (filters.bhkType.length > 0) {
      filtered = filtered.filter(property => {
        return filters.bhkType.some(bhkFilter => {
          const propertyBhk = property.bhkType?.toLowerCase();
          const filterBhk = bhkFilter.toLowerCase().replace(/\s+/g, '');
          return propertyBhk?.includes(filterBhk);
        });
      });
    }

    // Apply furnished filter
    if (filters.furnished.length > 0) {
      filtered = filtered.filter(property => {
        return filters.furnished.some(furnishedFilter => {
          return property.furnished?.toLowerCase().includes(furnishedFilter.toLowerCase());
        });
      });
    }

    // Apply availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(property => {
        return filters.availability.some(availFilter => {
          const normalizedAvail = availFilter.toLowerCase().replace(/\s+/g, '');
          const propertyAvail = property.availability?.toLowerCase().replace(/\s+/g, '') || '';
          
          if (normalizedAvail === 'readytomove') {
            return propertyAvail.includes('immediate') || propertyAvail.includes('ready');
          }
          if (normalizedAvail === 'underconstruction') {
            return propertyAvail.includes('construction') || propertyAvail.includes('under');
          }
          
          return propertyAvail.includes(normalizedAvail);
        });
      });
    }

    // Apply construction/age filter
    if (filters.construction.length > 0) {
      filtered = filtered.filter(property => {
        return filters.construction.some(constrFilter => {
          const normalizedConstr = constrFilter.toLowerCase().replace(/\s+/g, '');
          const propertyAge = property.ageOfProperty?.toLowerCase().replace(/\s+/g, '') || '';
          
          if (normalizedConstr === 'newproject') {
            return propertyAge.includes('new') || property.isNew;
          }
          
          return propertyAge.includes(normalizedConstr);
        });
      });
    }

    // Apply location filter
    if (filters.location.trim()) {
      const locationKeywords = filters.location.toLowerCase().split(/\s+|,/).filter(Boolean);
      filtered = filtered.filter(property => {
        const propertyLocation = `${property.location} ${property.locality} ${property.city}`.toLowerCase();
        return locationKeywords.some(keyword => 
          propertyLocation.includes(keyword)
        );
      });
    }

    // Apply locality filter
    if (filters.locality.length > 0) {
      filtered = filtered.filter(property => {
        return filters.locality.some(localityFilter => {
          return property.locality?.toLowerCase().includes(localityFilter.toLowerCase()) ||
                 property.city?.toLowerCase().includes(localityFilter.toLowerCase());
        });
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.priceNumber - b.priceNumber;
        case 'price-high':
          return b.priceNumber - a.priceNumber;
        case 'area':
          return b.areaNumber - a.areaNumber;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0; // relevance - maintain original order
      }
    });

    console.log(`🔍 Filter Results: ${filtered.length} properties found`, {
      totalProperties: allProperties.length,
      activeTab,
      appliedFilters: {
        propertyType: filters.propertyType,
        budget: filters.budget,
        bhkType: filters.bhkType,
        furnished: filters.furnished,
        availability: filters.availability,
        construction: filters.construction,
        location: filters.location,
        locality: filters.locality
      }
    });

    return filtered;
  }, [allProperties, filters, activeTab]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      propertyType: [],
      bhkType: [],
      budget: [0, 50000000],
      locality: [],
      furnished: [],
      availability: [],
      construction: [],
      location: '',
      sortBy: 'relevance'
    });
  };

  // Get available localities from filtered properties
  const availableLocalities = useMemo(() => {
    const localities = new Set<string>();
    allProperties.forEach(property => {
      if (property.locality) localities.add(property.locality);
      if (property.city) localities.add(property.city);
    });
    return Array.from(localities).sort();
  }, [allProperties]);

  return {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading
  };
};