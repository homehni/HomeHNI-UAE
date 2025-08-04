import React, { useState, useEffect } from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { OwnerInfoStep } from './OwnerInfoStep';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { RentalDetailsStep } from './RentalDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { AdditionalInfoStep } from './AdditionalInfoStep';
import { PreviewStep } from './PreviewStep';

import { OwnerInfo, PropertyInfo } from '@/types/property';

interface MultiStepFormProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void;
  isSubmitting?: boolean;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  
  
  const {
    currentStep,
    ownerInfo,
    propertyDetails,
    locationDetails,
    rentalDetails,
    amenities,
    gallery,
    additionalInfo,
    nextStep,
    prevStep,
    goToStep,
    updateOwnerInfo,
    updatePropertyDetails,
    updateLocationDetails,
    updateRentalDetails,
    updateAmenities,
    updateGallery,
    updateAdditionalInfo,
    getFormData,
    isStepValid
  } = usePropertyForm();


  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepValid(i)) completed.push(i);
    }
    return completed;
  }, [isStepValid, currentStep]);

  const handleOwnerInfoNext = (data: OwnerInfo) => {
    updateOwnerInfo(data);
    nextStep();
  };


  const handlePropertyDetailsNext = (data: any) => {
    updatePropertyDetails(data);
    nextStep();
  };

  const handleLocationDetailsNext = (data: any) => {
    updateLocationDetails(data);
    nextStep();
  };

  const handleRentalDetailsNext = (data: any) => {
    updateRentalDetails(data);
    nextStep();
  };

  const handleAmenitiesNext = (data: any) => {
    updateAmenities(data);
    nextStep();
  };

  const handleGalleryNext = (data: any) => {
    updateGallery(data);
    nextStep();
  };

  const handleAdditionalInfoNext = (data: any) => {
    updateAdditionalInfo(data);
    nextStep();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    
    // Enhanced validation before submission
    const ownerValid = !!(formData.ownerInfo?.fullName && formData.ownerInfo?.phoneNumber && 
                         formData.ownerInfo?.email && formData.ownerInfo?.role);
    const propertyValid = !!(formData.propertyInfo?.propertyDetails?.title && 
                           formData.propertyInfo?.locationDetails?.state && 
                           formData.propertyInfo?.rentalDetails?.expectedPrice);
    
    // Enhanced image validation
    const imageValid = !!(formData.propertyInfo?.gallery?.images && 
                         formData.propertyInfo.gallery.images.length >= 3);
    
    console.log('Form validation:', { 
      ownerValid, 
      propertyValid, 
      imageValid, 
      formData 
    });
    
    if (ownerValid && propertyValid && imageValid && formData.ownerInfo && formData.propertyInfo) {
      onSubmit({
        ownerInfo: formData.ownerInfo as OwnerInfo,
        propertyInfo: formData.propertyInfo as PropertyInfo
      });
    } else {
      console.error('Form validation failed:', { 
        ownerValid, 
        propertyValid, 
        imageValid,
        missingFields: {
          owner: !ownerValid ? 'Missing owner information' : null,
          property: !propertyValid ? 'Missing property information' : null,
          images: !imageValid ? 'Need at least 3 images' : null
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          List Your Property
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to list your property on our platform
        </p>
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="mb-12">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={8}
          completedSteps={completedSteps}
        />
      </div>

      {/* Form Content in Card Layout */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in">
        {currentStep === 1 && (
          <div className="p-6 md:p-8">
            <OwnerInfoStep
              initialData={ownerInfo}
              onNext={handleOwnerInfoNext}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-6 md:p-8">
            <PropertyDetailsStep
              initialData={propertyDetails}
              onNext={handlePropertyDetailsNext}
              onBack={prevStep}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="p-6 md:p-8">
            <LocationDetailsStep
              initialData={locationDetails}
              onNext={handleLocationDetailsNext}
              onBack={prevStep}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="p-6 md:p-8">
            <RentalDetailsStep
              initialData={rentalDetails}
              onNext={handleRentalDetailsNext}
              onBack={prevStep}
            />
          </div>
        )}

        {currentStep === 5 && (
          <div className="p-6 md:p-8">
            <AmenitiesStep
              initialData={amenities}
              onNext={handleAmenitiesNext}
              onBack={prevStep}
            />
          </div>
        )}

        {currentStep === 6 && (
          <div className="p-6 md:p-8">
            <GalleryStep
              initialData={gallery}
              onNext={handleGalleryNext}
              onBack={prevStep}
            />
          </div>
        )}

        {currentStep === 7 && (
          <div className="p-6 md:p-8">
            <AdditionalInfoStep
              initialData={additionalInfo}
              onNext={handleAdditionalInfoNext}
              onBack={prevStep}
            />
          </div>
        )}

        {currentStep === 8 && (
          <div className="p-6 md:p-8">
            <PreviewStep
              formData={getFormData()}
              onBack={prevStep}
              onEdit={goToStep}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>

    </div>
  );
};