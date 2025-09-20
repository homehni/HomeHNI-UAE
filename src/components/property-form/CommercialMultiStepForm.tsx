import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCommercialPropertyForm } from '@/hooks/useCommercialPropertyForm';
import { CommercialSidebar } from './CommercialSidebar';
import { CommercialPropertyDetailsStep } from './CommercialPropertyDetailsStep';
import { CommercialLocationDetailsStep } from './CommercialLocationDetailsStep';
import { CommercialRentalDetailsStep } from './CommercialRentalDetailsStep';
import { CommercialAmenitiesStep } from './CommercialAmenitiesStep';
import { GalleryStep } from './GalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { ScheduleStep } from './ScheduleStep';
import { CommercialPreviewStep } from './CommercialPreviewStep';
import { OwnerInfo, CommercialFormData, CommercialPropertyDetails, LocationDetails, CommercialRentalDetails, CommercialAmenities, PropertyGallery, AdditionalInfo, ScheduleInfo } from '@/types/property';

interface CommercialMultiStepFormProps {
  onSubmit: (data: CommercialFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const CommercialMultiStepForm: React.FC<CommercialMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId
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
    if (targetStep && targetStep > 0 && targetStep <= 8) {
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
    try {
      const el = document.scrollingElement || document.documentElement || document.body;
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  // Step handlers
  const handlePropertyDetailsNext = (data: Partial<CommercialPropertyDetails>) => {
    updatePropertyDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: Partial<LocationDetails>) => {
    updateLocationDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleRentalDetailsNext = (data: Partial<CommercialRentalDetails>) => {
    updateRentalDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleAmenitiesNext = (data: CommercialAmenities) => {
    updateAmenities(data);
    nextStep();
    scrollToTop();
  };

  const handleGalleryNext = (data: Partial<PropertyGallery>) => {
    updateGallery(data);
    nextStep();
    scrollToTop();
  };


const handleScheduleNext = (data: Partial<ScheduleInfo>) => {
  updateScheduleInfo(data);
  nextStep();
  scrollToTop();
};

const handleScheduleSubmit = (data: Partial<ScheduleInfo>) => {
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
            totalSteps={8}
          />
        );
      case 3:
        return (
          <CommercialLocationDetailsStep
            initialData={locationDetails}
            onNext={handleLocationDetailsNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 4:
        return (
          <CommercialRentalDetailsStep
            initialData={rentalDetails}
            onNext={handleRentalDetailsNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 5:
        return (
          <CommercialAmenitiesStep
            initialData={amenities}
            onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 6:
        return (
          <GalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 7:
        return (
          <ScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
            onSubmit={handleScheduleSubmit}
          />
        );
      case 8:
        return (
          <CommercialPreviewStep
            onBack={prevStep}
            onSubmit={handleSubmit}
            currentStep={currentStep}
            totalSteps={8}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="px-2 py-1 text-xs">Commercial</Badge>
              <span className="text-base font-semibold text-gray-900">Post Your Commercial Property</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Step {currentStep} of 8
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="w-80 flex-shrink-0">
            <CommercialSidebar
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={goToStep}
            />
          </div>
          
          <div className="flex-1 min-w-0 p-3 bg-white pb-20">
            <div className="max-w-4xl mx-auto">
              {renderCurrentStep()}
            </div>
          </div>

          {/* Sticky Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={currentStep === 1 ? () => {} : prevStep}
                className="h-10 sm:h-10 px-4 sm:px-6 w-full sm:w-auto order-2 sm:order-1"
                disabled={currentStep === 1}
              >
                Back
              </Button>
                <Button 
                type="button" 
                onClick={() => {
                  console.log('CommercialMultiStepForm sticky Save & Continue button clicked');
                  console.log('Current step:', currentStep);
                  
                  // Always scroll to top first
                  scrollToTop();
                  
                  if (currentStep === 2) {
                    console.log('Calling handlePropertyDetailsNext');
                    handlePropertyDetailsNext(propertyDetails);
                  } else if (currentStep === 3) {
                    console.log('Calling handleLocationDetailsNext');
                    handleLocationDetailsNext(locationDetails);
                  } else if (currentStep === 4) {
                    console.log('Calling handleRentalDetailsNext');
                    handleRentalDetailsNext(rentalDetails);
                  } else if (currentStep === 5) {
                    console.log('Calling handleAmenitiesNext');
                    handleAmenitiesNext(amenities);
                  } else if (currentStep === 6) {
                    console.log('Calling handleGalleryNext');
                    handleGalleryNext(gallery);
                  } else if (currentStep === 7) {
                    console.log('Calling handleScheduleSubmit');
                    handleScheduleSubmit(scheduleInfo);
                  }
                }}
                className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
                style={{ display: currentStep === 8 ? 'none' : 'block' }}
                >
                  {currentStep === 7 ? 'Review & Submit' : 'Save & Continue'}
                </Button>
            </div>
          </div>

          {/* Right Sidebar - Get Tenants Faster */}
          <div className="w-80 flex-shrink-0 h-full">
            <GetTenantsFasterSection />
          </div>
        </div>
      </div>
    </div>
  );
};