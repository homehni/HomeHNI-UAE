import { supabase } from '@/integrations/supabase/client';

export interface ContentElement {
  id: string;
  element_type: string;
  element_key: string;
  title?: string;
  content: any;
  images?: string[];
  sort_order: number;
  is_active: boolean;
  page_location?: string;
  section_location?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const contentElementsService = {
  // Get all content elements for a specific page/section
  async getContentElements(pageLocation?: string, sectionLocation?: string) {
    let query = supabase
      .from('content_elements')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (pageLocation) {
      query = query.eq('page_location', pageLocation);
    }
    
    if (sectionLocation) {
      query = query.eq('section_location', sectionLocation);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as ContentElement[];
  },

  // Get all content elements for admin
  async getAllContentElements() {
    const { data, error } = await supabase
      .from('content_elements')
      .select('*')
      .order('page_location', { ascending: true })
      .order('section_location', { ascending: true })
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data as ContentElement[];
  },

  // Create new content element
  async createContentElement(element: Omit<ContentElement, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('content_elements')
      .insert(element)
      .select()
      .single();
    
    if (error) throw error;
    return data as ContentElement;
  },

  // Update content element
  async updateContentElement(id: string, updates: Partial<ContentElement>) {
    const { data, error } = await supabase
      .from('content_elements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ContentElement;
  },

  // Delete content element
  async deleteContentElement(id: string) {
    const { error } = await supabase
      .from('content_elements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get featured properties for homepage
  async getFeaturedProperties() {
    const { data, error } = await supabase
      .from('content_elements')
      .select('*')
      .eq('page_location', 'homepage')
      .eq('section_location', 'featured_properties')
      .eq('element_type', 'featured_property')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    return data as ContentElement[];
  },

  // Get section header content
  async getSectionContent(pageLocation: string, sectionLocation: string, elementKey: string) {
    const { data, error } = await supabase
      .from('content_elements')
      .select('*')
      .eq('page_location', pageLocation)
      .eq('section_location', sectionLocation)
      .eq('element_key', elementKey)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) return null;
    return data as ContentElement | null;
  }
};