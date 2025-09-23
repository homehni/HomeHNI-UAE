import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Bed, ShowerHead, Tv, Wind, Shirt, ShoppingBag, DollarSign } from 'lucide-react';
import { formatExactPriceDisplay } from '@/utils/priceFormatter';

interface PgHostelRoomDetails {
  roomTypeDetails: {
    [key: string]: {
      expectedRent: number;
      expectedDeposit: number;
    };
  };
  roomAmenities: {
    cupboard: boolean;
    geyser: boolean;
    tv: boolean;
    ac: boolean;
    bedding: boolean;
    attachedBathroom: boolean;
  };
}

interface RoomType {
  selectedTypes: ('single' | 'double' | 'three' | 'four')[];
}

interface PgHostelRoomDetailsStepProps {
  initialData?: Partial<PgHostelRoomDetails>;
  roomTypes: RoomType;
  onNext: (data: PgHostelRoomDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelRoomDetailsStep({ 
  initialData, 
  roomTypes,
  onNext, 
  onBack, 
  currentStep, 
  totalSteps 
}: PgHostelRoomDetailsStepProps) {
  const [formData, setFormData] = useState<PgHostelRoomDetails>({
    roomTypeDetails: initialData?.roomTypeDetails || {},
    roomAmenities: {
      cupboard: initialData?.roomAmenities?.cupboard || false,
      geyser: initialData?.roomAmenities?.geyser || false,
      tv: initialData?.roomAmenities?.tv || false,
      ac: initialData?.roomAmenities?.ac || false,
      bedding: initialData?.roomAmenities?.bedding || false,
      attachedBathroom: initialData?.roomAmenities?.attachedBathroom || false,
    },
  });

  // Sync local state when navigating back to this step
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        roomTypeDetails: initialData.roomTypeDetails || prev.roomTypeDetails,
        roomAmenities: {
          cupboard: initialData.roomAmenities?.cupboard ?? prev.roomAmenities.cupboard,
          geyser: initialData.roomAmenities?.geyser ?? prev.roomAmenities.geyser,
          tv: initialData.roomAmenities?.tv ?? prev.roomAmenities.tv,
          ac: initialData.roomAmenities?.ac ?? prev.roomAmenities.ac,
          bedding: initialData.roomAmenities?.bedding ?? prev.roomAmenities.bedding,
          attachedBathroom: initialData.roomAmenities?.attachedBathroom ?? prev.roomAmenities.attachedBathroom,
        },
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    // Check if all selected room types have rent and deposit values
    return roomTypes.selectedTypes.every(roomType => {
      const details = formData.roomTypeDetails[roomType];
      return details && details.expectedRent > 0 && details.expectedDeposit > 0;
    });
  };

  const handleRoomTypePriceChange = (roomType: string, field: 'expectedRent' | 'expectedDeposit', value: number) => {
    setFormData(prev => ({
      ...prev,
      roomTypeDetails: {
        ...prev.roomTypeDetails,
        [roomType]: {
          ...prev.roomTypeDetails[roomType],
          [field]: value,
        },
      },
    }));
  };

  const getRoomTypeLabel = (roomType: string) => {
    return roomType.charAt(0).toUpperCase() + roomType.slice(1);
  };

  const handleAmenityChange = (amenity: keyof typeof formData.roomAmenities, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roomAmenities: {
        ...prev.roomAmenities,
        [amenity]: checked,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-2">
            Provide details about your place to find a tenant soon
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Individual Room Type Pricing */}
          {roomTypes.selectedTypes.map((roomType) => {
            const roomDetails = formData.roomTypeDetails[roomType] || { expectedRent: 0, expectedDeposit: 0 };
            return (
              <div key={roomType} className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                    <Bed className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {getRoomTypeLabel(roomType)} Room Details
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor={`${roomType}-rent`} className="text-base font-medium">
                      Expected Rent per person *
                    </Label>
                    <PriceInput
                      id={`${roomType}-rent`}
                      value={roomDetails.expectedRent}
                      onChange={(value) => handleRoomTypePriceChange(roomType, 'expectedRent', value)}
                      placeholder="Enter Amount"
                      className="h-12 text-lg"
                    />
                    {/* Expected rent in words display */}
                    {roomDetails.expectedRent && roomDetails.expectedRent > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {formatExactPriceDisplay(roomDetails.expectedRent)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${roomType}-deposit`} className="text-base font-medium">
                      Expected Deposit per person *
                    </Label>
                    <PriceInput
                      id={`${roomType}-deposit`}
                      value={roomDetails.expectedDeposit}
                      onChange={(value) => handleRoomTypePriceChange(roomType, 'expectedDeposit', value)}
                      placeholder="Enter Amount"
                      className="h-12 text-lg"
                    />
                    {/* Expected deposit in words display */}
                    {roomDetails.expectedDeposit && roomDetails.expectedDeposit > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {formatExactPriceDisplay(roomDetails.expectedDeposit)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Room Amenities */}
          <div className="space-y-6">
            <Label className="text-xl font-semibold">Room Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="cupboard"
                  checked={formData.roomAmenities.cupboard}
                  onCheckedChange={(checked) => handleAmenityChange('cupboard', checked as boolean)}
                  className="w-5 h-5"
                />
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="cupboard" className="text-base cursor-pointer">
                    Cupboard
                  </Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="tv"
                  checked={formData.roomAmenities.tv}
                  onCheckedChange={(checked) => handleAmenityChange('tv', checked as boolean)}
                  className="w-5 h-5"
                />
                <div className="flex items-center space-x-2">
                  <Tv className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="tv" className="text-base cursor-pointer">
                    TV
                  </Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="bedding"
                  checked={formData.roomAmenities.bedding}
                  onCheckedChange={(checked) => handleAmenityChange('bedding', checked as boolean)}
                  className="w-5 h-5"
                />
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="bedding" className="text-base cursor-pointer">
                    Bedding
                  </Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="geyser"
                  checked={formData.roomAmenities.geyser}
                  onCheckedChange={(checked) => handleAmenityChange('geyser', checked as boolean)}
                  className="w-5 h-5"
                />
                <div className="flex items-center space-x-2">
                  <ShowerHead className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="geyser" className="text-base cursor-pointer">
                    Geyser
                  </Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="ac"
                  checked={formData.roomAmenities.ac}
                  onCheckedChange={(checked) => handleAmenityChange('ac', checked as boolean)}
                  className="w-5 h-5"
                />
                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="ac" className="text-base cursor-pointer">
                    AC
                  </Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="attachedBathroom"
                  checked={formData.roomAmenities.attachedBathroom}
                  onCheckedChange={(checked) => handleAmenityChange('attachedBathroom', checked as boolean)}
                  className="w-5 h-5"
                />
                <div className="flex items-center space-x-2">
                  <Shirt className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="attachedBathroom" className="text-base cursor-pointer">
                    Attached Bathroom
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Removed, using only sticky buttons */}
        </form>
      </div>
    </div>
  );
}