import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CategorizedImageUpload } from './CategorizedImageUpload';
import { VideoUpload } from './VideoUpload';
import { PropertyGallery } from '@/types/property';

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
  console.log('🖼️ ResaleGalleryStep rendered with initialData:', initialData);
  console.log('🖼️ ResaleGalleryStep initialData.categorizedImages:', initialData.categorizedImages);
  const form = useForm({
    resolver: zodResolver(resaleGallerySchema),
    defaultValues: {
      images: (() => {
        // If categorizedImages exists, use it as the source of truth
        if (initialData.categorizedImages) {
          return {
            bathroom: initialData.categorizedImages.bathroom || [],
            bedroom: initialData.categorizedImages.bedroom || [],
            hall: initialData.categorizedImages.hall || [],
            kitchen: initialData.categorizedImages.kitchen || [],
            frontView: initialData.categorizedImages.frontView || [],
            balcony: initialData.categorizedImages.balcony || [],
            others: initialData.categorizedImages.others || []
          };
        }
        
        // Otherwise, fall back to empty categories (with legacy images in 'others')
        return {
          bathroom: [] as any[],
          bedroom: [] as any[],
          hall: [] as any[],
          kitchen: [] as any[],
          frontView: [] as any[],
          balcony: [] as any[],
          others: Array.isArray(initialData.images) ? (initialData.images as any[]) : []
        };
      })(),
      video: initialData.video
    }
  });

  // Local image state to ensure persistence independent of RHF
  type CategorizedImagesState = {
    bathroom: File[];
    bedroom: File[];
    hall: File[];
    kitchen: File[];
    frontView: File[];
    balcony: File[];
    others: File[];
  };

  const initialImagesState: CategorizedImagesState = (() => {
    console.log('🖼️ ResaleGalleryStep initialImagesState - initialData.categorizedImages:', initialData.categorizedImages);
    
    // Filter out non-File objects (URLs, etc.) to prevent crashes
    const filterValidFiles = (items: any[]): File[] => {
      return items.filter(item => item instanceof File);
    };
    
    if (initialData.categorizedImages) {
      return {
        bathroom: filterValidFiles(initialData.categorizedImages.bathroom || []),
        bedroom: filterValidFiles(initialData.categorizedImages.bedroom || []),
        hall: filterValidFiles(initialData.categorizedImages.hall || []),
        kitchen: filterValidFiles(initialData.categorizedImages.kitchen || []),
        frontView: filterValidFiles(initialData.categorizedImages.frontView || []),
        balcony: filterValidFiles(initialData.categorizedImages.balcony || []),
        others: filterValidFiles(initialData.categorizedImages.others || [])
      };
    }
    return {
      bathroom: [],
      bedroom: [],
      hall: [],
      kitchen: [],
      frontView: [],
      balcony: [],
      others: Array.isArray(initialData.images) ? filterValidFiles(initialData.images as any) : []
    };
  })();

  const [imagesState, setImagesState] = useState<CategorizedImagesState>(initialImagesState);

  // Keep RHF in sync when local state changes
  useEffect(() => {
    form.setValue('images', imagesState as any, { shouldDirty: true });
  }, [imagesState, form]);

  // Check if we're in edit mode by looking for existing property data
  const isEditMode = (window as any).editingPropertyData !== undefined;
  const handleFormSubmit = (_data: ResaleGalleryFormData) => {
    // Build from local state to avoid RHF sync timing issues
    const allImages = [
      ...imagesState.bathroom,
      ...imagesState.bedroom,
      ...imagesState.hall,
      ...imagesState.kitchen,
      ...imagesState.frontView,
      ...imagesState.balcony,
      ...imagesState.others
    ];
    const galleryData: PropertyGallery = {
      images: allImages,
      categorizedImages: imagesState as any,
      video: form.getValues('video')
    };
    onNext(galleryData);
  };
  const handleSubmitProperty = () => {
    // Build from local state to avoid RHF sync timing issues
    const allImages = [
      ...imagesState.bathroom,
      ...imagesState.bedroom,
      ...imagesState.hall,
      ...imagesState.kitchen,
      ...imagesState.frontView,
      ...imagesState.balcony,
      ...imagesState.others
    ];

    const galleryData: PropertyGallery = {
      images: allImages,
      categorizedImages: imagesState as any,
      video: form.getValues('video')
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
          <h2 className="text-2xl mb-6 font-semibold text-[#ef4444]">Property Photos & Videos</h2>
        </div>

        <Form {...form}>
          <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField control={form.control} name="images" render={({
            field
          }) => <FormItem>
                  <FormControl>
                    <div className="space-y-6">
                      {/* Categorized Image Upload Component */}
                      <CategorizedImageUpload
                        images={imagesState as any}
                        onImagesChange={(imgs) => setImagesState(imgs as any)}
                        maxImagesPerCategory={5}
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
