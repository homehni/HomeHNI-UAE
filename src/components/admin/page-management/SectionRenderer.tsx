import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, Eye } from 'lucide-react';

interface PageSection {
  id: string;
  section_type: string;
  content: any;
  sort_order: number;
  page_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SectionRendererProps {
  section: PageSection;
  onEdit?: (section: PageSection) => void;
  onDelete?: (sectionId: string) => void;
  onPreview?: (section: PageSection) => void;
  showActions?: boolean;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  onEdit,
  onDelete,
  onPreview,
  showActions = true
}) => {
  const renderSectionContent = () => {
    const { section_type, content } = section;

    switch (section_type) {
      case 'hero_search':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Hero Search Section'}</h3>
            <p className="text-sm text-muted-foreground">{content.subtitle || 'Property search with location-based functionality'}</p>
            {content.backgroundImage && (
              <div className="w-full h-20 bg-cover bg-center rounded border" 
                   style={{ backgroundImage: `url(${content.backgroundImage})` }} />
            )}
            <div className="text-xs text-muted-foreground">
              Search Placeholder: {content.searchPlaceholder || 'Search by city, locality, or landmark'}
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Hero Section'}</h3>
            <p className="text-sm text-muted-foreground">{content.subtitle || 'Hero banner with compelling message'}</p>
            {content.backgroundImage && (
              <div className="w-full h-20 bg-cover bg-center rounded border" 
                   style={{ backgroundImage: `url(${content.backgroundImage})` }} />
            )}
            {content.description && (
              <p className="text-xs text-muted-foreground">{content.description}</p>
            )}
          </div>
        );

      case 'services':
      case 'services_grid':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || content.heading || 'Services Section'}</h3>
            <p className="text-sm text-muted-foreground">{content.subtitle || content.description || 'Comprehensive service offerings'}</p>
            {content.services && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {content.services.slice(0, 4).map((service: any, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded">
                    <div className="font-medium">{service.title}</div>
                    <div className="text-muted-foreground truncate">{service.description}</div>
                  </div>
                ))}
                {content.services.length > 4 && (
                  <div className="text-xs text-muted-foreground col-span-2">
                    +{content.services.length - 4} more services
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Statistics Section'}</h3>
            {content.stats && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {content.stats.slice(0, 4).map((stat: any, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded text-center">
                    <div className="font-bold text-primary">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Testimonials Section'}</h3>
            <p className="text-sm text-muted-foreground">{content.subtitle || content.description || 'Customer reviews and success stories'}</p>
            {content.testimonials && (
              <div className="space-y-1 mt-2">
                {content.testimonials.slice(0, 2).map((testimonial: any, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded">
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-muted-foreground truncate">"{testimonial.review}"</div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                ))}
                {content.testimonials.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{content.testimonials.length - 2} more testimonials
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'directory':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Property Directory'}</h3>
            <p className="text-sm text-muted-foreground">Comprehensive property listings organized by location and type</p>
            {content.locations && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.locations.slice(0, 6).map((location: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">{location}</Badge>
                ))}
                {content.locations.length > 6 && (
                  <Badge variant="outline" className="text-xs">+{content.locations.length - 6} more</Badge>
                )}
              </div>
            )}
          </div>
        );

      case 'real_estate_slider':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Real Estate Builders Slider'}</h3>
            <p className="text-sm text-muted-foreground">Carousel showcasing trusted real estate builders</p>
            {content.builders && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.builders.slice(0, 4).map((builder: any, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">{builder.name}</Badge>
                ))}
                {content.builders.length > 4 && (
                  <Badge variant="secondary" className="text-xs">+{content.builders.length - 4} more</Badge>
                )}
              </div>
            )}
          </div>
        );

      case 'home_services':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Home Services'}</h3>
            <p className="text-sm text-muted-foreground">Various home and property-related services</p>
            {content.services && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {content.services.slice(0, 4).map((service: any, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded">
                    <div className="font-medium">{service.title}</div>
                    <div className="text-muted-foreground truncate">{service.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'featured_properties':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || content.heading || 'Featured Properties'}</h3>
            <p className="text-sm text-muted-foreground">{content.description || 'Showcase of premium property listings'}</p>
            <div className="text-xs text-muted-foreground">
              Max Properties: {content.maxProperties || content.max_properties || 'Unlimited'}
              {content.showFilters && ' • Filters Enabled'}
            </div>
          </div>
        );

      case 'why_use':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Why Choose Us'}</h3>
            <p className="text-sm text-muted-foreground">Benefits and advantages of using the platform</p>
            {content.benefits && (
              <div className="space-y-1 mt-2">
                {content.benefits.slice(0, 3).map((benefit: any, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded">
                    <div className="font-medium">{benefit.title || benefit}</div>
                    {benefit.description && (
                      <div className="text-muted-foreground truncate">{benefit.description}</div>
                    )}
                  </div>
                ))}
                {content.benefits.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{content.benefits.length - 3} more benefits
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'mobile_app':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Mobile App Promotion'}</h3>
            <p className="text-sm text-muted-foreground">{content.description || 'Mobile app download section'}</p>
            <div className="text-xs text-muted-foreground">
              App Store: {content.appStoreLink ? 'Available' : 'Not set'} • 
              Play Store: {content.playStoreLink ? 'Available' : 'Not set'}
            </div>
          </div>
        );

      case 'contact_form':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Contact Form'}</h3>
            <p className="text-sm text-muted-foreground">Contact form for inquiries</p>
            {content.fields && (
              <div className="text-xs text-muted-foreground">
                Fields: {content.fields.map((field: any) => field.name).join(', ')}
              </div>
            )}
          </div>
        );

      case 'contact_info':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Contact Information'}</h3>
            <p className="text-sm text-muted-foreground">Contact details and information</p>
            {content.contactDetails && (
              <div className="text-xs text-muted-foreground">
                {content.contactDetails.length} contact methods available
              </div>
            )}
          </div>
        );

      case 'map':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Location Map'}</h3>
            <p className="text-sm text-muted-foreground">Interactive map showing location</p>
            <div className="w-full h-16 bg-muted rounded border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Map Preview</span>
            </div>
          </div>
        );

      case 'content_block':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Content Block'}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {content.content || 'Content block with text and information'}
            </p>
          </div>
        );

      case 'features_grid':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Features Grid'}</h3>
            <p className="text-sm text-muted-foreground">{content.subtitle || 'Key features and benefits'}</p>
            {content.features && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {content.features.slice(0, 4).map((feature: any, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded">
                    <div className="font-medium">{feature.title}</div>
                    <div className="text-muted-foreground truncate">{feature.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'benefits_list':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Benefits List'}</h3>
            <p className="text-sm text-muted-foreground">{content.subtitle || 'List of benefits and advantages'}</p>
            {content.benefits && (
              <div className="space-y-1 mt-2">
                {content.benefits.slice(0, 3).map((benefit: string, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded">
                    {benefit}
                  </div>
                ))}
                {content.benefits.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{content.benefits.length - 3} more benefits
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'cta_banner':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Call to Action Banner'}</h3>
            <p className="text-sm text-muted-foreground">{content.subtitle || 'Compelling call to action'}</p>
            <div className="text-xs text-muted-foreground">
              CTA: {content.primaryCTA || 'Not set'}
            </div>
          </div>
        );

      case 'comparison_table':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Comparison Table'}</h3>
            <p className="text-sm text-muted-foreground">Feature comparison with competitors</p>
            {content.features && (
              <div className="text-xs text-muted-foreground">
                {content.features.length} features compared
              </div>
            )}
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'FAQ Section'}</h3>
            <p className="text-sm text-muted-foreground">Frequently asked questions</p>
            {content.faqs && (
              <div className="text-xs text-muted-foreground">
                {content.faqs.length} questions available
              </div>
            )}
          </div>
        );

      case 'audience_grid':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || 'Target Audience'}</h3>
            <p className="text-sm text-muted-foreground">Who we serve</p>
            {content.audiences && (
              <div className="space-y-1 mt-2">
                {content.audiences.slice(0, 3).map((audience: any, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded">
                    <div className="font-medium">{audience.title}</div>
                    <div className="text-muted-foreground truncate">{audience.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{content.title || `${section_type.replace('_', ' ')} Section`}</h3>
            <p className="text-sm text-muted-foreground">
              {content.description || content.subtitle || 'Custom section content'}
            </p>
            {Object.keys(content).length > 0 && (
              <div className="text-xs text-muted-foreground">
                {Object.keys(content).length} properties configured
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {renderSectionContent()}
          </div>
          {showActions && (
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="outline" className="text-xs">
                {section.section_type}
              </Badge>
              {onPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreview(section)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(section)}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(section.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};