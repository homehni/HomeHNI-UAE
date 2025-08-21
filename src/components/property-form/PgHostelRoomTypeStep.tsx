import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, Building, UserCheck } from 'lucide-react';

interface PgHostelRoomType {
  selectedType: 'single' | 'double' | 'three' | 'four' | '';
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
    selectedType: '',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return true;
  };

  const handleRoomTypeChange = (roomType: 'single' | 'double' | 'three' | 'four') => {
    setFormData({
      selectedType: roomType,
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
                const isSelected = formData.selectedType === roomType.key;
                return (
                  <div 
                    key={roomType.key} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-border'
                    }`}
                    onClick={() => handleRoomTypeChange(roomType.key as 'single' | 'double' | 'three' | 'four')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <Label className="text-base font-medium cursor-pointer">
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

            <div className="flex justify-end pt-6">
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