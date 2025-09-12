import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X, Loader2 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  power_backup?: string;
  current_property_condition?: string;
  water_supply?: string;
  gated_security?: boolean;
  amenities?: {
    lift?: string;
    parking?: string;
    security?: string;
    waterStorageFacility?: string;
    wifi?: string;
    [key: string]: any;
  };
}

interface PropertyFormData extends Partial<Property> {
  lift?: string;
  parking?: string;
  security?: string;
  waterStorageFacility?: string;
  wifi?: string;
  power_backup?: string;
  current_property_condition?: string;
  water_supply?: string;
  gated_security?: boolean;
}

interface PropertyEditModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onPropertyUpdated: () => void;
}

export const PropertyEditModal: React.FC<PropertyEditModalProps> = ({
  property,
  isOpen,
  onClose,
  onPropertyUpdated
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({});

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        property_type: property.property_type,
        listing_type: property.listing_type,
        bhk_type: property.bhk_type,
        expected_price: property.expected_price,
        super_area: property.super_area,
        carpet_area: property.carpet_area,
        bathrooms: property.bathrooms,
        balconies: property.balconies,
        city: property.city,
        locality: property.locality,
        state: property.state,
        pincode: property.pincode,
        description: property.description,
        status: property.status,
        // Amenities from individual columns
        power_backup: property.power_backup || '',
        current_property_condition: property.current_property_condition || '',
        water_supply: property.water_supply || '',
        gated_security: property.gated_security || false,
        // Amenities from JSON column
        lift: property.amenities?.lift || '',
        parking: property.amenities?.parking || '',
        security: property.amenities?.security || '',
        waterStorageFacility: property.amenities?.waterStorageFacility || '',
        wifi: property.amenities?.wifi || ''
      });
    }
  }, [property]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!property) return;

    setIsLoading(true);
    try {
      // Prepare amenities JSON data
      const amenitiesData = {
        ...property.amenities,
        lift: formData.lift || 'not-available',
        parking: formData.parking || 'none',
        security: formData.security || 'no',
        waterStorageFacility: formData.waterStorageFacility || 'none',
        wifi: formData.wifi || 'not-available'
      };

      const { error } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          property_type: formData.property_type,
          listing_type: formData.listing_type,
          bhk_type: formData.bhk_type,
          expected_price: Number(formData.expected_price),
          super_area: formData.super_area ? Number(formData.super_area) : null,
          carpet_area: formData.carpet_area ? Number(formData.carpet_area) : null,
          bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
          balconies: formData.balconies ? Number(formData.balconies) : null,
          city: formData.city,
          locality: formData.locality,
          state: formData.state,
          pincode: formData.pincode,
          description: formData.description,
          status: formData.status,
          // Individual amenity columns
          power_backup: formData.power_backup,
          current_property_condition: formData.current_property_condition,
          water_supply: formData.water_supply,
          gated_security: formData.gated_security,
          // Amenities JSON column
          amenities: amenitiesData,
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Property updated successfully.",
      });

      onPropertyUpdated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!property) return null;

  const propertyTypes = [
    'apartment', 'villa', 'independent_house', 'builder_floor', 'plot', 'commercial', 'office', 'shop'
  ];

  const bhkTypes = [
    '1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+', '6bhk'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">Edit Property</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Title *</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter property title"
              />
            </div>

            <div className="space-y-2">
              <Label>Property Type *</Label>
              <Select
                value={formData.property_type || ''}
                onValueChange={(value) => handleInputChange('property_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Listing Type *</Label>
              <Select
                value={formData.listing_type || ''}
                onValueChange={(value) => handleInputChange('listing_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>BHK Type</Label>
              <Select
                value={formData.bhk_type || ''}
                onValueChange={(value) => handleInputChange('bhk_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select BHK type" />
                </SelectTrigger>
                <SelectContent>
                  {bhkTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price and Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Expected Price (₹) *</Label>
              <Input
                type="number"
                value={formData.expected_price || ''}
                onChange={(e) => handleInputChange('expected_price', Number(e.target.value))}
                placeholder="Enter expected price"
              />
            </div>

            <div className="space-y-2">
              <Label>Super Area (sqft)</Label>
              <Input
                type="number"
                value={formData.super_area || ''}
                onChange={(e) => handleInputChange('super_area', Number(e.target.value))}
                placeholder="Enter super area"
              />
            </div>

            <div className="space-y-2">
              <Label>Carpet Area (sqft)</Label>
              <Input
                type="number"
                value={formData.carpet_area || ''}
                onChange={(e) => handleInputChange('carpet_area', Number(e.target.value))}
                placeholder="Enter carpet area"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                placeholder="Number of bathrooms"
              />
            </div>

            <div className="space-y-2">
              <Label>Balconies</Label>
              <Input
                type="number"
                value={formData.balconies || ''}
                onChange={(e) => handleInputChange('balconies', Number(e.target.value))}
                placeholder="Number of balconies"
              />
            </div>
          </div>

          {/* Additional Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Amenities</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Power Backup</Label>
                <Select
                  value={formData.power_backup || ''}
                  onValueChange={(value) => handleInputChange('power_backup', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select power backup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Backup</SelectItem>
                    <SelectItem value="partial">Partial Backup</SelectItem>
                    <SelectItem value="none">No Backup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Lift</Label>
                <Select
                  value={formData.lift || ''}
                  onValueChange={(value) => handleInputChange('lift', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="not-available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Parking</Label>
                <Select
                  value={formData.parking || ''}
                  onValueChange={(value) => handleInputChange('parking', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">Bike Parking</SelectItem>
                    <SelectItem value="car">Car Parking</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="none">No Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Water Storage Facility</Label>
                <Select
                  value={formData.waterStorageFacility || ''}
                  onValueChange={(value) => handleInputChange('waterStorageFacility', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overhead-tank">Overhead Tank</SelectItem>
                    <SelectItem value="underground-tank">Underground Tank</SelectItem>
                    <SelectItem value="borewell">Borewell</SelectItem>
                    <SelectItem value="municipal">Municipal Supply</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Security</Label>
                <Select
                  value={formData.security || ''}
                  onValueChange={(value) => handleInputChange('security', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Available</SelectItem>
                    <SelectItem value="no">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>WiFi</Label>
                <Select
                  value={formData.wifi || ''}
                  onValueChange={(value) => handleInputChange('wifi', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="not-available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current Property Condition</Label>
              <Select
                value={formData.current_property_condition || ''}
                onValueChange={(value) => handleInputChange('current_property_condition', value)}
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="needs-renovation">Needs Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State *</Label>
              <Input
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Enter state"
              />
            </div>

            <div className="space-y-2">
              <Label>City *</Label>
              <Input
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label>Locality *</Label>
              <Input
                value={formData.locality || ''}
                onChange={(e) => handleInputChange('locality', e.target.value)}
                placeholder="Enter locality"
              />
            </div>

            <div className="space-y-2">
              <Label>Pincode *</Label>
              <Input
                value={formData.pincode || ''}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="Enter pincode"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status || ''}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter property description"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-brand-red hover:bg-brand-red-dark"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};