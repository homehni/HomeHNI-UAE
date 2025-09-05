import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationCardProps {
  property: {
    city: string;
    state: string;
    locality: string;
    pincode: string;
    property_type?: string;
  };
}

export const LocationCard: React.FC<LocationCardProps> = ({ property }) => {
  const type = property.property_type?.toLowerCase() || '';
  const isPG = type.includes('pg') || type.includes('hostel') || type.includes('coliving');
  const locationDetails = [
    { label: 'City', value: property.city },
    { label: 'State', value: property.state },
    { label: 'Locality', value: property.locality },
    ...(!isPG && property.pincode ? [{ label: 'Pincode', value: property.pincode }] : [])
  ];

  return (
    <div className="rounded-2xl border-2 border-red-500 bg-white shadow-lg">
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Location</h2>
        <Button 
          variant="outline"
          size="sm"
          className="ring-1 ring-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 text-gray-800"
        >
          <MapPin className="w-4 h-4 mr-1" />
          Get Directions
        </Button>
      </div>
      
      <div className="p-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {locationDetails.map((detail, index) => (
            <div
              key={index}
              className="bg-gray-50/70 p-3 rounded-lg ring-1 ring-gray-100"
            >
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                {detail.label}
              </div>
              <div className="text-sm font-medium text-gray-800">
                {detail.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};