import React, { useState } from 'react';
import { Camera, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyImageModal } from '@/components/PropertyImageModal';

interface PropertyImageGalleryProps {
  property: {
    id: string;
    title: string;
    images?: string[];
  };
}

export const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ property }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setShowImageModal(true);
  };

  const handleViewAllPhotos = () => {
    setInitialImageIndex(0);
    setShowImageModal(true);
  };

  const images = property.images || ['/placeholder.svg'];

  return (
    <div className="relative">
      {/* Gallery Grid Layout */}
      <div className="grid grid-cols-3 gap-2 h-[480px] rounded-lg overflow-hidden">
        {/* Main Image - Takes 2 columns */}
        <div className="col-span-2 relative">
          <img
            src={images[0]}
            alt={property.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => handleImageClick(0)}
          />
          
          {/* Overlay Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-black/70 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
              onClick={handleViewAllPhotos}
            >
              <Camera className="w-4 h-4 mr-1" />
              Photos
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-black/70 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Location
            </Button>
          </div>

          {/* Shortlist Button - Top Right */}
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-black/70 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
            >
              <Heart className="w-4 h-4 mr-1" />
              Shortlist
            </Button>
          </div>
        </div>

        {/* Right Side Images - Stacked */}
        <div className="col-span-1 flex flex-col gap-2">
          {images.length > 1 && (
            <div className="relative h-1/2">
              <img
                src={images[1]}
                alt={`${property.title} - Image 2`}
                className="w-full h-full object-cover cursor-pointer rounded-lg"
                onClick={() => handleImageClick(1)}
              />
            </div>
          )}
          
          {images.length > 2 ? (
            <div className="relative h-1/2">
              <img
                src={images[2]}
                alt={`${property.title} - Image 3`}
                className="w-full h-full object-cover cursor-pointer rounded-lg"
                onClick={() => handleImageClick(2)}
              />
              {/* Show +X overlay if there are more than 3 images */}
              {images.length > 3 && (
                <div
                  className="absolute inset-0 bg-black/70 flex items-center justify-center cursor-pointer rounded-lg backdrop-blur-sm"
                  onClick={handleViewAllPhotos}
                >
                  <span className="text-white text-xl font-bold">
                    +{images.length - 3}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-1/2 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">No more images</span>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {property.images && (
        <PropertyImageModal
          images={property.images}
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          initialIndex={initialImageIndex}
          propertyTitle={property.title}
        />
      )}
    </div>
  );
};