import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';
import { PropertyGallery } from '@/types/property';

const gallerySchema = z.object({
  images: z.array(z.any()).min(3, 'Minimum 3 images required').max(10, 'Maximum 10 images allowed'),
  video: z.any().optional(),
});

interface GalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: PropertyGallery) => void;
  onBack: () => void;
}

export const GalleryStep: React.FC<GalleryStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<PropertyGallery>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      images: initialData.images || [],
      video: initialData.video,
    },
  });

  const onSubmit = (data: PropertyGallery) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Gallery</CardTitle>
        <CardDescription>Upload photos and videos of your property</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Images Upload */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      images={field.value}
                      onImagesChange={field.onChange}
                      maxImages={10}
                      minImages={3}
                    />
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
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Next: Additional Information
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};