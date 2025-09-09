import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MissingImagesNotificationProps {
  propertyId: string;
  propertyTitle: string;
  onDismiss?: () => void;
}

export const MissingImagesNotification: React.FC<MissingImagesNotificationProps> = ({
  propertyId,
  propertyTitle,
  onDismiss
}) => {
  const navigate = useNavigate();

  const handleUploadImages = () => {
    // Navigate to the edit property page with images tab
    console.log('Upload images clicked for property:', propertyId);
    navigate(`/edit-property/${propertyId}?tab=images`);
  };

  return (
    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="flex items-start space-x-3">
        {/* Camera Icon */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Camera className="w-4 h-4 text-orange-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-orange-800 mb-1">
            Hey! You forgot to upload some images
          </h4>
          <p className="text-xs text-orange-700 mb-3">
            Properties with photos get 3x more views and inquiries!
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleUploadImages}
              className="bg-orange-600 hover:bg-orange-700 text-white h-7 px-3 text-xs"
            >
              <Upload className="w-3 h-3 mr-1" />
              Upload Images
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/property/${propertyId}?refresh=true`)}
              className="h-7 px-3 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              View Property
            </Button>
          </div>
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-orange-400 hover:text-orange-600 transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
