import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyDraft } from '@/types/propertyDraft';
import { useAuth } from '@/contexts/AuthContext';

export const usePropertyDraft = () => {
  const [draft, setDraft] = useState<PropertyDraft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Load existing draft on mount
  useEffect(() => {
    if (user?.id) {
      loadDraft();
    }
  }, [user?.id]);

  const loadDraft = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setDraft(data as PropertyDraft);
      } else {
        // Try to load from localStorage as fallback
        const localDraft = localStorage.getItem(`propertyDraft_${user.id}`);
        if (localDraft) {
          setDraft(JSON.parse(localDraft));
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      // Try localStorage fallback
      const localDraft = localStorage.getItem(`propertyDraft_${user.id}`);
      if (localDraft) {
        setDraft(JSON.parse(localDraft));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async (draftData: Partial<PropertyDraft>) => {
    if (!user?.id) return;

    setIsSaving(true);
    const updatedDraft = { ...draft, ...draftData, user_id: user.id };
    
    try {
      // Save to localStorage first (immediate backup)
      localStorage.setItem(`propertyDraft_${user.id}`, JSON.stringify(updatedDraft));
      
      // Save to Supabase
      if (draft?.id) {
        // Update existing draft
        const { data, error } = await supabase
          .from('property_drafts')
          .update(updatedDraft)
          .eq('id', draft.id)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        setDraft(data as PropertyDraft);
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('property_drafts')
          .insert([updatedDraft])
          .select()
          .single();
        
        if (error) throw error;
        setDraft(data as PropertyDraft);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      // At least we have localStorage backup
      setDraft(updatedDraft);
    } finally {
      setIsSaving(false);
    }
  };

  const clearDraft = async () => {
    if (!user?.id) return;

    try {
      if (draft?.id) {
        await supabase
          .from('property_drafts')
          .delete()
          .eq('id', draft.id)
          .eq('user_id', user.id);
      }
      
      localStorage.removeItem(`propertyDraft_${user.id}`);
      setDraft(null);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  return {
    draft,
    isLoading,
    isSaving,
    saveDraft,
    clearDraft,
    loadDraft
  };
};