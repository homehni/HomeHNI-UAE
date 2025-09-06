import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PropertySearchParams {
  intent: string;
  propertyType: string;
  country: string;
  state: string;
  city: string;
  budgetMin: string;
  budgetMax: string;
  page: string;
  pageSize: string;
  bhkType?: string;
  furnished?: string;
  availability?: string;
  ageOfProperty?: string;
  locality?: string;
  sortBy?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestBody = await req.json();
    const {
      intent,
      propertyType,
      country,
      state,
      city,
      budgetMin,
      budgetMax,
      page = '1',
      pageSize = '10',
      bhkType,
      furnished,
      availability,
      ageOfProperty,
      locality,
      sortBy = 'relevance'
     } = requestBody;
 
     // Determine if land-like property is requested to relax irrelevant filters (e.g., BHK)
     const landRequested = (() => {
       const list: string[] = Array.isArray((requestBody as any).propertyTypes) ? (requestBody as any).propertyTypes : [];
       const single = propertyType || '';
       const labels = [...list, single].map((s: string) => String(s || '').toLowerCase());
       const hasLandLabel = labels.some(l => ['plot', 'plots', 'agricultural lands', 'agriculture lands', 'agricultural land', 'agriculture land', 'farm house', 'farmhouse', 'plots/land', 'plots & land'].includes(l));
       return hasLandLabel || intent === 'plots';
     })();
 
    console.log('Search params (from body):', requestBody);
    console.log('Mapped filters will be:', {
      propertyTypes: Array.isArray(requestBody.propertyTypes) && requestBody.propertyTypes.length > 0 ? requestBody.propertyTypes : (propertyType ? [propertyType] : []),
      bhkType: bhkType && bhkType !== 'All' ? ({ '2 BHK': '2bhk', '3 BHK': '3bhk', '4 BHK': '4bhk' }[bhkType] || bhkType.toLowerCase().replace(/\s+/g, '').replace(/\+/, '')) : 'no filter',
      landRequested,
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the query
    let query = supabase
      .from('properties')
      .select(`
        id, title, property_type, listing_type, expected_price, 
        city, locality, state, images, bhk_type,
        bathrooms, balconies, furnishing, availability_type, 
        super_area, carpet_area, created_at, property_age,
        current_property_condition, is_featured
      `)
      .eq('status', 'approved');

    // Filter by intent - handle different tab types
    if (intent) {
      switch (intent) {
        case 'buy':
          query = query.eq('listing_type', 'sale');
          break;
        case 'rent':
          query = query.eq('listing_type', 'rent');
          break;
        case 'commercial':
          // Commercial properties - don't filter by listing type here
          // The property type filtering will be handled by the propertyType parameter
          // and listing type will be determined by the context (buy/rent tab)
          break;
        case 'plots':
          // Plots/Land includes multiple land-related property types
          query = query.in('property_type', ['plot', 'agriculture_lands', 'farm_house']);
          break;
        case 'new-launch':
          // New launch properties - filter by availability type
          query = query.eq('availability_type', 'under_construction');
          break;
        case 'projects':
          // Projects - could be under construction or new properties
          query = query.or('availability_type.eq.under_construction,is_featured.eq.true');
          break;
        case 'pg':
          // PG/Hostel - this might need a specific property type
          query = query.eq('property_type', 'pg');
          break;
        default:
          // For any other intent, treat as listing type
          query = query.eq('listing_type', intent);
          break;
      }
    }

    // Filter by property type with proper mapping (supports multiple selections)
    {
      // 1) Try to load mapping from CMS (content_elements)
      let cmsMap: Record<string, string[] | string> | null = null;
      try {
        const { data: cmsMapping } = await supabase
          .from('content_elements')
          .select('content, element_key')
          .in('element_key', ['search_property_type_mapping', 'property_type_mappings'])
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (cmsMapping && cmsMapping.content && typeof cmsMapping.content === 'object') {
          cmsMap = cmsMapping.content as Record<string, string[] | string>;
        }
      } catch (e) {
        console.log('CMS mapping not found, using defaults');
      }

      // 2) Default hard-coded fallback mapping (used if CMS not configured)
      const propertyTypeMap: { [key: string]: string } = {
        'APARTMENT': 'apartment',
        'VILLA': 'villa',
        'PLOT': 'plot',
        'HOUSE': 'house',
        'INDEPENDENT HOUSE': 'independent_house',
        'PENTHOUSE': 'penthouse',
        'COMMERCIAL': 'commercial',
        'AGRICULTURE LANDS': 'agriculture_lands',
        'AGRICULTURAL LANDS': 'agriculture_lands',
        'FARM HOUSE': 'farm_house',
        'Agricultural Lands': 'agriculture_lands',
        // Legacy mappings for backward compatibility
        'Flat/Apartment': 'apartment',
        'Independent Building/Floor': 'independent_building',
        'Independent House': 'independent_house', 
        'Villa': 'villa',
        'Plots': 'plot',
        'Farm House': 'farm_house',
        'Industrial Space/Building': 'industrial',
        'Commercial Space/Building': 'commercial'
      };

      const normalizeToDbTypes = (key: string): string[] => {
        const k = key.toLowerCase();
        if (k === 'agriculture_lands' || k === 'agricultural_lands' || k === 'agriculture_land' || k === 'agricultural_land' || k === 'agriculture') {
          // Only return agriculture-specific types, not plot
          return ['agriculture_lands', 'agricultural_lands', 'agriculture_land', 'agricultural_land'];
        }
        if (k === 'farm_house' || k === 'farmhouse') {
          // Only return farmhouse-specific types, not plot
          return ['farm_house', 'farmhouse'];
        }
        return [k];
      };

      const getCmsMappedTypes = (label: string): string[] => {
        if (!cmsMap) return [];
        const candidates = [label, label.toUpperCase(), label.toLowerCase(), label.replace(/\s+/g, '_').toLowerCase()];
        for (const c of candidates) {
          const v = (cmsMap as any)[c];
          if (Array.isArray(v)) return v.flatMap((t: string) => normalizeToDbTypes(String(t)));
          if (typeof v === 'string') return normalizeToDbTypes(String(v));
        }
        return [];
      };

      const selectedTypes: string[] = [];

      if (Array.isArray((requestBody as any).propertyTypes)) {
        for (const t of (requestBody as any).propertyTypes as string[]) {
          if (!t || t === 'Others' || t === 'All Residential') continue;

          // Prefer CMS mapping if available
          const cmsTypes = getCmsMappedTypes(t);
          if (cmsTypes.length > 0) {
            selectedTypes.push(...cmsTypes);
            continue;
          }

          // Fallback to default mapping
          const key = propertyTypeMap[t] || propertyTypeMap[t.toUpperCase()] || t.toLowerCase().replace(/\s+/g, '_');
          selectedTypes.push(...normalizeToDbTypes(key));
        }
      }

      // Fallback to single propertyType
      if (selectedTypes.length === 0 && propertyType && propertyType !== 'Others' && propertyType !== 'All Residential') {
        const cmsTypes = getCmsMappedTypes(propertyType);
        if (cmsTypes.length > 0) {
          selectedTypes.push(...cmsTypes);
        } else {
          const mappedType = propertyTypeMap[propertyType] || propertyTypeMap[propertyType.toUpperCase()] || propertyType.toLowerCase().replace(/\s+/g, '_');
          selectedTypes.push(...normalizeToDbTypes(mappedType));
        }
      }

      if (selectedTypes.length > 0) {
        const unique = Array.from(new Set(selectedTypes));
        console.log('Applying property_type filter:', unique);
        query = query.in('property_type', unique);
      }
    }

    // Filter by state
    if (state) {
      query = query.eq('state', state);
    }

    // Filter by city or locality
    if (city) {
      query = query.or(`city.ilike.%${city}%,locality.ilike.%${city}%`);
    }

    // Filter by specific locality
    if (locality) {
      query = query.or(`locality.ilike.%${locality}%,city.ilike.%${locality}%`);
    }

    // Filter by BHK type (skip for land/plots searches)
    if (!landRequested && bhkType && bhkType !== 'All') {
      // Handle BHK type mapping to match database format (e.g., "2 BHK" -> "2bhk")
      const bhkMap: { [key: string]: string } = {
        '1 RK': '1rk',
        '1 BHK': '1bhk',
        '2 BHK': '2bhk', 
        '3 BHK': '3bhk',
        '4 BHK': '4bhk',
        '5+ BHK': '5bhk'
      };
      const mappedBhk = bhkMap[bhkType] || bhkType.toLowerCase().replace(/\s+/g, '').replace(/\+/, '');
      query = query.eq('bhk_type', mappedBhk);
    }

    // Filter by furnished status  
    if (furnished && furnished !== 'All') {
      const furnishedMap: { [key: string]: string } = {
        'Furnished': 'furnished',
        'Semi-Furnished': 'semi_furnished', 
        'Unfurnished': 'unfurnished'
      };
      
      const mappedFurnished = furnishedMap[furnished] || furnished.toLowerCase();
      query = query.eq('furnishing', mappedFurnished);
    }

    // Filter by availability type
    if (availability && availability !== 'All') {
      if (availability === 'Ready to Move') {
        query = query.eq('availability_type', 'immediate');
      } else if (availability === 'Under Construction') {
        query = query.eq('availability_type', 'under_construction');
      } else {
        const mappedAvailability = availability.toLowerCase().replace(/\s+/g, '_');
        query = query.eq('availability_type', mappedAvailability);
      }
    }

    // Filter by property age
    if (ageOfProperty && ageOfProperty !== 'All') {
      query = query.eq('property_age', ageOfProperty.toLowerCase().replace(/\s+/g, '_'));
    }

    // Filter by budget
    const minBudget = parseInt(budgetMin) || 0;
    const maxBudget = parseInt(budgetMax) || 999999999;
    
    if (minBudget > 0) {
      query = query.gte('expected_price', minBudget);
    }
    if (maxBudget < 999999999) {
      query = query.lte('expected_price', maxBudget);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        query = query.order('expected_price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('expected_price', { ascending: false });
        break;
      case 'area':
        query = query.order('super_area', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        // Relevance - prioritize featured properties
        query = query.order('is_featured', { ascending: false })
                    .order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const pageNum = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const from = (pageNum - 1) * size;
    const to = from + size - 1;

    query = query.range(from, to);

    const { data: properties, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Transform the data to match PropertyCard format
    const items = (properties || []).map(property => {
      // Format price for display
      const formatPrice = (price) => {
        if (!price) return 'Price on Request';
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
        return `₹${price.toLocaleString()}`;
      };

      return {
        id: property.id,
        title: property.title,
        location: `${property.locality}, ${property.city}, ${property.state}`,
        price: formatPrice(property.expected_price),
        area: property.super_area ? `${property.super_area} sq ft` : 'Area not specified',
        bedrooms: property.bhk_type ? parseInt(property.bhk_type) || 0 : 0,
        bathrooms: property.bathrooms || 0,
        image: property.images && property.images.length > 0 
          ? property.images[0] 
          : '/placeholder.svg',
        propertyType: property.property_type,
        isNew: property.is_featured || false
      };
    });

    // Get total count for pagination
    let totalCount = count || 0;
    if (count === null) {
      // If count is null, we need to make a separate count query
      const { count: actualCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      totalCount = actualCount || 0;
    }

    const response = {
      items,
      total: totalCount,
      page: pageNum,
      pageSize: size,
      hasMore: (pageNum * size) < totalCount
    };

    console.log(`Found ${items.length} properties out of ${totalCount} total`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});