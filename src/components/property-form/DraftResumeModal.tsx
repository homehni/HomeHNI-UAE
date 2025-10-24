import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, Home, MapPin, DollarSign, Star, Camera, Calendar, CheckCircle } from 'lucide-react';

interface DraftResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onStartNew: () => void;
  draftData: {
    id: string;
    property_type: string;
    listing_type: string;
    current_step: number;
    created_at: string;
    updated_at: string;
    city?: string;
    locality?: string;
    apartment_name?: string;
    bhk_type?: string;
  };
}

const stepIcons = {
  1: <Home className="w-4 h-4" />,
  2: <MapPin className="w-4 h-4" />,
  3: <DollarSign className="w-4 h-4" />,
  4: <Star className="w-4 h-4" />,
  5: <Camera className="w-4 h-4" />,
  6: <Calendar className="w-4 h-4" />,
  7: <CheckCircle className="w-4 h-4" />
};

const stepNames = {
  1: 'Property Details',
  2: 'Location Details', 
  3: 'Rental Details',
  4: 'Amenities',
  5: 'Gallery',
  6: 'Schedule',
  7: 'Preview'
};

export const DraftResumeModal: React.FC<DraftResumeModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  onStartNew,
  draftData
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = () => {
    return Math.round((draftData.current_step / 7) * 100);
  };

  const getPropertyTitle = () => {
    if (draftData.apartment_name) {
      return `${draftData.bhk_type} ${draftData.apartment_name}`;
    }
    return `${draftData.bhk_type || ''} ${draftData.property_type} Property`.trim();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Continue Previous Posting?
          </DialogTitle>
          <DialogDescription>
            We found an incomplete property listing that you started earlier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Draft Info Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {getPropertyTitle()}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {draftData.city && draftData.locality 
                    ? `${draftData.locality}, ${draftData.city}`
                    : draftData.city || 'Location not specified'
                  }
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {draftData.property_type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {draftData.listing_type}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
              {stepIcons[draftData.current_step as keyof typeof stepIcons]}
              <span>Last saved at: {stepNames[draftData.current_step as keyof typeof stepNames]}</span>
            </div>

            {/* Last Updated */}
            <div className="mt-2 text-xs text-gray-500">
              Last updated: {formatDate(draftData.updated_at)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onContinue}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Continue Previous Posting
            </Button>
            <Button
              onClick={onStartNew}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Start New Posting
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
