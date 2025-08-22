import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import SearchSection from '@/components/SearchSection';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import CustomerTestimonials from '@/components/CustomerTestimonials';
import MobileAppSection from '@/components/MobileAppSection';
import { Loader2 } from 'lucide-react';

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  page_type: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  content: any;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<ContentPage | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('content_pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error || !data) {
          console.error('Page not found:', error);
          setNotFound(true);
        } else {
          setPage(data);
          
          // Fetch page sections
          const { data: sectionsData, error: sectionsError } = await supabase
            .from('page_sections')
            .select('*')
            .eq('page_id', data.id)
            .eq('is_active', true)
            .order('sort_order');
            
          if (!sectionsError && sectionsData) {
            setSections(sectionsData);
          }
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();

    // Smooth scroll to top when component mounts
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    // Small delay to ensure page is fully loaded
    setTimeout(scrollToTop, 100);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Marquee />
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !page) {
    return <Navigate to="/404" replace />;
  }

  const formatContent = (content: any) => {
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object') {
      return JSON.stringify(content, null, 2);
    }
    return String(content || '');
  };

  const renderSection = (section: PageSection) => {
    const { section_type, content } = section;
    
    switch (section_type) {
      case 'hero-search':
        return <SearchSection key={section.id} />;
      
      case 'services':
        return (
          <div key={section.id} className="py-16 bg-white section-separator">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {content.title || 'Our Services'}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {content.subtitle || 'Comprehensive real estate solutions tailored to meet all your property needs'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(content.services || []).map((service: any, index: number) => (
                  <div key={index} className="card-border card-border-accent hover-lift p-6 bg-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-red to-brand-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 text-white">📋</div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <section key={section.id} className="py-16 gradient-red-maroon">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {(content.stats || []).map((stat: any, index: number) => (
                  <div key={index} className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8">📊</div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-lg opacity-90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'testimonials':
        return (
          <section key={section.id} className="py-16 bg-white text-black">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                {content.title || 'Our Customers Love us'}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="flex justify-center lg:justify-start">
                  <div className="bg-gray-50 border-2 border-primary w-full max-w-md rounded-lg">
                    <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                      <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-brand-red-light transition-colors">
                        <div className="w-8 h-8 text-white ml-1">▶️</div>
                      </div>
                      <p className="text-center text-gray-600">
                        Watch our customer stories
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {(content.testimonials || []).map((testimonial: any, index: number) => (
                    <div key={index} className="bg-gray-50 border-2 border-primary rounded-lg">
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-700 font-medium">
                              {testimonial.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-black">
                                {testimonial.name}
                              </h4>
                              <div className="flex">
                                {[...Array(testimonial.rating || 5)].map((_, i) => (
                                  <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {testimonial.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      
      case 'mobile-app':
        return <MobileAppSection key={section.id} />;
        
      default:
        // Handle custom content sections
        return (
          <section key={section.id} className="py-8 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {content.title && (
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                    {content.title}
                  </h2>
                )}
                <div 
                  className="prose prose-lg prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: formatContent(content.html || content.content || content) 
                  }}
                />
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>{page.meta_title || page.title}</title>
        {page.meta_description && (
          <meta name="description" content={page.meta_description} />
        )}
        {page.meta_keywords && page.meta_keywords.length > 0 && (
          <meta name="keywords" content={page.meta_keywords.join(', ')} />
        )}
        <meta property="og:title" content={page.meta_title || page.title} />
        {page.meta_description && (
          <meta property="og:description" content={page.meta_description} />
        )}
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/${page.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Marquee at the very top */}
        <Marquee />
        
        {/* Header overlapping with content */}
        <Header />
        
        {/* Main Content */}
        <div className="pt-8">
          {sections.length > 0 ? (
            // Render page sections
            <div>
              {sections.map(renderSection)}
            </div>
          ) : (
            // Fallback to static content if no sections
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto">
                <article className="space-y-8">
                  {/* Page Header */}
                  <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                      {page.title}
                    </h1>
                    
                    {(page.page_type || page.updated_at) && (
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        {page.page_type && (
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full capitalize font-medium">
                            {page.page_type}
                          </span>
                        )}
                        {page.updated_at && (
                          <>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <time dateTime={page.updated_at} className="text-gray-500">
                              Updated {new Date(page.updated_at).toLocaleDateString()}
                            </time>
                          </>
                        )}
                      </div>
                    )}
                  </header>

                  {/* Page Content */}
                  <div className="prose prose-lg prose-gray max-w-none">
                    <div 
                      className="content-area space-y-6 text-gray-700 leading-relaxed"
                      style={{
                        lineHeight: '1.8',
                        fontSize: '16px'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: formatContent(page.content) 
                      }}
                    />
                  </div>
                </article>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default DynamicPage;