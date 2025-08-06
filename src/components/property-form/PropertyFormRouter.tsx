import React, { useState } from 'react';
import { OwnerInfoStep } from './OwnerInfoStep';
import { MultiStepForm } from './MultiStepForm';
import { ResaleMultiStepForm } from './ResaleMultiStepForm';
import { OwnerInfo, PropertyInfo } from '@/types/property';
import { SalePropertyFormData } from '@/types/saleProperty';

interface PropertyFormRouterProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo } | SalePropertyFormData) => void;
  isSubmitting?: boolean;
}

export const PropertyFormRouter: React.FC<PropertyFormRouterProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  const [selectedListingType, setSelectedListingType] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});

  const handleOwnerInfoComplete = (data: OwnerInfo) => {
    setOwnerInfo(data);
    setSelectedListingType(data.listingType);
  };

  // If no listing type selected yet, show owner info form to capture selection
  if (!selectedListingType) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            List Your Property
          </h1>
          <p className="text-gray-600 text-lg">
            Fill in the details below to list your property on our platform
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in">
          <div className="p-6 md:p-8">
            <OwnerInfoStep
              initialData={ownerInfo}
              onNext={handleOwnerInfoComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  // Route to appropriate form based on listing type with owner info pre-filled
  if (selectedListingType === 'Resale') {
    return (
      <ResaleMultiStepForm 
        onSubmit={onSubmit as (data: SalePropertyFormData) => void}
        isSubmitting={isSubmitting}
        initialOwnerInfo={ownerInfo}
      />
    );
  }

  // Default to rental form for Rent, PG/Hostel, Flatmates
  return (
    <MultiStepForm 
      onSubmit={onSubmit as (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void}
      isSubmitting={isSubmitting}
      initialOwnerInfo={ownerInfo}
    />
  );
};