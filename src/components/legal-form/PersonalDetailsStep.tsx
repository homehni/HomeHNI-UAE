
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface PersonalDetailsData {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
}

interface PersonalDetailsStepProps {
  data: PersonalDetailsData;
  onChange: (data: Partial<PersonalDetailsData>) => void;
}

const PersonalDetailsStep = ({ data, onChange }: PersonalDetailsStepProps) => {
  // Major cities in India
  const majorCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
    "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full mb-4">
          <User className="h-8 w-8 text-brand-red" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Details</h3>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Full Name <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Address <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            Phone Number <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="10-digit mobile number"
            value={data.phoneNumber}
            onChange={(e) => onChange({ phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Enter a valid 10-digit Indian mobile number</p>
        </div>

        {/* City Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            City <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={data.city}
            onValueChange={(value) => onChange({ city: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {majorCities.map((city) => (
                <SelectItem key={city} value={city.toLowerCase()}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
