import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface PgHostelPropertyInfo {
  propertyType: string;
  buildingType: string;
  ageOfProperty: string;
  floorNo: number;
  totalFloors: number;
  superBuiltUpArea: number;
  furnishing: string;
  onMainRoad: boolean;
  cornerProperty: boolean;
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
    propertyType: '',
    buildingType: '',
    ageOfProperty: '',
    floorNo: 0,
    totalFloors: 0,
    superBuiltUpArea: 0,
    furnishing: '',
    onMainRoad: false,
    cornerProperty: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return formData.propertyType && 
           formData.buildingType && 
           formData.ageOfProperty &&
           formData.floorNo > 0 &&
           formData.totalFloors > 0 &&
           formData.superBuiltUpArea > 0 &&
           formData.furnishing;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Property Information</h2>
        <p className="text-muted-foreground">Tell us about your PG/Hostel property</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">PG (Paying Guest)</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Co-living">Co-living Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildingType">Building Type *</Label>
                <Select
                  value={formData.buildingType}
                  onValueChange={(value) => setFormData({ ...formData, buildingType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Independent House">Independent House</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Commercial Building">Commercial Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageOfProperty">Age of Property *</Label>
                <Select
                  value={formData.ageOfProperty}
                  onValueChange={(value) => setFormData({ ...formData, ageOfProperty: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under Construction">Under Construction</SelectItem>
                    <SelectItem value="0-1 Year">0-1 Year</SelectItem>
                    <SelectItem value="1-5 Years">1-5 Years</SelectItem>
                    <SelectItem value="5-10 Years">5-10 Years</SelectItem>
                    <SelectItem value="10+ Years">10+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="furnishing">Furnishing *</Label>
                <Select
                  value={formData.furnishing}
                  onValueChange={(value) => setFormData({ ...formData, furnishing: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                    <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                    <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floorNo">Floor No *</Label>
                <Input
                  id="floorNo"
                  type="number"
                  value={formData.floorNo || ''}
                  onChange={(e) => setFormData({ ...formData, floorNo: parseInt(e.target.value) || 0 })}
                  placeholder="Enter floor number"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalFloors">Total Floors *</Label>
                <Input
                  id="totalFloors"
                  type="number"
                  value={formData.totalFloors || ''}
                  onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) || 0 })}
                  placeholder="Enter total floors"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="superBuiltUpArea">Super Built Up Area (sq ft) *</Label>
                <Input
                  id="superBuiltUpArea"
                  type="number"
                  value={formData.superBuiltUpArea || ''}
                  onChange={(e) => setFormData({ ...formData, superBuiltUpArea: parseInt(e.target.value) || 0 })}
                  placeholder="Enter area in square feet"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-medium text-foreground">Additional Features</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onMainRoad"
                  checked={formData.onMainRoad}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, onMainRoad: checked as boolean })
                  }
                />
                <Label htmlFor="onMainRoad" className="text-sm">On Main Road</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cornerProperty"
                  checked={formData.cornerProperty}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, cornerProperty: checked as boolean })
                  }
                />
                <Label htmlFor="cornerProperty" className="text-sm">Corner Property</Label>
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