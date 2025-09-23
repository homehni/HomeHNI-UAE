import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tv, UtensilsCrossed, MoveUp, Refrigerator, Wifi, ChefHat, Zap, Car, Plus } from 'lucide-react';

interface PgHostelAmenities {
  // Available Services
  laundry: 'yes' | 'no' | '';
  roomCleaning: 'yes' | 'no' | '';
  wardenFacility: 'yes' | 'no' | '';
  
  // Directions Tip
  directionsTip: string;
  
  // Available Amenities
  commonTv: boolean;
  mess: boolean;
  lift: boolean;
  refrigerator: boolean;
  wifi: boolean;
  cookingAllowed: boolean;
  powerBackup: boolean;
  parking: 'none' | 'bike' | 'car' | 'both';
}

interface PgHostelAmenitiesStepProps {
  initialData?: Partial<PgHostelAmenities>;
  onNext: (data: PgHostelAmenities) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelAmenitiesStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps 
}: PgHostelAmenitiesStepProps) {
  const [formData, setFormData] = useState<PgHostelAmenities>({
    laundry: '',
    roomCleaning: '',
    wardenFacility: '',
    directionsTip: '',
    commonTv: false,
    mess: false,
    lift: false,
    refrigerator: false,
    wifi: false,
    cookingAllowed: false,
    powerBackup: false,
    parking: 'none',
    ...initialData,
  });

  // Sync when parent provides saved data (navigate back)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleAmenityChange = (amenity: string, value: boolean | string) => {
    setFormData(prev => {
      const next = { ...prev, [amenity]: value } as PgHostelAmenities;
      onNext(next);
      return next;
    });
  };

  const availableAmenities = [
    { key: 'commonTv', label: 'Common TV', icon: Tv },
    { key: 'mess', label: 'Mess', icon: UtensilsCrossed },
    { key: 'lift', label: 'Lift', icon: MoveUp },
    { key: 'refrigerator', label: 'Refrigerator', icon: Refrigerator },
    { key: 'wifi', label: 'Wifi', icon: Wifi },
    { key: 'cookingAllowed', label: 'Cooking Allowed', icon: ChefHat },
    { key: 'powerBackup', label: 'Power Backup', icon: Zap },
  ];

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Amenities</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
            {/* Available Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Available Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laundry">Laundry</Label>
                  <Select
                    value={formData.laundry}
                    onValueChange={(value: 'yes' | 'no') => 
                      handleAmenityChange('laundry', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomCleaning">Room Cleaning</Label>
                  <Select
                    value={formData.roomCleaning}
                    onValueChange={(value: 'yes' | 'no') => 
                      handleAmenityChange('roomCleaning', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wardenFacility">Warden Facility</Label>
                  <Select
                    value={formData.wardenFacility}
                    onValueChange={(value: 'yes' | 'no') => 
                      handleAmenityChange('wardenFacility', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Add Directions Tip */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-foreground">Add Directions Tip for your tenants</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">NEW</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Don't want calls asking location? Add directions to reach using landmarks
              </p>
              <Textarea
                value={formData.directionsTip}
                onChange={(e) => handleAmenityChange('directionsTip', e.target.value)}
                placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
                rows={3}
              />
            </div>

            {/* Available Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Available Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableAmenities.map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={amenity.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.key}
                        checked={formData[amenity.key as keyof PgHostelAmenities] as boolean}
                        onCheckedChange={(checked) => 
                          handleAmenityChange(amenity.key, checked as boolean)
                        }
                      />
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                        <Label htmlFor={amenity.key} className="text-sm">
                          {amenity.label}
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parking */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Parking</h3>
              <Select
                value={formData.parking}
                onValueChange={(value: 'none' | 'bike' | 'car' | 'both') => 
                  handleAmenityChange('parking', value)
                }
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select parking option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="bike">Bike Parking</SelectItem>
                  <SelectItem value="car">Car Parking</SelectItem>
                  <SelectItem value="both">Both Bike & Car</SelectItem>
                </SelectContent>
              </Select>
            </div>

        <div className="flex justify-between pt-6" style={{ visibility: 'hidden' }}>
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">
            Save & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}