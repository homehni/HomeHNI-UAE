import React, { useEffect, useMemo, useState } from 'react';
import PropertyCard from './PropertyCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const FeaturedProperties = ({ properties: propsProperties }: { properties?: FeaturedProperty[] }) => {
  const properties: FeaturedProperty[] = propsProperties ?? [
    {
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
    },
    {
      id: '2',
      title: 'Modern Villa with Garden',
      location: 'DLF Phase 3, Gurgaon',
      price: '₹2.5 Cr',
      area: '2,400 sq ft',
      bedrooms: 4,
      bathrooms: 3,
      image: 'photo-1613490493576-7fde63acd811',
      propertyType: 'Villa'
    },
    {
      id: '3',
      title: 'Affordable 2BHK in IT Hub',
      location: 'Electronic City, Bangalore',
      price: '₹75 L',
      area: '950 sq ft',
      bedrooms: 2,
      bathrooms: 2,
      image: 'photo-1512917774080-9991f1c4c750',
      propertyType: 'Apartment'
    },
    {
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
    },
    {
      id: '5',
      title: 'Spacious 3BHK with Balcony',
      location: 'Whitefield, Bangalore',
      price: '₹95 L',
      area: '1,350 sq ft',
      bedrooms: 3,
      bathrooms: 2,
      image: 'photo-1522708323590-d24dbb6b0267',
      propertyType: 'Apartment'
    },
    {
      id: '6',
      title: 'Independent House with Parking',
      location: 'Sector 15, Noida',
      price: '₹1.8 Cr',
      area: '1,800 sq ft',
      bedrooms: 4,
      bathrooms: 3,
      image: 'photo-1568605114967-8130f3a36994',
      propertyType: 'House'
    },
    {
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
    },
    {
      id: '8',
      title: 'Luxury Penthouse with Terrace',
      location: 'Koramangala, Bangalore',
      price: '₹3.2 Cr',
      area: '2,800 sq ft',
      bedrooms: 4,
      bathrooms: 4,
      image: 'photo-1613490493576-7fde63acd811',
      propertyType: 'Penthouse'
    },
    {
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
    },
    {
      id: '10',
      title: 'Independent House with Private Garden',
      location: 'Vijayanagar, Bangalore',
      price: '₹1.7 Cr',
      area: '1,900 sq ft',
      bedrooms: 4,
      bathrooms: 3,
      image: 'photo-1568605114967-8130f3a36994',
      propertyType: 'Independent House'
    }
  ];

  // Compute available types dynamically so it works if properties change in the future
  const availableTypes = useMemo(() => {
    const set = new Set(properties.map((p) => p.propertyType).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [properties]);

  const [activeType, setActiveType] = useState<string>('All');

  // Reset filter if current type disappears due to dynamic updates
  useEffect(() => {
    if (activeType !== 'All' && !availableTypes.includes(activeType)) {
      setActiveType('All');
    }
  }, [availableTypes, activeType]);

  const filtered = useMemo(
    () => (activeType === 'All' ? properties : properties.filter((p) => p.propertyType === activeType)),
    [activeType, properties]
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties across India's top cities
          </p>
        </div>

        {/* Premium Filter Bar */}
        <Card className="mb-6 border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm animate-fade-in">
          <div className="p-2 md:p-3 w-full min-w-0 overflow-hidden">
            {/* Mobile: dropdown filter */}
            <nav aria-label="Property type filter" className="md:hidden">
              <Select value={activeType} onValueChange={setActiveType}>
                <SelectTrigger className="w-full rounded-full bg-card/80 border border-border/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/90 border border-border shadow-lg">
                  {availableTypes.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="capitalize cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </nav>

            {/* Desktop: horizontal tabs with hidden scrollbar (no arrows) */}
            <nav aria-label="Property type filter" className="hidden md:block">
              <Tabs value={activeType} onValueChange={setActiveType}>
                <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap snap-x snap-mandatory rounded-full bg-muted/60 p-1 border border-border/60 backdrop-blur supports-[backdrop-filter]:bg-muted/40 shadow-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {availableTypes.map((type) => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      className="shrink-0 snap-start capitalize rounded-full px-4 py-2 md:px-5 md:py-2.5 transition-colors hover-scale data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                    >
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </nav>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
