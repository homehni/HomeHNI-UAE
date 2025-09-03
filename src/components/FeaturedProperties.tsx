
import React, { useEffect, useMemo, useState } from 'react';
import PropertyCard from './PropertyCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contentElementsService, ContentElement } from '@/services/contentElementsService';
import { fetchFeaturedProperties } from '@/services/propertyService';
import { supabase } from '@/integrations/supabase/client';

// Helper function to extract image URL from various formats
const extractImageUrl = (imageData: any): string => {
  // Attempt to normalize any string path into a usable public URL
  const resolveUrlFromString = (rawIn: string | undefined | null): string | null => {
    if (!rawIn) return null;
    const raw = String(rawIn).trim();

    // Absolute or data URL
    if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw)) return raw;

    // App-hosted public assets
    if (/^\//.test(raw)) return raw;

    // Clean common prefixes that may be stored in DB
    let cleaned = raw
      .replace(/^\/?storage\/v1\/object\/public\/property-media\//i, '')
      .replace(/^property-media\//i, '')
      .replace(/^public\//i, '');

    // If points to known public folders under app, add leading slash
    if (/^(lovable-uploads|images|img|assets)\//i.test(cleaned)) {
      return `/${cleaned}`;
    }

    // Otherwise treat as a path inside the property-media bucket
    try {
      const { data } = supabase.storage.from('property-media').getPublicUrl(cleaned);
      return data.publicUrl || null;
    } catch {
      return null;
    }
  };

  const tryFromObject = (obj: any): string | null => {
    if (!obj || typeof obj !== 'object') return null;
    // Common keys that may hold a URL/path
    const candidates = [obj.url, obj.publicUrl, obj.public_url, obj.path, obj.storage_path, obj.name];
    for (const c of candidates) {
      const url = typeof c === 'string' ? resolveUrlFromString(c) : null;
      if (url) return url;
    }
    // If a bucket is specified with a path
    if (obj.bucket && obj.path) {
      try {
        const { data } = supabase.storage.from(String(obj.bucket)).getPublicUrl(String(obj.path));
        return data.publicUrl || null;
      } catch {}
    }
    return null;
  };

  // Start resolving
  if (!imageData) return '/placeholder.svg';

  if (Array.isArray(imageData) && imageData.length > 0) {
    for (const entry of imageData) {
      if (typeof entry === 'string') {
        const url = resolveUrlFromString(entry);
        if (url) return url;
      } else if (entry && typeof entry === 'object') {
        const url = tryFromObject(entry);
        if (url) return url;
      }
    }
  }

  if (typeof imageData === 'string') {
    const url = resolveUrlFromString(imageData);
    if (url) return url;
  }
  if (typeof imageData === 'object') {
    const url = tryFromObject(imageData);
    if (url) return url;
  }

  return '/placeholder.svg';
};

// Minimal type for featured properties
 type FeaturedProperty = {
   id: string;
   title: string;
   location: string;
   price: string;
   area: string;
   bedrooms: number;
   bathrooms: number;
   image: string | { url: string } | (string | { url: string })[];
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
  
  // Fetch real featured properties from database with slight delay for better UX
  useEffect(() => {
    let propertiesChannel: any = null;
    
    // Defer heavy operations to allow initial render
    const timer = setTimeout(async () => {
      try {
        // Get featured properties from both sources
        // 1. From content_elements table (existing property_1 to property_19)
        const contentElements = await contentElementsService.getFeaturedProperties();
        
        // 2. From properties table (newly approved properties)
        const propertiesData = await fetchFeaturedProperties();
        
        // Validate content elements referencing properties against current database
        const referencedPropertyIds = contentElements
          .map(e => e.content?.id)
          .filter((id): id is string => Boolean(id));

        let validPropertyIdSet = new Set<string>();
        if (referencedPropertyIds.length > 0) {
          const { data: existingProps, error: existingErr } = await supabase
            .from('properties')
            .select('id, status')
            .in('id', referencedPropertyIds);
          if (!existingErr && existingProps) {
            validPropertyIdSet = new Set(existingProps.filter(p => p.status === 'approved').map(p => p.id));
          }
        }

        // Filter out content elements that point to deleted/unapproved properties
        const filteredContentElements = contentElements.filter(e => {
          const refId = e.content?.id as string | undefined;
          if (!refId) return true; // keep static curated tiles
          return validPropertyIdSet.has(refId);
        });

        // Transform filtered content_elements to FeaturedProperty format
        const contentElementProperties = filteredContentElements.map(element => ({
          id: element.content?.id || element.id,
          title: element.title || element.content?.title || 'Property',
          location: element.content?.location || 'Location',
          price: element.content?.price || '₹0',
          area: element.content?.area || element.content?.size || '0 sq ft',
          bedrooms: element.content?.bedrooms || parseInt(element.content?.bhk?.replace(/[^\d]/g, '') || '0'),
          bathrooms: element.content?.bathrooms || 0,
          image: element.images?.[0] || element.content?.image || '/placeholder.svg',
          propertyType: element.content?.propertyType || 'Property',
          isNew: element.content?.isNew || false
        }));
        
        // Transform properties table data to FeaturedProperty format
        const transformedProperties = propertiesData.map(property => ({
          id: property.id,
          title: property.title,
          location: `${property.locality}, ${property.city}`,
          price: `₹${(property.expected_price / 100000).toFixed(1)}L`,
          area: `${property.super_area || 0} sq ft`,
          bedrooms: parseInt(property.bhk_type?.replace(/[^\d]/g, '') || '0'),
          bathrooms: property.bathrooms || 0,
          image: property.images || [],
          propertyType: property.property_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Property',
          isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if created within last 7 days
        }));

        // Combine both sources, with newer properties first
        const allProperties = [...transformedProperties, ...contentElementProperties];
        
        // Remove duplicates based on ID and limit to reasonable number
        const uniqueProperties = allProperties.filter((property, index, self) => 
          index === self.findIndex(p => p.id === property.id)
        ).slice(0, 50); // Limit to 50 properties max
        
        setFeaturedProperties(uniqueProperties);

        // Get header content
        const headerContent = await contentElementsService.getSectionContent('homepage', 'featured_properties', 'featured_properties_header');
        setSectionHeader(headerContent);

        // Set up real-time subscription for featured properties after initial load
        propertiesChannel = supabase
          .channel('featured-properties-realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'properties'
            },
            (payload) => {
              console.log('Property change detected:', payload);

              if (payload.eventType === 'DELETE') {
                const deletedId = payload.old?.id;
                if (deletedId) {
                  setFeaturedProperties(prev => prev.filter(p => p.id !== deletedId));
                }
                return;
              }

              const record = payload.new as any;
              if (!record) return;

              const qualifies = record.status === 'approved' && record.is_featured === true;
              if (qualifies) {
                const newProperty = {
                  id: record.id,
                  title: record.title,
                  location: `${record.locality}, ${record.city}`,
                  price: `₹${(record.expected_price / 100000).toFixed(1)}L`,
                  area: `${record.super_area} sq ft`,
                  bedrooms: parseInt(record.bhk_type?.replace(/[^\d]/g, '') || '0'),
                  bathrooms: record.bathrooms || 0,
                  image: record.images || [],
                  propertyType: record.property_type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Property',
                  isNew: true
                };
                setFeaturedProperties(prev => {
                  const without = prev.filter(p => p.id !== newProperty.id);
                  return [newProperty, ...without].slice(0, 50);
                });
              } else {
                // If it no longer qualifies, remove it from the list
                setFeaturedProperties(prev => prev.filter(p => p.id !== record.id));
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (propertiesChannel) {
        supabase.removeChannel(propertiesChannel);
      }
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
    image: 'apartment1.jpg',
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
    image: 'villa1.jpg',
    propertyType: 'Villa'
  }, {
    id: '3',
    title: 'Affordable 2BHK in IT Hub',
    location: 'Electronic City, Bangalore',
    price: '₹75 L',
    area: '950 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    image: 'apartment2.jpg',
    propertyType: 'Apartment'
  }, {
    id: '4',
    title: 'Premium Office Space',
    location: 'Cyber City, Gurgaon',
    price: '₹45 L',
    area: '800 sq ft',
    bedrooms: 0,
    bathrooms: 1,
    image: 'commercial1.jpg',
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
    image: 'apartment3.jpg',
    propertyType: 'Apartment'
  }, {
    id: '6',
    title: 'Independent House with Parking',
    location: 'Sector 15, Noida',
    price: '₹1.8 Cr',
    area: '1,800 sq ft',
    bedrooms: 4,
    bathrooms: 3,
    image: 'house1.jpg',
    propertyType: 'House'
  }, {
    id: '7',
    title: 'Modern 2BHK with City View',
    location: 'Bandra West, Mumbai',
    price: '₹1.5 Cr',
    area: '1,100 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    image: 'apartment4.jpg',
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
    image: 'penthouse1.jpg',
    propertyType: 'Penthouse'
  }, {
    id: '9',
    title: 'Prime Residential Plot in Gated Community',
    location: 'Hinjewadi, Pune',
    price: '₹60 L',
    area: '2,400 sq ft',
    bedrooms: 0,
    bathrooms: 0,
    image: 'plot1.jpg',
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
    image: 'independent-house1.jpg',
    propertyType: 'Independent House'
  }, {
    id: '11',
    title: 'Fertile Agricultural Land with Water Source',
    location: 'Kharif Valley, Punjab',
    price: '₹25 L',
    area: '5 acres',
    bedrooms: 0,
    bathrooms: 0,
    image: 'agricultural-lands1.jpg',
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
    image: 'apartment5.jpg',
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
    image: 'commercial2.jpg',
    propertyType: 'Commercial'
  }, {
    id: '14',
    title: 'Duplex House with Garden',
    location: 'Jubilee Hills, Hyderabad',
    price: '₹2.8 Cr',
    area: '3,200 sq ft',
    bedrooms: 5,
    bathrooms: 4,
    image: 'house2.jpg',
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
    image: 'apartment6.jpg',
    propertyType: 'Apartment'
  }, {
    id: '16',
    title: 'Farmhouse with Orchard',
    location: 'Lonavala, Maharashtra',
    price: '₹1.2 Cr',
    area: '2 acres',
    bedrooms: 3,
    bathrooms: 2,
    image: 'farmhouse1.jpg',
    propertyType: 'Farm House'
  }, {
    id: '17',
    title: 'Modern 4BHK with Amenities',
    location: 'New Town, Kolkata',
    price: '₹1.1 Cr',
    area: '1,600 sq ft',
    bedrooms: 4,
    bathrooms: 3,
    image: 'apartment7.jpg',
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
    image: 'commercial3.jpg',
    propertyType: 'Commercial'
  }, {
    id: '19',
    title: 'Sea View Apartment with Balcony',
    location: 'Marine Drive, Mumbai',
    price: '₹4.5 Cr',
    area: '1,800 sq ft',
    bedrooms: 3,
    bathrooms: 3,
    image: 'apartment8.jpg',
    propertyType: 'Apartment',
    isNew: true
  }];

  const properties: FeaturedProperty[] = propsProperties ?? featuredProperties;

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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
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
