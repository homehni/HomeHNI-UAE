import { useState, useEffect, useCallback, useRef } from 'react';

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

      const params = new URLSearchParams({
        intent: query.intent,
        propertyType: query.propertyType,
        country: query.country,
        state: query.state,
        city: query.city,
        budgetMin: query.budgetMin.toString(),
        budgetMax: query.budgetMax.toString(),
        page: page.toString(),
        pageSize: '10'
      });

      const response = await fetch(`/supabase/functions/v1/search-listings?${params}`, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();

      setResults(prev => ({
        items: append ? [...prev.items, ...data.items] : data.items,
        total: data.total,
        hasMore: data.items.length === 10 && (page * 10) < data.total
      }));

      setCurrentPage(page);
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

      const params = new URLSearchParams({
        category,
        country: location.country,
        state: location.state,
        city: location.city,
        page: page.toString(),
        pageSize: '10'
      });

      const response = await fetch(`/supabase/functions/v1/search-services?${params}`, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();

      setResults(prev => ({
        items: append ? [...prev.items, ...data.items] : data.items,
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