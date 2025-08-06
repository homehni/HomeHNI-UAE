import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Bed, ShowerHead, Tv, Wind, Shirt, ShoppingBag, DollarSign } from 'lucide-react';

interface PgHostelRoomDetails {
  expectedRent: number;
  expectedDeposit: number;
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
  single: boolean;
  double: boolean;
  three: boolean;
  four: boolean;
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
    expectedRent: 0,
    expectedDeposit: 0,
    roomAmenities: {
      cupboard: false,
      geyser: false,
      tv: false,
      ac: false,
      bedding: false,
      attachedBathroom: false,
    },
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return formData.expectedRent > 0 && formData.expectedDeposit >= 0;
  };

  const handleAmenityChange = (amenity: keyof typeof formData.roomAmenities, checked: boolean) => {
    setFormData({
      ...formData,
      roomAmenities: {
        ...formData.roomAmenities,
        [amenity]: checked,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="text-center px-0">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Bed className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">
              {roomTypes.single ? 'Single' : 
               roomTypes.double ? 'Double' : 
               roomTypes.three ? 'Three Sharing' : 
               roomTypes.four ? 'Four Sharing' : 'Single'} Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rent and Deposit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="expectedRent" className="text-base font-medium">Expected Rent</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="expectedRent"
                      type="number"
                      value={formData.expectedRent}
                      onChange={(e) => setFormData({ ...formData, expectedRent: Number(e.target.value) })}
                      placeholder="15000"
                      className="pl-10 h-14 text-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">₹15 k</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedDeposit" className="text-base font-medium">Expected Deposit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="expectedDeposit"
                      type="number"
                      value={formData.expectedDeposit}
                      onChange={(e) => setFormData({ ...formData, expectedDeposit: Number(e.target.value) })}
                      placeholder="20000"
                      className="pl-10 h-14 text-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">₹20 k</p>
                </div>
              </div>

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

              {/* Action Buttons */}
              <div className="flex justify-center pt-8">
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={onBack} className="px-8">
                    Back
                  </Button>
                  <Button type="submit" disabled={!isFormValid()} className="px-8">
                    Save & Continue
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}