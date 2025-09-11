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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Upload photos & videos</h1>
        <Button 
          variant="outline" 
          className="bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
        >
          <Phone className="h-4 w-4 mr-2" />
          Upload through phone
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Main Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Add photos to get 5X more responses.</h3>
              <p className="text-gray-600 mb-6">90% tenants contact on properties with photos.</p>
              
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Button 
                        type="button"
                        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3"
                      >
                        Add Photos
                      </Button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="bg-gray-500 text-white text-sm px-3 py-1 rounded-full">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Alternative Upload Options */}
          <div className="text-center">
            <h3 className="text-lg font-medium mb-6">We can upload photos on your behalf</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* WhatsApp Option */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-medium mb-2">Whatsapp us on</h4>
                <p className="text-lg font-semibold text-green-600">0-9241-700-000</p>
              </div>

              {/* Email Option */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mx-auto mb-4">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <h4 className="font-medium mb-2">Email to</h4>
                <p className="text-lg font-semibold text-orange-600">photos@nobroker.in</p>
              </div>
            </div>
          </div>

          {/* Add Videos Section */}
          <div className="text-center pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-1a1 1 0 011-1v4a1 1 0 01-1 1H7a1 1 0 01-1-1V9a1 1 0 011-1h6z" clipRule="evenodd"/>
              </svg>
            </div>
            
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="bg-teal-600 text-white border-teal-600 hover:bg-teal-700 px-8 py-3"
                    >
                      Add Videos
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
              Back
            </Button>
            <div className="flex gap-3">
              {isEditMode && onSubmit && (
                <Button 
                  type="button" 
                  onClick={handleSubmitProperty}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white h-12 px-8"
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
              <Button type="submit" className="h-12 px-8 bg-red-500 hover:bg-red-600 text-white">
                Save & Continue
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};