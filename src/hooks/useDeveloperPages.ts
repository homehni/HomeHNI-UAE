import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DeveloperPage {
  id: string;
  slug: string;
  company_name: string;
  logo_url: string | null;
  tagline: string | null;
  description: string | null;
  headquarters: string | null;
  founded_year: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  hero_cta_text: string | null;
  highlights: string | null;
  about_title: string | null;
  about_content: string | null;
  about_images: any | null;
  video_section_title: string | null;
  video_section_subtitle: string | null;
  video_url: string | null;
  video_thumbnail_url: string | null;
  stats: any | null;
  specializations: any | null;
  key_projects: any | null;
  awards: any | null;
  gallery_images: any | null;
  floor_plans: any | null;
  amenities: any | null;
  location_title: string | null;
  location_description: string | null;
  location_map_url: string | null;
  location_highlights: any | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_website: string | null;
  contact_address: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export const useDeveloperPages = () => {
  return useQuery({
    queryKey: ["developer-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("developer_pages")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as DeveloperPage[];
    },
  });
};

export const useDeveloperPage = (slug: string) => {
  return useQuery({
    queryKey: ["developer-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("developer_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle(); // Use maybeSingle to avoid throwing on no results

      if (error) throw error;
      return data as DeveloperPage | null;
    },
    enabled: !!slug,
  });
};
