import React, { useState } from 'react';
import { MultiStepForm } from './MultiStepForm';
import { ResaleMultiStepForm } from './ResaleMultiStepForm';
import { PropertyTypeSelector } from './PropertyTypeSelector';
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
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null);
  const [selectedListingType, setSelectedListingType] = useState<string | null>(null);

  const handlePropertyTypeSelect = (propertyType: string, listingType: string) => {
    setSelectedPropertyType(propertyType);
    setSelectedListingType(listingType);
  };

  // If no selection made yet, show property type selector
  if (!selectedPropertyType || !selectedListingType) {
    return <PropertyTypeSelector onSelect={handlePropertyTypeSelect} />;
  }

  // Create initial owner info with selected types
  const initialOwnerInfo = {
    propertyType: selectedPropertyType as 'Residential' | 'Commercial' | 'Land/Plot',
    listingType: selectedListingType as 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates' | 'Sale'
  };

  // Route to appropriate form based on listing type with owner info pre-filled
  if (selectedListingType === 'Resale') {
    return (
      <ResaleMultiStepForm 
        onSubmit={onSubmit as (data: SalePropertyFormData) => void}
        isSubmitting={isSubmitting}
        initialOwnerInfo={initialOwnerInfo}
      />
    );
  }

  // Default to rental form for Rent, PG/Hostel, Flatmates
  return (
    <MultiStepForm 
      onSubmit={onSubmit as (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void}
      isSubmitting={isSubmitting}
      initialOwnerInfo={initialOwnerInfo}
    />
  );
};