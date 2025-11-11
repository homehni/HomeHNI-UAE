import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CMSElement {
  id: string;
  element_key: string;
  element_type: string;
  title?: string;
  content: any;
  images?: string[];
  is_active?: boolean;
}

export const useCMSContent = (elementKey: string) => {
  const [content, setContent] = useState<CMSElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

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
        setLastUpdate(Date.now());
      } catch (error) {
        console.error('Error fetching CMS content:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchContent();

    // Set up real-time subscription for this specific element
    const channel = supabase
      .channel(`cms-content-${elementKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_elements',
          filter: `element_key=eq.${elementKey}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newContent = payload.new as CMSElement;
            if (newContent.is_active) {
              setContent(newContent);
              setLastUpdate(Date.now());
            } else {
              setContent(null);
            }
          } else if (payload.eventType === 'DELETE') {
            setContent(null);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error(`Channel error for ${elementKey}, falling back to polling`);
          // Fallback to polling if real-time fails
          const pollInterval = setInterval(fetchContent, 5000); // Poll every 5 seconds
          return () => clearInterval(pollInterval);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [elementKey]);

  // Force refresh function for manual cache invalidation
  const refreshContent = () => {
    setLastUpdate(Date.now());
  };

  return { content, loading, lastUpdate, refreshContent };
};
