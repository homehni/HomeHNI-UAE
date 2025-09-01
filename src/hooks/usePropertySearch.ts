import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchPublicProperties, PublicProperty } from '@/services/propertyService';

export interface PropertySearchQuery {
  intent: 'buy' | 'sell' | 'lease' | '';
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

      // Fetch all properties from the database
      const allProperties = await fetchPublicProperties();
      
      // Filter properties based on search criteria
      let filteredProperties = allProperties.filter(property => {
        // Filter by intent (listing_type)
        const intentMatch = (() => {
          if (query.intent === 'buy') return property.listing_type === 'sale';
          if (query.intent === 'sell') return property.listing_type === 'sale';
          if (query.intent === 'lease') return property.listing_type === 'rent';
          return false;
        })();
        
        if (!intentMatch) return false;

        // Filter by property type
        if (query.propertyType && query.propertyType !== 'Others') {
          if (property.property_type !== query.propertyType) return false;
        }

        // Filter by state
        if (query.state && property.state !== query.state) return false;

        // Filter by city (optional - partial match)
        if (query.city && !property.city.toLowerCase().includes(query.city.toLowerCase())) return false;

        // Filter by budget
        if (property.expected_price) {
          if (property.expected_price < query.budgetMin || property.expected_price > query.budgetMax) {
            return false;
          }
        }

        return true;
      });

      // Sort by relevance (city match > featured > price)
      filteredProperties.sort((a, b) => {
        // Prioritize exact city matches
        if (query.city) {
          const aExactMatch = a.city.toLowerCase() === query.city.toLowerCase();
          const bExactMatch = b.city.toLowerCase() === query.city.toLowerCase();
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
        }

        // Then prioritize featured properties
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;

        // Then by price (ascending for buy/lease, descending for sell)
        if (query.intent === 'sell') {
          return (b.expected_price || 0) - (a.expected_price || 0);
        } else {
          return (a.expected_price || 0) - (b.expected_price || 0);
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
      
      console.log(`Found ${paginatedResults.length} properties out of ${transformedProperties.length} matching properties`);

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