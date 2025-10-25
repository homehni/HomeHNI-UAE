import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RentalStatusService } from '@/services/rentalStatusService';
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
  rental_status?: 'available' | 'inactive' | 'rented' | 'sold';
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

      // Fetch properties from Supabase properties table
      const { data: prRows, error: prError } = await supabase
        .from('properties')
        .select('id, title, property_type, listing_type, city, state, images, expected_price, furnishing, availability_type, super_area, created_at, is_featured')
        .eq('is_visible', true)
        .limit(2000);

      if (prError) {
        throw new Error(prError.message);
      }

      type AnyRow = {
        id?: string;
        title?: string;
        property_type?: string;
        listing_type?: string;
        city?: string;
        state?: string;
        images?: string[];
        expected_price?: number;
        furnishing?: string;
        availability_type?: string;
        super_area?: number;
        created_at?: string;
        is_featured?: boolean;
      };

      const toArray = (v: any): string[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter(Boolean);
        return [];
      };

      let propertiesPool: any[] = [];
      (prRows as AnyRow[] | null)?.forEach((row) => {
        const images = toArray(row.images);

        propertiesPool.push({
          id: row.id,
          title: row.title ?? 'Property',
          property_type: (row.property_type ?? '').toLowerCase(),
          listing_type: (row.listing_type ?? 'sale').toLowerCase(),
          status: 'approved', // All visible properties are approved
          expected_price: row.expected_price != null ? Number(row.expected_price) : null,
          city: row.city ?? '',
          state: row.state ?? '',
          availability_type: (row.availability_type ?? '').toLowerCase(),
          is_featured: Boolean(row.is_featured),
          isRecommended: false, // Can be enhanced later
          furnishing: row.furnishing ?? null,
          super_area: row.super_area ?? null,
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
      
      // Calculate keyword-based relevance score for each property
      const calculateRelevanceScore = (property: any) => {
        let score = 0;
        
        // Base score for approved properties
        if (property.status === 'approved') {
          score += 100;
        } else {
          return 0; // Skip non-approved properties
        }
        
        // Property type keyword matching
        if (query.propertyType && query.propertyType !== 'Others') {
          const queryTypeKeywords = query.propertyType.toLowerCase().split(/\s+|[-_]/);
          const propertyTypeKeywords = (property.property_type || '').toLowerCase().split(/\s+|[-_]/);
          
          // Exact match bonus
          if (property.property_type?.toLowerCase() === query.propertyType.toLowerCase()) {
            score += 50;
          }
          
          // Keyword overlap scoring
          queryTypeKeywords.forEach(queryKeyword => {
            propertyTypeKeywords.forEach(propKeyword => {
              if (queryKeyword === propKeyword) {
                score += 30; // Exact keyword match
              } else if (queryKeyword.includes(propKeyword) || propKeyword.includes(queryKeyword)) {
                score += 15; // Partial keyword match
              }
            });
          });
        }
        
        // Location keyword matching
        const propertyLocationText = `${property.city || ''} ${property.state || ''}`.toLowerCase();
        
        // City keyword matching
        if (query.city) {
          const queryCityKeywords = query.city.toLowerCase().split(/\s+|[-_]/);
          const propertyCityKeywords = (property.city || '').toLowerCase().split(/\s+|[-_]/);
          
          // Exact city match bonus
          if (property.city?.toLowerCase() === query.city.toLowerCase()) {
            score += 40;
          }
          
          // City keyword overlap
          queryCityKeywords.forEach(queryKeyword => {
            propertyCityKeywords.forEach(propKeyword => {
              if (queryKeyword === propKeyword) {
                score += 25;
              } else if (queryKeyword.includes(propKeyword) || propKeyword.includes(queryKeyword)) {
                score += 12;
              }
            });
          });
          
          // General location text match
          if (propertyLocationText.includes(query.city.toLowerCase())) {
            score += 20;
          }
        }
        
        // State keyword matching
        if (query.state) {
          const queryStateKeywords = query.state.toLowerCase().split(/\s+|[-_]/);
          const propertyStateKeywords = (property.state || '').toLowerCase().split(/\s+|[-_]/);
          
          // Exact state match bonus
          if (property.state?.toLowerCase() === query.state.toLowerCase()) {
            score += 35;
          }
          
          // State keyword overlap
          queryStateKeywords.forEach(queryKeyword => {
            propertyStateKeywords.forEach(propKeyword => {
              if (queryKeyword === propKeyword) {
                score += 20;
              } else if (queryKeyword.includes(propKeyword) || propKeyword.includes(queryKeyword)) {
                score += 10;
              }
            });
          });
          
          // General location text match
          if (propertyLocationText.includes(query.state.toLowerCase())) {
            score += 15;
          }
        }
        
        // Budget relevance scoring
        if (property.expected_price && (query.budgetMin > 0 || query.budgetMax < 50000000)) {
          if (property.expected_price >= query.budgetMin && property.expected_price <= query.budgetMax) {
            score += 30; // Within budget range
            
            // Bonus for being closer to middle of range
            const budgetMid = (query.budgetMin + query.budgetMax) / 2;
            const distanceFromMid = Math.abs(property.expected_price - budgetMid);
            const maxDistance = (query.budgetMax - query.budgetMin) / 2;
            const proximityScore = Math.max(0, 20 * (1 - distanceFromMid / maxDistance));
            score += proximityScore;
          } else {
            // Penalty for being outside budget range
            score -= 10;
          }
        }
        
        // Special property status bonuses
        if (property.isRecommended) {
          score += 60; // High bonus for recommended
        }
        
        if (property.is_featured) {
          score += 45; // Bonus for featured
        }
        
        // Title keyword matching (additional relevance)
        const titleText = (property.title || '').toLowerCase();
        const allQueryKeywords = [
          ...(query.propertyType ? query.propertyType.toLowerCase().split(/\s+|[-_]/) : []),
          ...(query.city ? query.city.toLowerCase().split(/\s+|[-_]/) : []),
          ...(query.state ? query.state.toLowerCase().split(/\s+|[-_]/) : [])
        ];
        
        allQueryKeywords.forEach(keyword => {
          if (titleText.includes(keyword)) {
            score += 8;
          }
        });
        
        return Math.max(0, score);
      };
      
      // Score all properties and sort by relevance
      const scoredProperties = propertiesPool.map(property => ({
        ...property,
        relevanceScore: calculateRelevanceScore(property)
      }));
      
      // Filter out properties with zero relevance score (non-approved or completely irrelevant)
      let filteredProperties = scoredProperties.filter(property => property.relevanceScore > 0);
      
      console.log(`🎯 Relevance Scoring Results:`, {
        totalProperties: propertiesPool.length,
        scoredProperties: scoredProperties.length,
        filteredProperties: filteredProperties.length,
        topScores: filteredProperties
          .slice(0, 5)
          .map(p => ({ 
            id: p.id, 
            title: p.title, 
            type: p.property_type,
            location: `${p.city}, ${p.state}`,
            score: p.relevanceScore,
            recommended: p.isRecommended,
            featured: p.is_featured
          }))
      });
      
      // Sort by relevance score (highest first)
      filteredProperties.sort((a, b) => {
        // Primary sort: relevance score
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        
        // Secondary sort: price based on intent
        if (query.intent === 'sell') {
          return (b.expected_price || 0) - (a.expected_price || 0);
        } else {
          return (a.expected_price || 0) - (b.expected_price || 0);
        }
      });

       // Get rental statuses for all properties
       const propertyIds = filteredProperties.map(p => p.id);
       console.log('usePropertySearch: Fetching rental statuses for', propertyIds.length, 'properties');
       const rentalStatuses = await RentalStatusService.getMultiplePropertiesRentalStatus(propertyIds);
       console.log('usePropertySearch: Got rental statuses:', rentalStatuses);

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
           : '/placeholder.svg',
         badges: [
           property.isRecommended && 'Recommended',
           property.furnishing && `${property.furnishing}`,
           property.availability_type && `${property.availability_type}`,
           property.super_area && `${property.super_area} sq ft`,
           property.is_featured && 'Featured'
         ].filter(Boolean),
         url: `/buy/preview/${property.id}/detail`,
         rental_status: rentalStatuses[property.id] || 'available'
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