import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Images } from 'lucide-react';
import { PropertyImageModal } from './PropertyImageModal';

interface PropertyImageGalleryProps {
  images: string[];
  propertyTitle: string;
}

export const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  propertyTitle
}) => {
  const [showModal, setShowModal] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setShowModal(true);
  };

  const displayImages = images.slice(0, 3);
  const remainingCount = Math.max(0, images.length - 3);

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="inline-flex items-center">
            <Images className="h-4 w-4 mr-1" /> Photos
          </Button>
        </div>
        <div className="text-sm text-gray-600">{images.length} photos</div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {displayImages.map((image, i) => (
          <div 
            key={i} 
            className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(i)}
          >
            <img 
              src={image} 
              alt={`${propertyTitle} image ${i + 1}`} 
              className="w-full h-full object-cover" 
            />
            
            {/* Show "+X more" overlay on the last image if there are more images */}
            {i === 2 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-white text-xl font-semibold">
                  +{remainingCount} more
                </div>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
              <Images className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      <PropertyImageModal
        images={images}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialIndex={initialImageIndex}
        propertyTitle={propertyTitle}
      />
    </>
  );
};
