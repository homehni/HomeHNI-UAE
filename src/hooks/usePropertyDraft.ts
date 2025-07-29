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
    const updatedDraft = { ...draft, ...draftData, user_id: user.id, status: 'draft' as const };
    
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
      setDraft(updatedDraft as PropertyDraft);
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

  const submitDraft = async (): Promise<boolean> => {
    if (!user?.id || !draft?.id) return false;

    try {
      // Mark draft as submitted
      const { error: draftError } = await supabase
        .from('property_drafts')
        .update({ status: 'submitted' })
        .eq('id', draft.id)
        .eq('user_id', user.id);

      if (draftError) throw draftError;

      // Create property record
      const propertyData = {
        user_id: user.id,
        title: draft.title || '',
        property_type: draft.property_type || '',
        listing_type: draft.listing_type || 'sale',
        bhk_type: draft.bhk_type || '',
        bathrooms: draft.bathrooms || 0,
        balconies: draft.balconies || 0,
        super_area: draft.super_area || 0,
        carpet_area: draft.carpet_area || 0,
        expected_price: draft.expected_price || 0,
        state: draft.state || '',
        city: draft.city || '',
        locality: draft.locality || '',
        pincode: draft.pincode || '',
        description: draft.description || '',
        images: draft.images || [],
        videos: draft.videos || [],
        availability_type: 'immediate',
        status: 'active'
      };

      const { error: propertyError } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (propertyError) throw propertyError;

      // Clear local storage and draft state
      localStorage.removeItem(`propertyDraft_${user.id}`);
      setDraft(null);
      
      return true;
    } catch (error) {
      console.error('Error submitting draft:', error);
      return false;
    }
  };

  return {
    draft,
    isLoading,
    isSaving,
    saveDraft,
    clearDraft,
    loadDraft,
    submitDraft
  };
};