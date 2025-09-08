import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Upload, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PhotoUploadReminderProps {
  propertyId: string;
  propertyTitle: string;
  onDismiss?: () => void;
  onMarkAsNoPhotos?: () => void;
}

export const PhotoUploadReminder: React.FC<PhotoUploadReminderProps> = ({
  propertyId,
  propertyTitle,
  onDismiss,
  onMarkAsNoPhotos
}) => {
  const navigate = useNavigate();

  const handleUploadNow = () => {
    // Always navigate to the full property posting form with focus on gallery step
    console.log('Upload photos clicked for property:', propertyId);
    console.log('Navigating to gallery step:', `/post-property?edit=${propertyId}&step=gallery`);
    navigate(`/post-property?edit=${propertyId}&step=gallery`);
  };

  const handleSendPhotos = () => {
    // Navigate to contact/support page for photo submission
    navigate('/contact?type=photo-submission');
  };

  const handleNoPhotos = () => {
    if (onMarkAsNoPhotos) {
      onMarkAsNoPhotos();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Card className="mb-6 border-l-4 border-l-orange-500 bg-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Warning Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Your property doesn't have any photos
            </h3>
            <p className="text-gray-700 mb-4">
              Your property "{propertyTitle}" will be live but in order to get the right tenant faster, 
              we suggest to upload your property photos ASAP.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNoPhotos}
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <X className="w-4 h-4 mr-2" />
                I Don't Have Photos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendPhotos}
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <Camera className="w-4 h-4 mr-2" />
                Send Photos
              </Button>
              <Button
                size="sm"
                onClick={handleUploadNow}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Now
              </Button>
            </div>
          </div>

          {/* Dismiss Button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
