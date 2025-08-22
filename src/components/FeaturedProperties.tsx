
import React, { useEffect, useMemo, useState } from 'react';
import PropertyCard from './PropertyCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contentElementsService, ContentElement } from '@/services/contentElementsService';
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
  
  // Fetch real featured properties from database (no static fallback)
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // 1) Get active featured property ids in order
        const { data: featuredRows, error: featuredErr } = await supabase
          .from('featured_properties')
          .select('property_id, sort_order, is_active')
          .eq('is_active', true)
          .order('sort_order');
        if (featuredErr) throw featuredErr;

        const ids = (featuredRows || []).map(r => r.property_id).filter(Boolean);

        // 2) Fetch public property details for these ids
        let transformedProperties: FeaturedProperty[] = [];
        if (ids.length > 0) {
          const { data: publicProps, error: publicErr } = await supabase
            .from('public_properties')
            .select('*')
            .in('id', ids)
            .eq('status', 'approved');
          if (publicErr) throw publicErr;

          const byId: Record<string, any> = {};
          (publicProps || []).forEach(p => { if (p?.id) byId[p.id] = p; });

          // Preserve sort order
          transformedProperties = (featuredRows || [])
            .map(fr => byId[fr.property_id])
            .filter(Boolean)
            .map(p => ({
              id: p.id,
              title: p.title,
              location: [p.locality, p.city].filter(Boolean).join(', '),
              price: typeof p.expected_price === 'number' ? `₹${(p.expected_price / 100000).toFixed(1)}L` : '',
              area: p.super_area ? `${p.super_area} sq ft` : '',
              bedrooms: parseInt((p.bhk_type || '').replace(/[^\d]/g, '') || '0'),
              bathrooms: p.bathrooms || 0,
              image: Array.isArray(p.images) && p.images.length ? p.images[0] : 'photo-1560518883-ce09059eeffa',
              propertyType: (p.property_type || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              isNew: false,
            }));
        }

        setFeaturedProperties(transformedProperties);

        // Header content from CMS (optional)
        const headerContent = await contentElementsService.getSectionContent('homepage', 'featured_properties', 'featured_properties_header');
        setSectionHeader(headerContent);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setFeaturedProperties([]);
      }
    };

    fetchContent();

    // Real-time updates: featured list and public properties
    const featuredChannel = supabase
      .channel('featured-properties-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'featured_properties' },
        () => fetchContent()
      )
      .subscribe();

    const publicPropsChannel = supabase
      .channel('public-properties-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'public_properties' },
        () => fetchContent()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(featuredChannel);
      supabase.removeChannel(publicPropsChannel);
    };
  }, []);

  // Live featured properties only (no static fallback)
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
