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
    if (images.length < 3) {
      alert('Please upload at least 3 images');
      return;
    }
    
    onNext({
      images,
      video
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Gallery</h2>
        <p className="text-gray-600">Upload photos and videos of your commercial property</p>
        <div className="mt-4 text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Property Images *</h3>
          <p className="text-gray-600 mb-4">Upload at least 3 high-quality images</p>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={20}
            minImages={3}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Property Video (Optional)</h3>
          <p className="text-gray-600 mb-4">Upload a video tour of your property</p>
          <VideoUpload
            video={video}
            onVideoChange={setVideo}
          />
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
};