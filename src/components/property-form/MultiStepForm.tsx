import React, { useState, useEffect } from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { RentalDetailsStep } from './RentalDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { AdditionalInfoStep } from './AdditionalInfoStep';
import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';

import { OwnerInfo, PropertyInfo } from '@/types/property';
import { Badge } from '@/components/ui/badge';

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header with Rental Badge */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium">
            🏠 RENTAL PROPERTY FORM
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          List Your Property for Rent
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to list your property for rent on our platform
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

      {/* Form Content with Sidebar Layout */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen p-6">
            <div className="space-y-1">
              {[
                { number: 1, title: "Property Details", completed: completedSteps.includes(1), active: currentStep === 1 },
                { number: 2, title: "Location Details", completed: completedSteps.includes(2), active: currentStep === 2 },
                { number: 3, title: "Rental Details", completed: completedSteps.includes(3), active: currentStep === 3 },
                { number: 4, title: "Amenities", completed: completedSteps.includes(4), active: currentStep === 4 },
                { number: 5, title: "Photos & Videos", completed: completedSteps.includes(5), active: currentStep === 5 },
                { number: 6, title: "Additional Info", completed: completedSteps.includes(6), active: currentStep === 6 },
                { number: 7, title: "Schedule", completed: completedSteps.includes(7), active: currentStep === 7 },
                { number: 8, title: "Preview & Submit", completed: completedSteps.includes(8), active: currentStep === 8 },
              ].map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    step.active 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                      : step.completed 
                        ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => step.completed && goToStep(step.number)}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.active 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : step.completed 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 bg-white'
                  }`}>
                    {step.completed ? (
                      <span className="text-xs">✓</span>
                    ) : (
                      <span className="text-xs">{step.number}</span>
                    )}
                  </div>
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6">
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