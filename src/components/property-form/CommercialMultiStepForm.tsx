import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { useCommercialPropertyForm } from '@/hooks/useCommercialPropertyForm';
import { CommercialSidebar } from './CommercialSidebar';
import { CommercialPropertyDetailsStep } from './CommercialPropertyDetailsStep';
import { CommercialLocationDetailsStep } from './CommercialLocationDetailsStep';
import { CommercialRentalDetailsStep } from './CommercialRentalDetailsStep';
import { CommercialAmenitiesStep } from './CommercialAmenitiesStep';
import { GalleryStep } from './GalleryStep';

import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';
import { OwnerInfo, CommercialFormData, CommercialPropertyDetails, LocationDetails, CommercialRentalDetails, CommercialAmenities, PropertyGallery, AdditionalInfo, ScheduleInfo } from '@/types/property';

interface CommercialMultiStepFormProps {
  onSubmit: (data: CommercialFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
}

export const CommercialMultiStepForm: React.FC<CommercialMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null
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
  } = useCommercialPropertyForm();

  // Initialize with owner info from previous step
  useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Navigate to target step if provided
  useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 7) {
      console.log('Navigating to target step:', targetStep);
      goToStep(targetStep);
    }
  }, [targetStep, goToStep]);

  const completedSteps = useMemo(() => {
    const completed = [];
    for (let i = 1; i <= currentStep - 1; i++) {
      if (isStepValid(i)) {
        completed.push(i);
      }
    }
    return completed;
  }, [currentStep, isStepValid]);

  const scrollToTop = () => {
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Step handlers
  const handlePropertyDetailsNext = (data: CommercialPropertyDetails) => {
    updatePropertyDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: LocationDetails) => {
    updateLocationDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleRentalDetailsNext = (data: CommercialRentalDetails) => {
    updateRentalDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleAmenitiesNext = (data: CommercialAmenities) => {
    updateAmenities(data);
    nextStep();
    scrollToTop();
  };

  const handleGalleryNext = (data: PropertyGallery) => {
    updateGallery(data);
    nextStep();
    scrollToTop();
  };


  const handleScheduleNext = (data: ScheduleInfo) => {
    updateScheduleInfo(data);
    nextStep();
    scrollToTop();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    
    // No validation required - all fields are optional
    onSubmit(formData as CommercialFormData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <CommercialPropertyDetailsStep
            initialData={propertyDetails}
            onNext={handlePropertyDetailsNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 3:
        return (
          <CommercialLocationDetailsStep
            initialData={locationDetails}
            onNext={handleLocationDetailsNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 4:
        return (
          <CommercialRentalDetailsStep
            initialData={rentalDetails}
            onNext={handleRentalDetailsNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 5:
        return (
          <CommercialAmenitiesStep
            initialData={amenities}
            onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 6:
        return (
          <GalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 7:
        return (
          <ScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
          />
        );
      case 8:
        return (
          <PreviewStep
            formData={getFormData()}
            onBack={prevStep}
            onEdit={goToStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="px-3 py-1">Commercial</Badge>
            <span className="text-lg font-semibold">Post Your Commercial Property</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Step {currentStep} of 7
            </span>
          </div>
        </div>
      </div>

      <div className="flex">
        <CommercialSidebar
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
        
        <div className="flex-1 p-4 lg:p-6">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};