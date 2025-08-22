import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
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

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<ContentPage | null>(null);
  const [sections, setSections] = useState<any[]>([]);
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
          // Fetch sections for this page
          const { data: secs, error: secErr } = await supabase
            .from('page_sections')
            .select('*')
            .eq('page_id', data.id)
            .eq('is_active', true)
            .order('sort_order');
          if (secErr) {
            console.error('Error fetching sections:', secErr);
            setSections([]);
          } else {
            setSections(secs || []);
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

                {/* Page Sections */}
                {sections.length > 0 && (
                  <div className="mt-16 space-y-16">
                    {sections.map((s, idx) => (
                      <section key={s.id || idx} className="w-full" aria-label={s.section_type}>
                        {s.section_type === 'hero-search' && (
                          <div className="bg-card rounded-xl p-8 text-center shadow-sm">
                            <h2 className="text-3xl font-bold text-foreground">{s.content?.title || 'Welcome'}</h2>
                            {s.content?.subtitle && (
                              <p className="mt-2 text-muted-foreground">{s.content.subtitle}</p>
                            )}
                            <div className="mt-6 flex items-center justify-center gap-4">
                              {s.content?.primaryCTA && (
                                <a href="#search" className="inline-block px-5 py-2 rounded-md bg-primary text-primary-foreground">
                                  {s.content.primaryCTA}
                                </a>
                              )}
                              {s.content?.secondaryCTA && (
                                <a href="#post" className="inline-block px-5 py-2 rounded-md border border-input">
                                  {s.content.secondaryCTA}
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {s.section_type === 'services' && (
                          <div>
                            {s.content?.title && (
                              <h2 className="text-2xl font-semibold text-foreground mb-2">{s.content.title}</h2>
                            )}
                            {s.content?.subtitle && (
                              <p className="text-muted-foreground mb-6">{s.content.subtitle}</p>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {(s.content?.services || []).map((srv: any, i: number) => (
                                <div key={i} className="border rounded-lg p-4 bg-card">
                                  <div className="font-medium text-foreground">{srv.title}</div>
                                  {srv.description && (
                                    <p className="text-muted-foreground text-sm mt-1">{srv.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {s.section_type === 'stats' && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {(s.content?.stats || []).map((st: any, i: number) => (
                              <div key={i} className="border rounded-lg p-4 text-center bg-card">
                                <div className="text-2xl font-bold text-foreground">{st.number}</div>
                                <div className="text-muted-foreground text-sm mt-1">{st.label}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {s.section_type === 'testimonials' && (
                          <div>
                            {s.content?.title && (
                              <h2 className="text-2xl font-semibold text-foreground mb-4">{s.content.title}</h2>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(s.content?.testimonials || []).map((t: any, i: number) => (
                                <blockquote key={i} className="border rounded-lg p-4 bg-card">
                                  <p className="text-foreground">“{t.text}”</p>
                                  <footer className="mt-2 text-sm text-muted-foreground">— {t.name}{t.location ? `, ${t.location}` : ''}</footer>
                                </blockquote>
                              ))}
                            </div>
                          </div>
                        )}

                        {s.section_type === 'mobile-app' && (
                          <div className="grid md:grid-cols-2 gap-8 items-center border rounded-lg p-6 bg-card">
                            <div>
                              <h2 className="text-2xl font-semibold text-foreground">{s.content?.title || 'Mobile App'}</h2>
                              {s.content?.description && (
                                <p className="text-muted-foreground mt-2">{s.content.description}</p>
                              )}
                            </div>
                            {s.content?.appImage && (
                              <img
                                src={s.content.appImage}
                                alt={s.content?.title ? `${s.content.title} app preview` : 'App preview'}
                                loading="lazy"
                                className="w-full h-auto rounded-md"
                              />
                            )}
                          </div>
                        )}

                        {s.section_type === 'content' && s.content?.html && (
                          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: s.content.html }} />
                        )}
                      </section>
                    ))}
                  </div>
                )}

  );
};

export default DynamicPage;