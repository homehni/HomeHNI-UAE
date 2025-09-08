import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CategorizedImageUpload } from './CategorizedImageUpload';
import { VideoUpload } from './VideoUpload';
import { PropertyGallery } from '@/types/property';
import { ProgressIndicator } from './ProgressIndicator';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone } from 'lucide-react';

// Define a local type for our form data
type GalleryFormData = {
  images: {
    bathroom: File[];
    bedroom: File[];
    hall: File[];
    kitchen: File[];
    frontView: File[];
    balcony: File[];
    others: File[];
  };
  video?: File;
};

const gallerySchema = z.object({
  images: z.object({
    bathroom: z.array(z.any()).default([]),
    bedroom: z.array(z.any()).default([]),
    hall: z.array(z.any()).default([]),
    kitchen: z.array(z.any()).default([]),
    frontView: z.array(z.any()).default([]),
    balcony: z.array(z.any()).default([]),
    others: z.array(z.any()).default([])
  }),
  video: z.any().optional(),
});

interface GalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: PropertyGallery) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const GalleryStep: React.FC<GalleryStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep = 6,
  totalSteps = 8,
  onSubmit,
  isSubmitting = false
}) => {
  const form = useForm({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      images: initialData.categorizedImages || {
        bathroom: [],
        bedroom: [],
        hall: [],
        kitchen: [],
        frontView: [],
        balcony: [],
        others: Array.isArray(initialData.images) ? initialData.images : []
      },
      video: initialData.video,
    },
  });

  // Check if we're in edit mode by looking for existing property data
  const isEditMode = (window as any).editingPropertyData !== undefined;

  const handleFormSubmit = (data: any) => {
    // Convert categorized images to flat array for backward compatibility
    const allImages = [
      ...data.images.bathroom,
      ...data.images.bedroom,
      ...data.images.hall,
      ...data.images.kitchen,
      ...data.images.frontView,
      ...data.images.balcony,
      ...data.images.others
    ];
    
    const propertyGalleryData: PropertyGallery = {
      images: allImages,
      categorizedImages: data.images, // Store categorized structure
      video: data.video
    };
    onNext(propertyGalleryData);
  };

  const handleSubmitProperty = () => {
    // First, capture the current form data and update the parent form state
    const currentFormData = form.getValues();
    
    // Convert categorized images to flat array for backward compatibility
    const allImages = [
      ...currentFormData.images.bathroom,
      ...currentFormData.images.bedroom,
      ...currentFormData.images.hall,
      ...currentFormData.images.kitchen,
      ...currentFormData.images.frontView,
      ...currentFormData.images.balcony,
      ...currentFormData.images.others
    ];
    
    const propertyGalleryData: PropertyGallery = {
      images: allImages,
      categorizedImages: currentFormData.images as any, // Store categorized structure
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
    <Card>
      <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-6">
                        {/* Upload Images Title */}
                        <div className="text-center">
                          <h2 className="text-xl font-semibold text-foreground mb-4">Upload Property Images by Category</h2>
                        </div>
                        
                        {/* Categorized Image Upload Component */}
                        <CategorizedImageUpload
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
                    <FormLabel>Property Video (Optional)</FormLabel>
                    <FormControl>
                      <VideoUpload
                        video={field.value}
                        onVideoChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack} className="bg-muted text-muted-foreground">
                  Back
                </Button>
                <div className="flex gap-3">
                  {isEditMode && onSubmit && (
                    <Button 
                      type="button" 
                      onClick={handleSubmitProperty}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        'Submit Property'
                      )}
                    </Button>
                  )}
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Save & Continue
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
    </Card>
  );
};