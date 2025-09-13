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
  images: z.array(z.any()).optional(),
  video: z.any().optional(),
});

type ResaleGalleryFormData = z.infer<typeof resaleGallerySchema>;

interface ResaleGalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: PropertyGallery) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const ResaleGalleryStep: React.FC<ResaleGalleryStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  onSubmit,
  isSubmitting = false
}) => {
  const form = useForm<ResaleGalleryFormData>({
    resolver: zodResolver(resaleGallerySchema),
    defaultValues: {
      images: initialData.images || [],
      video: initialData.video,
    },
  });

  // Check if we're in edit mode by looking for existing property data
  const isEditMode = (window as any).editingPropertyData !== undefined;

  const handleFormSubmit = (data: ResaleGalleryFormData) => {
    const galleryData: PropertyGallery = {
      images: data.images || [],
      video: data.video,
    };
    onNext(galleryData);
  };

  const handleSubmitProperty = () => {
    // First, capture the current form data and update the parent form state
    const currentFormData = form.getValues();
    
    const galleryData: PropertyGallery = {
      images: currentFormData.images || [],
      video: currentFormData.video,
    };
    
    // Update the parent form state with current gallery data
    onNext(galleryData);
    
    // Then submit the property
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Property Photos & Videos</h2>
          <p className="text-muted-foreground">Add photos to get 5X more responses from potential buyers</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-6">

                      {/* Image Upload Component */}
                      <ImageUpload
                        images={field.value || []}
                        onImagesChange={field.onChange}
                        maxImages={15}
                        minImages={0}
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
                    <VideoUpload
                      video={field.value}
                      onVideoChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
      </div>
    </div>
  );
};