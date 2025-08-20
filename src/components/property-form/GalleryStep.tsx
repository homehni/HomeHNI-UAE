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
  currentStep = 5,
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

  const steps = [
    { number: 1, title: "Property Details", icon: Home, active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: "Location Details", icon: MapPin, active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: "Rental Details", icon: Building, active: currentStep === 3, completed: currentStep > 3 },
    { number: 4, title: "Amenities", icon: Sparkles, active: currentStep === 4, completed: currentStep > 4 },
    { number: 5, title: "Photos & Videos", icon: Camera, active: currentStep === 5, completed: currentStep > 5 },
    { number: 6, title: "Additional Info", icon: FileText, active: currentStep === 6, completed: currentStep > 6 },
    { number: 7, title: "Schedule", icon: Calendar, active: currentStep === 7, completed: currentStep > 7 },
    { number: 8, title: "Preview & Submit", icon: Phone, active: currentStep === 8, completed: currentStep > 8 },
  ];

  return (
    <div className="flex">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-52 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6">
          <nav className="space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    step.active 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                      : step.completed 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-gray-500'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.active 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : step.completed 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 bg-white'
                  }`}>
                    {step.completed ? (
                      <span className="text-xs">✓</span>
                    ) : (
                      <span className="text-xs">{step.number}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.title}</div>
                  </div>
                </div>
              );
            })}
          </nav>
          
          {/* Help Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm text-gray-900 mb-2">Need Help?</h3>
            <p className="text-xs text-gray-600 mb-3">
              Contact our support team for assistance with your property listing.
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs">
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-semibold text-primary mb-6">Photos & Videos</h1>
            
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
          </div>
        </div>
      </div>
    </div>
  );
};