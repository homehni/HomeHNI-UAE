import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PropertyGallery } from '@/types/property';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';

interface GalleryForm {
  images: File[];
  video?: File;
}

interface LandPlotGalleryStepProps {
  initialData: Partial<PropertyGallery>;
  onNext: (data: GalleryForm) => void;
  onBack: () => void;
}

export const LandPlotGalleryStep: React.FC<LandPlotGalleryStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { handleSubmit, setValue, watch } = useForm<GalleryForm>({
    defaultValues: {
      images: [],
      video: undefined,
    }
  });

  const images = watch('images') || [];
  const video = watch('video');

  const handleImageChange = (files: File[]) => {
    setValue('images', files);
  };

  const handleVideoChange = (file: File | undefined) => {
    setValue('video', file);
  };

  const onSubmit = (data: GalleryForm) => {
    onNext(data);
  };

  return (
    <div className="bg-background p-4 md:p-8 lg:p-12">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-2 pt-6 sm:pt-0">
            Photos & Videos
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <ImageUpload
              images={images}
              onImagesChange={handleImageChange}
              maxImages={20}
              showCategories={false}
            />
            
            <div className="text-sm text-gray-600">
              <strong>Selected Images:</strong> {images.length} / 20
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Plot Videos (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload videos for a virtual tour of your plot and surrounding area.
              </p>
            </div>
            
            <VideoUpload
              video={video}
              onVideoChange={handleVideoChange}
            />
            
            <div className="text-sm text-gray-600">
              <strong>Selected Video:</strong> {video ? '1 video selected' : 'No video selected'}
            </div>
          </div>

          {/* Photo Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Photography Tips for Land/Plot:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Take wide-angle shots to show the complete plot</li>
              <li>• Include photos of survey stones or boundary markers</li>
              <li>• Show utility connections (electric poles, water lines)</li>
              <li>• Capture the approach road and parking space</li>
              <li>• Include nearby amenities and landmarks</li>
              <li>• Take photos in good lighting conditions</li>
              <li>• Avoid using filters that alter the actual appearance</li>
            </ul>
          </div>

          {/* Navigation Buttons - Removed, using sticky buttons instead */}
        </form>
      </div>
  );
};