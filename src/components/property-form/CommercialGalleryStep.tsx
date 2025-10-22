import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CommercialCategorizedImageUpload } from './CommercialCategorizedImageUpload';
import { VideoUpload } from './VideoUpload';
import { PropertyGallery } from '@/types/property';
import { ProgressIndicator } from './ProgressIndicator';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone } from 'lucide-react';

// Define a local type for our form data (commercial properties)
type CommercialGalleryFormData = {
  images: {
    frontView: File[];
    interiorView: File[];
    others: File[];
  };
  video?: File;
};

const commercialGallerySchema = z.object({
  images: z.object({
    frontView: z.array(z.any()).default([]),
    interiorView: z.array(z.any()).default([]),
    others: z.array(z.any()).default([])
  }),
  video: z.any().optional()
});

interface CommercialGalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: PropertyGallery) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const CommercialGalleryStep: React.FC<CommercialGalleryStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep = 6,
  totalSteps = 8,
  onSubmit,
  isSubmitting = false
}) => {
  const form = useForm({
    resolver: zodResolver(commercialGallerySchema),
    defaultValues: {
      images: initialData.categorizedImages ? {
        frontView: initialData.categorizedImages.frontView || [],
        interiorView: initialData.categorizedImages.interiorView || [],
        others: initialData.categorizedImages.others || []
      } : (initialData as any).categorized_images ? {
        frontView: (initialData as any).categorized_images.frontView || [],
        interiorView: (initialData as any).categorized_images.interiorView || [],
        others: (initialData as any).categorized_images.others || Array.isArray(initialData.images) ? initialData.images : []
      } : {
        frontView: [],
        interiorView: [],
        others: Array.isArray(initialData.images) ? initialData.images : []
      },
      video: initialData.video
    }
  });

  // Check if we're in edit mode by looking for existing property data
  const isEditMode = (window as any).editingPropertyData !== undefined;
  
  const handleFormSubmit = (data: any) => {
    // Convert categorized images to flat array for backward compatibility
    const allImages = [...data.images.frontView, ...data.images.interiorView, ...data.images.others];
    const propertyGalleryData: PropertyGallery = {
      images: allImages,
      categorizedImages: {
        ...data.images,
        // Set empty arrays for residential categories for compatibility
        bathroom: [],
        bedroom: [],
        hall: [],
        kitchen: [],
        balcony: []
      },
      video: data.video
    };
    onNext(propertyGalleryData);
  };

  const handleSubmitProperty = () => {
    // First, capture the current form data and update the parent form state
    const currentFormData = form.getValues();

    // Convert categorized images to flat array for backward compatibility
    const allImages = [...currentFormData.images.frontView, ...currentFormData.images.interiorView, ...currentFormData.images.others];
    const propertyGalleryData: PropertyGallery = {
      images: allImages,
      categorizedImages: {
        ...currentFormData.images,
        // Set empty arrays for residential categories for compatibility
        bathroom: [],
        bedroom: [],
        hall: [],
        kitchen: [],
        balcony: []
      } as any,
      video: currentFormData.video
    };

    // Update the parent form state with current gallery data
    onNext(propertyGalleryData);

    // Then submit the property
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8 lg:p-12 pb-16 md:pb-24 lg:pb-32">
      <Form {...form}>
        <form id="gallery-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <FormField 
            control={form.control} 
            name="images" 
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-6">
                    {/* Upload Images Title */}
                    <div>
                      <h1 className="text-2xl font-semibold text-primary mb-6 pt-4 sm:pt-6">Upload Property Images by Category</h1>
                    </div>
                        
                    {/* Commercial Categorized Image Upload Component */}
                    <CommercialCategorizedImageUpload 
                      images={field.value as any} 
                      onImagesChange={field.onChange} 
                      maxImagesPerCategory={5} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />

          {/* Video Upload */}
          <FormField 
            control={form.control} 
            name="video" 
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <VideoUpload video={field.value} onVideoChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />

        </form>
      </Form>
      
      {/* Hidden submit button for sticky bar */}
      <button type="submit" form="gallery-form" className="hidden" />
    </div>
  );
};