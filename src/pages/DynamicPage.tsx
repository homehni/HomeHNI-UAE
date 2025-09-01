import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SectionRenderer } from '@/components/admin/page-management/SectionRenderer';
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

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<ContentPage | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!slug) {
        setError('Page not found');
        setLoading(false);
        return;
      }

      try {
        // Fetch page details
        const { data: pageData, error: pageError } = await supabase
          .from('content_pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          setError('Page not found');
          setLoading(false);
          return;
        }

        setPage(pageData);

        // Fetch page sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_id', pageData.id)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (sectionsError) {
          console.error('Error fetching sections:', sectionsError);
        } else {
          setSections(sectionsData || []);
        }
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">{error || 'Page not found'}</p>
          <a 
            href="/" 
            className="inline-block bg-brand-red text-white px-6 py-3 rounded-lg hover:bg-brand-red-dark transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

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
        <link rel="canonical" href={`${window.location.origin}/${slug}`} />
      </Helmet>

      <div className="min-h-screen">
        {/* Page Header (optional) */}
        {page.content?.description && (
          <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
              <div 
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: page.content.description }}
              />
            </div>
          </div>
        )}

        {/* Page Sections */}
        <div>
          {sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>

        {/* Empty State */}
        {sections.length === 0 && (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{page.title}</h2>
            <p className="text-gray-600">This page is under construction.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DynamicPage;