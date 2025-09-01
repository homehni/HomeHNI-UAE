import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchPublicProperties, fetchFeaturedProperties, PublicProperty } from '@/services/propertyService';
import { contentElementsService } from '@/services/contentElementsService';
import { mapPropertyType } from '@/utils/propertyMappings';

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

      // Fetch recommended properties from content_elements as primary source
      const [allProperties, featuredProperties, recommendedElements] = await Promise.all([
        fetchPublicProperties(),
        fetchFeaturedProperties(),
        contentElementsService.getContentElements('post-service', 'recommended_properties')
      ]);
      
      // Process recommended properties from content_elements
      let propertiesPool = [];
      const existingIds = new Set();
      
      // 1st: Add recommended properties from content_elements
      if (recommendedElements && recommendedElements.length > 0) {
        for (const element of recommendedElements) {
          if (element.content && element.content.property_ids) {
            for (const propertyId of element.content.property_ids) {
              const property = allProperties.find(p => p.id === propertyId);
              if (property && !existingIds.has(property.id)) {
                propertiesPool.push({ ...property, isRecommended: true });
                existingIds.add(property.id);
              }
            }
          }
        }
      }
      
      // 2nd: Add featured properties
      featuredProperties.forEach(property => {
        if (!existingIds.has(property.id)) {
          propertiesPool.push(property);
          existingIds.add(property.id);
        }
      });
      
      // 3rd: Add remaining non-featured properties
      allProperties.forEach(property => {
        if (!existingIds.has(property.id)) {
          propertiesPool.push(property);
        }
      });
      
      console.log(`🎯 Recommended Properties loaded as primary source: ${propertiesPool.filter(p => p.isRecommended).length}`);
      console.log(`🌟 Featured Properties added: ${featuredProperties.length}`);
      console.log(`📋 Additional properties added: ${allProperties.length - propertiesPool.length}`);
      
      console.log(`🔍 Search Query:`, {
        intent: query.intent,
        propertyType: query.propertyType,
        mappedPropertyType: query.propertyType ? mapPropertyType(query.propertyType) : null,
        state: query.state,
        city: query.city,
        budgetRange: `₹${query.budgetMin} - ₹${query.budgetMax}`,
        featuredFirst: true
      });
      
      console.log(`📊 Total properties in pool:`, propertiesPool.length);
      console.log(`📋 Property types available:`, [...new Set(propertiesPool.map(p => p.property_type))]);
      console.log(`🎯 Property statuses:`, [...new Set(propertiesPool.map(p => p.status))]);
      console.log(`⭐ Featured properties (primary):`, propertiesPool.filter(p => p.is_featured).length);
      
      // Filter properties based on search criteria
      let filteredProperties = propertiesPool.filter(property => {
        console.log(`🏠 Checking property:`, {
          id: property.id,
          title: property.title,
          type: property.property_type,
          listing_type: property.listing_type,
          status: property.status,
          price: property.expected_price,
          city: property.city,
          state: property.state
        });
        // Filter by status - only approved properties
        if (property.status !== 'approved') {
          console.log(`❌ Property ${property.id} rejected: status is ${property.status}, not approved`);
          return false;
        }

        // Filter by intent (listing_type)
        const intentMatch = (() => {
          if (query.intent === 'buy') return property.listing_type === 'sale';
          if (query.intent === 'sell') return property.listing_type === 'sale';
          if (query.intent === 'lease') return property.listing_type === 'rent';
          return false;
        })();
        
        if (!intentMatch) {
          console.log(`❌ Property ${property.id} rejected: intent mismatch. Query: ${query.intent}, Property: ${property.listing_type}`);
          return false;
        }

        // Filter by property type with mapping
        if (query.propertyType && query.propertyType !== 'Others') {
          const mappedQueryType = mapPropertyType(query.propertyType);
          if (property.property_type !== mappedQueryType) {
            console.log(`❌ Property ${property.id} rejected: type mismatch. Query: ${query.propertyType} (mapped to ${mappedQueryType}), Property: ${property.property_type}`);
            return false;
          }
        }

        // Filter by state
        if (query.state && property.state !== query.state) {
          console.log(`❌ Property ${property.id} rejected: state mismatch. Query: ${query.state}, Property: ${property.state}`);
          return false;
        }

        // Filter by city (optional - partial match)
        if (query.city && !property.city.toLowerCase().includes(query.city.toLowerCase())) {
          console.log(`❌ Property ${property.id} rejected: city mismatch. Query: ${query.city}, Property: ${property.city}`);
          return false;
        }

        // Filter by budget
        if (property.expected_price) {
          if (property.expected_price < query.budgetMin || property.expected_price > query.budgetMax) {
            console.log(`❌ Property ${property.id} rejected: budget mismatch. Query: ₹${query.budgetMin}-₹${query.budgetMax}, Property: ₹${property.expected_price}`);
            return false;
          }
        }

        console.log(`✅ Property ${property.id} matches all criteria!`);
        return true;
      });

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