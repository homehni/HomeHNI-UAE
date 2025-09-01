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
    description: 'Hero banner with property search tabs and location-based search',
    category: 'Headers',
    previewImage: '/lovable-uploads/hero-search-preview.jpg',
    schema: {
      hero_image: 'image',
      search_placeholder: 'string',
      tabs: 'array'
    }
  },
  {
    id: 'featured-properties',
    name: 'Featured Properties Grid',
    type: 'featured_properties',
    description: 'Grid layout showcasing featured properties with filters and real-time updates',
    category: 'Real Estate',
    previewImage: '/lovable-uploads/featured-properties-preview.jpg',
    schema: {
      heading: 'string',
      description: 'string',
      show_filters: 'boolean',
      max_properties: 'number'
    }
  },
  {
    id: 'services-grid',
    name: 'Services Grid',
    type: 'services_grid',
    description: 'Grid of services with icons and descriptions',
    category: 'Content',
    previewImage: '/lovable-uploads/services-preview.jpg',
    schema: {
      heading: 'string',
      description: 'string',
      services: 'array'
    }
  },
  {
    id: 'stats-section',
    name: 'Statistics Counter',
    type: 'stats_section',
    description: 'Animated counters displaying key business metrics',
    category: 'Data',
    previewImage: '/lovable-uploads/stats-preview.jpg',
    schema: {
      stats: 'array',
      background_style: 'select'
    }
  },
  {
    id: 'testimonials-section',
    name: 'Customer Testimonials',
    type: 'testimonials_section',
    description: 'Customer reviews with video testimonials and trust metrics',
    category: 'Social Proof',
    previewImage: '/lovable-uploads/testimonials-preview.jpg',
    schema: {
      heading: 'string',
      description: 'string',
      show_video: 'boolean',
      testimonials: 'array'
    }
  },
  {
    id: 'property-grid',
    name: 'Property Listings Grid',
    type: 'property_grid',
    description: 'Customizable property listings with advanced filtering',
    category: 'Real Estate',
    previewImage: '/lovable-uploads/property-grid-preview.jpg',
    schema: {
      title: 'string',
      show_filters: 'boolean',
      grid_columns: 'number',
      properties_count: 'number'
    }
  },
  {
    id: 'search-bar',
    name: 'Search Bar with Filters',
    type: 'search',
    description: 'Advanced search interface with location and property filters',
    category: 'Interactive',
    previewImage: '/lovable-uploads/search-preview.jpg',
    schema: {
      placeholder_text: 'string',
      show_location_filter: 'boolean',
      show_price_filter: 'boolean',
      show_property_type: 'boolean'
    }
  },
  {
    id: 'how-it-works',
    name: 'How It Works',
    type: 'steps',
    description: 'Step-by-step process explanation with icons',
    category: 'Content',
    previewImage: '/lovable-uploads/steps-preview.jpg',
    schema: {
      title: 'string',
      steps: 'array'
    }
  },
  {
    id: 'agent-profiles',
    name: 'Agent Profiles',
    type: 'team',
    description: 'Grid of agent profiles with photos and contact information',
    category: 'People',
    previewImage: '/lovable-uploads/agents-preview.jpg',
    schema: {
      title: 'string',
      show_contact_info: 'boolean',
      agents: 'array'
    }
  },
  {
    id: 'blog-section',
    name: 'Blog Section',
    type: 'blog',
    description: 'Latest blog posts with featured images',
    category: 'Content',
    previewImage: '/lovable-uploads/blog-preview.jpg',
    schema: {
      title: 'string',
      posts_count: 'number',
      show_excerpt: 'boolean'
    }
  },
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion',
    type: 'faq',
    description: 'Expandable frequently asked questions',
    category: 'Content',
    previewImage: '/lovable-uploads/faq-preview.jpg',
    schema: {
      title: 'string',
      faqs: 'array',
      allow_multiple_open: 'boolean'
    }
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    type: 'contact',
    description: 'Contact form with validation and customizable fields',
    category: 'Forms',
    previewImage: '/lovable-uploads/contact-preview.jpg',
    schema: {
      title: 'string',
      fields: 'array',
      success_message: 'string'
    }
  },
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    type: 'gallery',
    description: 'Responsive image gallery with lightbox',
    category: 'Media',
    previewImage: '/lovable-uploads/gallery-preview.jpg',
    schema: {
      title: 'string',
      images: 'array',
      columns: 'number'
    }
  },
  {
    id: 'footer-banner',
    name: 'Footer Banner',
    type: 'footer_banner',
    description: 'Call-to-action banner for page footer',
    category: 'Footers',
    previewImage: '/lovable-uploads/footer-banner-preview.jpg',
    schema: {
      title: 'string',
      description: 'string',
      cta_text: 'string',
      cta_url: 'string'
    }
  }
];

const categories = ['All', 'Headers', 'Real Estate', 'Content', 'Interactive', 'People', 'Social Proof', 'Forms', 'Data', 'Media', 'Footers'];

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
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">
                    {template.name} Preview
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