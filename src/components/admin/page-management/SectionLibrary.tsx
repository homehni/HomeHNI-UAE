import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';

interface SectionTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  category: string;
  previewImage: string;
  schema: any;
}

const sectionTemplates: SectionTemplate[] = [
  {
    id: 'hero-search',
    name: 'Hero Search Section',
    type: 'hero_search',
    description: 'Main hero banner with property search tabs and location-based search functionality',
    category: 'Hero',
    previewImage: '/lovable-uploads/a83d7fd3-19d0-43ed-9c71-0158ae789ae2.png',
    schema: {
      title: 'string',
      subtitle: 'string',
      background_image: 'image',
      search_placeholder: 'string'
    }
  },
  {
    id: 'our-services',
    name: 'Our Services Grid',
    type: 'services',
    description: 'Comprehensive real estate services with 6 key service offerings',
    category: 'Services',
    previewImage: '/lovable-uploads/dddc344b-7d00-4537-98d1-558ec4fc90a7.png',
    schema: {
      title: 'string',
      subtitle: 'string',
      services: 'array'
    }
  },
  {
    id: 'stats-counter',
    name: 'Statistics Counter',
    type: 'stats',
    description: 'Business metrics with animated counters on red background',
    category: 'Statistics',
    previewImage: '/lovable-uploads/77255b7d-3088-40d7-8bff-d64bf3d0b561.png',
    schema: {
      stats: 'array',
      background_color: 'string'
    }
  },
  {
    id: 'property-directory',
    name: 'Property Directory',
    type: 'directory',
    description: 'Comprehensive property listings organized by location and type',
    category: 'Listings',
    previewImage: '/lovable-uploads/afeb45dd-0383-4b96-91d5-c7fa678d488c.png',
    schema: {
      show_tabs: 'boolean',
      locations: 'array',
      property_types: 'array'
    }
  },
  {
    id: 'real-estate-slider',
    name: 'Real Estate Builders Slider',
    type: 'real_estate_slider',
    description: 'Carousel showcasing trusted real estate builders and developers',
    category: 'Showcase',
    previewImage: '/lovable-uploads/eed6e505-e2ef-4267-b0b6-ebe159e3a167.png',
    schema: {
      title: 'string',
      builders: 'array',
      auto_scroll: 'boolean'
    }
  },
  {
    id: 'home-services',
    name: 'Home Services',
    type: 'home_services',
    description: 'Various home and property-related services with visual cards',
    category: 'Services',
    previewImage: '/lovable-uploads/eed6e505-e2ef-4267-b0b6-ebe159e3a167.png',
    schema: {
      title: 'string',
      services: 'array',
      show_offers: 'boolean'
    }
  },
  {
    id: 'featured-properties',
    name: 'Featured Properties',
    type: 'featured_properties',
    description: 'Showcase of premium and featured property listings',
    category: 'Properties',
    previewImage: '/lovable-uploads/property-grid-preview.jpg',
    schema: {
      title: 'string',
      description: 'string',
      max_properties: 'number',
      show_filters: 'boolean'
    }
  },
  {
    id: 'customer-testimonials',
    name: 'Customer Testimonials',
    type: 'testimonials',
    description: 'Customer reviews and success stories with ratings',
    category: 'Social Proof',
    previewImage: '/lovable-uploads/testimonials-preview.jpg',
    schema: {
      title: 'string',
      testimonials: 'array',
      show_ratings: 'boolean'
    }
  },
  {
    id: 'mobile-app-section',
    name: 'Mobile App Promotion',
    type: 'mobile_app',
    description: 'Mobile app download section with app store links',
    category: 'Promotion',
    previewImage: '/lovable-uploads/c0b01943-436f-4e6d-a35f-752876e4e8a4.png',
    schema: {
      title: 'string',
      description: 'string',
      app_store_link: 'string',
      play_store_link: 'string'
    }
  },
  {
    id: 'why-use-section',
    name: 'Why Choose Us',
    type: 'why_use',
    description: 'Benefits and advantages of using the platform',
    category: 'Benefits',
    previewImage: '/lovable-uploads/benefits-preview.jpg',
    schema: {
      title: 'string',
      benefits: 'array',
      show_icons: 'boolean'
    }
  }
];

const categories = ['All', 'Hero', 'Services', 'Statistics', 'Listings', 'Showcase', 'Properties', 'Social Proof', 'Promotion', 'Benefits'];

interface SectionLibraryProps {
  onSelectSection: (sectionType: string) => void;
}

export const SectionLibrary: React.FC<SectionLibraryProps> = ({ onSelectSection }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = sectionTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose from Section Templates</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select pre-designed sections to build your page. All templates are bound to your website data.
          </p>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search section templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border-b">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <div className="text-primary font-bold">
                        {template.category.slice(0, 2)}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {template.name}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{template.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <Button
                    onClick={() => onSelectSection(template.type)}
                    className="w-full flex items-center gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Use This Section
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No templates found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};