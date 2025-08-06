import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

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

interface PgHostelRoomDetailsStepProps {
  initialData?: Partial<PgHostelRoomDetails>;
  onNext: (data: PgHostelRoomDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelRoomDetailsStep({ 
  initialData, 
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Room Details</h2>
        <p className="text-muted-foreground">Pricing and room amenities</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedRent">Expected Rent (₹/month) *</Label>
                <Input
                  id="expectedRent"
                  type="number"
                  value={formData.expectedRent || ''}
                  onChange={(e) => setFormData({ ...formData, expectedRent: parseInt(e.target.value) || 0 })}
                  placeholder="e.g. ₹15,000"
                  min="0"
                  required
                />
                <p className="text-xs text-muted-foreground">Enter monthly rent amount</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDeposit">Expected Deposit (₹) *</Label>
                <Input
                  id="expectedDeposit"
                  type="number"
                  value={formData.expectedDeposit || ''}
                  onChange={(e) => setFormData({ ...formData, expectedDeposit: parseInt(e.target.value) || 0 })}
                  placeholder="e.g. ₹20,000"
                  min="0"
                  required
                />
                <p className="text-xs text-muted-foreground">Security deposit amount</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Room Amenities</h3>
              <p className="text-sm text-muted-foreground">Select all amenities available in the room</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cupboard"
                    checked={formData.roomAmenities.cupboard}
                    onCheckedChange={(checked) => handleAmenityChange('cupboard', checked as boolean)}
                  />
                  <Label htmlFor="cupboard" className="text-sm">Cupboard</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="geyser"
                    checked={formData.roomAmenities.geyser}
                    onCheckedChange={(checked) => handleAmenityChange('geyser', checked as boolean)}
                  />
                  <Label htmlFor="geyser" className="text-sm">Geyser</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tv"
                    checked={formData.roomAmenities.tv}
                    onCheckedChange={(checked) => handleAmenityChange('tv', checked as boolean)}
                  />
                  <Label htmlFor="tv" className="text-sm">TV</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ac"
                    checked={formData.roomAmenities.ac}
                    onCheckedChange={(checked) => handleAmenityChange('ac', checked as boolean)}
                  />
                  <Label htmlFor="ac" className="text-sm">AC</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bedding"
                    checked={formData.roomAmenities.bedding}
                    onCheckedChange={(checked) => handleAmenityChange('bedding', checked as boolean)}
                  />
                  <Label htmlFor="bedding" className="text-sm">Bedding</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attachedBathroom"
                    checked={formData.roomAmenities.attachedBathroom}
                    onCheckedChange={(checked) => handleAmenityChange('attachedBathroom', checked as boolean)}
                  />
                  <Label htmlFor="attachedBathroom" className="text-sm">Attached Bathroom</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" disabled={!isFormValid()}>
                Save & Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}