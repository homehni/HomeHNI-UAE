
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, MapPin, Key } from 'lucide-react';

interface PropertyInfoData {
  propertyAddress: string;
  propertyType: string;
  ownershipStatus: string;
}

interface PropertyInformationStepProps {
  data: PropertyInfoData;
  onChange: (data: Partial<PropertyInfoData>) => void;
}

const PropertyInformationStep = ({ data, onChange }: PropertyInformationStepProps) => {
  const propertyTypes = [
    'Flat/Apartment',
    'Independent House',
    'Land/Plot',
    'Commercial Space'
  ];

  const ownershipStatuses = [
    'Owner',
    'Buyer',
    'Tenant',
    'Legal Heir'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full mb-4">
          <Home className="h-8 w-8 text-brand-red" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Information</h3>
        <p className="text-gray-600">Tell us about the property in question</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="propertyAddress" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Property Address or Location
          </Label>
          <Input
            id="propertyAddress"
            type="text"
            placeholder="Enter the property address or area"
            value={data.propertyAddress}
            onChange={(e) => onChange({ propertyAddress: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Type of Property
            </Label>
            <Select value={data.propertyType} onValueChange={(value) => onChange({ propertyType: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ownershipStatus" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Ownership Status
            </Label>
            <Select value={data.ownershipStatus} onValueChange={(value) => onChange({ ownershipStatus: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select ownership status" />
              </SelectTrigger>
              <SelectContent>
                {ownershipStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInformationStep;
