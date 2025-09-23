import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
        <div className="text-left mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-2">
            Upload photos & videos
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <ImageUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
            maxImages={20}
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

        {/* Action Buttons - Removed, using only sticky buttons */}
      </form>
    </div>
  </div>
  );
}