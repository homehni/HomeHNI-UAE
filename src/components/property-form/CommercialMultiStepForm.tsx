import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCommercialPropertyForm } from '@/hooks/useCommercialPropertyForm';
import { CommercialSidebar } from './CommercialSidebar';
import { CommercialPropertyDetailsStep } from './CommercialPropertyDetailsStep';
import { CommercialLocationDetailsStep } from './CommercialLocationDetailsStep';
import { CommercialRentalDetailsStep } from './CommercialRentalDetailsStep';
import { CommercialAmenitiesStep } from './CommercialAmenitiesStep';
import { CommercialGalleryStep } from './CommercialGalleryStep';
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
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  const formData = getFormData();
  onSubmit(formData as CommercialFormData);
  setIsSubmitted(true);
};

  const handleSubmit = () => {
    const formData = getFormData();
    
    // No validation required - all fields are optional
    onSubmit(formData as CommercialFormData);
  };

  const handleEdit = (step: number) => {
    setIsSubmitted(false);
    goToStep(step);
  };

  const renderCurrentStep = () => {
    console.log('=== RENDERING CURRENT STEP ===');
    console.log('Current step:', currentStep);
    console.log('Is submitted:', isSubmitted);
    
    if (isSubmitted) {
      console.log('Rendering CommercialPreviewStep');
      return (
        <CommercialPreviewStep
          formData={getFormData() as CommercialFormData}
          onBack={prevStep}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          currentStep={currentStep}
          totalSteps={7}
          isSubmitting={isSubmitting}
          previewPropertyId={createdSubmissionId || undefined}
        />
      );
    }

    switch (currentStep) {
      case 2:
        console.log('Rendering CommercialPropertyDetailsStep');
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
        console.log('Rendering CommercialLocationDetailsStep');
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
        console.log('Rendering CommercialRentalDetailsStep');
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
        console.log('Rendering CommercialAmenitiesStep');
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
        console.log('Rendering CommercialGalleryStep');
        return (
          <CommercialGalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 7:
        console.log('Rendering ScheduleStep');
        return (
          <ScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
            onSubmit={handleScheduleSubmit}
          />
        );
      default:
        console.log('Unknown step, returning null');
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {renderCurrentStep()}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Three Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <CommercialSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        </div>

        {/* Main Content */}
        <div id="commercial-step-content" className="flex-1 bg-white p-6 md:p-8 pb-32">
          {renderCurrentStep()}
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <GetTenantsFasterSection />
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar - Hidden on Preview step */}
      {!isSubmitted && (
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
                console.log('=== COMMERCIAL SAVE & CONTINUE CLICKED ===');
                console.log('Current step:', currentStep);
                
                // Trigger the current step's form submission like Commercial Sale flow
                const container = document.getElementById('commercial-step-content');
                const currentStepForm = container?.querySelector('form') as HTMLFormElement | null;
                console.log('Found form element:', currentStepForm);
                
                if (currentStepForm) {
                  console.log('Dispatching requestSubmit to form');
                  if (typeof currentStepForm.requestSubmit === 'function') {
                    currentStepForm.requestSubmit();
                  } else {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    currentStepForm.dispatchEvent(submitEvent);
                  }
                } else {
                  console.log('No form element found - checking for step-specific handlers');
                  
                  // If no form found, try to trigger step progression manually
                  switch (currentStep) {
                    case 2:
                      console.log('Manually triggering property details next');
                      break;
                    case 3:
                      console.log('Manually triggering location details next');
                      break;
                    case 4:
                      console.log('Manually triggering rental details next');
                      break;
                    case 5:
                      console.log('Manually triggering amenities next');
                      break;
                    case 6:
                      console.log('Manually triggering gallery next');
                      break;
                    case 7:
                      console.log('Manually triggering schedule submit');
                      break;
                    default:
                      console.log('Unknown step:', currentStep);
                  }
                }
                
                // Scroll to top after triggering submit
                setTimeout(scrollToTop, 100);
              }}
              className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              style={{ display: isSubmitted ? 'none' : 'block' }}
            >
              {currentStep === 7 ? 'Submit Property' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};