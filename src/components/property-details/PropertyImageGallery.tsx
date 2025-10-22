import React, { useState } from 'react';
import { Camera, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyImageModal } from '@/components/PropertyImageModal';
import { useFavorites } from '@/hooks/useFavorites';
import propertyPlaceholder from '@/assets/property-placeholder.png';

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
  const { isFavorite, toggleFavorite } = useFavorites();

  console.log('PropertyImageGallery received property:', {
    id: property.id,
    title: property.title,
    images: property.images,
    imagesType: typeof property.images,
    imagesLength: Array.isArray(property.images) ? property.images.length : 'not array',
    imagesContent: property.images,
    firstImage: Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : 'no images'
  });


  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setShowImageModal(true);
  };

  const handleViewAllPhotos = () => {
    setInitialImageIndex(0);
    setShowImageModal(true);
  };

  const handleShortlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const images = (property.images && property.images.length > 0) ? property.images : [propertyPlaceholder];

  return (
    <div className="relative">
      {/* Mobile Layout - Single Image */}
      <div className="block md:hidden">
        <div className="relative h-[300px] rounded-lg overflow-hidden">
          <img
            src={images[0]}
            alt={property.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => handleImageClick(0)}
            onError={(e) => {
              e.currentTarget.src = propertyPlaceholder;
            }}
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
              Photos ({images.length})
            </Button>
          </div>

          {/* Shortlist Button - Top Right */}
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-black/70 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
              onClick={handleShortlistClick}
            >
              <Heart className={`w-4 h-4 mr-1 ${isFavorite(property.id) ? 'fill-current text-red-500' : ''}`} />
              Shortlist
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Gallery Grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-2 h-[480px] rounded-lg overflow-hidden">
          {/* Main Image - Takes 2 columns */}
          <div className={`${images.length < 2 ? 'col-span-3' : 'col-span-2'} relative`}>
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => handleImageClick(0)}
              onError={(e) => {
                e.currentTarget.src = propertyPlaceholder;
              }}
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
            </div>

            {/* Shortlist Button - Top Right */}
            <div className="absolute top-4 right-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-black/70 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
                onClick={handleShortlistClick}
              >
                <Heart className={`w-4 h-4 mr-1 ${isFavorite(property.id) ? 'fill-current text-red-500' : ''}`} />
                Shortlist
              </Button>
            </div>
          </div>

          {/* Right Side Images - Stacked (only if 2+ images) */}
          {images.length > 1 && (
            <div className="col-span-1 flex flex-col gap-2">
              <div className={images.length > 2 ? 'relative h-1/2' : 'relative h-full'}>
                <img
                  src={images[1]}
                  alt={`${property.title} - Image 2`}
                  className="w-full h-full object-cover cursor-pointer rounded-lg"
                  onClick={() => handleImageClick(1)}
                  onError={(e) => {
                    e.currentTarget.src = propertyPlaceholder;
                  }}
                />
              </div>
              {images.length > 2 && (
                <div className="relative h-1/2">
                  <img
                    src={images[2]}
                    alt={`${property.title} - Image 3`}
                    className="w-full h-full object-cover cursor-pointer rounded-lg"
                    onClick={() => handleImageClick(2)}
                    onError={(e) => {
                      e.currentTarget.src = propertyPlaceholder;
                    }}
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {images.length > 0 && (
        <PropertyImageModal
          images={images}
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          initialIndex={initialImageIndex}
          propertyTitle={property.title}
        />
      )}
    </div>
  );
};