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
      {/* Main Image */}
      <div className="relative h-[480px] rounded-lg overflow-hidden">
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
          <Button
            variant="outline"
            size="sm"
            className="bg-black/70 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
          >
            <Heart className="w-4 h-4 mr-1" />
            Shortlist
          </Button>
        </div>

        {/* Additional Images Preview */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {images.slice(1, 3).map((image, index) => (
              <div
                key={index + 1}
                className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 border-white/50"
                onClick={() => handleImageClick(index + 1)}
              >
                <img
                  src={image}
                  alt={`${property.title} - Image ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {images.length > 3 && (
              <div
                className="w-16 h-16 rounded-lg bg-black/70 text-white flex items-center justify-center cursor-pointer border-2 border-white/50 backdrop-blur-sm"
                onClick={handleViewAllPhotos}
              >
                <span className="text-xs font-medium">
                  +{images.length - 3}
                </span>
              </div>
            )}
          </div>
        )}
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