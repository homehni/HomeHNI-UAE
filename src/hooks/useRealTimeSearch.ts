import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentCountryConfig } from '@/services/domainCountryService';

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

interface SearchResponse {
  items: Property[];
  total: number;
  hasMore: boolean;
}

export const useRealTimeSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL params
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedLocation, setDebouncedLocation] = useState(filters.location);
  
  // Debounce location search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(filters.location);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters.location]);

  // Search properties using the edge function
  const searchProperties = async () => {
    // Check if "ALL" is selected or no property type is selected
    const isAllResidential = filters.propertyType.length === 0;
    
    // Determine if user has provided any criteria (excluding "All" as it's our default)
    const hasSearchCriteria = 
      debouncedLocation || 
      filters.propertyType.length > 0 || 
      filters.bhkType.length > 0 || 
      filters.locality.length > 0 || 
      filters.furnished.length > 0 || 
      filters.availability.length > 0 || 
      filters.construction.length > 0 ||
      filters.budget[0] > 0 || 
      filters.budget[1] < 50000000;

    console.log('useRealTimeSearch debug:', {
      isAllResidential,
      hasSearchCriteria,
      filters: {
        propertyType: filters.propertyType,
        budget: filters.budget,
        bhkType: filters.bhkType,
        furnished: filters.furnished,
        availability: filters.availability,
        construction: filters.construction,
        locality: filters.locality,
        location: debouncedLocation
      },
      willUseSearchFunction: !isAllResidential && hasSearchCriteria
    });

    // If "ALL" is selected or no criteria, show properties based on active tab (Buy/Rent/Commercial)
    if (isAllResidential || !hasSearchCriteria) {
      console.log('Using get_public_properties RPC (no search function)');
      try {
        setIsLoading(true);
        setError(null);
        
        // Get properties based on active tab (Buy/Rent/Commercial)
        const { data: propertiesData, error: propertiesError } = await supabase
          .rpc('get_public_properties');

        if (propertiesError) throw propertiesError;

        // Filter properties based on active tab
        let filteredPropertiesData = propertiesData || [];
        
        if (activeTab === 'buy') {
          filteredPropertiesData = filteredPropertiesData.filter(property => 
            property.listing_type === 'sale' || property.listing_type === 'buy'
          );
        } else if (activeTab === 'rent') {
          filteredPropertiesData = filteredPropertiesData.filter(property => 
            property.listing_type === 'rent'
          );
        } else if (activeTab === 'commercial') {
          // For commercial tab, show ALL commercial properties (both sale and rent)
          // The commercial tab is independent and shows all commercial listings
          filteredPropertiesData = filteredPropertiesData.filter(property => {
            return property.property_type === 'commercial' || 
              property.property_type === 'office' || 
              property.property_type === 'shop' || 
              property.property_type === 'warehouse' || 
              property.property_type === 'showroom';
          });
        }

        // Also get content elements for featured properties (but filter by active tab)
        const { data: contentElementsData, error: contentError } = await supabase
          .from('content_elements')
          .select('*')
          .eq('page_location', 'homepage')
          .eq('section_location', 'featured_properties')
          .eq('element_type', 'featured_property')
          .eq('is_active', true)
          .order('sort_order');

        if (contentError) throw contentError;

        // Validate content elements referencing properties against current database
        const referencedPropertyIds = (contentElementsData || [])
          .map(e => {
            const content = e.content as any;
            return content?.id;
          })
          .filter((id): id is string => Boolean(id));

        let validPropertyIdSet = new Set<string>();
        if (referencedPropertyIds.length > 0) {
          const { data: existingProps, error: existingErr } = await supabase
            .from('properties')
            .select('id, status')
            .in('id', referencedPropertyIds);
          if (!existingErr && existingProps) {
            validPropertyIdSet = new Set(existingProps.filter(p => p.status === 'approved').map(p => p.id));
          }
        }

        // Filter out content elements that point to deleted/unapproved properties
        const filteredContentElements = (contentElementsData || []).filter(e => {
          const content = e.content as any;
          const refId = content?.id as string | undefined;
          if (!refId) return true; // keep static curated tiles
          return validPropertyIdSet.has(refId);
        });

        // Filter content elements by active tab
        const tabFilteredContentElements = filteredContentElements.filter(element => {
          const content = element.content as any;
          const propertyType = content?.propertyType?.toLowerCase() || '';
          const listingType = content?.listingType?.toLowerCase();
          
          if (activeTab === 'buy') {
            // Only show properties explicitly marked for sale/buy, exclude rent properties
            return listingType === 'sale' || listingType === 'buy';
          } else if (activeTab === 'rent') {
            return listingType === 'rent';
          } else if (activeTab === 'commercial') {
            return propertyType.includes('commercial') || 
                   propertyType.includes('office') || 
                   propertyType.includes('shop') || 
                   propertyType.includes('warehouse') || 
                   propertyType.includes('showroom');
          }
          return true;
        });

        // Transform content elements to Property format
        const contentElementProperties = tabFilteredContentElements.map((element: any) => {
          const content = element.content as any || {};
          return {
            id: content?.id || element.id,
            title: element.title || content?.title || 'Property',
            location: content?.location || 'Location',
            price: content?.price || '₹0',
            priceNumber: parseFloat(content?.price?.replace(/[^\d]/g, '') || '0'),
            area: content?.area || content?.size || '0 sq ft',
            areaNumber: parseFloat(content?.area?.replace(/[^\d]/g, '') || content?.size?.replace(/[^\d]/g, '') || '0'),
            bedrooms: content?.bedrooms || parseInt(content?.bhk?.replace(/[^\d]/g, '') || '0'),
            bathrooms: content?.bathrooms || 0,
            image: element.images?.[0] || content?.image || '/placeholder.svg',
            propertyType: content?.propertyType || 'Property',
            locality: content?.location?.split(', ')[0] || '',
            city: content?.location?.split(', ').pop() || '',
            bhkType: content?.bhk || '1bhk',
            isNew: content?.isNew || false
          };
        });
        
        // Transform properties table data to Property format
        const transformedPropertiesData = filteredPropertiesData.map((property: any) => {
          // Debug logging for image data
          console.log('Property data from database:', {
            id: property.id,
            title: property.title,
            images: property.images,
            imagesType: typeof property.images,
            imagesLength: Array.isArray(property.images) ? property.images.length : 'N/A'
          });
          
          // Handle PG/Hostel properties specially - check multiple conditions
          const isPGHostel = property.property_type === 'pg_hostel' || 
                            property.property_type === 'PG/Hostel' || 
                            property.listing_type === 'PG/Hostel' ||
                            property.title?.toLowerCase().includes('pg') ||
                            property.title?.toLowerCase().includes('hostel');
          
          // Determine the correct property type for filtering
          let displayPropertyType = property.property_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Property';
          
          // Override property type for PG/Hostel properties
          if (isPGHostel) {
            displayPropertyType = 'PG/Hostel';
          }
          
          const imageUrl = (property.images && property.images.length > 0) ? property.images[0] : '/placeholder.svg';
          console.log('Final image URL for property:', { id: property.id, title: property.title, imageUrl });
          
          return {
            id: property.id,
            title: property.title,
            location: property.locality || '',
            price: isPGHostel 
              ? `₹${property.expected_price.toLocaleString()}/month`
              : (() => {
                  const price = property.expected_price;
                  
                  // Special handling for exactly 1 Crore (100 Lakhs)
                  if (price === 10000000) {
                    return '₹1 Cr';
                  } else if (price >= 10000000) {
                    return `₹${(price / 10000000).toFixed(1)} Cr`;
                  } else if (price >= 100000) {
                    return `₹${(price / 100000).toFixed(1)} L`;
                  } else if (price >= 1000) {
                    return `₹${(price / 1000).toFixed(0)} K`;
                  } else {
                    return `₹${price.toLocaleString()}`;
                  }
                })(),
            priceNumber: property.expected_price || 0,
            area: isPGHostel 
              ? `${property.super_area || 1} Room${(property.super_area || 1) > 1 ? 's' : ''}`
              : `${property.super_area || 0} sq ft`,
            areaNumber: property.super_area || 0,
            bedrooms: isPGHostel 
              ? 1  // PG/Hostel shows as 1 room
              : parseInt(property.bhk_type?.replace(/[^\d]/g, '') || '0'),
            bathrooms: property.bathrooms || 0,
            image: imageUrl,
            propertyType: displayPropertyType,
            listingType: property.listing_type || 'sale',
            locality: property.locality || '',
            city: property.city || '',
            bhkType: property.bhk_type || '1bhk',
            isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if created within last 7 days
          };
        });

        // Combine both sources, with newer properties first
        const allProperties = [...transformedPropertiesData, ...contentElementProperties];
        
        // Remove duplicates based on ID and limit to reasonable number
        const uniqueProperties = allProperties.filter((property, index, self) => 
          index === self.findIndex(p => p.id === property.id)
        ).slice(0, 50); // Limit to 50 properties max

        setProperties(uniqueProperties.slice(0, 50)); // Apply limits
      } catch (err: any) {
        setError(err.message || 'Failed to load properties');
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    console.log('Using search-listings function');
    setIsLoading(true);
    setError(null);

    try {
      // Map property types to database format
      const mapPropertyTypeToDb = (type: string) => {
        const mapping: { [key: string]: string } = {
          'DUPLEX': 'duplex',
          'PENTHOUSE': 'penthouse',
          'APARTMENT': 'apartment',
          'VILLA': 'villa',
          'PLOT': 'plot',
          'PG HOSTEL': 'pg_hostel',
          'INDEPENDENT HOUSE': 'independent_house',
          'COMMERCIAL': 'commercial'
        };
        return mapping[type] || type.toLowerCase();
      };

      const countryConfig = getCurrentCountryConfig();
      const searchBody = {
        intent: activeTab,
        // Send both single and multiple types for backward compatibility
        propertyType: filters.propertyType.length > 0
          ? mapPropertyTypeToDb(filters.propertyType[0])
          : '',
        propertyTypes: filters.propertyType.map(mapPropertyTypeToDb),
        country: countryConfig.name,
        state: '', // Let the backend handle state detection
        city: debouncedLocation || '',
        budgetMin: filters.budget[0].toString(),
        budgetMax: filters.budget[1].toString(),
        page: '1',
        pageSize: '20',
        bhkType: filters.bhkType.length > 0 ? filters.bhkType[0] : '',
        furnished: filters.furnished.length > 0 ? filters.furnished[0] : '',
        availability: filters.availability.length > 0 ? filters.availability[0] : '',
        ageOfProperty: filters.construction.length > 0 ? filters.construction[0] : '',
        locality: filters.locality.length > 0 ? filters.locality[0] : '',
        sortBy: filters.sortBy
      };

      console.log('Search body being sent:', searchBody);

      const { data, error: funcError } = await supabase.functions.invoke('search-listings', {
        body: searchBody
      });

      if (funcError) {
        throw new Error(funcError.message || 'Failed to search properties');
      }

      // Transform search results to match PropertyCard interface
      // Show all visible properties (not just featured ones)
      const filteredSearchResults = (data.items || []).filter((property: any) => {
        // Show all visible properties regardless of featured status
        return property.is_visible === true;
      });

      const transformedSearchResults = filteredSearchResults.map((property: any) => ({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        image: (property.images && property.images.length > 0) ? property.images[0] : '/placeholder.svg',
        propertyType: property.property_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Property',
        isNew: property.isNew || false
      }));

      // Also get content elements for the specific property type
      const { data: contentElementsData, error: contentError } = await supabase
        .from('content_elements')
        .select('*')
        .eq('page_location', 'homepage')
        .eq('section_location', 'featured_properties')
        .eq('element_type', 'featured_property')
        .eq('is_active', true)
        .order('sort_order');

      if (!contentError && contentElementsData) {
        // Filter content elements by the selected property type and active tab
        const filteredContentElements = contentElementsData.filter(element => {
          const content = element.content as any;
          const propertyType = content?.propertyType?.toLowerCase() || '';
          const listingType = content?.listingType?.toLowerCase();
          const title = element.title?.toLowerCase() || '';
          
          // Enhanced PG/Hostel detection for content elements
          const isPGHostel = propertyType.includes('pg') || 
                            propertyType.includes('hostel') ||
                            title.includes('pg') ||
                            title.includes('hostel') ||
                            content?.title?.toLowerCase().includes('pg') ||
                            content?.title?.toLowerCase().includes('hostel');
          
          // Check if this content element matches the selected property type
          const matchesPropertyType = filters.propertyType.length > 0 
            ? filters.propertyType.some(type => {
                const normalizedType = type.toLowerCase().replace(/\s+/g, '_');
                const typeLower = type.toLowerCase();
                
                // Special handling for PG HOSTEL
                if (typeLower === 'pg hostel' || typeLower === 'pg/hostel') {
                  return isPGHostel;
                }
                
                return propertyType.includes(normalizedType) || 
                       propertyType.includes(typeLower) ||
                       title.includes(typeLower) ||
                       content?.title?.toLowerCase().includes(typeLower);
              })
            : true;
          
          // Check if it matches the active tab
          const matchesActiveTab = activeTab === 'buy' 
            ? (listingType === 'sale' || listingType === 'buy' || !listingType)
            : activeTab === 'rent' 
            ? (listingType === 'rent' || isPGHostel) // PG/Hostel properties are typically for rent
            : activeTab === 'commercial'
            ? (propertyType.includes('commercial') || 
               propertyType.includes('office') || 
               propertyType.includes('shop') || 
               propertyType.includes('warehouse') || 
               propertyType.includes('showroom'))
            : true;
          
          return matchesPropertyType && matchesActiveTab;
        });

        // Transform content elements to Property format
        const contentElementProperties = filteredContentElements.map((element: any) => {
          const content = element.content as any || {};
          return {
            id: content?.id || element.id,
            title: element.title || content?.title || 'Property',
            location: content?.location || 'Location',
            price: content?.price || '₹0',
            priceNumber: parseFloat(content?.price?.replace(/[^\d]/g, '') || '0'),
            area: content?.area || content?.size || '0 sq ft',
            areaNumber: parseFloat(content?.area?.replace(/[^\d]/g, '') || content?.size?.replace(/[^\d]/g, '') || '0'),
            bedrooms: content?.bedrooms || parseInt(content?.bhk?.replace(/[^\d]/g, '') || '0'),
            bathrooms: content?.bathrooms || 0,
            image: element.images?.[0] || content?.image || '/placeholder.svg',
            propertyType: content?.propertyType || 'Property',
            locality: content?.location?.split(', ')[0] || '',
            city: content?.location?.split(', ').pop() || '',
            bhkType: content?.bhk || '1bhk',
            isNew: content?.isNew || false
          };
        });

        // Combine search results with content elements
        const allResults = [...transformedSearchResults, ...contentElementProperties];
        
        // Remove duplicates based on ID
        const uniqueResults = allResults.filter((property, index, self) => 
          index === self.findIndex(p => p.id === property.id)
        );

        setProperties(uniqueResults);
      } else {
        setProperties(transformedSearchResults);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load properties');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Search when filters change
  useEffect(() => {
    searchProperties();
  }, [debouncedLocation, filters, activeTab]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', activeTab);
    if (filters.location) params.set('location', filters.location);
    if (filters.propertyType.length > 0) params.set('propertyType', filters.propertyType[0]);
    
    setSearchParams(params);
  }, [activeTab, filters.location, filters.propertyType, setSearchParams]);

  const updateFilter = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      propertyType: [], // This will show "ALL" tab as selected
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

  // Get unique localities from properties
  const availableLocalities = useMemo(() => {
    const localities = new Set<string>();
    properties.forEach(property => {
      if (property.locality) localities.add(property.locality);
      if (property.city) localities.add(property.city);
    });
    return Array.from(localities).sort();
  }, [properties]);

  return {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties: properties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading,
    error
  };
};
