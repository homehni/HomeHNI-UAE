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
  location: string; // Keep for backward compatibility
  locations: string[]; // New: array of selected locations (max 3)
  selectedCity: string; // New: selected city for location restriction
  sortBy: string;
}

export const useSimplifiedSearch = () => {
  const [searchParams] = useSearchParams();
  
  // Dynamic budget range based on active tab
  const getBudgetRange = (tab: string): [number, number] => {
    switch (tab) {
      case 'rent':
        return [0, 500000]; // 0 to 5 Lakh for rent (max ₹5L)
      case 'buy':
        return [0, 50000000]; // 0 to 5 Crore for buy
      case 'commercial':
        return [0, 50000000]; // 0 to 5 Crore for commercial
      default:
        return [0, 50000000]; // Default to buy range
    }
  };

  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Parse locations from URL parameter (comma-separated)
    const locationsParam = searchParams.get('locations');
    const parsedLocations = locationsParam ? 
      locationsParam.split(',').map(loc => decodeURIComponent(loc.trim())).filter(Boolean) : 
      [];
    
    return {
      propertyType: searchParams.get('propertyType') ? [searchParams.get('propertyType')!] : [],
      bhkType: [],
      budget: getBudgetRange(searchParams.get('type') || 'buy'),
      locality: [],
      furnished: [],
      availability: [],
      construction: [],
      location: searchParams.get('location') || '',
      locations: parsedLocations, // Initialize from URL parameter
      selectedCity: searchParams.get('city') || '', // Initialize from URL parameter
      sortBy: 'relevance'
    };
  });

  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'buy');
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update budget range when active tab changes
  useEffect(() => {
    const newBudgetRange = getBudgetRange(activeTab);
    setFilters(prev => {
      // Only reset budget if current budget is outside the valid range for new tab
      const currentBudget = prev.budget;
      const maxValue = newBudgetRange[1];
      
      // If current budget is within valid range, keep it; otherwise reset to full range
      const shouldResetBudget = currentBudget[0] > maxValue || currentBudget[1] > maxValue;
      
      return {
        ...prev,
        budget: shouldResetBudget ? newBudgetRange : currentBudget
      };
    });
  }, [activeTab]);

  // Transform property data helper
  const transformProperty = (property: any) => {
    const displayPropertyType = property.property_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Property';
    
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
  };

  // Load properties with real-time updates
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        // Fetch approved and visible properties only
        const { data: properties, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'approved')
          .eq('is_visible', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedProperties = (properties || []).map(transformProperty);
        console.log('📊 Total properties loaded:', transformedProperties.length);
        
        setAllProperties(transformedProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();

    // Set up real-time subscription
    const channel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: 'status=eq.approved'
        },
        (payload) => {
          console.log('🔄 Real-time property change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newProperty = payload.new as any;
            if (newProperty.is_visible) {
              setAllProperties(prev => [transformProperty(newProperty), ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedProperty = payload.new as any;
            setAllProperties(prev => 
              prev.map(p => p.id === updatedProperty.id 
                ? transformProperty(updatedProperty) 
                : p
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedProperty = payload.old as any;
            setAllProperties(prev => prev.filter(p => p.id !== deletedProperty.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
          
          // Exact match priority - check for exact property type matches first
          if (normalizedFilter === 'penthouse') {
            return normalizedProperty === 'penthouse';
          }
          if (normalizedFilter === 'duplex') {
            return normalizedProperty === 'duplex';
          }
          if (normalizedFilter === 'independenthouse') {
            // Only match if it's specifically "independent house", not just any house
            return normalizedProperty === 'independenthouse' || 
                   normalizedProperty === 'independent' ||
                   (normalizedProperty.includes('independent') && normalizedProperty.includes('house') && !normalizedProperty.includes('penthouse'));
          }
          if (normalizedFilter === 'gatedcommunityvilla') {
            return normalizedProperty === 'gatedcommunityvilla' || 
                   (normalizedProperty.includes('gated') && normalizedProperty.includes('community') && normalizedProperty.includes('villa'));
          }
          
          // Broader category matches
          if (normalizedFilter.includes('apartment') || normalizedFilter.includes('flat')) {
            return normalizedProperty.includes('apartment') || normalizedProperty.includes('flat');
          }
          if (normalizedFilter === 'villa') {
            // Villa should not match gated community villa
            return normalizedProperty === 'villa' && !normalizedProperty.includes('community');
          }
          if (normalizedFilter.includes('plot') || normalizedFilter.includes('land')) {
            return normalizedProperty.includes('plot') || normalizedProperty.includes('land');
          }
          if (normalizedFilter === 'agriculturalland') {
            return normalizedProperty.includes('agricultural') && normalizedProperty.includes('land');
          }
          if (normalizedFilter === 'commercialland') {
            return normalizedProperty.includes('commercial') && normalizedProperty.includes('land');
          }
          if (normalizedFilter === 'industrialland') {
            return normalizedProperty.includes('industrial') && normalizedProperty.includes('land');
          }
          if (normalizedFilter.includes('pghosted') || normalizedFilter.includes('pg')) {
            return normalizedProperty.includes('pg') || normalizedProperty.includes('hostel');
          }
          if (normalizedFilter.includes('coliving')) {
            return normalizedProperty.includes('coliving') || normalizedProperty.includes('co-living');
          }
          if (normalizedFilter.includes('builderfloor')) {
            return normalizedProperty.includes('builderfloor') || normalizedProperty.includes('builder') && normalizedProperty.includes('floor');
          }
          if (normalizedFilter.includes('studioapartment')) {
            return normalizedProperty.includes('studioapartment') || normalizedProperty.includes('studio');
          }
          if (normalizedFilter.includes('coworking')) {
            return normalizedProperty.includes('coworking') || normalizedProperty.includes('co-working');
          }
          if (normalizedFilter.includes('office')) {
            return normalizedProperty.includes('office');
          }
          if (normalizedFilter.includes('retail')) {
            return normalizedProperty.includes('retail');
          }
          if (normalizedFilter.includes('warehouse')) {
            return normalizedProperty.includes('warehouse');
          }
          if (normalizedFilter.includes('showroom')) {
            return normalizedProperty.includes('showroom');
          }
          if (normalizedFilter.includes('restaurant')) {
            return normalizedProperty.includes('restaurant');
          }
          if (normalizedFilter === 'industrial') {
            return normalizedProperty === 'industrial';
          }
          
          // Fallback to partial match
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

    // Apply location filter (both single location and multiple locations)
    const hasLocationFilter = filters.location.trim() || filters.locations.length > 0;
    if (hasLocationFilter) {
      const locationKeywords: string[] = [];
      
      // Add keywords from single location field
      if (filters.location.trim()) {
        locationKeywords.push(...filters.location.toLowerCase().split(/\s+|,/).filter(Boolean));
      }
      
      // Add keywords from multiple locations
      if (filters.locations.length > 0) {
        filters.locations.forEach(location => {
          if (location.trim()) {
            locationKeywords.push(...location.toLowerCase().split(/\s+|,/).filter(Boolean));
          }
        });
      }
      
      // Remove duplicates
      const uniqueKeywords = [...new Set(locationKeywords)];
      
      if (uniqueKeywords.length > 0) {
        filtered = filtered.filter(property => {
          const propertyLocation = `${property.location} ${property.locality} ${property.city}`.toLowerCase();
          return uniqueKeywords.some(keyword => 
            propertyLocation.includes(keyword)
          );
        });
      }
    }

    // Apply locality filter (normalized cities and localities)
    if (filters.locality.length > 0) {
      try {
        filtered = filtered.filter(property => {
          return filters.locality.some(localityFilter => {
            try {
              // Normalize both the filter and property locations for comparison
              const normalizedFilter = normalizeLocationName(localityFilter);
              const normalizedCity = normalizeLocationName(property.city || '');
              const normalizedLocality = normalizeLocationName(property.locality || '');
              
              // Check if the filter is a major city (should match city field only)
              const isMajorCity = ['bangalore', 'hyderabad', 'mumbai', 'delhi', 'chennai', 'pune', 'karnataka'].includes(normalizedFilter.toLowerCase());
              
              if (isMajorCity) {
                // For major cities, only match against city field
                return normalizedCity === normalizedFilter;
              } else {
                // For localities, match against locality field only
                return normalizedLocality === normalizedFilter;
              }
            } catch (error) {
              console.error('Error in locality filter normalization:', error, { localityFilter, property });
              // Fallback to simple string matching if normalization fails
              return property.city?.toLowerCase().includes(localityFilter.toLowerCase()) ||
                     property.locality?.toLowerCase().includes(localityFilter.toLowerCase());
            }
          });
        });
      } catch (error) {
        console.error('Error in locality filtering:', error, { filters: filters.locality });
        // If filtering fails completely, return all properties
        filtered = [...allProperties];
      }
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
      budget: getBudgetRange(activeTab),
      locality: [],
      furnished: [],
      availability: [],
      construction: [],
      location: '',
      locations: [], // Clear multiple locations
      selectedCity: '', // Reset to empty (no city selected)
      sortBy: 'relevance'
    });
  };

  // Normalize location names to consolidate similar entries
  const normalizeLocationName = (location: string): string => {
    try {
      // Handle null/undefined cases
      if (!location || typeof location !== 'string') {
        return '';
      }
      
      const normalized = location.toLowerCase().trim();
      
      // Bangalore/Bengaluru consolidation
      if (normalized.includes('bangalore') || normalized.includes('bengaluru') || normalized.includes('bangalore division')) {
        return 'Bangalore';
      }
      
      // Karnataka consolidation
      if (normalized.includes('karnataka')) {
        return 'Karnataka';
      }
      
      // Hyderabad consolidation
      if (normalized.includes('hyderabad')) {
        return 'Hyderabad';
      }
      
      // Mumbai consolidation
      if (normalized.includes('mumbai') || normalized.includes('bombay')) {
        return 'Mumbai';
      }
      
      // Delhi consolidation
      if (normalized.includes('delhi') || normalized.includes('new delhi')) {
        return 'Delhi';
      }
      
      // Chennai consolidation
      if (normalized.includes('chennai') || normalized.includes('madras')) {
        return 'Chennai';
      }
      
      // Pune consolidation
      if (normalized.includes('pune')) {
        return 'Pune';
      }
      
      // Pune localities consolidation
      if (normalized.includes('koregaon park') || normalized.includes('koregaon')) {
        return 'Pune';
      }
      
      // Return original if no normalization needed
      return location.trim();
    } catch (error) {
      console.error('Error normalizing location name:', error, { location });
      return location || '';
    }
  };

  // Get available localities from filtered properties - show normalized cities and localities but exclude full addresses
  const availableLocalities = useMemo(() => {
    try {
      const localities = new Set<string>();
      allProperties.forEach(property => {
        try {
          // Add normalized city names
          if (property.city) {
            const normalizedCity = normalizeLocationName(property.city);
            if (normalizedCity) {
              localities.add(normalizedCity);
            }
          }
          
          // Add normalized locality names but exclude full addresses
          if (property.locality) {
            // Check if it's a full address (contains numbers, PIN codes, or very long text)
            const locality = property.locality.trim();
            const isFullAddress = 
              /\d{6}/.test(locality) || // Contains 6-digit PIN code
              /\d+,\s*Street/.test(locality) || // Contains street numbers
              locality.length > 50 || // Very long text
              locality.split(',').length > 3; // Multiple comma-separated parts
            
            if (!isFullAddress) {
              const normalizedLocality = normalizeLocationName(locality);
              if (normalizedLocality) {
                // Exclude specific localities that shouldn't appear in the filter
                const excludedLocalities = ['kokapet'];
                const shouldExclude = excludedLocalities.some(excluded => 
                  normalizedLocality.toLowerCase().includes(excluded.toLowerCase())
                );
                
                if (!shouldExclude) {
                  localities.add(normalizedLocality);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error processing property for localities:', error, { property });
        }
      });
      return Array.from(localities).sort();
    } catch (error) {
      console.error('Error generating available localities:', error);
      return [];
    }
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