import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus,
  Search,
  Layout,
  Type,
  Image as ImageIcon,
  Star,
  Users,
  Home,
  Settings,
  Smartphone,
  Wrench,
  Building,
  MessageSquare,
  BarChart3,
  Video,
  Map,
  Mail
} from 'lucide-react';

interface SectionTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  description?: string;
  template: {
    element_type: string;
    content: any;
  };
}

interface SectionLibraryProps {
  templates: any[];
  onAddSection: (template: any) => void;
}

const EXTENDED_TEMPLATES: SectionTemplate[] = [
  {
    id: 'hero_banner',
    name: 'Hero Banner',
    icon: <Layout className="h-4 w-4" />,
    category: 'Headers',
    description: 'Main page header with title and CTA',
    template: {
      element_type: 'hero_section',
      content: {
        title: 'Welcome to Our Platform',
        subtitle: 'Discover amazing features and services',
        buttonText: 'Get Started',
        buttonLink: '/signup',
        image: '/placeholder.svg'
      }
    }
  },
  {
    id: 'testimonial_card',
    name: 'Customer Testimonial',
    icon: <Star className="h-4 w-4" />,
    category: 'Social Proof',
    description: 'Customer review with rating',
    template: {
      element_type: 'testimonial',
      content: {
        name: 'John Doe',
        rating: '5.0',
        review: 'Great service and amazing experience!',
        location: 'New York, USA',
        image: '/placeholder.svg'
      }
    }
  },
  {
    id: 'stats_section',
    name: 'Statistics Counter',
    icon: <BarChart3 className="h-4 w-4" />,
    category: 'Data',
    description: 'Display key metrics and numbers',
    template: {
      element_type: 'stats_section',
      content: {
        properties: '10,000+',
        users: '50,000+',
        cities: '100+',
        satisfaction: '99%'
      }
    }
  },
  {
    id: 'service_card',
    name: 'Service Card',
    icon: <Settings className="h-4 w-4" />,
    category: 'Services',
    description: 'Highlight a service or feature',
    template: {
      element_type: 'service',
      content: {
        title: 'Professional Service',
        description: 'High-quality service description here',
        icon: 'home',
        features: ['Feature 1', 'Feature 2', 'Feature 3']
      }
    }
  },
  {
    id: 'mobile_app_promo',
    name: 'Mobile App Promotion',
    icon: <Smartphone className="h-4 w-4" />,
    category: 'Promotional',
    description: 'Promote your mobile application',
    template: {
      element_type: 'mobile_app_section',
      content: {
        title: 'Download Our Mobile App',
        description: 'Get the best experience on your mobile device',
        appStoreLink: '#',
        playStoreLink: '#',
        features: ['Easy to use', 'Fast', 'Secure']
      }
    }
  },
  {
    id: 'home_services_grid',
    name: 'Home Services Grid',
    icon: <Wrench className="h-4 w-4" />,
    category: 'Services',
    description: 'Grid of home services offered',
    template: {
      element_type: 'home_services_section',
      content: {
        title: 'Our Home Services',
        services: [
          { name: 'Plumbing', description: 'Professional plumbing services' },
          { name: 'Electrical', description: 'Licensed electrical work' },
          { name: 'Cleaning', description: 'House cleaning services' }
        ]
      }
    }
  },
  {
    id: 'featured_property',
    name: 'Featured Property',
    icon: <Building className="h-4 w-4" />,
    category: 'Real Estate',
    description: 'Showcase a featured property',
    template: {
      element_type: 'featured_property',
      content: {
        title: 'Luxury 3BHK Apartment',
        location: 'Whitefield, Bangalore',
        price: '₹85,00,000',
        bhk: '3bhk',
        size: '1200 sq ft',
        propertyType: 'apartment',
        image: '/placeholder.svg'
      }
    }
  },
  {
    id: 'text_block',
    name: 'Text Block',
    icon: <Type className="h-4 w-4" />,
    category: 'Content',
    description: 'Rich text content block',
    template: {
      element_type: 'text_block',
      content: {
        title: 'Content Title',
        content: 'Your content goes here. You can add multiple paragraphs and format the text as needed.',
        alignment: 'left'
      }
    }
  },
  {
    id: 'image_gallery',
    name: 'Image Gallery',
    icon: <ImageIcon className="h-4 w-4" />,
    category: 'Media',
    description: 'Display multiple images in a grid',
    template: {
      element_type: 'image_gallery',
      content: {
        title: 'Our Gallery',
        images: [
          { url: '/placeholder.svg', alt: 'Image 1', caption: 'Caption 1' },
          { url: '/placeholder.svg', alt: 'Image 2', caption: 'Caption 2' },
          { url: '/placeholder.svg', alt: 'Image 3', caption: 'Caption 3' }
        ]
      }
    }
  },
  {
    id: 'video_section',
    name: 'Video Player',
    icon: <Video className="h-4 w-4" />,
    category: 'Media',
    description: 'Embed video content',
    template: {
      element_type: 'video_section',
      content: {
        title: 'Watch Our Video',
        description: 'Learn more about our services',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '/placeholder.svg'
      }
    }
  },
  {
    id: 'contact_form',
    name: 'Contact Form',
    icon: <Mail className="h-4 w-4" />,
    category: 'Forms',
    description: 'Contact form with fields',
    template: {
      element_type: 'contact_form',
      content: {
        title: 'Get In Touch',
        description: 'Send us a message and we\'ll get back to you',
        fields: ['name', 'email', 'phone', 'message'],
        submitText: 'Send Message'
      }
    }
  },
  {
    id: 'map_section',
    name: 'Location Map',
    icon: <Map className="h-4 w-4" />,
    category: 'Location',
    description: 'Display location with map',
    template: {
      element_type: 'map_section',
      content: {
        title: 'Find Us',
        address: '123 Main Street, City, Country',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        mapUrl: 'https://maps.google.com/embed?...'
      }
    }
  }
];

const CATEGORIES = [
  'All',
  'Headers',
  'Social Proof',
  'Data',
  'Services',
  'Promotional',
  'Real Estate',
  'Content',
  'Media',
  'Forms',
  'Location'
];

export const SectionLibrary: React.FC<SectionLibraryProps> = ({
  onAddSection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = EXTENDED_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Library Header */}
      <div className="p-4 border-b bg-background">
        <h2 className="text-lg font-semibold text-foreground mb-3">Section Library</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Templates List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Layout className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No sections found</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => onAddSection(template)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      {template.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm text-foreground truncate">
                          {template.name}
                        </h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t bg-background">
        <Separator className="mb-3" />
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start text-xs">
            <Plus className="h-3 w-3 mr-2" />
            Create Custom Section
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start text-xs">
            <ImageIcon className="h-3 w-3 mr-2" />
            Import Section
          </Button>
        </div>
      </div>
    </div>
  );
};