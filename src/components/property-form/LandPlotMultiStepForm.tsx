import React from 'react';
import { useLandPlotPropertyForm } from '@/hooks/useLandPlotPropertyForm';
import { LandPlotPropertyDetailsStep } from './LandPlotPropertyDetailsStep';
import { LandPlotLocationDetailsStep } from './LandPlotLocationDetailsStep';
import { LandPlotSaleDetailsStep } from './LandPlotSaleDetailsStep';
import { LandPlotAmenitiesStep } from './LandPlotAmenitiesStep';
import { LandPlotGalleryStep } from './LandPlotGalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { LandPlotSidebar } from './LandPlotSidebar';

import { LandPlotScheduleStep } from './LandPlotScheduleStep';
import { LandPlotPreviewStep } from './LandPlotPreviewStep';
import { Badge } from '@/components/ui/badge';
import { OwnerInfo } from '@/types/property';
import { LandPlotFormData } from '@/types/landPlotProperty';

interface LandPlotMultiStepFormProps {
  onSubmit: (data: LandPlotFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const LandPlotMultiStepForm: React.FC<LandPlotMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId
}) => {
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

  // Initialize with owner info if provided
  React.useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
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
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

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


  const handleScheduleNext = (data: any) => {
    updateScheduleInfo(data);
    nextStep();
    scrollToTop();
  };

  const handleScheduleSubmit = async (data: any) => {
    // Update schedule info, submit the property, then go to Preview
    updateScheduleInfo(data);
    const formData = getFormData();
    await onSubmit(formData as LandPlotFormData);
    goToStep(7);
    scrollToTop();
  };

  const handleSubmit = () => {
    const formData = getFormData();
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
          <div className="max-w-4xl mx-auto p-6 md:p-8">
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

              {currentStep === 7 && (
                <LandPlotPreviewStep
                  formData={getFormData() as LandPlotFormData}
                  onBack={prevStep}
                  onEdit={goToStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  previewPropertyId={createdSubmissionId || undefined}
                />
              )}
          </div>
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <GetTenantsFasterSection />
        </div>
      </div>
    </div>
  );
};