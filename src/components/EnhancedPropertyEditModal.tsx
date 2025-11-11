import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  furnishing?: string;
  availability_type?: string;
  created_at: string;
}

interface EnhancedPropertyEditModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onPropertyUpdated: () => void;
}

export const EnhancedPropertyEditModal: React.FC<EnhancedPropertyEditModalProps> = ({
  property,
  isOpen,
  onClose,
  onPropertyUpdated
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});

  // Predefined options for dropdowns
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'independent_house', label: 'Independent House' },
    { value: 'builder_floor', label: 'Builder Floor' },
    { value: 'plot', label: 'Plot/Land' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'office', label: 'Office Space' },
    { value: 'shop', label: 'Shop/Showroom' }
  ];

  const listingTypes = [
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' }
  ];

  const bhkTypes = [
    { value: '1rk', label: '1 RK' },
    { value: '1bhk', label: '1 BHK' },
    { value: '2bhk', label: '2 BHK' },
    { value: '3bhk', label: '3 BHK' },
    { value: '4bhk', label: '4 BHK' },
    { value: '5bhk', label: '5 BHK' },
    { value: '5bhk+', label: '5+ BHK' },
    { value: '6bhk', label: '6 BHK' }
  ];

  const furnishingOptions = [
    { value: 'fully_furnished', label: 'Fully Furnished' },
    { value: 'semi_furnished', label: 'Semi Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' }
  ];

  const availabilityOptions = [
    { value: 'ready_to_move', label: 'Ready to Move' },
    { value: 'under_construction', label: 'Under Construction' }
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ];

  const majorCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
    'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik'
  ];

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
        furnishing: property.furnishing,
        availability_type: property.availability_type
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
          furnishing: formData.furnishing,
          availability_type: formData.availability_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Property updated successfully and changes are live!",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">Edit Property - Live Changes</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Title */}
          <div className="space-y-2">
            <Label>Property Title</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter property title"
            />
          </div>

          {/* Basic Information - Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select
                value={formData.property_type || ''}
                onValueChange={(value) => handleInputChange('property_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Listing Type</Label>
              <Select
                value={formData.listing_type || ''}
                onValueChange={(value) => handleInputChange('listing_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  {listingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
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
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Furnishing</Label>
              <Select
                value={formData.furnishing || ''}
                onValueChange={(value) => handleInputChange('furnishing', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select furnishing" />
                </SelectTrigger>
                <SelectContent>
                  {furnishingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                value={formData.availability_type || ''}
                onValueChange={(value) => handleInputChange('availability_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price and Area */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Expected Price (₹)</Label>
              <Input
                type="number"
                value={formData.expected_price || ''}
                onChange={(e) => handleInputChange('expected_price', Number(e.target.value))}
                placeholder="Enter price"
              />
            </div>

            <div className="space-y-2">
              <Label>Super Area (sqft)</Label>
              <Input
                type="number"
                value={formData.super_area || ''}
                onChange={(e) => handleInputChange('super_area', Number(e.target.value))}
                placeholder="Enter area"
              />
            </div>

            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Select
                value={formData.bathrooms?.toString() || ''}
                onValueChange={(value) => handleInputChange('bathrooms', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Balconies</Label>
              <Select
                value={formData.balconies?.toString() || ''}
                onValueChange={(value) => handleInputChange('balconies', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={formData.state || ''}
                onValueChange={(value) => handleInputChange('state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              <Select
                value={formData.city || ''}
                onValueChange={(value) => handleInputChange('city', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {majorCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Locality</Label>
              <Input
                value={formData.locality || ''}
                onChange={(e) => handleInputChange('locality', e.target.value)}
                placeholder="Enter locality"
              />
            </div>

            <div className="space-y-2">
              <Label>Pincode</Label>
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
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving Live Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save & Publish Live
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
