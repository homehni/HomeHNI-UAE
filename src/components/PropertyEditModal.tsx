import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Save, X, Loader2, Plus, Minus, PawPrint, Dumbbell, UtensilsCrossed, 
  Shield, MoveUp, Wifi, AirVent, MessageCircle, Users, Waves, Flame, 
  Car, Building2, Droplets, Wrench, Trees, Trash2, Zap, ShieldCheck, 
  ShoppingCart, Accessibility, Sparkles, PersonStanding 
} from 'lucide-react';

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
  who_will_show?: string;
  secondary_phone?: string;
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
  // Basic fields
  waterSupply?: string;
  petAllowed?: boolean;
  gym?: boolean;
  nonVegAllowed?: boolean;
  gatedSecurity?: boolean;
  whoWillShow?: string;
  currentPropertyCondition?: string;
  secondaryNumber?: string;
  moreSimilarUnits?: boolean;
  directionsTip?: string;
  
  // Checkbox amenities
  lift?: string;
  internetServices?: string;
  airConditioner?: string;
  clubHouse?: string;
  intercom?: string;
  swimmingPool?: string;
  childrenPlayArea?: string;
  fireSafety?: string;
  servantRoom?: string;
  shoppingCenter?: string;
  gasPipeline?: string;
  park?: string;
  rainWaterHarvesting?: string;
  sewageTreatmentPlant?: string;
  houseKeeping?: string;
  powerBackup?: string;
  visitorParking?: string;
  waterStorageFacility?: string;
  security?: string;
  wifi?: string;
  parking?: string;
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
        
        // Basic amenity fields
        waterSupply: property.water_supply || '',
        petAllowed: property.amenities?.petAllowed || false,
        gym: property.amenities?.gym || false,
        nonVegAllowed: property.amenities?.nonVegAllowed || false,
        gatedSecurity: property.gated_security || false,
        whoWillShow: property.who_will_show || property.amenities?.whoWillShow || '',
        currentPropertyCondition: property.current_property_condition || '',
        secondaryNumber: property.secondary_phone || property.amenities?.secondaryNumber || '',
        moreSimilarUnits: property.amenities?.moreSimilarUnits || false,
        directionsTip: property.amenities?.directionsTip || '',
        
        // Checkbox amenities
        lift: property.amenities?.lift || 'Not Available',
        internetServices: property.amenities?.internetServices || 'Not Available',
        airConditioner: property.amenities?.airConditioner || 'Not Available',
        clubHouse: property.amenities?.clubHouse || 'Not Available',
        intercom: property.amenities?.intercom || 'Not Available',
        swimmingPool: property.amenities?.swimmingPool || 'Not Available',
        childrenPlayArea: property.amenities?.childrenPlayArea || 'Not Available',
        fireSafety: property.amenities?.fireSafety || 'Not Available',
        servantRoom: property.amenities?.servantRoom || 'Not Available',
        shoppingCenter: property.amenities?.shoppingCenter || 'Not Available',
        gasPipeline: property.amenities?.gasPipeline || 'Not Available',
        park: property.amenities?.park || 'Not Available',
        rainWaterHarvesting: property.amenities?.rainWaterHarvesting || 'Not Available',
        sewageTreatmentPlant: property.amenities?.sewageTreatmentPlant || 'Not Available',
        houseKeeping: property.amenities?.houseKeeping || 'Not Available',
        powerBackup: property.amenities?.powerBackup || 'Not Available',
        visitorParking: property.amenities?.visitorParking || 'Not Available',
        waterStorageFacility: property.amenities?.waterStorageFacility || 'Not Available',
        security: property.amenities?.security || 'Not Available',
        wifi: property.amenities?.wifi || 'Not Available',
        parking: property.amenities?.parking || ''
      });
    }
  }, [property]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
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
        petAllowed: formData.petAllowed,
        gym: formData.gym,
        nonVegAllowed: formData.nonVegAllowed,
        whoWillShow: formData.whoWillShow,
        secondaryNumber: formData.secondaryNumber,
        moreSimilarUnits: formData.moreSimilarUnits,
        directionsTip: formData.directionsTip,
        lift: formData.lift,
        internetServices: formData.internetServices,
        airConditioner: formData.airConditioner,
        clubHouse: formData.clubHouse,
        intercom: formData.intercom,
        swimmingPool: formData.swimmingPool,
        childrenPlayArea: formData.childrenPlayArea,
        fireSafety: formData.fireSafety,
        servantRoom: formData.servantRoom,
        shoppingCenter: formData.shoppingCenter,
        gasPipeline: formData.gasPipeline,
        park: formData.park,
        rainWaterHarvesting: formData.rainWaterHarvesting,
        sewageTreatmentPlant: formData.sewageTreatmentPlant,
        houseKeeping: formData.houseKeeping,
        powerBackup: formData.powerBackup,
        visitorParking: formData.visitorParking,
        waterStorageFacility: formData.waterStorageFacility,
        security: formData.security,
        wifi: formData.wifi,
        parking: formData.parking
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
          // Individual columns
          water_supply: formData.waterSupply,
          current_property_condition: formData.currentPropertyCondition,
          gated_security: formData.gatedSecurity,
          who_will_show: formData.whoWillShow || null,
          secondary_phone: formData.secondaryNumber || null,
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

          {/* Bathrooms, Balcony, Water Supply Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bathrooms */}
            <div className="space-y-2">
              <Label>Bathroom(s)*</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('bathrooms', Math.max(0, (formData.bathrooms || 0) - 1))}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-16 text-center py-2 border rounded">{formData.bathrooms || 0}</div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('bathrooms', (formData.bathrooms || 0) + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Balcony */}
            <div className="space-y-2">
              <Label>Balcony</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('balconies', Math.max(0, (formData.balconies || 0) - 1))}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-16 text-center py-2 border rounded">{formData.balconies || 0}</div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('balconies', (formData.balconies || 0) + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Water Supply */}
            <div className="space-y-2">
              <Label>Water Supply</Label>
              <Select 
                value={formData.waterSupply || ''} 
                onValueChange={(value) => handleInputChange('waterSupply', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="borewell">Borewell</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Yes/No Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Allowed */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <PawPrint className="w-5 h-5 text-muted-foreground" />
                <Label>Pet Allowed*</Label>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.petAllowed === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('petAllowed', false)}
                  className="flex-1"
                >
                  No
                </Button>
                <Button
                  type="button"
                  variant={formData.petAllowed === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('petAllowed', true)}
                  className="flex-1"
                >
                  Yes
                </Button>
              </div>
            </div>

            {/* Gym */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Dumbbell className="w-5 h-5 text-muted-foreground" />
                <Label>Gym*</Label>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.gym === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('gym', false)}
                  className="flex-1"
                >
                  No
                </Button>
                <Button
                  type="button"
                  variant={formData.gym === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('gym', true)}
                  className="flex-1"
                >
                  Yes
                </Button>
              </div>
            </div>

            {/* Non-Veg Allowed */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                <Label>Non-Veg Allowed*</Label>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.nonVegAllowed === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('nonVegAllowed', false)}
                  className="flex-1"
                >
                  No
                </Button>
                <Button
                  type="button"
                  variant={formData.nonVegAllowed === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('nonVegAllowed', true)}
                  className="flex-1"
                >
                  Yes
                </Button>
              </div>
            </div>

            {/* Gated Security */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <Label>Gated Security*</Label>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.gatedSecurity === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('gatedSecurity', false)}
                  className="flex-1"
                >
                  No
                </Button>
                <Button
                  type="button"
                  variant={formData.gatedSecurity === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('gatedSecurity', true)}
                  className="flex-1"
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>

          {/* Who will show property and Property condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Who will show the property */}
            <div className="space-y-2">
              <Label>Who will show the property?*</Label>
              <Select 
                value={formData.whoWillShow || ''} 
                onValueChange={(value) => handleInputChange('whoWillShow', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="need-help">Need help</SelectItem>
                  <SelectItem value="i-will-show">I will show</SelectItem>
                  <SelectItem value="neighbours">Neighbours</SelectItem>
                  <SelectItem value="friends-relatives">Friends/Relatives</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="tenants">Tenants</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Property Condition */}
            <div className="space-y-2">
              <Label>Current Property Condition?</Label>
              <Select 
                value={formData.currentPropertyCondition || ''} 
                onValueChange={(value) => handleInputChange('currentPropertyCondition', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
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

          {/* Secondary Number */}
          <div className="space-y-2">
            <Label>Secondary Number</Label>
            <div className="flex">
              <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                <img src="https://flagcdn.w16/in.png" alt="India" className="w-4 h-3 mr-2" />
                <span className="text-sm">+91</span>
              </div>
              <Input
                placeholder="Secondary Number"
                value={formData.secondaryNumber || ''}
                onChange={(e) => handleInputChange('secondaryNumber', e.target.value)}
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* More similar units */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Label>Do you have more similar <strong>units/properties</strong> available ?</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.moreSimilarUnits === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('moreSimilarUnits', false)}
                >
                  No
                </Button>
                <Button
                  type="button"
                  variant={formData.moreSimilarUnits === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('moreSimilarUnits', true)}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>

          {/* Directions Tip */}
          <div className="space-y-2">
            <Label>
              Add Directions Tip for your tenants <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">NEW</span>
            </Label>
            <Textarea
              placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
              value={formData.directionsTip || ''}
              onChange={(e) => handleInputChange('directionsTip', e.target.value)}
              rows={4}
            />
          </div>

          {/* Available Amenities */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Select the available amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Lift */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.lift === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('lift', checked ? 'Available' : 'Not Available')}
                />
                <MoveUp className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Lift</Label>
              </div>

              {/* Internet Services */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.internetServices === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('internetServices', checked ? 'Available' : 'Not Available')}
                />
                <Wifi className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Internet Services</Label>
              </div>

              {/* Air Conditioner */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.airConditioner === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('airConditioner', checked ? 'Available' : 'Not Available')}
                />
                <AirVent className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Air Conditioner</Label>
              </div>

              {/* Club House */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.clubHouse === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('clubHouse', checked ? 'Available' : 'Not Available')}
                />
                <Users className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Club House</Label>
              </div>

              {/* Intercom */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.intercom === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('intercom', checked ? 'Available' : 'Not Available')}
                />
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Intercom</Label>
              </div>

              {/* Swimming Pool */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.swimmingPool === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('swimmingPool', checked ? 'Available' : 'Not Available')}
                />
                <Waves className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Swimming Pool</Label>
              </div>

              {/* Children Play Area */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.childrenPlayArea === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('childrenPlayArea', checked ? 'Available' : 'Not Available')}
                />
                <Accessibility className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Children Play Area</Label>
              </div>

              {/* Fire Safety */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.fireSafety === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('fireSafety', checked ? 'Available' : 'Not Available')}
                />
                <Flame className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Fire Safety</Label>
              </div>

              {/* Servant Room */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.servantRoom === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('servantRoom', checked ? 'Available' : 'Not Available')}
                />
                <PersonStanding className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Servant Room</Label>
              </div>

              {/* Shopping Center */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.shoppingCenter === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('shoppingCenter', checked ? 'Available' : 'Not Available')}
                />
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Shopping Center</Label>
              </div>

              {/* Gas Pipeline */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.gasPipeline === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('gasPipeline', checked ? 'Available' : 'Not Available')}
                />
                <Flame className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Gas Pipeline</Label>
              </div>

              {/* Park */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.park === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('park', checked ? 'Available' : 'Not Available')}
                />
                <Trees className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Park</Label>
              </div>

              {/* Rain Water Harvesting */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.rainWaterHarvesting === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('rainWaterHarvesting', checked ? 'Available' : 'Not Available')}
                />
                <Droplets className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Rain Water Harvesting</Label>
              </div>

              {/* Sewage Treatment Plant */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.sewageTreatmentPlant === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('sewageTreatmentPlant', checked ? 'Available' : 'Not Available')}
                />
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Sewage Treatment Plant</Label>
              </div>

              {/* House Keeping */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.houseKeeping === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('houseKeeping', checked ? 'Available' : 'Not Available')}
                />
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">House Keeping</Label>
              </div>

              {/* Power Backup */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.powerBackup === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('powerBackup', checked ? 'Available' : 'Not Available')}
                />
                <Zap className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Power Backup</Label>
              </div>

              {/* Visitor Parking */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.visitorParking === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('visitorParking', checked ? 'Available' : 'Not Available')}
                />
                <Car className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Visitor Parking</Label>
              </div>

              {/* WiFi */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.wifi === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('wifi', checked ? 'Available' : 'Not Available')}
                />
                <Wifi className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">WiFi</Label>
              </div>

              {/* Water Storage Facility */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.waterStorageFacility === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('waterStorageFacility', checked ? 'Available' : 'Not Available')}
                />
                <Droplets className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Water Storage Facility</Label>
              </div>

              {/* Security */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={formData.security === 'Available'}
                  onCheckedChange={(checked) => handleInputChange('security', checked ? 'Available' : 'Not Available')}
                />
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                <Label className="font-normal cursor-pointer">Security</Label>
              </div>
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