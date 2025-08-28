import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface FlattmatesPropertyDetails {
  apartmentType: string;
  bhkType: string;
  floorNo: number | string;
  totalFloors: number | string;
  roomType: string;
  tenantType: string;
  propertyAge: string;
  facing: string;
  builtUpArea: number;
}

interface FlattmatesPropertyDetailsStepProps {
  initialData?: Partial<FlattmatesPropertyDetails>;
  onNext: (data: FlattmatesPropertyDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export function FlattmatesPropertyDetailsStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps,
  completedSteps 
}: FlattmatesPropertyDetailsStepProps) {
  const [formData, setFormData] = useState<FlattmatesPropertyDetails>({
    apartmentType: '',
    bhkType: '',
    floorNo: 0,
    totalFloors: 0,
    roomType: '',
    tenantType: '',
    propertyAge: '',
    facing: '',
    builtUpArea: 0,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return true; // All fields are now optional
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Property Details</h2>
        <p className="text-muted-foreground">Tell us about your property for flatmates</p>
      </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Apartment Type and BHK Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apartmentType">Type of Property</Label>
                    <Select
                      value={formData.apartmentType}
                      onValueChange={(value) => setFormData({ ...formData, apartmentType: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select apartment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Independent House">Independent House</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Builder Floor">Builder Floor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bhkType">BHK Type</Label>
                    <Select
                      value={formData.bhkType}
                      onValueChange={(value) => setFormData({ ...formData, bhkType: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select BHK configuration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 BHK">1 BHK</SelectItem>
                        <SelectItem value="2 BHK">2 BHK</SelectItem>
                        <SelectItem value="3 BHK">3 BHK</SelectItem>
                        <SelectItem value="4 BHK">4 BHK</SelectItem>
                        <SelectItem value="5+ BHK">5+ BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Floor and Total Floors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floorNo">Floor</Label>
                    <Select
                      value={formData.floorNo?.toString()}
                      onValueChange={(value) => {
                        if (value === 'lower' || value === 'upper' || value === '99+') {
                          setFormData({ ...formData, floorNo: value as any });
                        } else {
                          setFormData({ ...formData, floorNo: parseInt(value) });
                        }
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select floor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lower">Lower Basement</SelectItem>
                        <SelectItem value="upper">Upper Basement</SelectItem>
                        <SelectItem value="0">Ground Floor</SelectItem>
                        {[...Array(99)].map((_, i) => {
                          const floor = i + 1;
                          return (
                            <SelectItem key={floor} value={floor.toString()}>
                              {floor}
                            </SelectItem>
                          );
                        })}
                        <SelectItem value="99+">99+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalFloors">Total Floor</Label>
                    <Select
                      value={formData.totalFloors?.toString()}
                      onValueChange={(value) => {
                        if (value === '99+') {
                          setFormData({ ...formData, totalFloors: value as any });
                        } else {
                          setFormData({ ...formData, totalFloors: parseInt(value) });
                        }
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select total floors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Ground</SelectItem>
                        {[...Array(99)].map((_, i) => {
                          const floor = i + 1;
                          return (
                            <SelectItem key={floor} value={floor.toString()}>
                              {floor}
                            </SelectItem>
                          );
                        })}
                        <SelectItem value="99+">99+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Room Type and Tenant Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select
                      value={formData.roomType}
                      onValueChange={(value) => setFormData({ ...formData, roomType: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select room sharing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single Room">Single Room</SelectItem>
                        <SelectItem value="Shared Room">Shared Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tenantType">Tenant Type</Label>
                    <Select
                      value={formData.tenantType}
                      onValueChange={(value) => setFormData({ ...formData, tenantType: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select preferred tenant gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Property Age and Facing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyAge">Property Age</Label>
                    <Select
                      value={formData.propertyAge}
                      onValueChange={(value) => setFormData({ ...formData, propertyAge: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select property age range" />
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
                    <Label htmlFor="facing">Facing</Label>
                    <Select
                      value={formData.facing}
                      onValueChange={(value) => setFormData({ ...formData, facing: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select property facing direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                        <SelectItem value="East">East</SelectItem>
                        <SelectItem value="West">West</SelectItem>
                        <SelectItem value="North-East">North-East</SelectItem>
                        <SelectItem value="North-West">North-West</SelectItem>
                        <SelectItem value="South-East">South-East</SelectItem>
                        <SelectItem value="South-West">South-West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Built Up Area - keeping full width as it's important */}
                <div className="space-y-2">
                  <Label htmlFor="builtUpArea">Built Up Area</Label>
                  <div className="relative">
                    <Input
                      id="builtUpArea"
                      type="number"
                      value={formData.builtUpArea || ''}
                      onChange={(e) => setFormData({ ...formData, builtUpArea: parseInt(e.target.value) || 0 })}
                      placeholder="Enter area"
                      className="h-12 pr-16"
                      min="1"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      Sq.ft
                    </span>
                  </div>
                </div>

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