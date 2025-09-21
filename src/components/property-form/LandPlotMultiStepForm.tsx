import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLandPlotPropertyForm } from '@/hooks/useLandPlotPropertyForm';
import { LandPlotPropertyDetailsStep } from './LandPlotPropertyDetailsStep';
import { LandPlotLocationDetailsStep } from './LandPlotLocationDetailsStep';
import { LandPlotSaleDetailsStep } from './LandPlotSaleDetailsStep';
import { LandPlotAmenitiesStep } from './LandPlotAmenitiesStep';
import { LandPlotGalleryStep } from './LandPlotGalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { LandPlotSidebar } from './LandPlotSidebar';

import { LandPlotScheduleStep } from './LandPlotScheduleStep';
import { IndustrialLandSuccessStep } from './IndustrialLandSuccessStep';
import { AgriculturalLandSuccessStep } from './AgriculturalLandSuccessStep';
import { CommercialLandSuccessStep } from './CommercialLandSuccessStep';
import { Badge } from '@/components/ui/badge';
import { OwnerInfo, ScheduleInfo } from '@/types/property';
import { LandPlotFormData } from '@/types/landPlotProperty';

interface LandPlotMultiStepFormProps {
  onSubmit: (data: LandPlotFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
  listingType?: 'Industrial land' | 'Agricultural Land' | 'Commercial land';
}

export const LandPlotMultiStepForm: React.FC<LandPlotMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId,
  listingType = 'Industrial land'
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  
  console.log('LandPlotMultiStepForm rendering with props:', {
    isSubmitting,
    initialOwnerInfo,
    targetStep,
    createdSubmissionId
  });
  const {
    currentStep,
    ownerInfo,
    plotDetails,
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
    updatePlotDetails,
    updateLocationDetails,
    updateSaleDetails,
    updateAmenities,
    updateGallery,
    updateAdditionalInfo,
    updateScheduleInfo,
    getFormData,
    isStepValid
  } = useLandPlotPropertyForm();

  console.log('LandPlotMultiStepForm currentStep:', currentStep);

  // Initialize with owner info if provided
  React.useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Navigate to target step if provided
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 8) {
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

  const handlePlotDetailsNext = (data: any) => {
    updatePlotDetails(data);
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

  const handleScheduleNext = (data: Partial<ScheduleInfo>) => {
    console.log('LandPlotMultiStepForm handleScheduleNext called');
    updateScheduleInfo(data);
    nextStep();
    scrollToTop();
  };

  const handleScheduleSubmit = async (data: Partial<ScheduleInfo>) => {
    console.log('LandPlotMultiStepForm handleScheduleSubmit called');
    updateScheduleInfo(data);
    
    const formData = {
      ownerInfo,
      propertyInfo: {
        plotDetails,
        locationDetails,
        saleDetails,
        amenities,
        gallery,
        additionalInfo,
        scheduleInfo: data
      }
    };
    
    console.log('Complete form data for submission:', formData);
    
    await onSubmit(formData as LandPlotFormData);
    setIsSubmitted(true);
    scrollToTop();
  };

  const handleEdit = (step: number) => {
    setIsSubmitted(false);
    goToStep(step);
  };

  const handlePreviewListing = () => {
    if (createdSubmissionId) {
      window.open(`/property/${createdSubmissionId}`, '_blank');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const renderSuccessStep = () => {
    const successProps = {
      onPreviewListing: handlePreviewListing,
      onGoToDashboard: handleGoToDashboard,
      createdSubmissionId,
      onEdit: handleEdit,
      gallery
    };

    switch (listingType) {
      case 'Industrial land':
        return <IndustrialLandSuccessStep {...successProps} />;
      case 'Agricultural Land':
        return <AgriculturalLandSuccessStep {...successProps} />;
      case 'Commercial land':
        return <CommercialLandSuccessStep {...successProps} />;
      default:
        return <IndustrialLandSuccessStep {...successProps} />;
    }
  };



  const handleSubmit = () => {
    console.log('LandPlotMultiStepForm handleSubmit called');
    const formData = getFormData();
    console.log('Form data for submission:', formData);
    onSubmit(formData as LandPlotFormData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Three Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <LandPlotSidebar 
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          <div className="max-w-4xl mx-auto p-6 md:p-8 pb-64">
              {currentStep === 1 && (
                <LandPlotPropertyDetailsStep
                  initialData={plotDetails}
                  onNext={handlePlotDetailsNext}
                  onBack={() => {}} // No back on first step
                />
              )}

              {currentStep === 2 && (
                <LandPlotLocationDetailsStep
                  initialData={locationDetails}
                  onNext={handleLocationDetailsNext}
                  onBack={prevStep}
                  currentStep={2}
                  totalSteps={7}
                />
              )}

              {currentStep === 3 && (
                <LandPlotSaleDetailsStep
                  initialData={saleDetails}
                  onNext={handleSaleDetailsNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 4 && (
                <LandPlotAmenitiesStep
                  initialData={amenities}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 5 && (
                <LandPlotGalleryStep
                  initialData={gallery}
                  onNext={handleGalleryNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 6 && (
                <LandPlotScheduleStep
                  initialData={scheduleInfo}
                  onNext={handleScheduleNext}
                  onBack={prevStep}
                  onSubmit={handleScheduleSubmit}
                />
              )}

              {(currentStep === 7 || isSubmitted) && renderSuccessStep()}
          </div>

          {/* Sticky Bottom Navigation Bar - Hidden on Success step */}
          {currentStep !== 7 && !isSubmitted && (
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
                  console.log('LandPlotMultiStepForm sticky Save & Continue button clicked');
                  console.log('Current step:', currentStep);
                  
                  // Trigger the current step's form submission
                  const currentStepElement = document.querySelector('form');
                  console.log('Found form element:', currentStepElement);
                  
                  if (currentStepElement) {
                    console.log('Dispatching submit event to form');
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    currentStepElement.dispatchEvent(submitEvent);
                  } else {
                    console.log('No form element found!');
                  }
                  
                  // Always scroll to top when Save & Continue is clicked
                  setTimeout(scrollToTop, 100);
                }}
                className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              >
                Save & Continue
              </Button>
            </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <GetTenantsFasterSection />
        </div>
      </div>
    </div>
  );
};