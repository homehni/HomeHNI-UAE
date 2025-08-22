import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading page...</p>
        </div>
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

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {page.title}
              </h1>
              {page.page_type && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md capitalize">
                    {page.page_type}
                  </span>
                  <span>•</span>
                  <time dateTime={page.updated_at}>
                    Updated {new Date(page.updated_at).toLocaleDateString()}
                  </time>
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none">
              <div 
                className="content-area"
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(page.content) 
                }}
              />
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DynamicPage;