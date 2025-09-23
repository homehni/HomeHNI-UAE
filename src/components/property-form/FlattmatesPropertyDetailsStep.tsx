import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FlattmatesPropertyDetails {
  apartmentType: string;
  apartmentName?: string; // Optional apartment name field
  bhkType: string;
  floorNo: number | string;
  totalFloors: number | string;
  roomType: string;
  tenantType: string;
  facing: string;
  builtUpArea: number;
  propertyAge: string;
}

interface FlattmatesPropertyDetailsStepProps {
  initialData?: Partial<FlattmatesPropertyDetails>;
  onNext: (data: FlattmatesPropertyDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  formId?: string;
}

export function FlattmatesPropertyDetailsStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps,
  completedSteps,
  formId
}: FlattmatesPropertyDetailsStepProps) {
  const [formData, setFormData] = useState<FlattmatesPropertyDetails>({
    apartmentType: '',
    apartmentName: '', // Initialize apartment name field
    bhkType: '',
    floorNo: 0,
    totalFloors: 0,
    roomType: '',
    tenantType: '',
    facing: '',
    builtUpArea: 0,
    propertyAge: '',
    ...initialData,
  });

  // Debug: Log formData changes
  useEffect(() => {
    console.log('FlattmatesPropertyDetailsStep formData updated:', formData);
  }, [formData]);

  // Get minimum total floors based on selected floor
  const getMinTotalFloors = () => {
    if (typeof formData.floorNo === 'number' && formData.floorNo > 0) {
      return formData.floorNo;
    }
    return 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('=== FlattmatesPropertyDetailsStep handleSubmit called ===');
    console.log('Event:', e);
    console.log('Event type:', e.type);
    console.log('Event target:', e.target);
    console.log('Form data:', formData);
    console.log('onNext function:', onNext);
    console.log('onNext function type:', typeof onNext);
    e.preventDefault();
    if (isFormValid()) {
      console.log('Form is valid, calling onNext with data:', formData);
      console.log('About to call onNext...');
      try {
        onNext(formData);
        console.log('onNext called successfully');
      } catch (error) {
        console.error('Error calling onNext:', error);
      }
    } else {
      console.log('Form is not valid');
    }
    console.log('=== FlattmatesPropertyDetailsStep handleSubmit completed ===');
  };

  const isFormValid = () => {
    return true; // All fields are now optional
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Property Details</h2>
      </div>

      <form id={formId || 'flatmates-step-form'} onSubmit={handleSubmit} className="space-y-6">
                {/* Apartment Type and BHK Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apartmentType">Type of Property</Label>
                    <Select
                      value={formData.apartmentType}
                      onValueChange={(value) => {
                        console.log('Apartment Type changed to:', value);
                        setFormData({ 
                          ...formData, 
                          apartmentType: value,
                          // Clear apartment name if not Apartment type
                          apartmentName: value === 'Apartment' ? formData.apartmentName : ''
                        });
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select apartment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Independent House/Villa">Independent House/Villa</SelectItem>
                        <SelectItem value="Gated Community Villa">Gated Community Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bhkType">BHK Type</Label>
                    <Select
                      value={formData.bhkType}
                      onValueChange={(value) => {
                        console.log('BHK Type changed to:', value);
                        setFormData({ ...formData, bhkType: value });
                      }}
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

                {/* Conditional Apartment Name Field - Half Width */}
                {formData.apartmentType === 'Apartment' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="apartmentName">Apartment Name (Optional)</Label>
                      <Input
                        id="apartmentName"
                        type="text"
                        placeholder="Enter apartment/society name"
                        value={formData.apartmentName || ''}
                        onChange={(e) => setFormData({ ...formData, apartmentName: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    {/* Empty div to maintain grid structure */}
                    <div></div>
                  </div>
                )}

                {/* Floor and Total Floors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floorNo">Floor</Label>
                    <Select
                      value={
                        formData.floorNo === undefined ? undefined :
                        formData.floorNo === 0 ? '0' :
                        formData.floorNo.toString()
                      }
                      onValueChange={(value) => {
                        if (value === 'lower' || value === 'upper' || value === '99+') {
                          setFormData({ ...formData, floorNo: value as any });
                        } else {
                          const newFloorNo = parseInt(value);
                          const currentTotalFloors = formData.totalFloors;
                          
                          // If the new floor number is higher than current total floors, update total floors
                          if (typeof currentTotalFloors === 'number' && newFloorNo > currentTotalFloors) {
                            setFormData({ 
                              ...formData, 
                              floorNo: newFloorNo,
                              totalFloors: newFloorNo
                            });
                          } else {
                            setFormData({ ...formData, floorNo: newFloorNo });
                          }
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
                      value={
                        formData.totalFloors === undefined ? undefined :
                        formData.totalFloors.toString()
                      }
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
                        {formData.floorNo === 0 && (
                          <SelectItem value="0">Ground</SelectItem>
                        )}
                        {[...Array(99)].map((_, i) => {
                          const floor = i + 1;
                          const minFloors = getMinTotalFloors();
                          if (floor >= minFloors) {
                            return (
                              <SelectItem key={floor} value={floor.toString()}>
                                {floor}
                              </SelectItem>
                            );
                          }
                          return null;
                        }).filter(Boolean)}
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

                {/* Facing and Built Up Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="builtUpArea">Built Up Area</Label>
                    <div className="relative">
                      <Input
                        id="builtUpArea"
                        type="number"
                        min="1"
                        value={formData.builtUpArea || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setFormData({ ...formData, builtUpArea: value >= 1 ? value : undefined });
                        }}
                        className="h-12 pr-16 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                        onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); setFormData({ ...formData, builtUpArea: digits ? Math.max(1, Number(digits)) : undefined }); } }}
                        placeholder="Enter area"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        Sq.ft
                      </span>
                    </div>
                  </div>
                </div>

              </form>
    </div>
  );
}