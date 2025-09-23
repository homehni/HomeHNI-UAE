import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, Building, UserCheck } from 'lucide-react';

interface PgHostelRoomType {
  selectedTypes: ('single' | 'double' | 'three' | 'four')[];
}

interface PgHostelRoomTypeStepProps {
  initialData?: Partial<PgHostelRoomType>;
  onNext: (data: PgHostelRoomType) => void;
  onBack?: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelRoomTypeStep({ 
  initialData, 
  onNext, 
  onBack,
  currentStep, 
  totalSteps 
}: PgHostelRoomTypeStepProps) {
  const [formData, setFormData] = useState<PgHostelRoomType>({
    selectedTypes: [],
    ...initialData,
  });

  // Sync when parent provides saved data (e.g., navigating back)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        selectedTypes: initialData.selectedTypes ?? prev.selectedTypes ?? [],
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
    return formData.selectedTypes.length > 0;
  };

  const handleRoomTypeChange = (roomType: 'single' | 'double' | 'three' | 'four') => {
    setFormData(prev => {
      const isSelected = prev.selectedTypes.includes(roomType);
      const nextSelected = isSelected
        ? prev.selectedTypes.filter(type => type !== roomType)
        : [...prev.selectedTypes, roomType];
      return { selectedTypes: nextSelected } as PgHostelRoomType;
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-2">
            Provide details about your place to find a tenant soon
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {roomTypes.map((roomType) => {
              const IconComponent = roomType.icon;
              const isSelected = formData.selectedTypes.includes(roomType.key as 'single' | 'double' | 'three' | 'four');
              return (
                <div 
                  key={roomType.key} 
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                    isSelected 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRoomTypeChange(roomType.key as 'single' | 'double' | 'three' | 'four')}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <Label className="text-base font-medium cursor-pointer">
                        {roomType.label}
                      </Label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons - Removed, using only sticky buttons */}
        </form>
      </div>
    </div>
  );
}