import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';
import { PropertyGallery } from '@/types/property';

interface CommercialSaleGalleryStepProps {
  initialData?: Partial<PropertyGallery>;
  onNext: (data: Partial<PropertyGallery>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialSaleGalleryStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSaleGalleryStepProps) => {
  const [images, setImages] = useState<File[]>(initialData?.images || []);
  const [video, setVideo] = useState<File | undefined>(initialData?.video);

  const handleNext = () => {
    onNext({
      images,
      video
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">Upload Photos & Videos</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <div>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={20}
              showCategories={false}
            />
          </div>

          <div>
            <VideoUpload
              video={video}
              onVideoChange={setVideo}
            />
          </div>
        </div>
      </form>

      {/* Navigation Buttons - Removed, using sticky buttons instead */}
    </div>
  );
};