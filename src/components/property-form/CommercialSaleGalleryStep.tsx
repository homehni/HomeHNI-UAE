import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { CommercialCategorizedImageUpload } from './CommercialCategorizedImageUpload';
import { VideoUpload } from './VideoUpload';
import { PropertyGallery } from '@/types/property';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema for commercial sale gallery
const commercialSaleGallerySchema = z.object({
  images: z.object({
    frontView: z.array(z.any()).default([]),
    interiorView: z.array(z.any()).default([]),
    others: z.array(z.any()).default([])
  }),
  video: z.any().optional()
});

interface CommercialSaleGalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: Partial<PropertyGallery>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialSaleGalleryStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSaleGalleryStepProps) => {
  const form = useForm({
    resolver: zodResolver(commercialSaleGallerySchema),
    defaultValues: {
      images: initialData?.categorizedImages ? {
        frontView: initialData.categorizedImages.frontView || [],
        interiorView: initialData.categorizedImages.interiorView || [],
        others: initialData.categorizedImages.others || Array.isArray(initialData.images) ? initialData.images : []
      } : {
        frontView: [],
        interiorView: [],
        others: Array.isArray(initialData?.images) ? initialData.images : []
      },
      video: initialData?.video
    }
  });

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-left mb-8">
        <h1 className="text-2xl font-semibold text-red-600 mb-2 pt-6 sm:pt-6">Upload Property Images by Category</h1>
      </div>
      
      <Form {...form}>
        <form id="commercial-sale-gallery-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <FormField 
            control={form.control} 
            name="images" 
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-6">
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
      <button type="submit" form="commercial-sale-gallery-form" className="hidden" />
    </div>
  );
};