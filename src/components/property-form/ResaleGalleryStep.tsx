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
  images: z.array(z.any()).min(3, 'Minimum 3 images required').max(15, 'Maximum 15 images allowed'),
  video: z.any().optional(),
});

interface ResaleGalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: PropertyGallery) => void;
  onBack: () => void;
}

export const ResaleGalleryStep: React.FC<ResaleGalleryStepProps> = ({
  initialData = {},
  onNext,
  onBack,
}) => {
  const form = useForm<PropertyGallery>({
    resolver: zodResolver(resaleGallerySchema),
    defaultValues: {
      images: initialData.images || [],
      video: initialData.video,
    },
  });

  const onSubmit = (data: PropertyGallery) => {
    onNext(data);
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Property Photos & Videos</h2>
          <p className="text-muted-foreground">Add photos to get 5X more responses from potential buyers</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-6">
                      {/* Photo Tips */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <ImageIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Photo Tips for Better Response</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Take photos during good lighting (preferably daylight)</li>
                              <li>• Include living room, bedrooms, kitchen, and bathrooms</li>
                              <li>• Capture the balcony and external building view</li>
                              <li>• Show amenities like parking, security, or garden areas</li>
                              <li>• Avoid blurry or dark images</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Image Upload Component */}
                      <ImageUpload
                        images={field.value || []}
                        onImagesChange={field.onChange}
                        maxImages={15}
                        minImages={3}
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

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="bg-muted text-muted-foreground">
                Back
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};