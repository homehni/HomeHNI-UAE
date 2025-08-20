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
import { ProgressIndicator } from './ProgressIndicator';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone } from 'lucide-react';

const gallerySchema = z.object({
  images: z.array(z.any()).min(3, 'Minimum 3 images required').max(10, 'Maximum 10 images allowed'),
  video: z.any().optional(),
});

interface GalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: PropertyGallery) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const GalleryStep: React.FC<GalleryStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep = 6,
  totalSteps = 8
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
      <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-6">
                        {/* Upload Images Title */}
                        <div className="text-center">
                          <h2 className="text-xl font-semibold text-foreground mb-4">Upload Images * (Min 3, Max 10)</h2>
                        </div>
                        
                        {/* Image Upload Component */}
                        <ImageUpload
                          images={field.value || []}
                          onImagesChange={field.onChange}
                          maxImages={10}
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
        </CardContent>
    </Card>
  );
};