import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PropertyTypeSelectorProps {
  onSelect: (propertyType: string, listingType: string) => void;
}

export const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({ onSelect }) => {
  const propertyOptions = [
    {
      type: 'Residential',
      icon: '🏠',
      description: 'Apartments, Houses, Villas',
      subtypes: [
        { label: 'Rent', value: 'Rent', color: 'bg-blue-500' },
        { label: 'Resale', value: 'Resale', color: 'bg-green-500' },
        { label: 'PG/Hostel', value: 'PG/Hostel', color: 'bg-purple-500' },
        { label: 'Flatmates', value: 'Flatmates', color: 'bg-orange-500' }
      ]
    },
    {
      type: 'Commercial',
      icon: '🏢',
      description: 'Offices, Shops, Warehouses',
      subtypes: [
        { label: 'Rent', value: 'Rent', color: 'bg-blue-500' },
        { label: 'Resale', value: 'Resale', color: 'bg-green-500' }
      ]
    },
    {
      type: 'Land/Plot',
      icon: '🏞️',
      description: 'Agricultural, Residential, Commercial Land',
      subtypes: [
        { label: 'Sale', value: 'Sale', color: 'bg-green-500' }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          List Your Property
        </h1>
        <p className="text-gray-600 text-lg">
          Select your property type and listing preference to get started
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {propertyOptions.map((property) => (
          <Card key={property.type} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{property.icon}</div>
              <CardTitle className="text-xl">{property.type}</CardTitle>
              <CardDescription>{property.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {property.subtypes.map((subtype) => (
                <Button
                  key={subtype.value}
                  variant="outline"
                  className="w-full justify-between hover:bg-gray-50"
                  onClick={() => onSelect(property.type, subtype.value)}
                >
                  <span>{subtype.label}</span>
                  <Badge 
                    className={`${subtype.color} text-white border-none`}
                    variant="secondary"
                  >
                    List Now
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};