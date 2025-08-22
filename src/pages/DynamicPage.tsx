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
              </article>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default DynamicPage;