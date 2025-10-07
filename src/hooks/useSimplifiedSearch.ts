import { useState, useEffect, useMemo, useCallback } from 'react';
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
  budgetDirty: boolean;
  area: [number, number]; // Area range in square feet
  areaDirty: boolean; // Track if area was manually changed
  locality: string[];
  furnished: string[];
  availability: string[];
  construction: string[];
  location: string; // Keep for backward compatibility
  locations: string[]; // New: array of selected locations (max 3)
  selectedCity: string; // New: selected city for location restriction
  sortBy: string;
}

let hasInitialBudgetInUrlFlag = false;
export const useSimplifiedSearch = () => {
  const [searchParams] = useSearchParams();
  // Minimal DB row type to replace 'any' in realtime handlers
  type PropertyRow = {
    id: string;
    title?: string;
    locality?: string;
    city?: string;
    expected_price?: number;
    super_area?: number;
    bhk_type?: string;
    bathrooms?: number;
    images?: string[];
    property_type?: string;
    furnishing?: string;
    availability_type?: string;
    property_age?: string;
    listing_type?: string;
    created_at?: string;
    is_visible?: boolean;
    status?: string;
    plot_area_unit?: string;
  };
  
  // Dynamic budget range based on active tab
  const getBudgetRange = (tab: string): [number, number] => {
    switch (tab) {
      case 'rent':
        return [0, 500000]; // 0 to 5 Lakh for rent (max ₹5L)
      case 'buy':
        return [0, 50000000]; // 0 to 5 Crore for buy
      case 'commercial':
        return [0, 50000000]; // 0 to 5 Crore for commercial
      case 'land':
        return [0, 50000000]; // Land aligned with buy
      default:
        return [0, 50000000]; // Default to buy range
    }
  };

  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Tab determines default budget range
    const initialTab = searchParams.get('type') || 'buy';
    const defaultBudget = getBudgetRange(initialTab);

    // Parse locations from URL parameter (comma-separated)
    const locationsParam = searchParams.get('locations');
    const parsedLocations = locationsParam
      ? locationsParam.split(',').map((loc) => decodeURIComponent(loc.trim())).filter(Boolean)
      : [];

    // Property types: support both 'propertyTypes' (comma-separated) and legacy 'propertyType'
    const propertyTypesParam = searchParams.get('propertyTypes') || '';
    const propertyTypeLegacy = searchParams.get('propertyType');
    const propertyType = propertyTypesParam
      ? propertyTypesParam.split(',').map((v) => decodeURIComponent(v.trim())).filter(Boolean)
      : propertyTypeLegacy
      ? [propertyTypeLegacy]
      : [];

    // BHK selections
    const bhkParam = searchParams.get('bhk') || '';
    const bhkType = bhkParam
      ? bhkParam.split(',').map((v) => decodeURIComponent(v.trim())).filter(Boolean)
      : [];

    // Availability and construction
    const availabilityParam = searchParams.get('availability') || '';
    const availability = availabilityParam
      ? availabilityParam.split(',').map((v) => decodeURIComponent(v.trim())).filter(Boolean)
      : [];
    const constructionParam = searchParams.get('construction') || '';
    const construction = constructionParam
      ? constructionParam.split(',').map((v) => decodeURIComponent(v.trim())).filter(Boolean)
      : [];

    // Furnished
    const furnishedParam = searchParams.get('furnished') || '';
    const furnished = furnishedParam
      ? furnishedParam.split(',').map((v) => decodeURIComponent(v.trim())).filter(Boolean)
      : [];

    // Budget bounds (parse only if params are present to avoid Number(null) => 0)
    const budgetMinParam = searchParams.get('budgetMin');
    const budgetMaxParam = searchParams.get('budgetMax');
    const hasBudgetMin = budgetMinParam !== null;
    const hasBudgetMax = budgetMaxParam !== null;
    const parsedBudgetMin = hasBudgetMin ? Number(budgetMinParam) : undefined;
    const parsedBudgetMax = hasBudgetMax ? Number(budgetMaxParam) : undefined;
    const budget: [number, number] = [
      hasBudgetMin && Number.isFinite(parsedBudgetMin as number)
        ? Math.max(0, parsedBudgetMin as number)
        : defaultBudget[0],
      hasBudgetMax && Number.isFinite(parsedBudgetMax as number)
        ? Math.min(defaultBudget[1], parsedBudgetMax as number)
        : defaultBudget[1],
    ];
    // Track if URL explicitly set any budget so we don't override on tab switches
    const hasBudgetParams = hasBudgetMin || hasBudgetMax;
    hasInitialBudgetInUrlFlag = hasBudgetParams;

    // Area bounds (parse only if params are present)
    const areaMinParam = searchParams.get('areaMin');
    const areaMaxParam = searchParams.get('areaMax');
    const hasAreaMin = areaMinParam !== null;
    const hasAreaMax = areaMaxParam !== null;
    const parsedAreaMin = hasAreaMin ? Number(areaMinParam) : undefined;
    const parsedAreaMax = hasAreaMax ? Number(areaMaxParam) : undefined;
    const area: [number, number] = [
      hasAreaMin && Number.isFinite(parsedAreaMin as number)
        ? Math.max(0, parsedAreaMin as number)
        : 0,
      hasAreaMax && Number.isFinite(parsedAreaMax as number)
        ? Math.min(10000, parsedAreaMax as number)
        : 10000,
    ];
    // Track if URL explicitly set any area params
    const hasAreaParams = hasAreaMin || hasAreaMax;

    return {
      propertyType,
      bhkType,
      budget,
      budgetDirty: hasBudgetParams,
      area,
      areaDirty: hasAreaParams,
      locality: [],
      furnished,
      availability,
      construction,
      location: searchParams.get('location') || '',
      locations: parsedLocations, // Initialize from URL parameter
      selectedCity: searchParams.get('city') || '', // Initialize from URL parameter
      sortBy: 'relevance',
    };
  });

  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'buy');
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [propertyCount, setPropertyCount] = useState(0);

  // Batch size for loading properties - load in chunks for better performance
  const BATCH_SIZE = 50;

  // Update budget range when active tab changes
  useEffect(() => {
    const newBudgetRange = getBudgetRange(activeTab);
  const hasInitialBudgetInUrl: boolean = hasInitialBudgetInUrlFlag;
    setFilters(prev => {
      if (!hasInitialBudgetInUrl) {
        // No explicit budget from URL; reset to full range for the selected tab
        return { ...prev, budget: newBudgetRange, budgetDirty: false };
      }
      // Clamp existing budget into the new tab's range
      const current = prev.budget;
      const clampedMin = Math.max(0, Math.min(current[0], newBudgetRange[1]));
      const clampedMax = Math.max(0, Math.min(current[1], newBudgetRange[1]));
      const adjusted: [number, number] = clampedMin > clampedMax ? [clampedMax, clampedMax] : [clampedMin, clampedMax];
      const dirty = adjusted[0] > 0 || adjusted[1] < newBudgetRange[1];
      return { ...prev, budget: adjusted, budgetDirty: dirty };
    });
  }, [activeTab]);

  // Transform property data helper - Memoized with useCallback for performance
  const transformProperty = useCallback((property: PropertyRow) => {
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
      area: (() => {
        const isLandProperty = property.property_type?.toLowerCase().includes('land') || 
                              property.property_type?.toLowerCase().includes('plot');
        const areaValue = property.super_area || 0;
        
        // Debug logging for land properties
        if (isLandProperty) {
          console.log('Land/Plot property area unit:', {
            propertyType: property.property_type,
            plotAreaUnit: property.plot_area_unit,
            areaValue
          });
        }
        
        // For land/plot properties, use the stored area unit with proper mapping
        if (isLandProperty && property.plot_area_unit) {
          const unitMap: Record<string, string> = {
            'sq-ft': 'sq.ft',
            'sq_ft': 'sq.ft',
            'sq.ft': 'sq.ft',
            'sqft': 'sq.ft',
            'sq-yard': 'sq.yard',
            'sq_yard': 'sq.yard',
            'sq-m': 'sq.m',
            'sq_m': 'sq.m',
            'acre': 'acres',
            'acres': 'acres',
            'hectare': 'hectare',
            'bigha': 'bigha',
            'biswa': 'biswa',
            'gunta': 'gunta',
            'cents': 'cents',
            'marla': 'marla',
            'kanal': 'kanal',
            'kottah': 'kottah',
            'grounds': 'grounds',
            'ares': 'ares'
          };
          const displayUnit = unitMap[property.plot_area_unit.toLowerCase()] || property.plot_area_unit;
          return `${areaValue} ${displayUnit}`;
        }
        return `${areaValue} sq ft`;
      })(),
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
  }, []);

  // Load properties with real-time updates - Optimized with batching
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        // First, get the total count for pagination purposes
        const { count } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('is_visible', true);

        setPropertyCount(count || 0);

        // Fetch only essential fields initially for better performance
        // Load in batches to avoid overwhelming the browser
        const { data: properties, error } = await supabase
          .from('properties')
          .select('id, title, locality, city, expected_price, super_area, bhk_type, bathrooms, images, property_type, furnishing, availability_type, property_age, listing_type, created_at, plot_area_unit')
          .eq('is_visible', true)
          .order('created_at', { ascending: false })
          .limit(BATCH_SIZE); // Load first batch only

        if (error) throw error;

        const transformedProperties = (properties || []).map(transformProperty);
        console.log('📊 Initial properties loaded:', transformedProperties.length, 'of', count);
        
        setAllProperties(transformedProperties);
        setHasMore((count || 0) > BATCH_SIZE);
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
          table: 'properties'
        },
        (payload) => {
          console.log('🔄 Real-time property change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newProperty = payload.new as PropertyRow;
            if (newProperty.is_visible) {
              setAllProperties(prev => [transformProperty(newProperty), ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedProperty = payload.new as PropertyRow;
            setAllProperties(prev => 
              prev.map(p => p.id === updatedProperty.id 
                ? transformProperty(updatedProperty) 
                : p
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedProperty = payload.old as PropertyRow;
            setAllProperties(prev => prev.filter(p => p.id !== deletedProperty.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [transformProperty]);

  // Load more properties function - for infinite scroll or "load more" button
  const loadMoreProperties = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, locality, city, expected_price, super_area, bhk_type, bathrooms, images, property_type, furnishing, availability_type, property_age, listing_type, created_at, plot_area_unit')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .range(allProperties.length, allProperties.length + BATCH_SIZE - 1);

      if (error) throw error;

      const transformedProperties = (properties || []).map(transformProperty);
      console.log('📊 Loaded more properties:', transformedProperties.length);
      
      setAllProperties(prev => [...prev, ...transformedProperties]);
      setHasMore(allProperties.length + transformedProperties.length < propertyCount);
    } catch (error) {
      console.error('Error loading more properties:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, allProperties.length, propertyCount, transformProperty]);

  // Normalize location names to consolidate similar entries - Memoized constant
  const normalizeLocationName = useCallback((location: string): string => {
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
  }, []);

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    let filtered = [...allProperties];

    // Filter by active tab (buy/rent/commercial) using listing_type
    console.log('🔍 Filtering by activeTab:', activeTab);
    console.log('📊 Total properties before filter:', filtered.length);
    
    if (activeTab === 'buy') {
      // For buy tab, show only sale properties but exclude land/plot properties
      filtered = filtered.filter(property => {
        const listingType = property.listingType?.toLowerCase();
        const propertyType = property.propertyType.toLowerCase();
        
        // Exclude land/plot properties from Buy tab - they should only be in Land/Plot tab
        const isLandProperty = propertyType.includes('plot') || 
               propertyType.includes('land') ||
               propertyType.includes('agricultural') ||
               propertyType.includes('industrial land') ||
               propertyType.includes('commercial land');
        
        if (isLandProperty) {
          console.log('❌ Filtered out land property from buy:', property.title, 'property_type:', propertyType);
          return false;
        }
        
        const isMatch = listingType === 'sale' || listingType === 'resale';
        if (!isMatch) {
          console.log('❌ Filtered out for buy:', property.title, 'listing_type:', listingType);
        }
        return isMatch;
      });
    } else if (activeTab === 'rent') {
      // For rent tab, show rental properties and PG/Hostels, but exclude commercial property types
      filtered = filtered.filter(property => {
        const listingType = property.listingType?.toLowerCase();
        const propertyType = property.propertyType.toLowerCase();
        
        // Exclude commercial property types from Rent tab
        const isCommercialType = propertyType.includes('commercial') ||
               propertyType.includes('office') ||
               propertyType.includes('shop') ||
               propertyType.includes('retail') ||
               propertyType.includes('warehouse') ||
               propertyType.includes('showroom') ||
               propertyType.includes('restaurant') ||
               propertyType.includes('coworking') ||
               propertyType.includes('co-working') ||
               propertyType.includes('industrial');
        
        if (isCommercialType) {
          console.log('❌ Filtered out commercial property from rent:', property.title, 'property_type:', propertyType);
          return false;
        }
        
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
               propertyType.includes('retail') ||
               propertyType.includes('warehouse') ||
               propertyType.includes('showroom') ||
               propertyType.includes('restaurant') ||
               propertyType.includes('coworking') ||
               propertyType.includes('co-working') ||
               propertyType.includes('industrial');
        if (!isMatch) {
          console.log('❌ Filtered out for commercial:', property.title, 'listing_type:', listingType, 'property_type:', propertyType);
        }
        return isMatch;
      });
    } else if (activeTab === 'land') {
      // For land tab, show only land/plot properties
      filtered = filtered.filter(property => {
        const ptype = property.propertyType.toLowerCase();
        const isMatch = ptype.includes('plot') || ptype.includes('land');
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

    // Apply budget filter only if user/URL changed it
    if (filters.budgetDirty) {
      filtered = filtered.filter(property => {
        const price = property.priceNumber || 0;
        return price >= filters.budget[0] && price <= filters.budget[1];
      });
    }

    // Apply area filter only if user/URL changed it
    if (filters.areaDirty) {
      filtered = filtered.filter(property => {
        const area = property.areaNumber || 0;
        return area >= filters.area[0] && area <= filters.area[1];
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
  }, [allProperties, filters, activeTab, normalizeLocationName]);

  const updateFilter = (key: keyof SearchFilters, value: SearchFilters[typeof key]) => {
    setFilters(prev => {
      if (key === 'budget') {
        const range = value as [number, number];
        const full = getBudgetRange(activeTab);
        const dirty = range[0] > 0 || range[1] < full[1];
        return { ...prev, budget: range, budgetDirty: dirty };
      }
      if (key === 'area') {
        const range = value as [number, number];
        const dirty = range[0] > 0 || range[1] < 10000;
        return { ...prev, area: range, areaDirty: dirty };
      }
      return { ...prev, [key]: value } as SearchFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      propertyType: [],
      bhkType: [],
      budget: getBudgetRange(activeTab),
      budgetDirty: false,
      area: [0, 10000], // Reset area range to default
      areaDirty: false,
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
  }, [allProperties, normalizeLocationName]);

  return {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading,
    loadMoreProperties,
    hasMore,
    propertyCount
  };
};