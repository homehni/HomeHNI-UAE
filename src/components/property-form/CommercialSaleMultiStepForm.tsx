import { useMemo, useEffect } from 'react';
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
import { CommercialSalePreviewStep } from './CommercialSalePreviewStep';
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
    if (targetStep && targetStep > 0 && targetStep <= 7) {
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

const handleSubmit = async () => {
  const formData = getFormData();
  await onSubmit(formData);
};

const handleScheduleSubmit = async (data: any) => {
  // Update schedule info, submit the property, then go to Preview
  updateScheduleInfo(data);
  const formData = getFormData();
  await onSubmit(formData);
  goToStep(8);
  scrollToTop();
};

  const scrollToTop = () => {
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const renderCurrentStep = () => {
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
            totalSteps={7}
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
            totalSteps={7}
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
            totalSteps={7}
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
            totalSteps={7}
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
            totalSteps={7}
          />
        );
      case 7:
        return (
          <CommercialSaleScheduleStep
            initialData={scheduleInfo}
            onNext={(data) => {
              console.log('Step 7 onNext called with data:', data);
              updateScheduleInfo(data);
              nextStep();
              scrollToTop();
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
            onSubmit={handleScheduleSubmit}
          />
        );
      case 8:
        return (
          <CommercialSalePreviewStep
            formData={getFormData() as any}
            onSubmit={handleSubmit}
            onBack={prevStep}
            onEdit={goToStep}
            currentStep={currentStep}
            totalSteps={7}
            isSubmitting={isSubmitting}
            previewPropertyId={createdSubmissionId || undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto flex flex-col">
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="px-4 py-2">
            <h1 className="text-base font-bold text-gray-900">
              List Your Commercial Property for Sale
            </h1>
            <p className="text-gray-600 text-xs mt-1 flex items-center gap-2">
              Step {currentStep} of 7: Complete your property listing
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {currentStep}/7
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="w-80 flex-shrink-0">
            <CommercialSaleSidebar
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
              {currentStep > 2 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  className="h-10 sm:h-10 px-4 sm:px-6 w-full sm:w-auto order-2 sm:order-1"
                >
                  Back
                </Button>
              )}
              <Button 
                type="button" 
                onClick={() => {
                  scrollToTop();
                  // Trigger the current step's form submission
                  const currentStepElement = document.querySelector('form');
                  if (currentStepElement) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    currentStepElement.dispatchEvent(submitEvent);
                  }
                }}
                className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              >
                Save & Continue
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