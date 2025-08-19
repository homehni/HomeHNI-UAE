import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Key, 
  Droplets, 
  Plus, 
  Dumbbell, 
  Shield, 
  MoveUp,
  Waves,
  Building,
  Zap,
  TreePine,
  ShoppingBag,
  Users,
  Phone,
  Fuel,
  Recycle,
  Car,
  ShieldCheck 
} from 'lucide-react';

interface FlattmatesAmenities {
  // Room Details
  attachedBathroom: boolean;
  acRoom: boolean;
  balcony: boolean;
  
  // Flatmate Preference
  nonVegAllowed: boolean;
  smokingAllowed: boolean;
  drinkingAllowed: boolean;
  
  // Additional Details
  gym: boolean;
  gatedSecurity: boolean;
  whoWillShow: string;
  secondaryNumber: string;
  waterSupply: string;
  directionsTip: string;
  
  // Available Amenities
  selectedAmenities: string[];
}

interface FlattmatesAmenitiesStepProps {
  initialData?: Partial<FlattmatesAmenities>;
  onNext: (data: FlattmatesAmenities) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

const amenitiesList = [
  { key: 'lift', label: 'Lift', icon: MoveUp },
  { key: 'swimming-pool', label: 'Swimming Pool', icon: Waves },
  { key: 'club-house', label: 'Club House', icon: Building },
  { key: 'power-backup', label: 'Power Backup', icon: Zap },
  { key: 'park', label: 'Park', icon: TreePine },
  { key: 'shopping-center', label: 'Shopping Center', icon: ShoppingBag },
  { key: 'house-keeping', label: 'House Keeping', icon: Users },
  { key: 'intercom', label: 'Intercom', icon: Phone },
  { key: 'gas-pipeline', label: 'Gas Pipeline', icon: Fuel },
  { key: 'sewage-treatment', label: 'Sewage Treatment Plant', icon: Recycle },
  { key: 'visitor-parking', label: 'Visitor Parking', icon: Car },
  { key: 'fire-safety', label: 'Fire Safety', icon: ShieldCheck },
];

export function FlattmatesAmenitiesStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps,
  completedSteps 
}: FlattmatesAmenitiesStepProps) {
  const [formData, setFormData] = useState<FlattmatesAmenities>({
    attachedBathroom: false,
    acRoom: false,
    balcony: false,
    nonVegAllowed: false,
    smokingAllowed: false,
    drinkingAllowed: false,
    gym: false,
    gatedSecurity: false,
    whoWillShow: '',
    secondaryNumber: '',
    waterSupply: '',
    directionsTip: '',
    selectedAmenities: [],
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleAmenityToggle = (amenityKey: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenityKey)
        ? prev.selectedAmenities.filter(a => a !== amenityKey)
        : [...prev.selectedAmenities, amenityKey]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Amenities</h2>
        <p className="text-muted-foreground">Tell us about the amenities and preferences</p>
      </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Room Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Room Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor="attachedBathroom" className="text-base font-medium">
                        Attached Bathroom *
                      </Label>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${!formData.attachedBathroom ? 'text-foreground' : 'text-muted-foreground'}`}>
                          No
                        </span>
                        <Switch
                          id="attachedBathroom"
                          checked={formData.attachedBathroom}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, attachedBathroom: checked }))}
                        />
                        <span className={`text-sm ${formData.attachedBathroom ? 'text-foreground' : 'text-muted-foreground'}`}>
                          Yes
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor="acRoom" className="text-base font-medium">
                        AC Room *
                      </Label>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${!formData.acRoom ? 'text-foreground' : 'text-muted-foreground'}`}>
                          No
                        </span>
                        <Switch
                          id="acRoom"
                          checked={formData.acRoom}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acRoom: checked }))}
                        />
                        <span className={`text-sm ${formData.acRoom ? 'text-foreground' : 'text-muted-foreground'}`}>
                          Yes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Balcony - Single field, can be full width */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="balcony" className="text-base font-medium">
                      Balcony
                    </Label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${!formData.balcony ? 'text-foreground' : 'text-muted-foreground'}`}>
                        No
                      </span>
                      <Switch
                        id="balcony"
                        checked={formData.balcony}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, balcony: checked }))}
                      />
                      <span className={`text-sm ${formData.balcony ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Yes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flatmate Preference */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Flatmate Preference</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor="nonVegAllowed" className="text-base font-medium">
                        Non-Veg Allowed *
                      </Label>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${!formData.nonVegAllowed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          No
                        </span>
                        <Switch
                          id="nonVegAllowed"
                          checked={formData.nonVegAllowed}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, nonVegAllowed: checked }))}
                        />
                        <span className={`text-sm ${formData.nonVegAllowed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          Yes
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor="smokingAllowed" className="text-base font-medium">
                        Smoking Allowed
                      </Label>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${!formData.smokingAllowed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          No
                        </span>
                        <Switch
                          id="smokingAllowed"
                          checked={formData.smokingAllowed}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, smokingAllowed: checked }))}
                        />
                        <span className={`text-sm ${formData.smokingAllowed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          Yes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Drinking Allowed - Single field */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="drinkingAllowed" className="text-base font-medium">
                      Drinking Allowed
                    </Label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${!formData.drinkingAllowed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        No
                      </span>
                      <Switch
                        id="drinkingAllowed"
                        checked={formData.drinkingAllowed}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, drinkingAllowed: checked }))}
                      />
                      <span className={`text-sm ${formData.drinkingAllowed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Yes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Additional Details for maximum visibility</h3>
                  
                  {/* Gym and Gated Security */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor="gym" className="text-base font-medium flex items-center space-x-2">
                        <Dumbbell className="w-4 h-4" />
                        <span>Gym *</span>
                      </Label>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${!formData.gym ? 'text-foreground' : 'text-muted-foreground'}`}>
                          No
                        </span>
                        <Switch
                          id="gym"
                          checked={formData.gym}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, gym: checked }))}
                        />
                        <span className={`text-sm ${formData.gym ? 'text-foreground' : 'text-muted-foreground'}`}>
                          Yes
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <Label htmlFor="gatedSecurity" className="text-base font-medium flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Gated Security *</span>
                      </Label>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${!formData.gatedSecurity ? 'text-foreground' : 'text-muted-foreground'}`}>
                          No
                        </span>
                        <Switch
                          id="gatedSecurity"
                          checked={formData.gatedSecurity}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, gatedSecurity: checked }))}
                        />
                        <span className={`text-sm ${formData.gatedSecurity ? 'text-foreground' : 'text-muted-foreground'}`}>
                          Yes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Who will show and Water Supply */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whoWillShow" className="flex items-center space-x-2">
                        <Key className="w-4 h-4" />
                        <span>Who will show the property? *</span>
                      </Label>
                      <Select
                        value={formData.whoWillShow}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, whoWillShow: value }))}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="Owner">I will show</SelectItem>
                          <SelectItem value="Agent">Agent will show</SelectItem>
                          <SelectItem value="Tenant">Current tenant will show</SelectItem>
                          <SelectItem value="Neighbor">Neighbor will show</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="waterSupply" className="flex items-center space-x-2">
                        <Droplets className="w-4 h-4" />
                        <span>Water Supply</span>
                      </Label>
                      <Select
                        value={formData.waterSupply}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, waterSupply: value }))}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="Municipal">Municipal Corporation</SelectItem>
                          <SelectItem value="Borewell">Borewell</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Secondary Number - Full width */}
                  <div className="space-y-2">
                    <Label htmlFor="secondaryNumber">Secondary Number</Label>
                    <div className="flex space-x-2">
                      <div className="w-16 h-12 border rounded-lg flex items-center justify-center text-muted-foreground">
                        +91
                      </div>
                      <Input
                        id="secondaryNumber"
                        type="tel"
                        value={formData.secondaryNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, secondaryNumber: e.target.value }))}
                        placeholder="Secondary Number"
                        className="h-12 flex-1"
                      />
                    </div>
                  </div>

                  {/* Directions Tip - Full width */}
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-primary" />
                      <h4 className="text-base font-medium text-foreground">Add Directions Tip for your tenants</h4>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">NEW</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Don't want calls asking location? Add directions to reach using landmarks
                    </p>
                    <Textarea
                      value={formData.directionsTip}
                      onChange={(e) => setFormData(prev => ({ ...prev, directionsTip: e.target.value }))}
                      placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Available Amenities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Select the available amenities</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesList.map((amenity) => {
                      const IconComponent = amenity.icon;
                      const isSelected = formData.selectedAmenities.includes(amenity.key);
                      
                      return (
                        <div
                          key={amenity.key}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleAmenityToggle(amenity.key)}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleAmenityToggle(amenity.key)}
                            />
                            <IconComponent className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{amenity.label}</span>
                          </div>
                        </div>
                      );
                    })}
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