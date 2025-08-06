import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';

interface PgHostelGallery {
  images: File[];
  video?: File;
}

interface PgHostelGalleryStepProps {
  initialData?: Partial<PgHostelGallery>;
  onNext: (data: PgHostelGallery) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelGalleryStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps 
}: PgHostelGalleryStepProps) {
  const [formData, setFormData] = useState<PgHostelGallery>({
    images: [],
    video: undefined,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return formData.images.length > 0;
  };

  const handleImagesChange = (images: File[]) => {
    setFormData({ ...formData, images });
  };

  const handleVideoChange = (video: File | undefined) => {
    setFormData({ ...formData, video });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Gallery</h2>
        <p className="text-muted-foreground">Add photos and videos of your PG/Hostel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Images & Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Property Images *
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload high-quality images of rooms, common areas, amenities, and exterior
                </p>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  maxImages={20}
                  minImages={1}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Property Video (Optional)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add a video tour to give potential residents a better view of your PG/Hostel
                </p>
                <VideoUpload
                  video={formData.video}
                  onVideoChange={handleVideoChange}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Photography Tips</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Take photos in good lighting, preferably during daytime</li>
                <li>• Show all available room types and common areas</li>
                <li>• Include photos of kitchen, bathrooms, and study areas</li>
                <li>• Capture the building exterior and nearby landmarks</li>
                <li>• Ensure images are clear and showcase the cleanliness</li>
              </ul>
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" disabled={!isFormValid()}>
                Save & Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}