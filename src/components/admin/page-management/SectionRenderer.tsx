import React from 'react';
import SearchSection from '@/components/SearchSection';
import FeaturedProperties from '@/components/FeaturedProperties';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import CustomerTestimonials from '@/components/CustomerTestimonials';

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
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  if (!section.is_active) {
    return null;
  }

  const renderSection = () => {
    switch (section.section_type) {
      case 'hero_search':
        return <SearchSection />;
      
      case 'featured_properties':
        return (
          <FeaturedProperties 
            properties={section.content?.properties}
          />
        );
      
      case 'services_grid':
        return <Services />;
      
      case 'stats_section':
        return <Stats />;
      
      case 'testimonials_section':
        return <CustomerTestimonials />;
      
      case 'property_grid':
        return (
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'Properties'}
                </h2>
                {section.content?.description && (
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {section.content.description}
                  </p>
                )}
              </div>
              <FeaturedProperties />
            </div>
          </div>
        );
      
      case 'search':
        return (
          <div className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <SearchSection />
            </div>
          </div>
        );
      
      case 'steps':
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'How It Works'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(section.content?.steps || []).map((step: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'team':
        return (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'Our Team'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(section.content?.agents || []).map((agent: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-6 text-center shadow-md">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4">
                      {agent.image ? (
                        <img src={agent.image} alt={agent.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-brand-red flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {agent.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
                    <p className="text-gray-600 mb-2">{agent.role}</p>
                    {section.content?.show_contact_info && agent.contact && (
                      <p className="text-brand-red">{agent.contact}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'blog':
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'Latest Blog Posts'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array.from({ length: section.content?.posts_count || 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Blog Post {index + 1}</h3>
                      {section.content?.show_excerpt && (
                        <p className="text-gray-600">Sample blog post excerpt...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'faq':
        return (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'Frequently Asked Questions'}
                </h2>
              </div>
              <div className="max-w-3xl mx-auto space-y-4">
                {(section.content?.faqs || []).map((faq: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'contact':
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'Contact Us'}
                </h2>
                {section.content?.description && (
                  <p className="text-xl text-gray-600">{section.content.description}</p>
                )}
              </div>
              <div className="max-w-md mx-auto">
                <form className="space-y-4">
                  {(section.content?.fields || ['name', 'email', 'message']).map((field: string) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {field}
                      </label>
                      {field === 'message' ? (
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows={4}
                        />
                      ) : (
                        <input 
                          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      )}
                    </div>
                  ))}
                  <button 
                    type="submit" 
                    className="w-full bg-brand-red text-white py-2 px-4 rounded-md hover:bg-brand-red-dark transition-colors"
                  >
                    {section.content?.submitText || 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </section>
        );
      
      case 'gallery':
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'Gallery'}
                </h2>
              </div>
              <div className={`grid gap-4 grid-cols-${section.content?.columns || 3}`}>
                {(section.content?.images || []).map((image: any, index: number) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.alt || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'footer_banner':
        return (
          <section className="py-16 bg-brand-red text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                {section.content?.title || 'Ready to Get Started?'}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {section.content?.description || 'Join thousands of satisfied customers'}
              </p>
              <a 
                href={section.content?.cta_url || '#'} 
                className="inline-block bg-white text-brand-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {section.content?.cta_text || 'Get Started'}
              </a>
            </div>
          </section>
        );
      
      default:
        return (
          <div className="py-8 px-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-600">
              Unknown section type: <strong>{section.section_type}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This section type needs to be implemented in the SectionRenderer component.
            </p>
          </div>
        );
    }
  };

  return (
    <div data-section-id={section.id} data-section-type={section.section_type}>
      {renderSection()}
    </div>
  );
};