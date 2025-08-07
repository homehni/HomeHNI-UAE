import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyGallery } from '@/types/property';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';

interface GalleryForm {
  images: File[];
  videos?: File[];
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
      videos: [],
    }
  });

  const images = watch('images') || [];
  const videos = watch('videos') || [];

  const handleImageChange = (files: File[]) => {
    setValue('images', files);
  };

  const handleVideoChange = (files: File[]) => {
    setValue('videos', files);
  };

  const onSubmit = (data: GalleryForm) => {
    if (data.images.length < 3) {
      alert('Please upload at least 3 images of your land/plot');
      return;
    }
    onNext(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Photos & Videos
        </CardTitle>
        <p className="text-gray-600">
          Upload high-quality photos and videos of your land/plot. Minimum 3 photos required.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Plot Images * (Minimum 3 required)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload clear photos showing different angles of your plot, boundaries, access road, and surrounding area.
              </p>
            </div>
            
            <ImageUpload
              onImagesChange={handleImageChange}
              maxImages={20}
              guidelines={[
                'Take photos during good lighting (preferably morning or evening)',
                'Include boundary walls, gates, and corner markers',
                'Show access road and connectivity',
                'Capture surrounding development and landmarks',
                'Include any existing structures or utilities',
                'Show the plot from multiple angles'
              ]}
            />
            
            <div className="text-sm text-gray-600">
              <strong>Selected Images:</strong> {images.length} / 20 (Minimum 3 required)
            </div>
            
            {images.length < 3 && (
              <p className="text-red-500 text-sm">
                Please upload at least 3 images to proceed
              </p>
            )}
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
              onVideoChange={handleVideoChange}
              maxVideos={3}
              guidelines={[
                'Record a walkthrough of the entire plot perimeter',
                'Show access from main road to the plot',
                'Capture surrounding infrastructure and amenities',
                'Keep videos under 2 minutes for better viewer engagement',
                'Record during daylight for better visibility',
                'Ensure stable footage (avoid shaky camera)'
              ]}
            />
            
            <div className="text-sm text-gray-600">
              <strong>Selected Videos:</strong> {videos.length} / 3
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

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={images.length < 3}
            >
              Next: Additional Information
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};