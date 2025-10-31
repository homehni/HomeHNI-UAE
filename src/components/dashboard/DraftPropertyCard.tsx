import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Trash2, Eye } from 'lucide-react';
import { PropertyDraft } from '@/services/propertyDraftService';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

interface DraftPropertyCardProps {
  draft: PropertyDraft;
  onContinue: () => void;
  onDelete: () => void;
  onPreview?: () => void;
}

const stepNames = {
  1: 'Property Details',
  2: 'Location Details', 
  3: 'Rental/Sale Details',
  4: 'Amenities',
  5: 'Gallery',
  6: 'Schedule',
  7: 'Preview'
};

export const DraftPropertyCard: React.FC<DraftPropertyCardProps> = ({
  draft,
  onContinue,
  onDelete,
  onPreview
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    return Math.round((draft.current_step / 7) * 100);
  };

  const getPropertyTitle = () => {
    if (draft.apartment_name) {
      return `${draft.bhk_type} ${draft.apartment_name}`;
    }
    if (draft.bhk_type) {
      return `${draft.bhk_type} ${draft.property_type} Property`;
    }
    return `${draft.property_type} Property`;
  };

  const getPriceText = () => {
    if (draft.expected_rent && draft.expected_rent > 0) {
      return `Rent: ₹${draft.expected_rent.toLocaleString()}`;
    }
    if (draft.expected_price && draft.expected_price > 0) {
      return `Price: ₹${draft.expected_price.toLocaleString()}`;
    }
    return 'Price not set';
  };

  const getLocationText = () => {
    if (draft.city && draft.locality) {
      return `${draft.locality}, ${draft.city}`;
    }
    if (draft.city) {
      return draft.city;
    }
    return 'Location not specified';
  };

  return (
    <Card className="relative bg-white border border-orange-200 ring-1 ring-orange-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Draft Badge - Top Left */}
      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-20 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded text-white bg-orange-500">
        DRAFT
      </div>

      {/* Progress Badge - Top Right */}
      <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 z-20 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded text-white bg-blue-500">
        {getProgressPercentage()}%
      </div>

      {/* Diagonal Ribbon - Top Right Corner */}
      <div className="absolute top-0 right-0 z-10">
        <div className={`${draft.listing_type === 'Rent' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-[9px] sm:text-xs font-medium py-0.5 sm:py-1 px-4 sm:px-6 transform rotate-45 translate-x-2 sm:translate-x-3 translate-y-1.5 sm:translate-y-2`}>
          For {draft.listing_type === 'Rent' ? 'Rent' : 'Buy'}
        </div>
      </div>

      <CardContent className="p-0">
        {/* Horizontal Layout: Text Left, Image Right */}
        <div className="flex items-center">
          {/* Left Side - Text Content */}
          <div className="flex-1 p-2 sm:p-3 min-w-0">
            {/* Title */}
            <div className="mb-1.5 sm:mb-2 mt-6 sm:mt-8">
              <h3 className="font-medium text-gray-800 text-xs sm:text-sm leading-tight truncate">
                {getPropertyTitle()}
              </h3>
            </div>

            {/* Location */}
            <div className="mb-1.5 sm:mb-2">
              <p className="text-xs text-gray-600 truncate">
                {getLocationText()}
              </p>
            </div>

            {/* Price */}
            <div className="mb-2 sm:mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {getPriceText()}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-2 sm:mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="mb-2 sm:mb-3 flex items-center gap-1 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>Last saved: {stepNames[draft.current_step as keyof typeof stepNames]}</span>
            </div>

            {/* Last Updated */}
            <div className="mb-3 sm:mb-4 text-xs text-gray-500">
              Updated: {formatDate(draft.updated_at || draft.created_at || '')}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 sm:gap-2">
              <Button
                onClick={onContinue}
                size="sm"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs h-7 sm:h-8"
              >
                <Play className="w-3 h-3 mr-1" />
                Continue
              </Button>
              {onPreview && (
                <Button
                  onClick={onPreview}
                  size="sm"
                  variant="outline"
                  className="px-2 sm:px-3 text-xs h-7 sm:h-8"
                >
                  <Eye className="w-3 h-3" />
                </Button>
              )}
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                size="sm"
                variant="outline"
                className="px-2 sm:px-3 text-xs h-7 sm:h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="w-20 sm:w-24 h-20 sm:h-24 flex-shrink-0 relative">
            <div className="w-full h-full bg-gray-100 rounded-r-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                </div>
                <p className="text-[8px] sm:text-xs text-gray-500 font-medium">Draft</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          onDelete();
          setIsDeleteModalOpen(false);
        }}
        title="Delete Draft"
        description="Are you sure you want to delete this draft? This action cannot be undone."
      />
    </Card>
  );
};
