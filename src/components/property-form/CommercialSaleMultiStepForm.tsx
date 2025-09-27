import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCommercialSalePropertyForm } from '@/hooks/useCommercialSalePropertyForm';
import { CommercialSaleSidebar } from './CommercialSaleSidebar';
import { CommercialSalePropertyDetailsStep } from './CommercialSalePropertyDetailsStep';
import { CommercialSaleLocationDetailsStep } from './CommercialSaleLocationDetailsStep';
import { CommercialSaleSaleDetailsStep } from './CommercialSaleSaleDetailsStep';
import { CommercialSaleAmenitiesStep } from './CommercialSaleAmenitiesStep';
import { CommercialSaleGalleryStep } from './CommercialSaleGalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';

import { CommercialSaleScheduleStep } from './CommercialSaleScheduleStep';
import { CommercialSaleSuccessStep } from './CommercialSaleSuccessStep';
import { OwnerInfo } from '@/types/property';

interface CommercialSaleMultiStepFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const CommercialSaleMultiStepForm = ({
  onSubmit,
  isSubmitting,
  initialOwnerInfo,
  targetStep = null,
  createdSubmissionId
}: CommercialSaleMultiStepFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    currentStep,
    ownerInfo,
    propertyDetails,
    locationDetails,
    saleDetails,
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
    updateSaleDetails,
    updateAmenities,
    updateGallery,
    updateAdditionalInfo,
    updateScheduleInfo,
    getFormData,
    isStepValid,
  } = useCommercialSalePropertyForm();

  useEffect(() => {
    if (initialOwnerInfo) {
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
    for (let i = 2; i <= 7; i++) {
      if (isStepValid(i) && i < currentStep) {
        completed.push(i);
      }
    }
    return completed;
  }, [currentStep, isStepValid]);

  const handleScheduleSubmit = (data: any) => {
    updateScheduleInfo(data);
    const formData = getFormData();
    onSubmit(formData);
    setIsSubmitted(true);
  };

  const handleSubmit = () => {
    const formData = getFormData();
    onSubmit(formData);
    setIsSubmitted(true);
  };

  const handleEdit = (step: number) => {
    setIsSubmitted(false);
    goToStep(step);
  };

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

  const renderCurrentStep = () => {
    if (isSubmitted) {
      return (
        <CommercialSaleSuccessStep
          onEditProperty={() => handleEdit(2)}
          onPreviewListing={() => {
            if (createdSubmissionId) {
              // Navigate to the specific property preview
              window.open(`/property/${createdSubmissionId}`, '_blank');
            }
          }}
          onGoToDashboard={() => {
            // Navigate to dashboard
            window.location.href = '/dashboard';
          }}
          createdSubmissionId={createdSubmissionId}
          onEdit={handleEdit}
          gallery={gallery}
        />
      );
    }

    switch (currentStep) {
      case 2:
        return (
          <CommercialSalePropertyDetailsStep
            initialData={propertyDetails}
            onNext={(data) => {
              updatePropertyDetails(data);
              nextStep();
              scrollToTop();
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 3:
        return (
          <CommercialSaleLocationDetailsStep
            initialData={locationDetails}
            onNext={(data) => {
              console.log('Step 3 onNext called with data:', data);
              updateLocationDetails(data);
              nextStep();
              scrollToTop();
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 4:
        return (
          <CommercialSaleSaleDetailsStep
            initialData={saleDetails}
            onNext={(data) => {
              console.log('Step 4 onNext called with data:', data);
              updateSaleDetails(data);
              nextStep();
              scrollToTop();
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 5:
        return (
          <CommercialSaleAmenitiesStep
            initialData={amenities}
            onNext={(data) => {
              console.log('Step 5 onNext called with data:', data);
              updateAmenities(data);
              nextStep();
              scrollToTop();
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 6:
        return (
          <CommercialSaleGalleryStep
            initialData={gallery}
            onNext={(data) => {
              console.log('Step 6 onNext called with data:', data);
              updateGallery(data);
              nextStep();
              scrollToTop();
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 7:
        return (
          <CommercialSaleScheduleStep
            initialData={scheduleInfo}
            onNext={(data) => {
              console.log('Step 7 onNext called with data:', data);
              updateScheduleInfo(data);
              // Directly submit the form instead of going to next step
              const formData = getFormData();
              onSubmit(formData);
              setIsSubmitted(true);
              scrollToTop();
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
            onSubmit={handleScheduleSubmit}
          />
        );
      case 8:
        // Step 8 is now handled by the isSubmitted state
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Single Layout - Responsive */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <CommercialSaleSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        </div>

        {/* Main Content */}
        <div id="commercial-sale-step-content" className="flex-1 bg-white p-4 sm:p-6 md:p-8 pb-32 overflow-y-auto">
          {renderCurrentStep()}
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <GetTenantsFasterSection />
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar - Hidden on success page */}
      {!isSubmitted && currentStep < 8 && (
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
                // Trigger the current step's form submission and scroll to top
                const container = document.getElementById('commercial-sale-step-content');
                const currentStepForm = container?.querySelector('form') as HTMLFormElement | null;
                if (currentStepForm) {
                  if (typeof currentStepForm.requestSubmit === 'function') {
                    currentStepForm.requestSubmit();
                  } else {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    currentStepForm.dispatchEvent(submitEvent);
                  }
                }
                // Always scroll to top when Save & Continue is clicked
                setTimeout(scrollToTop, 100);
              }}
              className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              style={{ display: currentStep === 7 ? 'block' : 'block' }}
            >
              {currentStep === 7 ? 'Review & Submit' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};