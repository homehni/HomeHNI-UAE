import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface PgHostelAmenities {
  wifi: boolean;
  parking: boolean;
  security: boolean;
  laundry: boolean;
  commonArea: boolean;
  kitchen: boolean;
  powerBackup: boolean;
  cleaning: boolean;
  studyRoom: boolean;
  recreation: boolean;
  meals: boolean;
  elevator: boolean;
  waterSupply: boolean;
  cctv: boolean;
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
    wifi: false,
    parking: false,
    security: false,
    laundry: false,
    commonArea: false,
    kitchen: false,
    powerBackup: false,
    cleaning: false,
    studyRoom: false,
    recreation: false,
    meals: false,
    elevator: false,
    waterSupply: false,
    cctv: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleAmenityChange = (amenity: keyof PgHostelAmenities, checked: boolean) => {
    setFormData({
      ...formData,
      [amenity]: checked,
    });
  };

  const amenityGroups = [
    {
      title: "Basic Amenities",
      amenities: [
        { key: 'wifi', label: 'Wi-Fi Internet' },
        { key: 'parking', label: 'Parking' },
        { key: 'security', label: '24/7 Security' },
        { key: 'powerBackup', label: 'Power Backup' },
        { key: 'waterSupply', label: '24/7 Water Supply' },
        { key: 'elevator', label: 'Elevator/Lift' },
      ]
    },
    {
      title: "Services",
      amenities: [
        { key: 'laundry', label: 'Laundry Service' },
        { key: 'cleaning', label: 'Room Cleaning' },
        { key: 'meals', label: 'Meal Service' },
        { key: 'cctv', label: 'CCTV Surveillance' },
      ]
    },
    {
      title: "Common Areas",
      amenities: [
        { key: 'commonArea', label: 'Common Lounge' },
        { key: 'kitchen', label: 'Common Kitchen' },
        { key: 'studyRoom', label: 'Study Room' },
        { key: 'recreation', label: 'Recreation Area' },
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Amenities</h2>
        <p className="text-muted-foreground">Select all amenities available at your PG/Hostel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {amenityGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">{group.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {group.amenities.map((amenity) => (
                    <div key={amenity.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.key}
                        checked={formData[amenity.key as keyof PgHostelAmenities]}
                        onCheckedChange={(checked) => 
                          handleAmenityChange(amenity.key as keyof PgHostelAmenities, checked as boolean)
                        }
                      />
                      <Label htmlFor={amenity.key} className="text-sm">
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Save & Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}