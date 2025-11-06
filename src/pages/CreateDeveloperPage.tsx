import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeveloperPageForm } from "@/components/developer-form/DeveloperPageForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { uploadFilesToStorage } from "@/services/fileUploadService";

export default function CreateDeveloperPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate URL-friendly slug and ensure uniqueness
  const slugify = (str: string) => str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const ensureUniqueSlug = async (base: string) => {
    let candidate = base;
    let counter = 1;
    // Keep trying until no record with this slug exists
    // Using maybeSingle() so we don't throw when not found
    while (true) {
      const { data, error } = await supabase
        .from('developer_pages')
        .select('id')
        .eq('slug', candidate)
        .maybeSingle();

      if (!data) return candidate; // slug is free
      counter += 1;
      candidate = `${base}-${counter}`;
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to create a developer page",
          variant: "destructive"
        });
        return;
      }

      // Upload files to storage
      const uploadedImages: Record<string, string[]> = {};
      
      // Upload logo
      let logoUrl = null;
      if (formData.logo) {
        const [uploaded] = await uploadFilesToStorage([formData.logo], 'developer-logos', user.id);
        logoUrl = uploaded.url;
      }

      // Upload hero image
      let heroImageUrl = null;
      if (formData.heroImage) {
        const [uploaded] = await uploadFilesToStorage([formData.heroImage], 'developer-heroes', user.id);
        heroImageUrl = uploaded.url;
      }

      // Upload hero video
      let heroVideoUrl = null;
      if (formData.heroVideo) {
        const [uploaded] = await uploadFilesToStorage([formData.heroVideo], 'developer-videos', user.id);
        heroVideoUrl = uploaded.url;
      }

      // Upload about images
      const aboutImages = formData.aboutImages && formData.aboutImages.length > 0
        ? await uploadFilesToStorage(formData.aboutImages, 'developer-about', user.id)
        : [];

      // Upload gallery images
      const galleryImages = formData.galleryImages && formData.galleryImages.length > 0
        ? await uploadFilesToStorage(formData.galleryImages, 'developer-gallery', user.id)
        : [];

      // Upload video
      let videoUrl = null;
      let videoThumbnailUrl = null;
      if (formData.video) {
        const [uploaded] = await uploadFilesToStorage([formData.video], 'developer-videos', user.id);
        videoUrl = uploaded.url;
      }
      if (formData.videoThumbnail) {
        const [uploaded] = await uploadFilesToStorage([formData.videoThumbnail], 'developer-thumbnails', user.id);
        videoThumbnailUrl = uploaded.url;
      }

      // Create unique slug from company name
      const baseSlug = slugify(formData.companyName || 'developer');
      const slug = await ensureUniqueSlug(baseSlug);

      // Insert developer page with retry on duplicate slug
      let finalSlug = slug;
      const maxRetries = 5;
      let attempt = 0;
      let insertError: any = null;
      let insertData: any = null;

      while (attempt < maxRetries) {
        const { data, error } = await supabase
          .from('developer_pages')
          .insert({
            company_name: formData.companyName,
            slug: finalSlug,
            logo_url: logoUrl,
            tagline: formData.tagline,
            description: formData.description,
            headquarters: formData.headquarters,
            founded_year: formData.foundedYear,
            hero_title: formData.heroTitle,
            hero_subtitle: formData.heroSubtitle,
            hero_image_url: heroImageUrl,
            hero_video_url: heroVideoUrl,
            hero_cta_text: formData.heroCTAText,
            highlights: formData.highlights,
            about_title: formData.aboutTitle,
            about_content: formData.aboutContent,
            about_images: aboutImages.map(img => img.url),
            video_section_title: formData.videoSectionTitle,
            video_section_subtitle: formData.videoSectionSubtitle,
            video_url: videoUrl,
            video_thumbnail_url: videoThumbnailUrl,
            stats: formData.stats,
            specializations: formData.specializations,
            key_projects: formData.keyProjects,
            awards: formData.awards,
            gallery_images: galleryImages.map(img => img.url),
            floor_plans: formData.floorPlans,
            amenities: formData.amenities,
            location_title: formData.locationTitle,
            location_description: formData.locationDescription,
            location_map_url: formData.locationMapUrl,
            location_highlights: formData.locationHighlights,
            contact_phone: formData.contactPhone,
            contact_email: formData.contactEmail,
            contact_website: formData.contactWebsite,
            contact_address: formData.contactAddress,
            meta_title: formData.metaTitle,
            meta_description: formData.metaDescription,
            meta_keywords: formData.metaKeywords,
            is_published: formData.isPublished !== false, // Default to true unless explicitly set to false
            created_by: user.id
          })
          .select()
          .single();

        if (!error) {
          insertData = data;
          break;
        }

        // Handle duplicate slug constraint violation (23505)
        if (error?.code === '23505' || /slug/.test(error?.message || '')) {
          attempt += 1;
          finalSlug = await ensureUniqueSlug(baseSlug);
          continue;
        }

        insertError = error;
        break;
      }

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Developer page created successfully",
        variant: "default"
      });

      navigate(`/developer/${finalSlug}`);
    } catch (error: any) {
      console.error('Error creating developer page:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create developer page",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Developer Showcase Page</h1>
            <p className="text-muted-foreground">
              Create a comprehensive showcase page for your real estate development company. 
              This page will display your projects, achievements, and contact information in a professional layout.
            </p>
          </div>
          <DeveloperPageForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
