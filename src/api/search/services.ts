// Mock API endpoint for service providers search
// In a real implementation, this would be a Supabase Edge Function or API route

export interface ServiceSearchParams {
  category: string;
  country: string;
  state: string;
  city: string;
  page: string;
  pageSize: string;
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

// Mock service provider data
const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Elite Property Management',
    category: 'Property Management',
    city: 'Hyderabad',
    state: 'Telangana',
    phone: '+91-9876541234',
    whatsapp: '+91-9876541234',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    url: '/service/1',
    rating: 4.8,
    experience: '8+ years'
  },
  {
    id: '2',
    name: 'Home Interior Experts',
    category: 'Home Interiors',
    city: 'Bangalore',
    state: 'Karnataka',
    phone: '+91-9876541235',
    whatsapp: '+91-9876541235',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
    url: '/service/2',
    rating: 4.6,
    experience: '5+ years'
  },
  {
    id: '3',
    name: 'Legal Documentation Services',
    category: 'Legal & Documentation',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91-9876541236',
    whatsapp: '+91-9876541236',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop',
    url: '/service/3',
    rating: 4.9,
    experience: '12+ years'
  },
  {
    id: '4',
    name: 'Quick Home Loans',
    category: 'Home Loan Assistance',
    city: 'Delhi',
    state: 'Delhi',
    phone: '+91-9876541237',
    whatsapp: '+91-9876541237',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop',
    url: '/service/4',
    rating: 4.7,
    experience: '6+ years'
  },
  {
    id: '5',
    name: 'Property Valuation Pro',
    category: 'Property Valuation',
    city: 'Pune',
    state: 'Maharashtra',
    phone: '+91-9876541238',
    whatsapp: '+91-9876541238',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    url: '/service/5',
    rating: 4.5,
    experience: '10+ years'
  },
  {
    id: '6',
    name: 'NRI Property Consultants',
    category: 'NRI Property Assistance',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91-9876541239',
    whatsapp: '+91-9876541239',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    url: '/service/6',
    rating: 4.8,
    experience: '15+ years'
  },
  {
    id: '7',
    name: 'Rental & Leasing Experts',
    category: 'Rental & Leasing',
    city: 'Gurgaon',
    state: 'Haryana',
    phone: '+91-9876541240',
    whatsapp: '+91-9876541240',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop',
    url: '/service/7',
    rating: 4.4,
    experience: '7+ years'
  },
  {
    id: '8',
    name: 'Property Maintenance Plus',
    category: 'Property Maintenance & Repairs',
    city: 'Kolkata',
    state: 'West Bengal',
    phone: '+91-9876541241',
    whatsapp: '+91-9876541241',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
    url: '/service/8',
    rating: 4.6,
    experience: '9+ years'
  }
];

export const searchServices = async (params: ServiceSearchParams) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const {
    category,
    country,
    state,
    city,
    page,
    pageSize
  } = params;

  let filteredServices = [...mockServiceProviders];

  // Filter by category
  if (category && category !== 'Others') {
    filteredServices = filteredServices.filter(service => 
      service.category.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(service.category.toLowerCase())
    );
  }

  // Filter by country
  if (country) {
    filteredServices = filteredServices.filter(service => 
      service.state && service.city // India-based services for now
    );
  }

  // Filter by state
  if (state) {
    filteredServices = filteredServices.filter(service => 
      service.state.toLowerCase() === state.toLowerCase()
    );
  }

  // Filter by city (optional)
  if (city) {
    filteredServices = filteredServices.filter(service => 
      service.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Sort by relevance (city match > state match > rating)
  filteredServices.sort((a, b) => {
    // Prioritize city matches
    if (city) {
      const aMatchesCity = a.city.toLowerCase().includes(city.toLowerCase());
      const bMatchesCity = b.city.toLowerCase().includes(city.toLowerCase());
      if (aMatchesCity && !bMatchesCity) return -1;
      if (!aMatchesCity && bMatchesCity) return 1;
    }

    // Then by rating (descending)
    return (b.rating || 0) - (a.rating || 0);
  });

  // Pagination
  const pageNum = parseInt(page) || 1;
  const size = parseInt(pageSize) || 10;
  const startIndex = (pageNum - 1) * size;
  const endIndex = startIndex + size;
  
  const paginatedResults = filteredServices.slice(startIndex, endIndex);

  return {
    items: paginatedResults,
    total: filteredServices.length,
    page: pageNum,
    pageSize: size,
    hasMore: endIndex < filteredServices.length
  };
};