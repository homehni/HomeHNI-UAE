import React, { useState } from 'react';
import { useSalePropertyForm } from '@/hooks/useSalePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyFormSidebar } from './PropertyFormSidebar';
import { ResalePropertyDetailsStep } from './ResalePropertyDetailsStep';
import { ResaleLocationDetailsStep } from './ResaleLocationDetailsStep';
import { SaleDetailsStep } from './SaleDetailsStep';
import { ResaleAmenitiesStep } from './ResaleAmenitiesStep';
import { ResaleGalleryStep } from './ResaleGalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { Button } from '@/components/ui/button';

import { ResaleScheduleStep } from './ResaleScheduleStep';
import { ResalePreviewStep } from './ResalePreviewStep';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, DollarSign, Sparkles, Camera, Info, Calendar, CheckCircle } from 'lucide-react';

import { OwnerInfo } from '@/types/property';
import { SalePropertyFormData } from '@/types/saleProperty';

interface ResaleMultiStepFormProps {
  onSubmit: (data: SalePropertyFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const ResaleMultiStepForm: React.FC<ResaleMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId = null
}) => {
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
    isStepValid
  } = useSalePropertyForm();

  // Initialize with owner info if provided
  const ownerInfoInitRef = React.useRef(false);
  React.useEffect(() => {
    if (!ownerInfoInitRef.current && initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
      ownerInfoInitRef.current = true;
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Navigate to target step if provided
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 7) {
      console.log('Navigating to target step:', targetStep);
      goToStep(targetStep);
    }
  }, [targetStep, goToStep]);

  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepValid(i)) completed.push(i);
    }
    return completed;
  }, [isStepValid, currentStep]);


  const scrollToTop = () => {
    try {
      const el = document.scrollingElement || document.documentElement || document.body;
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const currentFormId = 'resale-step-form';

  const handlePropertyDetailsNext = (data: any) => {
    updatePropertyDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: any) => {
    updateLocationDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleSaleDetailsNext = (data: any) => {
    updateSaleDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    updateAmenities(data);
    nextStep();
    scrollToTop();
  };

  const handleGalleryNext = (data: any) => {
    updateGallery(data);
    nextStep();
    scrollToTop();
  };


  const handleScheduleNext = (data: any) => {
    updateScheduleInfo(data);
    nextStep();
    scrollToTop();
  };

const handleScheduleSubmit = (data: any) => {
  console.log('[ResaleMultiStepForm] Schedule submit: received data', data);
  updateScheduleInfo(data);
  const formData = getFormData();
  console.log('[ResaleMultiStepForm] Submitting resale form data:', formData);
  onSubmit(formData as SalePropertyFormData);
  console.log('[ResaleMultiStepForm] Submission triggered. Going to Preview step (7)');
  goToStep(7);
  scrollToTop();
};

  const handleSubmit = () => {
    const formData = getFormData();
    
    // Submit form without validation - all fields are now optional
    console.log('Resale form submitted with data:', formData);
    
    if (formData.ownerInfo && formData.propertyInfo) {
      onSubmit(formData as SalePropertyFormData);
    }
  };
  const sidebarSteps = [
    { title: "Property Details", icon: <Home className="w-4 h-4" /> },
    { title: "Locality Details", icon: <MapPin className="w-4 h-4" /> },
    { title: "Sale Details", icon: <DollarSign className="w-4 h-4" /> },
    { title: "Amenities", icon: <Sparkles className="w-4 h-4" /> },
    { title: "Gallery", icon: <Camera className="w-4 h-4" /> },
    { title: "Schedule", icon: <Calendar className="w-4 h-4" /> },
    { title: "Preview", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {currentStep === 1 && (
              <ResalePropertyDetailsStep
                initialData={propertyDetails}
                onNext={handlePropertyDetailsNext}
                onBack={() => {}}
                formId={`${currentFormId}-m`}
              />
            )}

            {currentStep === 2 && (
              <ResaleLocationDetailsStep
                initialData={locationDetails}
                onNext={handleLocationDetailsNext}
                onBack={prevStep}
                currentStep={2}
                totalSteps={4}
                formId={`${currentFormId}-m`}
              />
            )}

            {currentStep === 3 && (
              <SaleDetailsStep
                initialData={saleDetails}
                propertyDetails={propertyDetails}
                onNext={handleSaleDetailsNext}
                onBack={prevStep}
                formId={`${currentFormId}-m`}
              />
            )}

            {currentStep === 4 && (
              <ResaleAmenitiesStep
                initialData={amenities as any}
                onNext={handleAmenitiesNext}
                onBack={prevStep}
                formId={`${currentFormId}-m`}
              />
            )}

            {currentStep === 5 && (
              <ResaleGalleryStep
                initialData={gallery}
                onNext={handleGalleryNext}
                onBack={prevStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                formId={`${currentFormId}-m`}
              />
            )}

            {currentStep === 6 && (
              <ResaleScheduleStep
                initialData={scheduleInfo}
                onNext={handleScheduleNext}
                onBack={prevStep}
                onSubmit={handleScheduleSubmit}
                formId={`${currentFormId}-m`}
              />
            )}

            {currentStep === 7 && (
              <ResalePreviewStep
                formData={getFormData() as SalePropertyFormData}
                onBack={prevStep}
                onEdit={goToStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                previewPropertyId={createdSubmissionId || undefined}
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full min-h-screen">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <PropertyFormSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            steps={sidebarSteps}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-white">
          {/* Form Content */}
          <div className="p-3 pb-20">
            <div className="bg-white">
              <div className="max-w-4xl mx-auto w-full">
                {currentStep === 1 && (
                  <ResalePropertyDetailsStep
                    initialData={propertyDetails}
                    onNext={handlePropertyDetailsNext}
                    onBack={() => {}} // No back on first step
                    formId={currentFormId}
                  />
                )}

                {currentStep === 2 && (
                  <ResaleLocationDetailsStep
                    initialData={locationDetails}
                    onNext={handleLocationDetailsNext}
                    onBack={prevStep}
                    currentStep={2}
                    totalSteps={4}
                    formId={currentFormId}
                  />
                )}

                {currentStep === 3 && (
                  <SaleDetailsStep
                    initialData={saleDetails}
                    propertyDetails={propertyDetails}
                    onNext={handleSaleDetailsNext}
                    onBack={prevStep}
                    formId={currentFormId}
                  />
                )}

                {currentStep === 4 && (
                  <ResaleAmenitiesStep
                    initialData={amenities as any}
                    onNext={handleAmenitiesNext}
                    onBack={prevStep}
                    formId={currentFormId}
                  />
                )}

                {currentStep === 5 && (
                  <ResaleGalleryStep
                    initialData={gallery}
                    onNext={handleGalleryNext}
                    onBack={prevStep}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    formId={currentFormId}
                  />
                )}

                {currentStep === 6 && (
                  <ResaleScheduleStep
                    initialData={scheduleInfo}
                    onNext={handleScheduleNext}
                    onBack={prevStep}
                    onSubmit={handleScheduleSubmit}
                    formId={currentFormId}
                  />
                )}

                {currentStep === 7 && (
                  <ResalePreviewStep
                    formData={getFormData() as SalePropertyFormData}
                    onBack={prevStep}
                    onEdit={goToStep}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    previewPropertyId={createdSubmissionId || undefined}
                  />
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="w-80 flex-shrink-0 h-full">
          <GetTenantsFasterSection ownerInfo={ownerInfo} />
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar - Visible on all screens */}
      {currentStep !== 7 && (
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
                console.log('🔵 ResaleMultiStepForm sticky Save & Continue button clicked');
                console.log('Current step:', currentStep);
                console.log('Form ID we are looking for:', currentFormId);
                
                    let formEl = document.getElementById(`${currentFormId}-m`) as HTMLFormElement | null;
                    if (!formEl) {
                      formEl = document.getElementById(currentFormId) as HTMLFormElement | null;
                    }
                    console.log('Form element found:', formEl);
                    console.log('Form ID attribute:', formEl?.id);
                    console.log('Form name:', formEl?.name);
                    
                    if (formEl) {
                      console.log('✅ Calling requestSubmit on form element');
                      formEl.requestSubmit();
                    } else {
                  console.warn('❌ Form element not found for current step');
                  // Try to find any form on the page as fallback
                  const anyForm = document.querySelector('form');
                  console.log('Any form found on page:', anyForm);
                  console.log('Any form ID:', (anyForm as HTMLFormElement)?.id);
                  if (anyForm) {
                    console.log('Trying to submit any form found');
                    anyForm.requestSubmit();
                  }
                }
                
                scrollToTop();
              }}
              className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
            >
              {currentStep === 6 ? 'Submit Property' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};