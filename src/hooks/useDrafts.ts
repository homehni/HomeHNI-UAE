import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyDraft } from '@/types/propertyDraft';
import { useAuth } from '@/contexts/AuthContext';

export const useDrafts = () => {
  const [drafts, setDrafts] = useState<PropertyDraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadDrafts = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_drafts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDrafts((data || []) as PropertyDraft[]);
    } catch (error) {
      console.error('Error loading drafts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDraft = async (draftId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('property_drafts')
        .delete()
        .eq('id', draftId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Remove from local state
      setDrafts(prev => prev.filter(draft => draft.id !== draftId));
      
      // Also remove from localStorage if it exists
      localStorage.removeItem(`propertyDraft_${user.id}`);
      
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDrafts();
    }
  }, [user?.id]);

  return {
    drafts,
    isLoading,
    loadDrafts,
    deleteDraft
  };
};