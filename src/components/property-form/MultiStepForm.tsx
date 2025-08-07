import React, { useState, useEffect } from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { PropertySidebar } from './PropertySidebar';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { RentalDetailsStep } from './RentalDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { AdditionalInfoStep } from './AdditionalInfoStep';
import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';

import { OwnerInfo, PropertyInfo } from '@/types/property';

interface MultiStepFormProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {}
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
    scheduleInfo,
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
    updateScheduleInfo,
    getFormData,
    isStepValid
  } = usePropertyForm();

  // Initialize with owner info if provided
  React.useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);


  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepValid(i)) completed.push(i);
    }
    return completed;
  }, [isStepValid, currentStep]);



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

  const handleScheduleNext = (data: any) => {
    updateScheduleInfo(data);
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                RENTAL PROPERTY FORM
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              List Your Property for Rent
            </h1>
            <p className="text-gray-600 mt-1">
              Step {currentStep} of 8: Fill in the details below to list your property for rent on our platform
            </p>
          </div>
        </div>

        <div className="flex">
          <PropertySidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />

          <div className="flex-1">
            {currentStep === 1 && (
              <PropertyDetailsStep
                initialData={propertyDetails}
                onNext={handlePropertyDetailsNext}
                onBack={() => {}} // No back on first step
                currentStep={currentStep}
                totalSteps={8}
              />
            )}

            {currentStep === 2 && (
              <LocationDetailsStep
                initialData={locationDetails}
                onNext={handleLocationDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={8}
              />
            )}

            {currentStep === 3 && (
              <RentalDetailsStep
                initialData={rentalDetails}
                onNext={handleRentalDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={8}
              />
            )}

            {currentStep === 4 && (
              <AmenitiesStep
                initialData={amenities}
                onNext={handleAmenitiesNext}
                onBack={prevStep}
              />
            )}

            {currentStep === 5 && (
              <GalleryStep
                initialData={gallery}
                onNext={handleGalleryNext}
                onBack={prevStep}
              />
            )}

            {currentStep === 6 && (
              <AdditionalInfoStep
                initialData={additionalInfo}
                onNext={handleAdditionalInfoNext}
                onBack={prevStep}
              />
            )}

            {currentStep === 7 && (
              <ScheduleStep
                initialData={scheduleInfo}
                onNext={handleScheduleNext}
                onBack={prevStep}
              />
            )}

            {currentStep === 8 && (
              <PreviewStep
                formData={getFormData()}
                onBack={prevStep}
                onEdit={goToStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};