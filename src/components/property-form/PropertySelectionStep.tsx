import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';

interface PropertySelectionData {
  city: string;
  whatsappUpdates: boolean;
  propertyType: 'Residential' | 'Commercial' | 'Land/Plot';
  listingType: 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates';
}

interface PropertySelectionStepProps {
  onNext: (data: PropertySelectionData) => void;
}

export const PropertySelectionStep: React.FC<PropertySelectionStepProps> = ({
  onNext
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [selectedPropertyType, setSelectedPropertyType] = useState<'Residential' | 'Commercial' | 'Land/Plot'>('Residential');
  const [selectedListingType, setSelectedListingType] = useState<string>('');

  const getListingTypes = () => {
    switch (selectedPropertyType) {
      case 'Commercial':
        return ['Rent', 'Sale'];
      case 'Land/Plot':
        return ['Resale'];
      default: // Residential
        return ['Rent', 'Resale', 'PG/Hostel', 'Flatmates'];
    }
  };

  const handlePropertyTypeChange = (type: 'Residential' | 'Commercial' | 'Land/Plot') => {
    setSelectedPropertyType(type);
    setSelectedListingType(''); // Reset listing type when property type changes
  };

  const handleSubmit = () => {
    if (selectedCity && selectedListingType) {
      onNext({
        city: selectedCity,
        whatsappUpdates,
        propertyType: selectedPropertyType,
        listingType: selectedListingType as 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates'
      });
    }
  };

  const isFormValid = selectedCity && selectedListingType;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Post a property
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* City Selection */}
          <div className="space-y-2">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full h-12 text-left">
                <SelectValue placeholder="Bangalore" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* WhatsApp Updates */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <Label className="text-base font-medium">Get updates on WhatsApp</Label>
            </div>
            <Switch
              checked={whatsappUpdates}
              onCheckedChange={setWhatsappUpdates}
              className="data-[state=checked]:bg-teal-600"
            />
          </div>

          {/* Property Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Property type</h3>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {['Residential', 'Commercial', 'Land/Plot'].map((type) => (
                <button
                  key={type}
                  onClick={() => handlePropertyTypeChange(type as 'Residential' | 'Commercial' | 'Land/Plot')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors relative ${
                    selectedPropertyType === type
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type}
                  {type === 'Land/Plot' && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1 py-0">
                      New
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Select Property Ad Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Select Property Ad Type</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {getListingTypes().map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedListingType(type)}
                  className={`py-4 px-6 rounded-lg text-sm font-medium transition-colors border ${
                    selectedListingType === type
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full h-14 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-lg"
            >
              Start Posting Your Ad For FREE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};