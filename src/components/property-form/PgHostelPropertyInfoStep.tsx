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
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded"></div>
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">Property Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="buildingType">Building Type *</Label>
                <Select
                  value={formData.buildingType}
                  onValueChange={(value) => setFormData({ ...formData, buildingType: value })}
                >
                  <SelectTrigger className="h-12">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ageOfProperty">Age of Property *</Label>
                <Select
                  value={formData.ageOfProperty}
                  onValueChange={(value) => setFormData({ ...formData, ageOfProperty: value })}
                >
                  <SelectTrigger className="h-12">
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
                <Label htmlFor="floorNo">Floor No *</Label>
                <Input
                  id="floorNo"
                  type="number"
                  value={formData.floorNo || ''}
                  onChange={(e) => setFormData({ ...formData, floorNo: parseInt(e.target.value) || 0 })}
                  placeholder="Enter floor"
                  className="h-12"
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
                  placeholder="Total floors"
                  className="h-12"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="superBuiltUpArea">Super Built Up Area (sq ft) *</Label>
                <Input
                  id="superBuiltUpArea"
                  type="number"
                  value={formData.superBuiltUpArea || ''}
                  onChange={(e) => setFormData({ ...formData, superBuiltUpArea: parseInt(e.target.value) || 0 })}
                  placeholder="Enter area in sq ft"
                  className="h-12"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="furnishing">Furnishing *</Label>
                <Select
                  value={formData.furnishing}
                  onValueChange={(value) => setFormData({ ...formData, furnishing: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                    <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                    <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-medium text-foreground">Other Features</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="onMainRoad"
                    checked={formData.onMainRoad}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, onMainRoad: checked as boolean })
                    }
                  />
                  <Label htmlFor="onMainRoad" className="text-sm font-normal">On Main Road</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="cornerProperty"
                    checked={formData.cornerProperty}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, cornerProperty: checked as boolean })
                    }
                  />
                  <Label htmlFor="cornerProperty" className="text-sm font-normal">Corner Property</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="px-8 py-3">
                Back
              </Button>
              <Button type="submit" disabled={!isFormValid()} className="px-8 py-3 bg-red-500 hover:bg-red-600">
                Save & Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}