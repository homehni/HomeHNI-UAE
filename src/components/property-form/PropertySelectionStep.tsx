import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageCircle } from 'lucide-react';

interface PropertySelectionData {
  city: string;
  phoneNumber: string;
  whatsappUpdates: boolean;
  propertyType: 'Residential' | 'Commercial' | 'Land/Plot';
  listingType: 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates';
  termsAccepted: boolean;
}

interface PropertySelectionStepProps {
  onNext: (data: PropertySelectionData) => void;
}

export const PropertySelectionStep: React.FC<PropertySelectionStepProps> = ({
  onNext
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [selectedPropertyType, setSelectedPropertyType] = useState<'Residential' | 'Commercial' | 'Land/Plot'>('Residential');
  const [selectedListingType, setSelectedListingType] = useState<string>('');
  
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

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
    if (selectedCity && selectedListingType && phoneNumber && termsAccepted) {
      onNext({
        city: selectedCity,
        phoneNumber,
        whatsappUpdates,
        propertyType: selectedPropertyType,
        listingType: selectedListingType as 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates',
        termsAccepted
      });
    }
  };

  const isFormValid = selectedCity && selectedListingType && phoneNumber && termsAccepted;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-red-600 mb-2">Start Posting Your Property For FREE</h1>
            <h2 className="text-lg font-medium text-gray-800">Personal Information</h2>
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-base font-medium">Mobile Number *</Label>
            <div className="flex">
              <Select defaultValue="+91">
                <SelectTrigger className="w-24 rounded-r-none border-r-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">+91</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="mobile"
                placeholder="Enter your mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 rounded-l-none"
              />
            </div>
          </div>

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
              className="data-[state=checked]:bg-red-600"
            />
          </div>

          {/* Property Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Property Type</h3>
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

          {/* I want to */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">I want to</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {getListingTypes().map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedListingType(type)}
                  className={`py-4 px-6 rounded-lg text-sm font-medium transition-colors border ${
                    selectedListingType === type
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type === 'PG/Hostel' ? 'List PG/Hostel' : type}
                </button>
              ))}
            </div>
          </div>


          {/* Terms & Conditions */}
          <div className="flex items-start space-x-2 py-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              By clicking 'Start Posting Your Property For FREE', you acknowledge that you have read, understood, and agreed to the above{' '}
              <span className="text-red-600 underline cursor-pointer">Terms & Conditions</span>.
            </Label>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full h-14 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-lg"
            >
              Start Posting Your Property For FREE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};