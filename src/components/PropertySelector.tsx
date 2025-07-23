import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface PropertySelectorProps {
  onSelectionChange?: (selectedTypes: string[]) => void;
}

const PropertySelector = ({ onSelectionChange }: PropertySelectorProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);

  // Define the main residential options that trigger additional options
  const residentialOptions = [
    'Flat/Apartment',
    'Residential Land', 
    'Serviced Apartments'
  ];

  // Additional options that appear when all residential options are selected
  const additionalOptions = [
    'Independent/Builder Floor',
    '1 RK/Studio Apartment', 
    'Farm House',
    'Independent House/Villa',
    'Other'
  ];

  // Check if all residential options are selected
  useEffect(() => {
    const allResidentialSelected = residentialOptions.every(option => 
      selectedTypes.includes(option)
    );
    setShowAdditionalOptions(allResidentialSelected);
  }, [selectedTypes]);

  const handleCheckboxChange = (propertyType: string, checked: boolean) => {
    let newSelection: string[];
    
    if (checked) {
      newSelection = [...selectedTypes, propertyType];
    } else {
      newSelection = selectedTypes.filter(type => type !== propertyType);
    }
    
    setSelectedTypes(newSelection);
    onSelectionChange?.(newSelection);
  };

  const clearAll = () => {
    setSelectedTypes([]);
    onSelectionChange?.([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {/* Header with Clear button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Property Type</h3>
        <Button 
          variant="ghost" 
          onClick={clearAll}
          className="text-blue-500 hover:text-blue-600 p-0 h-auto font-normal"
        >
          Clear
        </Button>
      </div>

      {/* Main property type options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {residentialOptions.map((propertyType) => (
          <div key={propertyType} className="flex items-center space-x-3">
            <Checkbox
              id={propertyType}
              checked={selectedTypes.includes(propertyType)}
              onCheckedChange={(checked) => 
                handleCheckboxChange(propertyType, checked as boolean)
              }
              className="data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red border-brand-red"
            />
            <label 
              htmlFor={propertyType} 
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {propertyType}
            </label>
          </div>
        ))}
      </div>

      {/* Additional options that appear when all residential are selected */}
      {showAdditionalOptions && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalOptions.map((propertyType) => (
              <div key={propertyType} className="flex items-center space-x-3">
                <Checkbox
                  id={propertyType}
                  checked={selectedTypes.includes(propertyType)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(propertyType, checked as boolean)
                  }
                  className="data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red border-brand-red"
                />
                <label 
                  htmlFor={propertyType} 
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {propertyType}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commercial properties link */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Looking for commercial properties?{' '}
          <button className="text-blue-500 hover:text-blue-600 font-medium">
            Click here
          </button>
        </p>
      </div>
    </div>
  );
};

export default PropertySelector;