import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Home, Users, Building, UserCheck } from 'lucide-react';

interface PgHostelRoomType {
  single: boolean;
  double: boolean;
  three: boolean;
  four: boolean;
}

interface PgHostelRoomTypeStepProps {
  initialData?: Partial<PgHostelRoomType>;
  onNext: (data: PgHostelRoomType) => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelRoomTypeStep({ 
  initialData, 
  onNext, 
  currentStep, 
  totalSteps 
}: PgHostelRoomTypeStepProps) {
  const [formData, setFormData] = useState<PgHostelRoomType>({
    single: false,
    double: false,
    three: false,
    four: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return formData.single || formData.double || formData.three || formData.four;
  };

  const handleRoomTypeChange = (roomType: keyof PgHostelRoomType, checked: boolean) => {
    setFormData({
      ...formData,
      [roomType]: checked,
    });
  };

  const roomTypes = [
    { 
      key: 'single', 
      label: 'Single', 
      description: 'Private room for one person',
      icon: Home 
    },
    { 
      key: 'double', 
      label: 'Double', 
      description: 'Shared room for two people',
      icon: Users 
    },
    { 
      key: 'three', 
      label: 'Three', 
      description: 'Shared room for three people',
      icon: Building 
    },
    { 
      key: 'four', 
      label: 'Four', 
      description: 'Shared room for four people',
      icon: UserCheck 
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Room Types Available</h2>
        <p className="text-muted-foreground">Select the type of rooms available in your PG</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select the type of rooms available in your PG</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roomTypes.map((roomType) => {
                const IconComponent = roomType.icon;
                return (
                  <div key={roomType.key} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={roomType.key}
                        checked={formData[roomType.key as keyof PgHostelRoomType]}
                        onCheckedChange={(checked) => 
                          handleRoomTypeChange(roomType.key as keyof PgHostelRoomType, checked as boolean)
                        }
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor={roomType.key} className="text-base font-medium cursor-pointer">
                            {roomType.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{roomType.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!isFormValid() && (
              <p className="text-sm text-destructive">Please select at least one room type</p>
            )}

            <div className="flex justify-end pt-6">
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