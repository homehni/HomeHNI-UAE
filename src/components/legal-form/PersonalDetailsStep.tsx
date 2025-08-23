
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

        {/* Location Information in a single row */}
        <div className="md:col-span-2">
          <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
            <div>
              <Select
                value={data.country}
                onValueChange={(value) => onChange({ country: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={data.state}
                onValueChange={(value) => onChange({ state: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={data.city}
                onValueChange={(value) => onChange({ city: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
