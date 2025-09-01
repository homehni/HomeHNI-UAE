import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapPropertyType } from '@/utils/propertyMappings';

export interface PropertySearchQuery {
  intent: 'buy' | 'sell' | 'lease' | 'rent' | 'new-launch' | 'pg' | 'commercial' | 'plots' | 'projects' | '';
  propertyType: string;
  country: string;
  state: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  type: string;
  intent: string;
  priceInr: number | null;
  city: string;
  state: string;
  country: string;
  image: string;
  badges: string[];
  url: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  image: string;
  url: string;
  rating?: number;
  experience?: string;
}

export interface SearchResults {
  items: PropertyListing[] | ServiceProvider[];
  total: number;
  hasMore: boolean;
}

export const usePropertySearch = () => {
  const [results, setResults] = useState<SearchResults>({ items: [], total: 0, hasMore: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchProperties = useCallback(async (query: PropertySearchQuery, page = 1, append = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Skip search if essential fields are missing
    if (!query.intent || !query.country || !query.state) {
      setResults({ items: [], total: 0, hasMore: false });
      return;
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      // Fetch properties from Supabase property_real (single source of truth)
      const { data: prRows, error: prError } = await (supabase as any)
        .from('property_real')
        .select('id, element_type, element_key, title, property_type, location, images, content, updated_at')
        .limit(500);

      if (prError) {
        throw new Error(prError.message);
      }

      type AnyRow = {
        id?: string | null;
        element_type?: string | null;
        element_key?: string | null;
        title?: string | null;
        property_type?: string | null;
        location?: string | null;
        images?: any;
        content?: any;
        updated_at?: string | null;
      };

      const toArray = (v: any): string[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter(Boolean);
        if (typeof v === 'string') {
          try {
            // handle stringified JSON arrays
            const parsed = JSON.parse(v);
            return Array.isArray(parsed) ? parsed.filter(Boolean) : [v];
          } catch {
            return v.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
        return [];
      };

      let propertiesPool: any[] = [];
      (prRows as AnyRow[] | null)?.forEach((row) => {
        const c = (row.content ?? {}) as any;

        // Extract city/state from content or from location text ("City, State, Country")
        let city = (c.city ?? '').toString().trim();
        let state = (c.state ?? '').toString().trim();
        if ((!city || !state) && row.location) {
          const parts = row.location.split(',').map((s) => s.trim());
          city = city || (parts[0] ?? '');
          state = state || (parts[1] ?? '');
        }

        const images = toArray(c.images ?? row.images);

        propertiesPool.push({
          id: c.id ?? row.id,
          title: row.title ?? c.title ?? 'Property',
          property_type: (c.property_type ?? row.property_type ?? '').toLowerCase(),
          listing_type: (c.listing_type ?? 'sale').toLowerCase(),
          status: (c.status ?? 'approved').toLowerCase(),
          expected_price: c.expected_price != null ? Number(c.expected_price) : null,
          city,
          state,
          availability_type: (c.availability_type ?? '').toLowerCase(),
          is_featured: Boolean(c.is_featured) || /featured/i.test(row.element_key ?? ''),
          isRecommended: Boolean(c.isRecommended) || /recommended/i.test(row.element_key ?? ''),
          furnishing: c.furnishing ?? null,
          super_area: c.super_area ?? null,
          images,
        });
      });

      console.log(`📦 Loaded from property_real: ${propertiesPool.length}`);
      console.log(`🔍 Search Query:`, {
        intent: query.intent,
        propertyType: query.propertyType,
        mappedPropertyType: query.propertyType ? mapPropertyType(query.propertyType) : null,
        state: query.state,
        city: query.city,
        budgetRange: `₹${query.budgetMin} - ₹${query.budgetMax}`,
      });
      console.log(`📊 Property types available:`, [...new Set(propertiesPool.map(p => p.property_type))]);
      console.log(`🎯 Property statuses:`, [...new Set(propertiesPool.map(p => p.status))]);
      console.log(`⭐ Featured properties:`, propertiesPool.filter(p => p.is_featured).length);
      console.log(`📊 Total properties in pool:`, propertiesPool.length);
      
      // Filter properties using string-based search on property_type and location fields
      let filteredProperties = propertiesPool.filter(property => {
        console.log(`🏠 Checking property:`, {
          id: property.id,
          title: property.title,
          type: property.property_type,
          location: `${property.city}, ${property.state}`,
          status: property.status,
          price: property.expected_price
        });

        // Filter by status - only approved properties
        if (property.status !== 'approved') {
          console.log(`❌ Property ${property.id} rejected: status is ${property.status}, not approved`);
          return false;
        }

        // String-based property type matching
        if (query.propertyType && query.propertyType !== 'Others') {
          const queryType = query.propertyType.toLowerCase().trim();
          const propertyType = (property.property_type || '').toLowerCase().trim();
          
          // Check if property type contains the search term or vice versa
          const typeMatch = propertyType.includes(queryType) || 
                           queryType.includes(propertyType) ||
                           propertyType === queryType;
          
          if (!typeMatch) {
            console.log(`❌ Property ${property.id} rejected: property type mismatch. Query: "${query.propertyType}", Property: "${property.property_type}"`);
            return false;
          }
        }

        // String-based location matching (state and city)
        const locationString = `${property.city || ''} ${property.state || ''}`.toLowerCase().trim();
        
        // Filter by state
        if (query.state) {
          const queryState = query.state.toLowerCase().trim();
          if (!locationString.includes(queryState) && !(property.state || '').toLowerCase().includes(queryState)) {
            console.log(`❌ Property ${property.id} rejected: state mismatch. Query: ${query.state}, Property: ${property.state}`);
            return false;
          }
        }

        // Filter by city
        if (query.city) {
          const queryCity = query.city.toLowerCase().trim();
          if (!locationString.includes(queryCity) && !(property.city || '').toLowerCase().includes(queryCity)) {
            console.log(`❌ Property ${property.id} rejected: city mismatch. Query: "${query.city}", Property: "${property.city}"`);
            return false;
          }
        }

        // Filter by budget
        if (property.expected_price && (query.budgetMin > 0 || query.budgetMax < 50000000)) {
          if (property.expected_price < query.budgetMin || property.expected_price > query.budgetMax) {
            console.log(`❌ Property ${property.id} rejected: budget mismatch. Query: ₹${query.budgetMin}-₹${query.budgetMax}, Property: ₹${property.expected_price}`);
            return false;
          }
        }

        console.log(`✅ Property ${property.id} matches all criteria!`);
        return true;
      });

      // Fallback: if no exact matches, relax filters to show recommended/featured in same state
      if (filteredProperties.length === 0) {
        console.log('ℹ️ No exact matches found; showing recommended/featured properties in the same state as fallback');
        const fallback = propertiesPool.filter(p => 
          p.status === 'approved' && (!query.state || p.state === query.state)
        );
        // Prioritize: recommended > featured > exact city match
        fallback.sort((a, b) => {
          const aScore = (a.isRecommended ? 2 : 0) + (a.is_featured ? 1 : 0) + (query.city && a.city.toLowerCase() === query.city.toLowerCase() ? 0.5 : 0);
          const bScore = (b.isRecommended ? 2 : 0) + (b.is_featured ? 1 : 0) + (query.city && b.city.toLowerCase() === query.city.toLowerCase() ? 0.5 : 0);
          return bScore - aScore;
        });
        filteredProperties = fallback;
      }

      // Sort by relevance with enhanced priority system
      filteredProperties.sort((a, b) => {
        // 1st Priority: Recommended properties from content_elements
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;

        // 2nd Priority: Exact city matches
        if (query.city) {
          const aExactMatch = a.city.toLowerCase() === query.city.toLowerCase();
          const bExactMatch = b.city.toLowerCase() === query.city.toLowerCase();
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
        }

        // 3rd Priority: Featured properties
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        
        // 3rd Priority: Exact property type match (if both are featured or both are not)
        if (query.propertyType && query.propertyType !== 'Others') {
          const mappedQueryType = mapPropertyType(query.propertyType);
          const aExactTypeMatch = a.property_type === mappedQueryType;
          const bExactTypeMatch = b.property_type === mappedQueryType;
          if (aExactTypeMatch && !bExactTypeMatch) return -1;
          if (!aExactTypeMatch && bExactTypeMatch) return 1;
        }

        // 4th Priority: Price sorting
        if (query.intent === 'sell') {
          return (b.expected_price || 0) - (a.expected_price || 0); // Descending for sell
        } else {
          return (a.expected_price || 0) - (b.expected_price || 0); // Ascending for buy/lease
        }
      });

      // Transform to expected format
      const transformedProperties = filteredProperties.map(property => ({
        id: property.id,
        title: property.title,
        type: property.property_type,
        intent: property.listing_type === 'sale' ? 'buy' : property.listing_type,
        priceInr: property.expected_price,
        city: property.city,
        state: property.state,
        country: 'India', // Assuming India for now
        image: property.images && property.images.length > 0 
          ? property.images[0] 
          : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop',
        badges: [
          property.isRecommended && 'Recommended',
          property.furnishing && `${property.furnishing}`,
          property.availability_type && `${property.availability_type}`,
          property.super_area && `${property.super_area} sq ft`,
          property.is_featured && 'Featured'
        ].filter(Boolean),
        url: `/property/${property.id}`
      }));

      // Apply pagination
      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = transformedProperties.slice(startIndex, endIndex);

      setResults(prev => ({
        items: append ? [...(prev.items as PropertyListing[]), ...paginatedResults] : paginatedResults,
        total: transformedProperties.length,
        hasMore: endIndex < transformedProperties.length
      }));

      setCurrentPage(page);
      
      console.log(`🎉 Search Results: Found ${paginatedResults.length} properties out of ${transformedProperties.length} matching properties (Recommended Properties as primary source)`);
      console.log('📱 Matching properties:', paginatedResults.map(p => ({ 
        id: p.id, 
        title: p.title, 
        type: p.type, 
        price: p.priceInr,
        badges: p.badges,
        recommended: p.badges.includes('Recommended'),
        featured: p.badges.includes('Featured')
      })));

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError('Failed to load property matches. Please try again.');
        console.error('Property search error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchServices = useCallback(async (category: string, location: { country: string; state: string; city: string }, page = 1, append = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!category || !location.country || !location.state) {
      setResults({ items: [], total: 0, hasMore: false });
      return;
    }

    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: funcError } = await supabase.functions.invoke('search-services', {
        body: {
          category,
          country: location.country,
          state: location.state,
          city: location.city,
          page: page.toString(),
          pageSize: '10'
        }
      });

      if (funcError) {
        throw new Error(funcError.message || 'Failed to fetch services');
      }

      setResults(prev => ({
        items: append ? [...(prev.items as ServiceProvider[]), ...data.items] : data.items,
        total: data.total,
        hasMore: data.items.length === 10 && (page * 10) < data.total
      }));

      setCurrentPage(page);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError('Failed to load service providers. Please try again.');
        console.error('Service search error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearchProperties = useCallback((query: PropertySearchQuery) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchProperties(query, 1, false);
    }, 400);
  }, [searchProperties]);

  const debouncedSearchServices = useCallback((category: string, location: { country: string; state: string; city: string }) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchServices(category, location, 1, false);
    }, 400);
  }, [searchServices]);

  const loadMore = useCallback(() => {
    if (results.hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [results.hasMore, isLoading]);

  const clearResults = useCallback(() => {
    setResults({ items: [], total: 0, hasMore: false });
    setError(null);
    setCurrentPage(1);
  }, []);

  // Auto-load more when page changes
  useEffect(() => {
    if (currentPage > 1) {
      // This will be handled by the parent component calling searchProperties or searchServices with append=true
    }
  }, [currentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    results,
    isLoading,
    error,
    debouncedSearchProperties,
    debouncedSearchServices,
    searchProperties,
    searchServices,
    loadMore,
    clearResults,
    currentPage
  };
};