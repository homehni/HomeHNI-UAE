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
  // Helper function to filter out non-File objects (URLs from resumed drafts)
  const filterValidFiles = (files: any[]): File[] => {
    return files.filter(file => file instanceof File);
  };

  // Filter initialData to only include valid File objects
  const filteredInitialData = {
    ...initialData,
    images: initialData?.images ? filterValidFiles(initialData.images) : []
  };

  console.log('PgHostelGalleryStep initialData:', initialData);
  console.log('PgHostelGalleryStep initialData.images:', initialData?.images);
  console.log('PgHostelGalleryStep filtered images:', filteredInitialData.images);

  const [formData, setFormData] = useState<PgHostelGallery>({
    images: [],
    video: undefined,
    ...filteredInitialData,
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
    <div className="min-h-screen bg-background pb-32 sm:pb-24">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
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