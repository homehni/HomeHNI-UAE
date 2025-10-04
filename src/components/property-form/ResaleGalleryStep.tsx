import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';
import { PropertyGallery } from '@/types/property';
import { Camera, ImageIcon } from 'lucide-react';
const resaleGallerySchema = z.object({
  images: z.object({
    bathroom: z.array(z.any()).default([]),
    bedroom: z.array(z.any()).default([]),
    hall: z.array(z.any()).default([]),
    kitchen: z.array(z.any()).default([]),
    frontView: z.array(z.any()).default([]),
    balcony: z.array(z.any()).default([]),
    others: z.array(z.any()).default([])
  }),
  video: z.any().optional()
});
type ResaleGalleryFormData = z.infer<typeof resaleGallerySchema>;
interface ResaleGalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: PropertyGallery) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  formId?: string;
}
export const ResaleGalleryStep: React.FC<ResaleGalleryStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  onSubmit,
  isSubmitting = false,
  formId
}) => {
  const form = useForm({
    resolver: zodResolver(resaleGallerySchema),
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
      video: initialData.video
    }
  });

  // Check if we're in edit mode by looking for existing property data
  const isEditMode = (window as any).editingPropertyData !== undefined;
  const handleFormSubmit = (data: any) => {
    // Convert categorized images to flat array for backward compatibility
    const allImages = [...data.images.bathroom, ...data.images.bedroom, ...data.images.hall, ...data.images.kitchen, ...data.images.frontView, ...data.images.balcony, ...data.images.others];
    const galleryData: PropertyGallery = {
      images: allImages,
      categorizedImages: data.images,
      video: data.video
    };
    onNext(galleryData);
  };
  const handleSubmitProperty = () => {
    // First, capture the current form data and update the parent form state
    const currentFormData = form.getValues();
    
    // Convert categorized images to flat array for backward compatibility
    const allImages = [...currentFormData.images.bathroom, ...currentFormData.images.bedroom, ...currentFormData.images.hall, ...currentFormData.images.kitchen, ...currentFormData.images.frontView, ...currentFormData.images.balcony, ...currentFormData.images.others];
    const galleryData: PropertyGallery = {
      images: allImages,
      categorizedImages: currentFormData.images as any,
      video: currentFormData.video
    };

    // Update the parent form state with current gallery data
    onNext(galleryData);

    // Then submit the property
    if (onSubmit) {
      onSubmit();
    }
  };
  return <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-4 md:p-8 lg:p-12">
        <div className="text-left mb-8">
          <h2 className="text-2xl mb-6 font-semibold text-red-600">Property Photos & Videos</h2>
        </div>

        <Form {...form}>
          <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField control={form.control} name="images" render={({
            field
          }) => <FormItem>
                  <FormControl>
                    <div className="space-y-6">

                      {/* Image Upload Component */}
                      <ImageUpload 
                        images={field.value as any} 
                        onImagesChange={field.onChange} 
                        maxImages={35}
                        showCategories={true}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* Video Upload */}
            <FormField control={form.control} name="video" render={({
            field
          }) => <FormItem>
                  <FormLabel>Property Video (Optional)</FormLabel>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <div className="text-amber-600 mt-1">💡</div>
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Pro Tip: Add a property video</p>
                        <p className="text-sm text-amber-700">Videos help buyers get a better feel of your property and increase serious inquiries</p>
                      </div>
                    </div>
                  </div>
                  <FormControl>
                    <VideoUpload video={field.value} onVideoChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <div className="flex justify-between pt-6" style={{
            visibility: 'hidden'
          }}>
              <Button type="button" variant="outline" onClick={onBack} className="bg-muted text-muted-foreground">
                Back
              </Button>
              <div className="flex gap-3">
                {isEditMode && onSubmit && <Button type="button" onClick={handleSubmitProperty} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                    {isSubmitting ? <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Submitting...</span>
                      </div> : 'Submit Property'}
                  </Button>}
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Save & Continue
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>;
};