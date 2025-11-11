import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface PgHostelPropertyInfo {
  title: string;
  propertyType: string;
}

interface PgHostelPropertyInfoStepProps {
  initialData?: Partial<PgHostelPropertyInfo>;
  onNext: (data: PgHostelPropertyInfo) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelPropertyInfoStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps 
}: PgHostelPropertyInfoStepProps) {
const [formData, setFormData] = useState<PgHostelPropertyInfo>({
  title: '',
  propertyType: '',
  ...initialData,
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

const isFormValid = () => {
  return formData.title.trim() && formData.propertyType;
};

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Property Information</h2>
        <p className="text-muted-foreground">Tell us about your PG/Hostel property</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded"></div>
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">Property Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a catchy title for your PG/Hostel"
                className="h-12"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">PG (Paying Guest)</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Co-living">Co-living Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons - Removed, using only sticky buttons */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
