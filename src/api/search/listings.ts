// Mock API endpoint for property listings search
// In a real implementation, this would be a Supabase Edge Function or API route

export interface PropertySearchParams {
  intent: string;
  propertyType: string;
  country: string;
  state: string;
  city: string;
  budgetMin: string;
  budgetMax: string;
  page: string;
  pageSize: string;
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

// Mock property data - in real implementation, this would come from Supabase
const mockProperties: PropertyListing[] = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment in Gachibowli',
    type: 'Apartment/Flat',
    intent: 'buy',
    priceInr: 12500000,
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    image: '/placeholder.svg',
    badges: ['Ready to Move', 'Gated Community'],
    url: '/property/1'
  },
  {
    id: '2',
    title: 'Commercial Office Space in Cyber City',
    type: 'Office',
    intent: 'lease',
    priceInr: 85000,
    city: 'Gurgaon',
    state: 'Haryana',
    country: 'India',
    image: '/placeholder.svg',
    badges: ['Furnished', 'IT Park'],
    url: '/property/2'
  },
  {
    id: '3',
    title: 'Independent Villa with Garden',
    type: 'Independent House/Villa',
    intent: 'sell',
    priceInr: 8500000,
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    image: '/placeholder.svg',
    badges: ['Swimming Pool', 'Parking'],
    url: '/property/3'
  },
  {
    id: '4',
    title: 'Residential Plot in Sector 85',
    type: 'Plot/Land',
    intent: 'buy',
    priceInr: 6800000,
    city: 'Gurgaon',
    state: 'Haryana',
    country: 'India',
    image: '/placeholder.svg',
    badges: ['Corner Plot', 'Approved'],
    url: '/property/4'
  },
  {
    id: '5',
    title: 'Retail Shop in Prime Location',
    type: 'Retail/Shop',
    intent: 'lease',
    priceInr: 45000,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    image: '/placeholder.svg',
    badges: ['High Footfall', 'Ground Floor'],
    url: '/property/5'
  },
  {
    id: '6',
    title: '2BHK Apartment near IT Hub',
    type: 'Apartment/Flat',
    intent: 'buy',
    priceInr: 7500000,
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    image: '/placeholder.svg',
    badges: ['New Construction', 'Metro Nearby'],
    url: '/property/6'
  },
  {
    id: '7',
    title: 'Warehouse Space for Logistics',
    type: 'Warehouse',
    intent: 'lease',
    priceInr: 125000,
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    image: '/placeholder.svg',
    badges: ['24x7 Security', 'Truck Access'],
    url: '/property/7'
  },
  {
    id: '8',
    title: 'Penthouse with City View',
    type: 'Apartment/Flat',
    intent: 'sell',
    priceInr: 25000000,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    image: '/placeholder.svg',
    badges: ['Luxury', 'Sea View'],
    url: '/property/8'
  }
];

export const searchListings = async (params: PropertySearchParams) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const {
    intent,
    propertyType,
    country,
    state,
    city,
    budgetMin,
    budgetMax,
    page,
    pageSize
  } = params;

  let filteredProperties = [...mockProperties];

  // Filter by intent
  if (intent) {
    filteredProperties = filteredProperties.filter(property => 
      property.intent.toLowerCase() === intent.toLowerCase()
    );
  }

  // Filter by property type
  if (propertyType && propertyType !== 'Others') {
    filteredProperties = filteredProperties.filter(property => 
      property.type === propertyType
    );
  }

  // Filter by country
  if (country) {
    filteredProperties = filteredProperties.filter(property => 
      property.country.toLowerCase() === country.toLowerCase()
    );
  }

  // Filter by state
  if (state) {
    filteredProperties = filteredProperties.filter(property => 
      property.state.toLowerCase() === state.toLowerCase()
    );
  }

  // Filter by city (optional)
  if (city) {
    filteredProperties = filteredProperties.filter(property => 
      property.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Filter by budget
  const minBudget = parseInt(budgetMin) || 0;
  const maxBudget = parseInt(budgetMax) || Infinity;
  
  filteredProperties = filteredProperties.filter(property => {
    if (property.priceInr === null) return true; // Include "On request" properties
    return property.priceInr >= minBudget && property.priceInr <= maxBudget;
  });

  // Sort by relevance (city match > state match > price proximity)
  filteredProperties.sort((a, b) => {
    // Prioritize city matches
    if (city) {
      const aMatchesCity = a.city.toLowerCase().includes(city.toLowerCase());
      const bMatchesCity = b.city.toLowerCase().includes(city.toLowerCase());
      if (aMatchesCity && !bMatchesCity) return -1;
      if (!aMatchesCity && bMatchesCity) return 1;
    }

    // Then by price (ascending for buy/lease, descending for sell)
    if (intent === 'sell') {
      return (b.priceInr || 0) - (a.priceInr || 0);
    } else {
      return (a.priceInr || 0) - (b.priceInr || 0);
    }
  });

  // Pagination
  const pageNum = parseInt(page) || 1;
  const size = parseInt(pageSize) || 10;
  const startIndex = (pageNum - 1) * size;
  const endIndex = startIndex + size;
  
  const paginatedResults = filteredProperties.slice(startIndex, endIndex);

  return {
    items: paginatedResults,
    total: filteredProperties.length,
    page: pageNum,
    pageSize: size,
    hasMore: endIndex < filteredProperties.length
  };
};