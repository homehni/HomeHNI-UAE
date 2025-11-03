import { supabase } from '@/integrations/supabase/client';

export const developerPagesService = {
  // Get a single developer page by slug
  async getDeveloperPageBySlug(slug: string) {
    const { data, error } = await supabase
      .from('developer_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching developer page:', error);
      return null;
    }

    return data;
  },

  // Get all published developer pages
  async getAllDeveloperPages() {
    const { data, error } = await supabase
      .from('developer_pages')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Error fetching developer pages:', error);
      return [];
    }

    return data;
  },

  // Get featured developer pages
  async getFeaturedDeveloperPages() {
    const { data, error } = await supabase
      .from('developer_pages')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching featured developer pages:', error);
      return [];
    }

    return data;
  },

  // Admin: Create a new developer page
  async createDeveloperPage(page: any) {
    const { data, error } = await supabase
      .from('developer_pages')
      .insert([page])
      .select()
      .single();

    if (error) {
      console.error('Error creating developer page:', error);
      throw error;
    }

    return data;
  },

  // Admin: Update a developer page
  async updateDeveloperPage(id: string, updates: any) {
    const { data, error } = await supabase
      .from('developer_pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating developer page:', error);
      throw error;
    }

    return data;
  },

  // Admin: Delete a developer page
  async deleteDeveloperPage(id: string) {
    const { error } = await supabase
      .from('developer_pages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting developer page:', error);
      throw error;
    }
  }
};
