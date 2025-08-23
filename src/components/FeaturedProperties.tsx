
import React, { useEffect, useMemo, useState } from 'react';
import PropertyCard from './PropertyCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contentElementsService, ContentElement } from '@/services/contentElementsService';
import { fetchFeaturedProperties } from '@/services/propertyService';
import { supabase } from '@/integrations/supabase/client';

// Minimal type for featured properties
type FeaturedProperty = {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  propertyType: string;
  isNew?: boolean;
};
const FeaturedProperties = ({
  properties: propsProperties
}: {
  properties?: FeaturedProperty[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([]);
  const [sectionHeader, setSectionHeader] = useState<ContentElement | null>(null);
  
  // Fetch real featured properties from database
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Get featured properties using the service function
        const propertiesData = await fetchFeaturedProperties();
        
        // Transform to FeaturedProperty format
        const transformedProperties = propertiesData.map(property => ({
          id: property.id,
          title: property.title,
          location: `${property.locality}, ${property.city}`,
          price: `₹${(property.expected_price / 100000).toFixed(1)}L`,
          area: `${property.super_area || 0} sq ft`,
          bedrooms: parseInt(property.bhk_type?.replace(/[^\d]/g, '') || '0'),
          bathrooms: property.bathrooms || 0,
          image: property.images?.[0] || 'photo-1560518883-ce09059eeffa',
          propertyType: property.property_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Property',
          isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if created within last 7 days
        }));

        setFeaturedProperties(transformedProperties);

        // Get header content
        const headerContent = await contentElementsService.getSectionContent('homepage', 'featured_properties', 'featured_properties_header');
        setSectionHeader(headerContent);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      }
    };

    fetchContent();

    // Set up real-time subscription for featured properties
    const propertiesChannel = supabase
      .channel('featured-properties-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: 'is_featured=eq.true'
        },
        (payload) => {
          console.log('Featured property change detected:', payload);
          
          // Handle real-time updates for featured properties
          if (payload.eventType === 'UPDATE' && payload.new?.status === 'approved' && payload.new?.is_featured) {
            // Add newly approved featured property to the beginning of the list
            const newProperty = {
              id: payload.new.id,
              title: payload.new.title,
              location: `${payload.new.locality}, ${payload.new.city}`,
              price: `₹${(payload.new.expected_price / 100000).toFixed(1)}L`,
              area: `${payload.new.super_area} sq ft`,
              bedrooms: parseInt(payload.new.bhk_type?.replace(/[^\d]/g, '') || '0'),
              bathrooms: payload.new.bathrooms || 0,
              image: payload.new.images?.[0] || 'photo-1560518883-ce09059eeffa',
              propertyType: payload.new.property_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Property',
              isNew: true
            };
            
            setFeaturedProperties(prev => [newProperty, ...prev.slice(0, 19)]); // Keep maximum 20 items
          } else {
            // For other changes, refetch all data
            fetchContent();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesChannel);
    };
  }, []);

  // Default properties as fallback
  const defaultProperties: FeaturedProperty[] = [{
    id: '1',
    title: 'Modern Apartment with Delhi',
    location: 'Sector 18, KK Road',
    price: '₹1.2 Cr',
    area: '1,200 sq ft',
    bedrooms: 3,
    bathrooms: 2,
    image: 'photo-1560518883-ce09059eeffa',
    propertyType: 'Apartment',
    isNew: true
  }, {
    id: '2',
    title: 'Modern Villa with Garden',
    location: 'DLF Phase 3, Gurgaon',
    price: '₹2.5 Cr',
    area: '2,400 sq ft',
    bedrooms: 4,
    bathrooms: 3,
    image: 'photo-1613490493576-7fde63acd811',
    propertyType: 'Villa'
  }, {
    id: '3',
    title: 'Affordable 2BHK in IT Hub',
    location: 'Electronic City, Bangalore',
    price: '₹75 L',
    area: '950 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    image: 'photo-1512917774080-9991f1c4c750',
    propertyType: 'Apartment'
  }, {
    id: '4',
    title: 'Premium Office Space',
    location: 'Cyber City, Gurgaon',
    price: '₹45 L',
    area: '800 sq ft',
    bedrooms: 0,
    bathrooms: 1,
    image: 'photo-1497366216548-37526070297c',
    propertyType: 'Commercial',
    isNew: true
  }, {
    id: '5',
    title: 'Spacious 3BHK with Balcony',
    location: 'Whitefield, Bangalore',
    price: '₹95 L',
    area: '1,350 sq ft',
    bedrooms: 3,
    bathrooms: 2,
    image: 'photo-1522708323590-d24dbb6b0267',
    propertyType: 'Apartment'
  }, {
    id: '6',
    title: 'Independent House with Parking',
    location: 'Sector 15, Noida',
    price: '₹1.8 Cr',
    area: '1,800 sq ft',
    bedrooms: 4,
    bathrooms: 3,
    image: 'photo-1568605114967-8130f3a36994',
    propertyType: 'House'
  }, {
    id: '7',
    title: 'Modern 2BHK with City View',
    location: 'Bandra West, Mumbai',
    price: '₹1.5 Cr',
    area: '1,100 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    image: 'photo-1512917774080-9991f1c4c750',
    propertyType: 'Apartment',
    isNew: true
  }, {
    id: '8',
    title: 'Luxury Penthouse with Terrace',
    location: 'Koramangala, Bangalore',
    price: '₹3.2 Cr',
    area: '2,800 sq ft',
    bedrooms: 4,
    bathrooms: 4,
    image: 'photo-1613490493576-7fde63acd811',
    propertyType: 'Penthouse'
  }, {
    id: '9',
    title: 'Prime Residential Plot in Gated Community',
    location: 'Hinjewadi, Pune',
    price: '₹60 L',
    area: '2,400 sq ft',
    bedrooms: 0,
    bathrooms: 0,
    image: 'photo-1497366216548-37526070297c',
    propertyType: 'Plot',
    isNew: true
  }, {
    id: '10',
    title: 'Independent House with Private Garden',
    location: 'Vijayanagar, Bangalore',
    price: '₹1.7 Cr',
    area: '1,900 sq ft',
    bedrooms: 4,
    bathrooms: 3,
    image: 'photo-1568605114967-8130f3a36994',
    propertyType: 'Independent House'
  }, {
    id: '11',
    title: 'Fertile Agricultural Land with Water Source',
    location: 'Kharif Valley, Punjab',
    price: '₹25 L',
    area: '5 acres',
    bedrooms: 0,
    bathrooms: 0,
    image: 'photo-1497366216548-37526070297c',
    propertyType: 'Agriculture Lands',
    isNew: true
  }, {
    id: '12',
    title: 'Luxury Studio Apartment with Pool',
    location: 'Powai, Mumbai',
    price: '₹85 L',
    area: '650 sq ft',
    bedrooms: 1,
    bathrooms: 1,
    image: 'photo-1560518883-ce09059eeffa',
    propertyType: 'Apartment',
    isNew: true
  }, {
    id: '13',
    title: 'Commercial Space in IT Park',
    location: 'HITEC City, Hyderabad',
    price: '₹55 L',
    area: '1,000 sq ft',
    bedrooms: 0,
    bathrooms: 2,
    image: 'photo-1497366216548-37526070297c',
    propertyType: 'Commercial'
  }, {
    id: '14',
    title: 'Duplex House with Garden',
    location: 'Jubilee Hills, Hyderabad',
    price: '₹2.8 Cr',
    area: '3,200 sq ft',
    bedrooms: 5,
    bathrooms: 4,
    image: 'photo-1568605114967-8130f3a36994',
    propertyType: 'House',
    isNew: true
  }, {
    id: '15',
    title: 'Affordable 1BHK Near Metro',
    location: 'Dwarka, Delhi',
    price: '₹45 L',
    area: '550 sq ft',
    bedrooms: 1,
    bathrooms: 1,
    image: 'photo-1512917774080-9991f1c4c750',
    propertyType: 'Apartment'
  }, {
    id: '16',
    title: 'Farmhouse with Orchard',
    location: 'Lonavala, Maharashtra',
    price: '₹1.2 Cr',
    area: '2 acres',
    bedrooms: 3,
    bathrooms: 2,
    image: 'photo-1497366216548-37526070297c',
    propertyType: 'Farm House'
  }, {
    id: '17',
    title: 'Modern 4BHK with Amenities',
    location: 'New Town, Kolkata',
    price: '₹1.1 Cr',
    area: '1,600 sq ft',
    bedrooms: 4,
    bathrooms: 3,
    image: 'photo-1522708323590-d24dbb6b0267',
    propertyType: 'Apartment',
    isNew: true
  }, {
    id: '18',
    title: 'Warehouse Space with Loading Dock',
    location: 'Manesar, Gurgaon',
    price: '₹75 L',
    area: '5,000 sq ft',
    bedrooms: 0,
    bathrooms: 2,
    image: 'photo-1497366216548-37526070297c',
    propertyType: 'Commercial'
  }, {
    id: '19',
    title: 'Sea View Apartment with Balcony',
    location: 'Marine Drive, Mumbai',
    price: '₹4.5 Cr',
    area: '1,800 sq ft',
    bedrooms: 3,
    bathrooms: 3,
    image: 'photo-1560518883-ce09059eeffa',
    propertyType: 'Apartment',
    isNew: true
  }];

  // Use real database properties if available, otherwise fall back to default
  const properties: FeaturedProperty[] = propsProperties ?? (
    featuredProperties.length > 0 ? featuredProperties : defaultProperties
  );

  // Compute available types dynamically so it works if properties change in the future
  const availableTypes = useMemo(() => {
    const set = new Set(properties.map(p => p.propertyType).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [properties]);
  const [activeType, setActiveType] = useState<string>('All');

  // Reset filter if current type disappears due to dynamic updates
  useEffect(() => {
    if (activeType !== 'All' && !availableTypes.includes(activeType)) {
      setActiveType('All');
    }
  }, [availableTypes, activeType]);
  const filtered = useMemo(() => activeType === 'All' ? properties : properties.filter(p => p.propertyType === activeType), [activeType, properties]);
  
  // Show only first 20 properties initially, all when showAll is true
  const displayedProperties = useMemo(() => {
    return showAll ? filtered : filtered.slice(0, 20);
  }, [filtered, showAll]);

  const handleViewAllClick = () => {
    setShowAll(!showAll);
  };

  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionHeader?.content?.heading || 'Featured Properties'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center">
            {sectionHeader?.content?.description || 'Discover our handpicked selection of premium properties across India\'s top cities'}
          </p>
        </div>

        {/* Premium Filter Bar */}
        <Card className="mb-6 border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm animate-fade-in">
          <div className="p-2 md:p-3">
            {/* Mobile: dropdown select */}
            <nav aria-label="Property type filter" className="md:hidden">
              <Select value={activeType} onValueChange={setActiveType}>
                <SelectTrigger className="w-full rounded-full border border-border/60 bg-background text-foreground shadow-sm">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border/60 shadow-lg z-50 rounded-lg">
                  {availableTypes.map(type => <SelectItem key={type} value={type} className="cursor-pointer hover:bg-muted focus:bg-muted rounded-md uppercase">
                      {type}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </nav>

            {/* Desktop: horizontal tabs with hidden scrollbar (no arrows) */}
            <nav aria-label="Property type filter" className="hidden md:block">
              <Tabs value={activeType} onValueChange={setActiveType}>
                <TabsList className="w-full justify-start overflow-x-auto rounded-full bg-muted/60 p-1 border border-border/60 backdrop-blur supports-[backdrop-filter]:bg-muted/40 shadow-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {availableTypes.map(type => <TabsTrigger key={type} value={type} className="uppercase rounded-full px-4 py-2 md:px-5 md:py-2.5 transition-colors hover-scale data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow">
                      {type}
                    </TabsTrigger>)}
                </TabsList>
              </Tabs>
            </nav>
          </div>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 lg:gap-2 justify-items-center">
          {displayedProperties.map(property => <PropertyCard key={property.id} {...property} size="compact" />)}
        </div>

        {filtered.length > 20 && (
          <div className="text-center mt-12">
            <button 
              onClick={handleViewAllClick}
              className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {showAll ? 'Show Less' : 'View All Properties'}
            </button>
          </div>
        )}
      </div>
    </section>;
};
export default FeaturedProperties;
