import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bed, 
  Bath, 
  Car, 
  Wifi, 
  Zap, 
  Shield,
  Droplets,
  Plus,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

// Define the interface without whoWillShow and secondaryNumber
interface FlattmatesAmenities {
  // Living Arrangements
  attachedBathroom: boolean;
  balcony: boolean;
  
  // Furnishing
  bed: boolean;
  wardrobe: boolean;
  ac: boolean;
  geyser: boolean;
  
  // Property Features
  powerBackup: boolean;
  wifi: boolean;
  parking: string;
  lift: boolean;
  
  // Security & Utilities
  gatedSecurity: boolean;
  waterSupply: string;
  directionsTip: string;
  
  // Available Amenities
  selectedAmenities: string[];
}

interface FlattmatesAmenitiesStepProps {
  initialData?: Partial<FlattmatesAmenities>;
  onNext: (data: FlattmatesAmenities) => void;
  onBack: () => void;
}

export const FlattmatesAmenitiesStep: React.FC<FlattmatesAmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const [formData, setFormData] = useState<FlattmatesAmenities>({
    // Living Arrangements
    attachedBathroom: initialData.attachedBathroom || false,
    balcony: initialData.balcony || false,
    
    // Furnishing
    bed: initialData.bed || false,
    wardrobe: initialData.wardrobe || false,
    ac: initialData.ac || false,
    geyser: initialData.geyser || false,
    
    // Property Features
    powerBackup: initialData.powerBackup || false,
    wifi: initialData.wifi || false,
    parking: initialData.parking || 'none',
    lift: initialData.lift || false,
    
    // Security & Utilities
    gatedSecurity: initialData.gatedSecurity || false,
    waterSupply: initialData.waterSupply || '',
    directionsTip: initialData.directionsTip || '',
    
    // Available Amenities
    selectedAmenities: initialData.selectedAmenities || [],
  });

  const handleSwitchChange = (field: keyof FlattmatesAmenities) => (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: keyof FlattmatesAmenities) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  const amenityOptions = [
    { id: 'gym', label: 'Gym', icon: '🏋️' },
    { id: 'swimming-pool', label: 'Swimming Pool', icon: '🏊' },
    { id: 'garden', label: 'Garden', icon: '🌿' },
    { id: 'clubhouse', label: 'Clubhouse', icon: '🏛️' },
    { id: 'park', label: 'Park', icon: '🌳' },
    { id: 'security', label: '24/7 Security', icon: '🛡️' },
    { id: 'power-backup', label: 'Power Backup', icon: '⚡' },
    { id: 'lift', label: 'Lift', icon: '🛗' },
    { id: 'parking', label: 'Parking', icon: '🚗' },
    { id: 'water-supply', label: 'Water Supply', icon: '💧' },
  ];

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenityId)
        ? prev.selectedAmenities.filter(id => id !== amenityId)
        : [...prev.selectedAmenities, amenityId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Property Amenities</h2>
        <p className="text-gray-600">Select the amenities and facilities available in your property</p>
      </div>

      {/* Living Arrangements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="w-5 h-5" />
            Living Arrangements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="attachedBathroom" className="flex items-center space-x-2">
                <Bath className="w-4 h-4" />
                <span>Attached Bathroom</span>
              </Label>
              <Switch
                id="attachedBathroom"
                checked={formData.attachedBathroom}
                onCheckedChange={handleSwitchChange('attachedBathroom')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="balcony" className="flex items-center space-x-2">
                <span>🪟</span>
                <span>Balcony</span>
              </Label>
              <Switch
                id="balcony"
                checked={formData.balcony}
                onCheckedChange={handleSwitchChange('balcony')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Furnishing */}
      <Card>
        <CardHeader>
          <CardTitle>Furnishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="bed">Bed</Label>
              <Switch
                id="bed"
                checked={formData.bed}
                onCheckedChange={handleSwitchChange('bed')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="wardrobe">Wardrobe</Label>
              <Switch
                id="wardrobe"
                checked={formData.wardrobe}
                onCheckedChange={handleSwitchChange('wardrobe')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ac">AC</Label>
              <Switch
                id="ac"
                checked={formData.ac}
                onCheckedChange={handleSwitchChange('ac')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="geyser">Geyser</Label>
              <Switch
                id="geyser"
                checked={formData.geyser}
                onCheckedChange={handleSwitchChange('geyser')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Features */}
      <Card>
        <CardHeader>
          <CardTitle>Property Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="powerBackup" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Power Backup</span>
              </Label>
              <Switch
                id="powerBackup"
                checked={formData.powerBackup}
                onCheckedChange={handleSwitchChange('powerBackup')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="wifi" className="flex items-center space-x-2">
                <Wifi className="w-4 h-4" />
                <span>WiFi</span>
              </Label>
              <Switch
                id="wifi"
                checked={formData.wifi}
                onCheckedChange={handleSwitchChange('wifi')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking" className="flex items-center space-x-2">
                <Car className="w-4 h-4" />
                <span>Parking</span>
              </Label>
              <Select
                value={formData.parking}
                onValueChange={handleInputChange('parking')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parking type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parking</SelectItem>
                  <SelectItem value="bike">Bike Parking</SelectItem>
                  <SelectItem value="car">Car Parking</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lift">Lift</Label>
              <Switch
                id="lift"
                checked={formData.lift}
                onCheckedChange={handleSwitchChange('lift')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Utilities */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Utilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="gatedSecurity" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Gated Security</span>
              </Label>
              <Switch
                id="gatedSecurity"
                checked={formData.gatedSecurity}
                onCheckedChange={handleSwitchChange('gatedSecurity')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waterSupply" className="flex items-center space-x-2">
                <Droplets className="w-4 h-4" />
                <span>Water Supply</span>
              </Label>
              <Select
                value={formData.waterSupply}
                onValueChange={handleInputChange('waterSupply')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select water supply" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Municipal">Municipal Water</SelectItem>
                  <SelectItem value="Borewell">Borewell</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Available Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {amenityOptions.map((amenity) => (
              <div
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                  formData.selectedAmenities.includes(amenity.id)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{amenity.icon}</div>
                <div className="text-sm font-medium">{amenity.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Directions Tip */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Directions Tip
            <Badge variant="secondary">Optional</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="directionsTip">Add directions for tenants</Label>
            <Textarea
              id="directionsTip"
              value={formData.directionsTip}
              onChange={(e) => handleInputChange('directionsTip')(e.target.value)}
              placeholder="Provide helpful directions to reach your property..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};