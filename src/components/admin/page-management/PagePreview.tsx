import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye } from 'lucide-react';

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

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

interface PagePreviewProps {
  page: ContentPage | null;
  sections?: PageSection[];
}

export const PagePreview: React.FC<PagePreviewProps> = ({ page, sections = [] }) => {
  if (!page) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No page selected for preview</p>
        </CardContent>
      </Card>
    );
  }

  const renderSectionPreview = (section: PageSection) => {
    const { section_type, content } = section;

    switch (section_type) {
      case 'hero_search':
        return (
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex items-center justify-center h-full text-white text-center p-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">{content.title || 'Find Your Perfect Property'}</h1>
                <p className="text-lg mb-6">{content.subtitle || 'Discover thousands of properties across India'}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
                  <input 
                    type="text" 
                    placeholder={content.searchPlaceholder || 'Search by city, locality, or landmark'}
                    className="w-full bg-transparent text-white placeholder-white/70 border-none outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="relative h-48 bg-gradient-to-r from-red-600 to-red-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex items-center justify-center h-full text-white text-center p-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{content.title || 'Hero Section'}</h1>
                <p className="text-sm">{content.subtitle || 'Compelling hero message'}</p>
              </div>
            </div>
          </div>
        );

      case 'services':
      case 'services_grid':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || content.heading || 'Our Services'}</h2>
            <p className="text-muted-foreground mb-6">{content.subtitle || content.description || 'Comprehensive service offerings'}</p>
            {content.services && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.services.slice(0, 6).map((service: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-primary font-bold text-lg">{service.title?.charAt(0) || 'S'}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{service.title || 'Service'}</h3>
                    <p className="text-sm text-muted-foreground">{service.description || 'Service description'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'stats':
        return (
          <div className="bg-red-600 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">{content.title || 'Our Statistics'}</h2>
            {content.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {content.stats.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-2">{stat.number || '0'}</div>
                    <div className="text-sm opacity-90">{stat.label || 'Statistic'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'testimonials':
        return (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'What Our Customers Say'}</h2>
            <p className="text-muted-foreground mb-6">{content.subtitle || content.description || 'Customer reviews and success stories'}</p>
            {content.testimonials && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.testimonials.slice(0, 3).map((testimonial: any, index: number) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-bold">{testimonial.name?.charAt(0) || 'C'}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name || 'Customer'}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.location || 'Location'}</div>
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">"{testimonial.review || 'Great service!'}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'directory':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Property Directory'}</h2>
            <p className="text-muted-foreground mb-6">Browse properties by location and type</p>
            {content.locations && (
              <div className="flex flex-wrap gap-2 mb-4">
                {content.locations.slice(0, 8).map((location: string, index: number) => (
                  <Badge key={index} variant="outline">{location}</Badge>
                ))}
                {content.locations.length > 8 && (
                  <Badge variant="outline">+{content.locations.length - 8} more</Badge>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Apartments', 'Villas', 'Plots', 'Commercial'].map((type, index) => (
                <div key={index} className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="font-semibold">{type}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'real_estate_slider':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Trusted by Leading Builders'}</h2>
            {content.builders && (
              <div className="flex flex-wrap gap-4 justify-center">
                {content.builders.slice(0, 6).map((builder: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-600 font-bold text-sm">{builder.name?.split(' ').map((n: string) => n[0]).join('') || 'B'}</span>
                    </div>
                    <div className="text-sm font-semibold text-center">{builder.name || 'Builder'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'home_services':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Home Services'}</h2>
            <p className="text-muted-foreground mb-6">Complete home solutions for all your needs</p>
            {content.services && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {content.services.slice(0, 6).map((service: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-primary font-bold">{service.title?.charAt(0) || 'S'}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{service.title || 'Service'}</h3>
                    <p className="text-sm text-muted-foreground">{service.description || 'Service description'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'featured_properties':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || content.heading || 'Featured Properties'}</h2>
            <p className="text-muted-foreground mb-6">{content.description || 'Discover our handpicked selection of premium properties'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Property Image {index}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Sample Property {index}</h3>
                    <p className="text-sm text-muted-foreground mb-2">2 BHK • 1000 sq ft</p>
                    <p className="text-lg font-bold text-primary">₹50,00,000</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'why_use':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Why Choose Us'}</h2>
            <p className="text-muted-foreground mb-6">Benefits and advantages of using our platform</p>
            {content.benefits && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.benefits.slice(0, 4).map((benefit: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title || benefit}</h3>
                      {benefit.description && (
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'mobile_app':
        return (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{content.title || 'Download Our Mobile App'}</h2>
              <p className="text-lg mb-6 opacity-90">{content.description || 'Search properties on the go with our mobile app'}</p>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  App Store
                </Button>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Google Play
                </Button>
              </div>
            </div>
          </div>
        );

      case 'contact_form':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Contact Us'}</h2>
            <p className="text-muted-foreground mb-6">Send us a message and we'll respond as soon as possible</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" className="w-full p-3 border rounded-lg" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full p-3 border rounded-lg" placeholder="your.email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea className="w-full p-3 border rounded-lg h-24" placeholder="Tell us how we can help you..."></textarea>
              </div>
              <Button className="w-full bg-red-800 hover:bg-red-900 text-white">Send Message</Button>
            </div>
          </div>
        );

      case 'contact_info':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Contact Information'}</h2>
            {content.contactDetails && (
              <div className="space-y-4">
                {content.contactDetails.map((contact: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">{contact.type?.charAt(0).toUpperCase() || 'C'}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.label || 'Contact'}</h3>
                      <p className="text-muted-foreground">{contact.value || 'Contact information'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'map':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Find Us'}</h2>
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Interactive Map</span>
            </div>
          </div>
        );

      case 'content_block':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Content Block'}</h2>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {content.content || 'This is a content block with text and information that can be customized for your needs.'}
              </p>
            </div>
          </div>
        );

      case 'features_grid':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Features'}</h2>
            <p className="text-muted-foreground mb-6">{content.subtitle || 'Key features and benefits'}</p>
            {content.features && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.features.slice(0, 4).map((feature: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">{feature.title?.charAt(0) || 'F'}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title || 'Feature'}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description || 'Feature description'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'benefits_list':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Benefits'}</h2>
            <p className="text-muted-foreground mb-6">{content.subtitle || 'List of benefits and advantages'}</p>
            {content.benefits && (
              <div className="space-y-3">
                {content.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'cta_banner':
        return (
          <div className="bg-red-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Call to Action'}</h2>
            <p className="text-lg mb-6 opacity-90">{content.subtitle || 'Compelling call to action message'}</p>
            <Button variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              {content.primaryCTA || 'Get Started'}
            </Button>
          </div>
        );

      case 'comparison_table':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Comparison'}</h2>
            <p className="text-muted-foreground mb-6">Feature comparison with competitors</p>
            {content.features && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Features</th>
                      <th className="text-center p-3">Home HNI</th>
                      <th className="text-center p-3">Others</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.features.slice(0, 5).map((feature: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{feature.feature || 'Feature'}</td>
                        <td className="text-center p-3">
                          {feature.homeHNI ? '✓' : '✗'}
                        </td>
                        <td className="text-center p-3">
                          {feature.others ? '✓' : '✗'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'faq':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Frequently Asked Questions'}</h2>
            <p className="text-muted-foreground mb-6">Common questions and answers</p>
            {content.faqs && (
              <div className="space-y-4">
                {content.faqs.slice(0, 3).map((faq: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{faq.question || 'Question'}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer || 'Answer'}</p>
                  </div>
                ))}
                {content.faqs.length > 3 && (
                  <div className="text-center text-muted-foreground">
                    +{content.faqs.length - 3} more questions
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'audience_grid':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || 'Who We Serve'}</h2>
            <p className="text-muted-foreground mb-6">Our target audience and customers</p>
            {content.audiences && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.audiences.map((audience: any, index: number) => (
                  <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">{audience.title?.charAt(0) || 'A'}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{audience.title || 'Audience'}</h3>
                    <p className="text-sm text-muted-foreground">{audience.description || 'Audience description'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title || `${section_type.replace('_', ' ')} Section`}</h2>
            <p className="text-muted-foreground">
              {content.description || content.subtitle || 'Custom section content'}
            </p>
            {Object.keys(content).length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                {Object.keys(content).length} properties configured
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Page Preview: {page.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Preview of how your page will look to visitors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live
                </Button>
              </a>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-lg border p-6">
              <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
              {page.meta_description && (
                <p className="text-muted-foreground">{page.meta_description}</p>
              )}
            </div>

            {/* Page Content */}
            {page.content && (
              <div className="bg-white rounded-lg border p-6">
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: page.content }} 
                />
              </div>
            )}

            {/* Page Sections */}
            <div className="space-y-6">
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <div key={section.id || index}>
                    {renderSectionPreview(section)}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Page sections will be rendered here when they are added to the page.</p>
                  <p className="text-sm mt-2">Use the Page Editor to add sections and see them in this preview.</p>
                </div>
              )}
            </div>

            {/* Page Footer */}
            <div className="bg-gray-50 rounded-lg p-6 text-center text-muted-foreground">
              <p>Page Footer - Contact information, links, and copyright</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
