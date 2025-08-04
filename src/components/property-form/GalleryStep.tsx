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

  const sidebarSteps = [
    { number: 1, title: "Owner Information", icon: Phone, completed: true },
    { number: 2, title: "Property Details", icon: Home, completed: true },
    { number: 3, title: "Location Details", icon: MapPin, completed: true },
    { number: 4, title: "Rental Details", icon: Building, completed: true },
    { number: 5, title: "Amenities", icon: Sparkles, completed: true },
    { number: 6, title: "Gallery", icon: Camera, completed: false, active: true },
    { number: 7, title: "Additional Information", icon: FileText, completed: false },
    { number: 8, title: "Schedule", icon: Calendar, completed: false },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header with Progress */}
      <div className="bg-background border-b p-4">
        <div className="max-w-7xl mx-auto">
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            completedSteps={[1, 2, 3, 4, 5]}
          />
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-64 bg-background border-r min-h-screen p-6">
          <div className="space-y-1">
            {sidebarSteps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.active 
                    ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                    : step.completed 
                    ? 'text-muted-foreground hover:bg-muted/50' 
                    : 'text-muted-foreground/60'
                }`}
              >
                <step.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
              <div className="bg-background rounded-lg border p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Upload photos & videos</h2>
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
                            {/* Instructions section */}
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                              <div className="flex flex-col items-center gap-4">
                                <div className="bg-muted/50 rounded-full p-4">
                                  <Camera className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                  <p className="text-lg font-medium">Add photos to get 5X more responses.</p>
                                  <p className="text-muted-foreground">90% tenants contact on properties with photos.</p>
                                </div>
                              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};