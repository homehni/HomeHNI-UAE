import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  is_published: boolean;
  page_type: string;
}

interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  content: any;
  sort_order: number;
  is_active: boolean;
}

const PagePreview: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<ContentPage | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!slug) return;

      try {
        // Fetch page data
        const { data: pageData, error: pageError } = await supabase
          .from('content_pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (pageError) throw pageError;

        setPage(pageData);

        // Fetch page sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_id', pageData.id)
          .eq('is_active', true)
          .order('sort_order');

        if (sectionsError) throw sectionsError;

        setSections(sectionsData || []);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Page not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  const renderSection = (section: PageSection) => {
    const content = section.content;
    const images = content?.images || [];

    switch (section.section_type) {
      case 'hero':
        return (
          <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
            <div className="container mx-auto px-4">
              <div 
                className="prose prose-lg max-w-4xl mx-auto text-center"
                dangerouslySetInnerHTML={{ __html: content?.html || '' }}
              />
              {images.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <img 
                    src={images[0]} 
                    alt="Hero" 
                    className="max-w-2xl w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section className="py-12">
            <div className="container mx-auto px-4">
              {content?.html && (
                <div 
                  className="prose max-w-4xl mx-auto mb-8 text-center"
                  dangerouslySetInnerHTML={{ __html: content.html }}
                />
              )}
              {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image: string, index: number) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'cta':
        return (
          <section className="bg-primary/5 py-12">
            <div className="container mx-auto px-4">
              <div 
                className="prose prose-lg max-w-4xl mx-auto text-center"
                dangerouslySetInnerHTML={{ __html: content?.html || '' }}
              />
            </div>
          </section>
        );

      case 'testimonial':
        return (
          <section className="bg-muted/50 py-12">
            <div className="container mx-auto px-4">
              <div 
                className="prose prose-lg max-w-4xl mx-auto text-center"
                dangerouslySetInnerHTML={{ __html: content?.html || '' }}
              />
            </div>
          </section>
        );

      case 'faq':
        return (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div 
                className="prose max-w-4xl mx-auto"
                dangerouslySetInnerHTML={{ __html: content?.html || '' }}
              />
            </div>
          </section>
        );

      default:
        return (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div 
                className="prose max-w-4xl mx-auto"
                dangerouslySetInnerHTML={{ __html: content?.html || '' }}
              />
              {images.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  {images.map((image: string, index: number) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Content ${index + 1}`} 
                      className="max-w-md w-full h-auto rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Marquee />
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-white">
        <Marquee />
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
            <p className="text-muted-foreground">The requested page could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{page.meta_title || page.title}</title>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
        {page.meta_keywords && <meta name="keywords" content={page.meta_keywords.join(', ')} />}
      </Helmet>
      
      <Marquee />
      <Header />
      
      <main className="pt-20">
        {/* Page Title Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 mt-4">
              {page.title}
            </h1>
            {page.meta_description && (
              <p className="max-w-3xl mx-auto text-muted-foreground">
                {page.meta_description}
              </p>
            )}
          </div>
        </section>

        {/* Rich Content from editor (always below title) */}
        {(typeof page.content === 'string' || page.content?.html || page.content?.description) && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div 
                className="prose prose-lg max-w-4xl mx-auto text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: typeof page.content === 'string' ? page.content : (page.content?.html || page.content?.description || '') }}
              />
            </div>
          </section>
        )}


        {/* Page Sections */}
        {sections.map((section) => (
          <div key={section.id}>
            {renderSection(section)}
          </div>
        ))}

        {/* Show page images if no sections */}
        {sections.length === 0 && page.content?.images && page.content.images.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {page.content.images.map((image: string, index: number) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${page.title} ${index + 1}`} 
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PagePreview;