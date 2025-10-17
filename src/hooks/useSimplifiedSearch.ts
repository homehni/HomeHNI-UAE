import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { convertArea, getStandardizedAreaUnit, AreaUnit } from '@/utils/areaConverter';

// Build select columns at module scope to avoid hook dependency warnings
const BASE_COLUMNS = 'id, title, locality, city, expected_price, super_area, bhk_type, bathrooms, images, property_type, furnishing, availability_type, property_age, listing_type, created_at, plot_area_unit, user_id, is_premium';
// Keep extra fields conservative to avoid schema mismatches: floor_no and parking are commonly present.
const EXTRA_COMMERCIAL_COLUMNS = ', floor_no, floor_type';
const SELECT_COLUMNS = `${BASE_COLUMNS}${EXTRA_COMMERCIAL_COLUMNS}`;

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
  filterPropertyType?: string; // Used for filtering while keeping original display name (maps Penthouse->Apartment, Duplex->Villa)
  furnished?: string;
  availability?: string;
  ageOfProperty?: string;
  locality: string;
  city: string;
  bhkType: string;
  listingType: string;
  isNew?: boolean;
  ownerId?: string; // Add owner ID for ownership detection
  // Plot/Land specific attributes
  plotAreaUnit?: string; // The unit of measurement for land area
  // Commercial-specific attributes used for filtering
  floorNo?: number | 'basement' | 'ground';
  parkingType?: string; // e.g., none | bike | car | both | open | covered
  parkingAvailable?: boolean;
}

interface SearchFilters {
  propertyType: string[];
  bhkType: string[];
  budget: [number, number];
  budgetDirty: boolean;
  area: [number, number]; // Area range in square feet
  areaDirty: boolean; // Track if area was manually changed
  // Land-specific area filters
  landArea: [number, number]; // Area range for land properties
  landAreaUnit: string; // Unit for land area (acres, sq.ft, etc.)
  landAreaDirty: boolean; // Track if land area was manually changed
  locality: string[];
  furnished: string[];
  availability: string[];
  construction: string[];
  // Commercial-specific filters
  floor?: string[]; // ['Basement', 'Ground', '1', '2', '3+']
  parking?: string[]; // ['Parking Available', 'No Parking']
  location: string; // Keep for backward compatibility
  locations: string[]; // New: array of selected locations (max 3)
  selectedCity: string; // New: selected city for location restriction
  sortBy: string;
  trigger?: string; // Special action trigger ('search', etc)
}

let hasInitialBudgetInUrlFlag = false;
export const useSimplifiedSearch = () => {
  // Feature flag: merge Commercial & Land into Buy/Rent results
  const MERGE_COMM_LAND_IN_BUY_RENT = true;
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
    floor_no?: number | 'basement' | null;
    floor_type?: string | null;
    user_id?: string;
    is_premium?: boolean;
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

    // Parse location from URL parameter (take only the first one if there are multiple)
    const locationsParam = searchParams.get('locations');
    let parsedLocation = '';
    if (locationsParam) {
      // Take only the first location
      const parts = locationsParam.split(',');
      if (parts.length > 0) {
        parsedLocation = decodeURIComponent(parts[0].trim());
      }
    }

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
    
    // Land area bounds specifically for Land/Plot properties
    const landAreaMinParam = searchParams.get('landAreaMin');
    const landAreaMaxParam = searchParams.get('landAreaMax');
    const landAreaUnitParam = searchParams.get('landAreaUnit') || 'acres';
    const hasLandAreaMin = landAreaMinParam !== null;
    const hasLandAreaMax = landAreaMaxParam !== null;
    const parsedLandAreaMin = hasLandAreaMin ? Number(landAreaMinParam) : undefined;
    const parsedLandAreaMax = hasLandAreaMax ? Number(landAreaMaxParam) : undefined;
    const landArea: [number, number] = [
      hasLandAreaMin && Number.isFinite(parsedLandAreaMin as number)
        ? Math.max(0, parsedLandAreaMin as number)
        : 0,
      hasLandAreaMax && Number.isFinite(parsedLandAreaMax as number)
        ? Math.min(6, parsedLandAreaMax as number)
        : 6,
    ];
    // Track if URL explicitly set any land area params
    const hasLandAreaParams = hasLandAreaMin || hasLandAreaMax;

    return {
      propertyType,
      bhkType,
      budget,
      budgetDirty: hasBudgetParams,
      area,
      areaDirty: hasAreaParams,
      landArea,
      landAreaUnit: landAreaUnitParam,
      landAreaDirty: hasLandAreaParams,
      locality: [],
      furnished,
      availability,
      construction,
      floor: [],
      parking: [],
      location: parsedLocation || searchParams.get('location') || '',
      locations: [], // Always empty - we only support a single location
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

  // Update budget range when active tab changes and clear irrelevant filters
  useEffect(() => {
    const newBudgetRange = getBudgetRange(activeTab);
    const hasInitialBudgetInUrl: boolean = hasInitialBudgetInUrlFlag;
    setFilters(prev => {
      const updates = {} as Partial<SearchFilters>;
      
      // Budget handling
      if (!hasInitialBudgetInUrl) {
        // No explicit budget from URL; reset to full range for the selected tab
        updates.budget = newBudgetRange;
        updates.budgetDirty = false;
      } else {
        // Clamp existing budget into the new tab's range
        const current = prev.budget;
        const clampedMin = Math.max(0, Math.min(current[0], newBudgetRange[1]));
        const clampedMax = Math.max(0, Math.min(current[1], newBudgetRange[1]));
        const adjusted: [number, number] = clampedMin > clampedMax ? [clampedMax, clampedMax] : [clampedMin, clampedMax];
        const dirty = adjusted[0] > 0 || adjusted[1] < newBudgetRange[1];
        updates.budget = adjusted;
        updates.budgetDirty = dirty;
      }
      
      // Area handling - clear the irrelevant filter when switching tabs
      if (activeTab === 'land') {
        // Reset the standard area filter when switching to land tab
        updates.area = [0, 6000];
        updates.areaDirty = false;
      } else {
        // Reset the land area filter when switching to non-land tabs
        updates.landArea = [0, 6];
        updates.landAreaDirty = false;
      }
      
      return { ...prev, ...updates };
    });
  }, [activeTab]);

  // Transform property data helper - Memoized with useCallback for performance
  const transformProperty = useCallback((property: PropertyRow) => {
    let displayPropertyType = property.property_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Property';
    // Initialize filterPropertyType as the same as displayPropertyType by default
    let filterPropertyType = displayPropertyType;
    const titleLowerForInference = (property.title || '').toLowerCase();

    // Map special property types for filtering
    if (displayPropertyType.toLowerCase() === 'penthouse') {
      // For display purposes, keep it as "Penthouse", but map to "Apartment" for filtering
      filterPropertyType = 'Apartment';
    } else if (displayPropertyType.toLowerCase() === 'duplex') {
      // For display purposes, keep it as "Duplex", but map to "Villa" for filtering  
      filterPropertyType = 'Villa';
    }

    // Normalize land/plot subtypes so filters can match precisely
    try {
      const ptLower = (property.property_type || '').toLowerCase();
      const titleLower = (property.title || '').toLowerCase();
      const looksLikeLand = ptLower.includes('plot') || ptLower.includes('land') || titleLower.includes(' land');
      if (looksLikeLand) {
        if (ptLower.includes('agriculture') || titleLower.includes('agricultural land')) {
          displayPropertyType = 'Agricultural Land';
        } else if (titleLower.includes('industrial land')) {
          displayPropertyType = 'Industrial Land';
        } else if (titleLower.includes('commercial land')) {
          displayPropertyType = 'Commercial Land';
        } else if (!displayPropertyType.toLowerCase().includes('land') && !displayPropertyType.toLowerCase().includes('plot')) {
          // Generic land fallback
          displayPropertyType = 'Land';
        }
      } else {
        // Infer commercial space subtype from title/property_type for realtime categorization
        const isCommercialContext = ptLower.includes('commercial') || titleLower.includes('commercial');
        const office = /\boffice\b|\bbusiness center\b|\bworkspace\b/.test(titleLower) || ptLower.includes('office');
        const retail = /\bretail\b|\bshop\b|\bstore\b|\boutlet\b/.test(titleLower) || ptLower.includes('retail') || ptLower.includes('shop') || ptLower.includes('store');
        const warehouse = /\bwarehouse\b|\bgodown\b/.test(titleLower) || ptLower.includes('warehouse');
        const showroom = /\bshowroom\b/.test(titleLower) || ptLower.includes('showroom');
        const restaurant = /\brestaurant\b|\bcafe\b|\bfood court\b/.test(titleLower) || ptLower.includes('restaurant') || ptLower.includes('cafe');
        const coworking = /\bcoworking\b|\bco-working\b/.test(titleLower) || ptLower.includes('coworking') || ptLower.includes('co-working');
        const industrialSpace = (titleLower.includes('industrial') || ptLower.includes('industrial')) && !titleLower.includes('industrial land') && !ptLower.includes('land');

        if (isCommercialContext || office || retail || warehouse || showroom || restaurant || coworking || industrialSpace) {
          if (office) displayPropertyType = 'Office';
          else if (retail) displayPropertyType = 'Retail';
          else if (warehouse) displayPropertyType = 'Warehouse';
          else if (showroom) displayPropertyType = 'Showroom';
          else if (restaurant) displayPropertyType = 'Restaurant';
          else if (coworking) displayPropertyType = 'Co-Working';
          else if (industrialSpace) displayPropertyType = 'Industrial';
        }
      }
    } catch (e) {
      // no-op: fallback to original displayPropertyType
    }
    
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
          // Use the standardized area unit function from our utility
          const standardizedUnit = getStandardizedAreaUnit(property.plot_area_unit);
          
          console.log('Land property area mapping:', {
            id: property.id,
            property_type: property.property_type,
            original_unit: property.plot_area_unit,
            standardized_unit: standardizedUnit,
            area_value: areaValue
          });
          
          return `${areaValue} ${standardizedUnit}`;
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
      filterPropertyType: filterPropertyType, // Used for filtering while keeping original display name
      furnished: property.furnishing?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      availability: property.availability_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      ageOfProperty: property.property_age?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      locality: property.locality || '',
      city: property.city || '',
      bhkType: property.bhk_type || '1bhk',
      listingType: property.listing_type || 'sale',
      isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ownerId: property.user_id, // Add owner ID for ownership detection
      plotAreaUnit: property.plot_area_unit ? getStandardizedAreaUnit(property.plot_area_unit) : 'sq.ft',
    is_premium: !!property.is_premium,
      // Commercial specifics (best-effort mapping; values may be absent on residential/land)
      floorNo: ((): number | 'basement' | 'ground' | undefined => {
        const f = property.floor_no as number | 'basement' | null | undefined;
        if (typeof f === 'number' || f === 'basement') return f;
        // Try to infer from title when explicit field missing
        const t = titleLowerForInference;
        // First try structured floor_type if available
        const ft = (property.floor_type || '').toLowerCase();
        if (ft) {
          if (ft.includes('basement')) return 'basement';
          if (ft.includes('lower ground') || /\blg\b/.test(ft) || /\blgf\b/.test(ft)) return 'ground';
          if (ft.includes('ground')) return 'ground';
          if (ft.includes('1')) return 1;
          if (ft.includes('2')) return 2;
          if (ft.includes('3')) return 3;
        }
        if (t.includes('basement')) return 'basement';
        if (t.includes('lower ground') || /\blg\b/.test(t) || /\blgf\b/.test(t)) return 'ground';
        if (t.includes('ground floor') || /\bgf\b/.test(t) || t === 'ground' || t.includes('on ground')) return 'ground';
        if (t.includes('first floor') || /\b1st\b/.test(t) || t.includes('on 1st') || /\bf1\b/.test(t)) return 1;
        if (t.includes('second floor') || /\b2nd\b/.test(t) || t.includes('on 2nd') || /\bf2\b/.test(t)) return 2;
        if (t.includes('third floor') || /\b3rd\b/.test(t) || t.includes('on 3rd') || /\bf3\b/.test(t)) return 3;
        // As a last resort, assume ground for commercial-like properties to match UX expectations
        const dt = (displayPropertyType || '').toLowerCase();
        const commercialish = dt.includes('commercial') || dt.includes('office') || dt.includes('retail') || dt.includes('shop') || dt.includes('store') || dt.includes('warehouse') || dt.includes('showroom') || dt.includes('restaurant') || dt.includes('coworking') || dt.includes('co-working') || (dt.includes('industrial') && !dt.includes('land'));
        if (commercialish) return 'ground';
        return undefined;
      })(),
      parkingAvailable: ((): boolean | undefined => {
        const t = titleLowerForInference;
        if (!t) return undefined;
        if (t.includes('no parking') || t.includes('without parking')) return false;
        if (t.includes('with parking') || t.includes('parking available') || t.includes('car parking') || t.includes('covered parking') || t.includes('open parking') || t.includes('2 wheeler') || t.includes('four wheeler') || t.includes('4 wheeler')) return true;
        if (t.includes('parking')) return true; // generic mention
        return undefined;
      })()
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
          .eq('is_visible', true)
          .neq('status', 'rejected'); // Exclude rejected properties from count

        setPropertyCount(count || 0);

        // Fetch only essential fields initially for better performance
        // Load in batches to avoid overwhelming the browser
        const { data: properties, error } = await supabase
          .from('properties')
          .select(SELECT_COLUMNS)
          .eq('is_visible', true)
          .neq('status', 'rejected') // Exclude rejected properties from search
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
        .select(SELECT_COLUMNS)
        .eq('is_visible', true)
        .neq('status', 'rejected') // Exclude rejected properties from search
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
      // Buy tab behaviour
      if (MERGE_COMM_LAND_IN_BUY_RENT) {
        // Include ALL sale/resale properties (residential + commercial + land)
        filtered = filtered.filter(property => {
          const listingType = property.listingType?.toLowerCase();
          // Include sale/resale AND commercial properties for the merged tab
          const isMatch = listingType === 'sale' || listingType === 'resale' || listingType === 'commercial';
          return isMatch;
        });
      } else {
        // Legacy: Exclude commercial and land from Buy tab
        filtered = filtered.filter(property => {
          const listingType = property.listingType?.toLowerCase();
          const propertyType = property.propertyType.toLowerCase();
          const isLandProperty = propertyType.includes('plot') || 
                 propertyType.includes('land') ||
                 propertyType.includes('agricultural') ||
                 propertyType.includes('industrial land') ||
                 propertyType.includes('commercial land');
          if (isLandProperty) return false;
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
          if (isCommercialType) return false;
          return listingType === 'sale' || listingType === 'resale';
        });
      }
    } else if (activeTab === 'rent') {
      // Rent tab behaviour
      if (MERGE_COMM_LAND_IN_BUY_RENT) {
        // Include residential rentals, PG/Hostel, and commercial rentals
        filtered = filtered.filter(property => {
          const listingType = property.listingType?.toLowerCase();
          const propertyType = property.propertyType.toLowerCase();
          const isPgHostel = listingType === 'pg/hostel' || propertyType.includes('pg') || propertyType.includes('hostel');
          const isRent = listingType === 'rent';
          const isMatch = isRent || isPgHostel;
          if (!isMatch) {
            console.log('❌ Filtered out for rent (merged):', property.title, 'listing_type:', listingType, 'property_type:', propertyType);
          }
          return isMatch;
        });
      } else {
        // Legacy: Exclude commercial rentals from Rent tab
        filtered = filtered.filter(property => {
          const listingType = property.listingType?.toLowerCase();
          const propertyType = property.propertyType.toLowerCase();
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
          if (isCommercialType) return false;
          const isMatch = listingType === 'rent' || 
                 listingType === 'pg/hostel' || 
                 propertyType.includes('pg') || 
                 propertyType.includes('hostel');
          return isMatch;
        });
      }
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
        // Exclude land/plot types from commercial tab (they belong in Land/Plot)
        const isLandType = propertyType.includes('land') || propertyType.includes('plot') || propertyType.includes('agricultural');
        if (isLandType) {
          return false;
        }
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
          // Use filterPropertyType for matching categories (which maps Penthouse->Apartment, Duplex->Villa)
          // but use propertyType for display purposes
          const normalizedProperty = (property.filterPropertyType || property.propertyType).toLowerCase().replace(/\s+/g, '');
          const listingLower = (property.listingType || '').toLowerCase();
          const titleLower = (property.title || '').toLowerCase();
          
          // Debug mapping for special property types
          if (property.propertyType !== property.filterPropertyType) {
            console.log(`📊 Mapping: ${property.propertyType} -> ${property.filterPropertyType}, matches ${filterType}? ${normalizedProperty.includes(normalizedFilter)}`);
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

          // Specific Land/Plot categories MUST be matched before the generic land/plot branch
          if (normalizedFilter === 'agriculturalland') {
            // Match both property_type variations (agriculture_lands) and listing_type (Agricultural Land)
            const isAgri = normalizedProperty.includes('agricultural') ||
                           normalizedProperty.includes('agriculture') ||
                           listingLower.includes('agricultural') ||
                           titleLower.includes('agricultural land');
            const isLand = normalizedProperty.includes('land') || normalizedProperty.includes('plot') || listingLower.includes('land') || titleLower.includes('land');
            return isAgri && isLand;
          }
          if (normalizedFilter === 'commercialland') {
            const isCommercial = normalizedProperty.includes('commercial') || listingLower.includes('commercial') || titleLower.includes('commercial land');
            const isLand = normalizedProperty.includes('land') || normalizedProperty.includes('plot') || listingLower.includes('land') || titleLower.includes('land');
            return isCommercial && isLand;
          }
          if (normalizedFilter === 'industrialland') {
            const isIndustrial = normalizedProperty.includes('industrial') || listingLower.includes('industrial') || titleLower.includes('industrial land');
            const isLand = normalizedProperty.includes('land') || normalizedProperty.includes('plot') || listingLower.includes('land') || titleLower.includes('land');
            return isIndustrial && isLand;
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
            // Generic land/plot match (only after specific categories are handled above)
            return normalizedProperty.includes('plot') || normalizedProperty.includes('land');
          }
          if (normalizedFilter.includes('pghosted') || normalizedFilter.includes('pg')) {
            return normalizedProperty.includes('pg') || normalizedProperty.includes('hostel');
          }
          if (normalizedFilter.includes('coliving')) {
            return normalizedProperty.includes('coliving') || normalizedProperty.includes('co-living');
          }
          if (normalizedFilter.includes('builderfloor')) {
            return normalizedProperty.includes('builderfloor') || (normalizedProperty.includes('builder') && normalizedProperty.includes('floor'));
          }
          if (normalizedFilter.includes('studioapartment')) {
            return normalizedProperty.includes('studioapartment') || normalizedProperty.includes('studio');
          }
          if (normalizedFilter.includes('coworking') || normalizedFilter === 'co-working') {
            return normalizedProperty.includes('coworking') || normalizedProperty.includes('co-working') || titleLower.includes('coworking') || titleLower.includes('co-working');
          }
          if (normalizedFilter.includes('office')) {
            return normalizedProperty.includes('office') || /\boffice\b/.test(titleLower);
          }
          if (normalizedFilter.includes('retail')) {
            // Treat 'retail' as retail/shop/store
            return normalizedProperty.includes('retail') || normalizedProperty.includes('shop') || normalizedProperty.includes('store') || /\b(retail|shop|store|outlet)\b/.test(titleLower);
          }
          if (normalizedFilter.includes('warehouse')) {
            return normalizedProperty.includes('warehouse') || /\b(warehouse|godown)\b/.test(titleLower);
          }
          if (normalizedFilter.includes('showroom')) {
            return normalizedProperty.includes('showroom') || /\bshowroom\b/.test(titleLower);
          }
          if (normalizedFilter.includes('restaurant')) {
            return normalizedProperty.includes('restaurant') || /\b(restaurant|cafe|food court)\b/.test(titleLower);
          }
          if (normalizedFilter === 'industrial') {
            // Match industrial spaces but avoid 'industrial land'
            const titleOk = titleLower.includes('industrial') && !titleLower.includes('industrial land');
            return (normalizedProperty.includes('industrial') && !normalizedProperty.includes('land')) || titleOk;
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

    // Apply area filter based on property type
    // For land properties, always use landArea filter
    // For non-land properties, always use the regular area filter
    filtered = filtered.filter(property => {
      const isLandProperty = property.propertyType?.toLowerCase().includes('land') || 
                           property.propertyType?.toLowerCase().includes('plot');
      
      const area = property.areaNumber || 0;
      
      // For land/plot properties, use the land area filter if dirty
      if (isLandProperty) {
        if (filters.landAreaDirty) {
          const propertyAreaUnit = property.plotAreaUnit || 'sq.ft';
          
          // No need to standardize again - it's already standardized during transformation
          
          console.log('Land property filtering:', {
            property: property.title,
            originalArea: area,
            propertyUnit: propertyAreaUnit,
            targetUnit: filters.landAreaUnit,
            filterRange: filters.landArea
          });
          
          const propertyAreaInFilterUnit = convertArea(
            area,
            propertyAreaUnit as AreaUnit,
            filters.landAreaUnit as AreaUnit
          );
          
          console.log('After conversion:', {
            convertedArea: propertyAreaInFilterUnit,
            unit: filters.landAreaUnit,
            inRange: propertyAreaInFilterUnit >= filters.landArea[0] && propertyAreaInFilterUnit <= filters.landArea[1]
          });
          
          // Now compare using the converted value
          return propertyAreaInFilterUnit >= filters.landArea[0] && 
                propertyAreaInFilterUnit <= filters.landArea[1];
        }
        // No filtering if land area filter is not dirty
        return true;
      } else {
        // For non-land properties, use regular area filter if dirty
        if (filters.areaDirty) {
          return area >= filters.area[0] && area <= filters.area[1];
        }
        // No filtering if area filter is not dirty
        return true;
      }
    });

    // Apply BHK filter (residential only)
    if (filters.bhkType.length > 0) {
      filtered = filtered.filter(property => {
        const pt = property.propertyType.toLowerCase();
        const isLand = pt.includes('land') || pt.includes('plot');
        const isCommercial = pt.includes('commercial') || pt.includes('office') || pt.includes('shop') || pt.includes('retail') || pt.includes('warehouse') || pt.includes('showroom') || pt.includes('restaurant') || pt.includes('coworking') || pt.includes('co-working') || (pt.includes('industrial') && !pt.includes('land'));
        const isResidential = !isLand && !isCommercial;
        // If not residential, do not filter out by BHK
        if (!isResidential) return true;
        // Residential: apply BHK matching
        return filters.bhkType.some(bhkFilter => {
          const propertyBhk = property.bhkType?.toLowerCase();
          const filterBhk = bhkFilter.toLowerCase().replace(/\s+/g, '');
          return propertyBhk?.includes(filterBhk);
        });
      });
    }

    // Apply furnished filter
    if (filters.furnished.length > 0) {
      console.log('🔍 Applying furnished filter:', filters.furnished);
      filtered = filtered.filter(property => {
        const hasMatch = filters.furnished.some(furnishedFilter => {
          const match = property.furnished?.toLowerCase().includes(furnishedFilter.toLowerCase());
          if (!match && property.furnished) {
            console.log('❌ Furnished mismatch:', {
              property: property.title,
              propertyFurnished: property.furnished,
              filterValue: furnishedFilter
            });
          }
          return match;
        });
        if (!hasMatch) {
          console.log('❌ Property filtered out by furnished:', property.title, 'furnished:', property.furnished);
        }
        return hasMatch;
      });
      console.log('📊 After furnished filter:', filtered.length, 'properties');
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
      console.log('🔍 Applying age/construction filter:', filters.construction);
      filtered = filtered.filter(property => {
        const hasMatch = filters.construction.some(constrFilter => {
          const normalizedConstr = constrFilter.toLowerCase().replace(/\s+/g, '');
          const propertyAge = property.ageOfProperty?.toLowerCase().replace(/\s+/g, '') || '';
          
          if (normalizedConstr === 'newproject') {
            return propertyAge.includes('new') || property.isNew;
          }
          
          const match = propertyAge.includes(normalizedConstr);
          if (!match && property.ageOfProperty) {
            console.log('❌ Age mismatch:', {
              property: property.title,
              propertyAge: property.ageOfProperty,
              filterValue: constrFilter,
              normalizedConstr
            });
          }
          return match;
        });
        if (!hasMatch) {
          console.log('❌ Property filtered out by age:', property.title, 'age:', property.ageOfProperty);
        }
        return hasMatch;
      });
      console.log('📊 After age/construction filter:', filtered.length, 'properties');
    }

    // Apply commercial-specific filters (only when on commercial tab)
    if (activeTab === 'commercial') {
      // Floor filter
      if (filters.floor && filters.floor.length > 0) {
        const normalized = filters.floor.map(s => s.toLowerCase());
        const allOptions = ['basement', 'ground', '1', '2', '3+'];
        const includesAll = allOptions.every(o => normalized.includes(o));
        if (!includesAll) {
          // If there are no explicit 0/'ground' entries in the currently filtered set,
          // treat '1' as ground (common in some legacy datasets).
          const hasExplicitGround = filtered.some(p => p.floorNo === 0 || p.floorNo === 'ground');
          const treatOneAsGround = !hasExplicitGround;

          filtered = filtered.filter(property => {
            const f = property.floorNo;
            return normalized.some(sel => {
              const s = sel;
              if (s === 'basement') return f === 'basement';
              if (s === 'ground') return f === 'ground' || f === 0 || (treatOneAsGround && f === 1) || typeof f === 'undefined';
              if (s.endsWith('+')) {
                const n = parseInt(s.replace('+',''));
                return typeof f === 'number' && f >= n;
              }
              const n = parseInt(s);
              return typeof f === 'number' && f === n;
            });
          });
        }
      }
      // Parking filter
      if (filters.parking && filters.parking.length > 0) {
        filtered = filtered.filter(property => {
          const hasParking = property.parkingAvailable;
          return filters.parking!.some(p => {
            const v = p.toLowerCase();
            // If parking availability is unknown, don't match either option
            if (typeof hasParking === 'undefined') return false;
            if (v.includes('no')) return hasParking === false;
            return hasParking === true; // 'Parking Available'
          });
        });
      }
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
        // Commercial type-first sorts: bring matching type to the top
        case 'type-office': {
          const score = (p: typeof a) => (p.propertyType.toLowerCase().includes('office') ? 1 : 0);
          return score(b) - score(a);
        }
        case 'type-retail': {
          const score = (p: typeof a) => (p.propertyType.toLowerCase().includes('retail') || p.propertyType.toLowerCase().includes('shop') || p.propertyType.toLowerCase().includes('store') ? 1 : 0);
          return score(b) - score(a);
        }
        case 'type-warehouse': {
          const score = (p: typeof a) => (p.propertyType.toLowerCase().includes('warehouse') ? 1 : 0);
          return score(b) - score(a);
        }
        case 'type-showroom': {
          const score = (p: typeof a) => (p.propertyType.toLowerCase().includes('showroom') ? 1 : 0);
          return score(b) - score(a);
        }
        case 'type-restaurant': {
          const score = (p: typeof a) => (p.propertyType.toLowerCase().includes('restaurant') ? 1 : 0);
          return score(b) - score(a);
        }
        case 'type-coworking': {
          const score = (p: typeof a) => (p.propertyType.toLowerCase().includes('coworking') || p.propertyType.toLowerCase().includes('co-working') ? 1 : 0);
          return score(b) - score(a);
        }
        case 'type-industrial': {
          const score = (p: typeof a) => (p.propertyType.toLowerCase().includes('industrial') && !p.propertyType.toLowerCase().includes('land') ? 1 : 0);
          return score(b) - score(a);
        }
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
  }, [allProperties, filters, activeTab, normalizeLocationName, MERGE_COMM_LAND_IN_BUY_RENT]);

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
      if (key === 'landArea') {
        const range = value as [number, number];
        const dirty = range[0] > 0 || range[1] < 6;
        return { ...prev, landArea: range, landAreaDirty: dirty };
      }
      if (key === 'landAreaUnit') {
        return { ...prev, landAreaUnit: value as string, landAreaDirty: true };
      }
      // Handle location updates - always treat as single location
      if (key === 'locations') {
        // If it's an array and has values, use the first one only
        if (Array.isArray(value) && value.length > 0) {
          return { ...prev, location: value[0], locations: [] } as SearchFilters;
        }
        // If empty array, clear both location and locations
        return { ...prev, location: '', locations: [] } as SearchFilters;
      }
      // When updating location directly, always clear the locations array
      if (key === 'location') {
        return { ...prev, location: value as string, locations: [] } as SearchFilters;
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
      landArea: [0, 10], // Reset land area range to default
      landAreaUnit: 'acres', // Default land area unit 
      landAreaDirty: false,
      locality: [],
      furnished: [],
      availability: [],
      construction: [],
      location: '', // Clear the single location field
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