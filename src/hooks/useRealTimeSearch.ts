import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  image: string;
  propertyType: string;
  furnished?: string;
  availability?: string;
  ageOfProperty?: string;
  locality: string;
  city: string;
  bhkType: string;
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

// Mock data with enhanced properties
const mockProperties: Property[] = [
  {
    id: '1',
    title: '3 BHK Apartment in Sector 150, Noida',
    location: 'Sector 150, Noida',
    price: '₹85 Lakh',
    priceNumber: 8500000,
    area: '1200 sq ft',
    areaNumber: 1200,
    bedrooms: 3,
    bathrooms: 2,
    image: 'photo-1512917774080-9991f1c4c750',
    propertyType: 'Flat/Apartment',
    furnished: 'Semi-Furnished',
    availability: 'Ready to Move',
    ageOfProperty: '1-5 Years Old',
    locality: 'Sector 150',
    city: 'Noida',
    bhkType: '3 BHK'
  },
  {
    id: '2', 
    title: '2 BHK Independent House in Gurgaon',
    location: 'Sector 45, Gurgaon',
    price: '₹1.2 Crore',
    priceNumber: 12000000,
    area: '1000 sq ft',
    areaNumber: 1000,
    bedrooms: 2,
    bathrooms: 2,
    image: 'photo-1568605114967-8130f3a36994',
    propertyType: 'Independent House',
    furnished: 'Furnished',
    availability: 'Ready to Move',
    ageOfProperty: 'New Project',
    locality: 'Sector 45',
    city: 'Gurgaon',
    bhkType: '2 BHK'
  },
  {
    id: '3',
    title: '4 BHK Villa in Whitefield, Bangalore',
    location: 'Whitefield, Bangalore',
    price: '₹2.5 Crore',
    priceNumber: 25000000,
    area: '2500 sq ft',
    areaNumber: 2500,
    bedrooms: 4,
    bathrooms: 3,
    image: 'photo-1522708323590-d24dbb6b0267',
    propertyType: 'Villa',
    furnished: 'Unfurnished',
    availability: 'Under Construction',
    ageOfProperty: 'New Project',
    locality: 'Whitefield',
    city: 'Bangalore',
    bhkType: '4 BHK'
  },
  {
    id: '4',
    title: '1 BHK Flat in Andheri, Mumbai',
    location: 'Andheri West, Mumbai',
    price: '₹75 Lakh',
    priceNumber: 7500000,
    area: '650 sq ft',
    areaNumber: 650,
    bedrooms: 1,
    bathrooms: 1,
    image: 'photo-1613490493576-7fde63acd811',
    propertyType: 'Flat/Apartment',
    furnished: 'Furnished',
    availability: 'Ready to Move',
    ageOfProperty: '5-10 Years Old',
    locality: 'Andheri West',
    city: 'Mumbai',
    bhkType: '1 BHK'
  },
  {
    id: '5',
    title: '3 BHK Independent Floor in Sector 62, Noida',
    location: 'Sector 62, Noida',
    price: '₹95 Lakh',
    priceNumber: 9500000,
    area: '1400 sq ft',
    areaNumber: 1400,
    bedrooms: 3,
    bathrooms: 2,
    image: 'photo-1512917774080-9991f1c4c750',
    propertyType: 'Independent Building/Floor',
    furnished: 'Semi-Furnished',
    availability: 'Ready to Move',
    ageOfProperty: '1-5 Years Old',
    locality: 'Sector 62',
    city: 'Noida',
    bhkType: '3 BHK'
  },
  {
    id: '6',
    title: '2 BHK Apartment in Koramangala, Bangalore',
    location: 'Koramangala, Bangalore',
    price: '₹1.1 Crore',
    priceNumber: 11000000,
    area: '1100 sq ft',
    areaNumber: 1100,
    bedrooms: 2,
    bathrooms: 2,
    image: 'photo-1568605114967-8130f3a36994',
    propertyType: 'Flat/Apartment',
    furnished: 'Furnished',
    availability: 'Ready to Move',
    ageOfProperty: 'New Project',
    locality: 'Koramangala',
    city: 'Bangalore',
    bhkType: '2 BHK'
  },
  {
    id: '7',
    title: '1 RK Studio Apartment in Powai, Mumbai',
    location: 'Powai, Mumbai',
    price: '₹45 Lakh',
    priceNumber: 4500000,
    area: '400 sq ft',
    areaNumber: 400,
    bedrooms: 1,
    bathrooms: 1,
    image: 'photo-1613490493576-7fde63acd811',
    propertyType: 'Flat/Apartment',
    furnished: 'Furnished',
    availability: 'Ready to Move',
    ageOfProperty: '1-5 Years Old',
    locality: 'Powai',
    city: 'Mumbai',
    bhkType: '1 RK'
  },
  {
    id: '8',
    title: '5+ BHK Villa in Jubilee Hills, Hyderabad',
    location: 'Jubilee Hills, Hyderabad',
    price: '₹3.8 Crore',
    priceNumber: 38000000,
    area: '4000 sq ft',
    areaNumber: 4000,
    bedrooms: 5,
    bathrooms: 4,
    image: 'photo-1522708323590-d24dbb6b0267',
    propertyType: 'Villa',
    furnished: 'Semi-Furnished',
    availability: 'Ready to Move',
    ageOfProperty: '5-10 Years Old',
    locality: 'Jubilee Hills',
    city: 'Hyderabad',
    bhkType: '5+ BHK'
  },
  {
    id: '9',
    title: 'Commercial Office Space in Cyber City, Gurgaon',
    location: 'Cyber City, Gurgaon',
    price: '₹2.5 Crore',
    priceNumber: 25000000,
    area: '1500 sq ft',
    areaNumber: 1500,
    bedrooms: 0,
    bathrooms: 2,
    image: 'photo-1497366216548-37526070297c',
    propertyType: 'Commercial Space/Building',
    furnished: 'Furnished',
    availability: 'Ready to Move',
    ageOfProperty: 'New Project',
    locality: 'Cyber City',
    city: 'Gurgaon',
    bhkType: 'Commercial'
  },
  {
    id: '10',
    title: 'Industrial Warehouse in Okhla, Delhi',
    location: 'Okhla Industrial Area, Delhi',
    price: '₹5 Crore',
    priceNumber: 50000000,
    area: '5000 sq ft',
    areaNumber: 5000,
    bedrooms: 0,
    bathrooms: 1,
    image: 'photo-1586023492125-27b2c045efd7',
    propertyType: 'Industrial Space/Building',
    furnished: 'Unfurnished',
    availability: 'Ready to Move',
    ageOfProperty: '1-5 Years Old',
    locality: 'Okhla Industrial Area',
    city: 'Delhi',
    bhkType: 'Industrial'
  },
  {
    id: '11',
    title: 'Residential Plot in Sector 85, Gurgaon',
    location: 'Sector 85, Gurgaon',
    price: '₹80 Lakh',
    priceNumber: 8000000,
    area: '250 sq yards',
    areaNumber: 2090,
    bedrooms: 0,
    bathrooms: 0,
    image: 'photo-1500382017468-9049fed747ef',
    propertyType: 'Plots',
    furnished: 'Unfurnished',
    availability: 'Ready to Move',
    ageOfProperty: 'New Project',
    locality: 'Sector 85',
    city: 'Gurgaon',
    bhkType: 'Plot'
  }
];

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
  const [debouncedLocation, setDebouncedLocation] = useState(filters.location);
  
  // Debounce location search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(filters.location);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters.location]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', activeTab);
    if (filters.location) params.set('location', filters.location);
    if (filters.propertyType.length > 0) params.set('propertyType', filters.propertyType[0]);
    
    setSearchParams(params);
  }, [activeTab, filters.location, filters.propertyType, setSearchParams]);

  // Filter properties in real-time
  const filteredProperties = useMemo(() => {
    let result = [...mockProperties];

    // Tab filter - filter by listing type first
    if (activeTab === 'rent') {
      // For rent, filter properties that would be suitable for rental
      result = result.filter(property => 
        property.propertyType === 'Flat/Apartment' || 
        property.propertyType === 'Independent House' || 
        property.propertyType === 'Villa'
      );
    } else if (activeTab === 'commercial') {
      result = result.filter(property => 
        property.propertyType === 'Commercial Space/Building' || 
        property.propertyType === 'Industrial Space/Building'
      );
    } else if (activeTab === 'plots') {
      result = result.filter(property => property.propertyType === 'Plots');
    } else if (activeTab === 'new-launch') {
      result = result.filter(property => property.ageOfProperty === 'New Project');
    } else if (activeTab === 'pg' || activeTab === 'projects') {
      // No properties available for PG/Co-living and Projects sections
      result = [];
    }
    // 'buy' shows all residential properties (default)

  // Location filter - improved matching logic
  if (debouncedLocation.trim()) {
    const searchLocation = debouncedLocation.toLowerCase().trim();
    
    result = result.filter(property => {
      const matches = [
        property.title.toLowerCase(),
        property.location.toLowerCase(),
        property.locality.toLowerCase(), 
        property.city.toLowerCase()
      ];
      
      // Check if any search terms match any property fields
      const isMatch = matches.some(field => 
        field.includes(searchLocation) ||
        searchLocation.includes(field) ||
        // Handle partial matches for common search patterns
        (searchLocation.includes('noida') && field.includes('noida')) ||
        (searchLocation.includes('gurgaon') && field.includes('gurgaon')) ||
        (searchLocation.includes('mumbai') && field.includes('mumbai')) ||
        (searchLocation.includes('bangalore') && field.includes('bangalore')) ||
        (searchLocation.includes('delhi') && field.includes('delhi'))
      );
      
      return isMatch;
    });
  }

    // Property Type filter
    if (filters.propertyType.length > 0 && !filters.propertyType.includes('All Residential')) {
      result = result.filter(property => 
        filters.propertyType.includes(property.propertyType)
      );
    }

    // BHK Type filter
    if (filters.bhkType.length > 0) {
      result = result.filter(property => 
        filters.bhkType.includes(property.bhkType)
      );
    }

    // Budget filter
    result = result.filter(property => 
      property.priceNumber >= filters.budget[0] && 
      property.priceNumber <= filters.budget[1]
    );

    // Furnished filter
    if (filters.furnished.length > 0) {
      result = result.filter(property => 
        property.furnished && filters.furnished.includes(property.furnished)
      );
    }

    // Availability filter
    if (filters.availability.length > 0) {
      result = result.filter(property => 
        property.availability && filters.availability.includes(property.availability)
      );
    }

    // Construction/Age filter
    if (filters.construction.length > 0) {
      result = result.filter(property => 
        property.ageOfProperty && filters.construction.includes(property.ageOfProperty)
      );
    }

    // Locality filter
    if (filters.locality.length > 0) {
      result = result.filter(property => 
        filters.locality.includes(property.locality) || 
        filters.locality.includes(property.city)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.priceNumber - b.priceNumber);
        break;
      case 'price-high':
        result.sort((a, b) => b.priceNumber - a.priceNumber);
        break;
      case 'area':
        result.sort((a, b) => b.areaNumber - a.areaNumber);
        break;
      case 'newest':
        // Mock sorting by newest (could be based on created date)
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return result;
  }, [debouncedLocation, filters, activeTab]);

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

  // Get unique localities from filtered results for dynamic locality filter
  const availableLocalities = useMemo(() => {
    const localities = new Set<string>();
    filteredProperties.forEach(property => {
      localities.add(property.locality);
      localities.add(property.city);
    });
    return Array.from(localities).sort();
  }, [filteredProperties]);

  return {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading: false // Could be used for API integration
  };
};
