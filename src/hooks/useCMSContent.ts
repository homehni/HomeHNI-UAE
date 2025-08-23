import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CMSElement {
  id: string;
  element_key: string;
  element_type: string;
  title?: string;
  content: any;
  images?: string[];
}

export const useCMSContent = (elementKey: string) => {
  const [content, setContent] = useState<CMSElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content_elements')
          .select('*')
          .eq('element_key', elementKey)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.error('Error fetching CMS content:', error);
        }
        setContent(data);
      } catch (error) {
        console.error('Error fetching CMS content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [elementKey]);

  return { content, loading };
};