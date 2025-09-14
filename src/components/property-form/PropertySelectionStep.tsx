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
  name: string;
  email: string;
  phoneNumber: string;
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
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [city, setCity] = useState<string>('');
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
    if (selectedListingType && phoneNumber && name && email && city) {
      onNext({
        name,
        email,
        phoneNumber,
        city,
        whatsappUpdates,
        propertyType: selectedPropertyType,
        listingType: selectedListingType as 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates'
      });
    }
  };

  const isFormValid = selectedListingType && phoneNumber && name && email && city;

  return (
    <div className="bg-white flex flex-col h-full">
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6 lg:space-y-8">
          {/* Personal Information Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm lg:text-base font-medium">Name *</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm lg:text-base font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2 lg:col-span-1">
              <Label htmlFor="mobile" className="text-sm lg:text-base font-medium">Mobile Number *</Label>
              <div className="flex">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-20 lg:w-24 rounded-r-none border-r-0 h-12">
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
                  className="flex-1 rounded-l-none h-12"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2 lg:col-span-1">
              <Label htmlFor="city" className="text-sm lg:text-base font-medium">City *</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-full bg-white h-12">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Faridabad">Faridabad</SelectItem>
                  <SelectItem value="Ghaziabad">Ghaziabad</SelectItem>
                  <SelectItem value="Noida">Noida</SelectItem>
                  <SelectItem value="Greater Noida">Greater Noida</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                  <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                  <SelectItem value="Jaipur">Jaipur</SelectItem>
                  <SelectItem value="Lucknow">Lucknow</SelectItem>
                  <SelectItem value="Kanpur">Kanpur</SelectItem>
                  <SelectItem value="Nagpur">Nagpur</SelectItem>
                  <SelectItem value="Indore">Indore</SelectItem>
                  <SelectItem value="Thane">Thane</SelectItem>
                  <SelectItem value="Bhopal">Bhopal</SelectItem>
                  <SelectItem value="Visakhapatnam">Visakhapatnam</SelectItem>
                  <SelectItem value="Pimpri-Chinchwad">Pimpri-Chinchwad</SelectItem>
                  <SelectItem value="Patna">Patna</SelectItem>
                  <SelectItem value="Vadodara">Vadodara</SelectItem>
                  <SelectItem value="Agra">Agra</SelectItem>
                  <SelectItem value="Ludhiana">Ludhiana</SelectItem>
                  <SelectItem value="Nashik">Nashik</SelectItem>
                  <SelectItem value="Meerut">Meerut</SelectItem>
                  <SelectItem value="Rajkot">Rajkot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* WhatsApp Updates */}
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700 text-sm lg:text-base">Get updates on</span>
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.064 3.488z"/>
              </svg>
            </div>
            <span className="text-gray-700 font-medium text-sm lg:text-base">WhatsApp</span>
            <Switch
              checked={whatsappUpdates}
              onCheckedChange={setWhatsappUpdates}
              className="data-[state=checked]:bg-green-500 scale-75"
            />
          </div>

          {/* Property Selection Container */}
          <div className="border border-gray-200 rounded-lg p-4 lg:p-6 space-y-6">
            {/* Property Type */}
            <div className="space-y-4">
              <h3 className="text-lg lg:text-xl font-medium text-gray-700 text-center">Property type</h3>
              <div className="flex border-b border-gray-200">
                {['Residential', 'Commercial', 'Land/Plot'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handlePropertyTypeChange(type as 'Residential' | 'Commercial' | 'Land/Plot')}
                    className={`flex-1 py-3 px-2 lg:px-4 text-sm lg:text-base font-medium transition-colors relative ${
                      selectedPropertyType === type
                        ? 'text-red-600 border-b-2 border-red-600'
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
              <h3 className="text-lg lg:text-xl font-medium text-gray-700 text-center">Select Property Ad Type</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {getListingTypes().map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedListingType(type)}
                    className={`py-3 lg:py-4 px-4 lg:px-6 rounded-lg text-sm lg:text-base font-medium transition-colors border ${
                      selectedListingType === type
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 lg:pt-8">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full h-12 lg:h-14 bg-red-500 hover:bg-red-600 text-white text-base lg:text-lg font-semibold rounded-lg"
            >
              Start Posting Your Ad For FREE
            </Button>
          </div>

          {/* Terms and Conditions */}
          <div className="pt-2 lg:pt-4">
            <p className="text-xs lg:text-sm text-gray-500 text-center leading-relaxed px-2">
              By clicking 'Start Posting Your Ad' you acknowledge that you have agreed to the{' '}
              <span className="text-red-600 underline cursor-pointer">Terms & Conditions</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};