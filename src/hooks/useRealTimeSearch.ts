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
    // Check if "All Residential" is selected
    const isAllResidential = filters.propertyType.includes('All Residential');
    
    // Determine if user has provided any criteria (excluding "All Residential" as it's our default)
    const hasSearchCriteria = 
      debouncedLocation || 
      (filters.propertyType.length > 0 && !isAllResidential) || 
      filters.bhkType.length > 0 || 
      filters.locality.length > 0 || 
      filters.furnished.length > 0 || 
      filters.availability.length > 0 || 
      filters.construction.length > 0 ||
      filters.budget[0] > 0 || 
      filters.budget[1] < 50000000;

    // If "All Residential" is selected or no criteria, show all residential properties
    if (isAllResidential || !hasSearchCriteria) {
      try {
        setIsLoading(true);
        setError(null);
        const { data, error: funcError } = await supabase.functions.invoke('search-listings', {
          body: {
            intent: activeTab,
            propertyType: '',
            propertyTypes: [], // Empty to get all property types
            country: 'India',
            state: '',
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
            sortBy: 'relevance'
          }
        });
        if (funcError) throw new Error(funcError.message || 'Failed to search properties');
        setProperties(data.items || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load properties');
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchBody = {
        intent: activeTab,
        // Send both single and multiple types for backward compatibility
        propertyType: filters.propertyType.length > 0 && !filters.propertyType.includes('All Residential')
          ? filters.propertyType[0]
          : '',
        propertyTypes: filters.propertyType.filter((t) => t && t !== 'All Residential'),
        country: 'India',
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

      const { data, error: funcError } = await supabase.functions.invoke('search-listings', {
        body: searchBody
      });

      if (funcError) {
        throw new Error(funcError.message || 'Failed to search properties');
      }

      setProperties(data.items || []);
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
      propertyType: [],
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
