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
    return true;
  };

  const handleImagesChange = (images: File[]) => {
    setFormData({ ...formData, images });
  };

  const handleVideoChange = (video: File | undefined) => {
    setFormData({ ...formData, video });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold text-primary">
              Upload photos & videos
            </CardTitle>
            <p className="text-center text-gray-600">
              Add photos to get 5X more responses. 90% tenants contact on properties with photos.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photos *</label>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  maxImages={20}
                  minImages={0}
                />
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Video (Optional)</label>
                <VideoUpload
                  video={formData.video}
                  onVideoChange={handleVideoChange}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack} className="px-8">
                  Back
                </Button>
                <Button type="submit" className="px-8">
                  Save & Continue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}