import React from 'react';
import { useLandPlotPropertyForm } from '@/hooks/useLandPlotPropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { LandPlotPropertyDetailsStep } from './LandPlotPropertyDetailsStep';
import { LandPlotLocationDetailsStep } from './LandPlotLocationDetailsStep';
import { LandPlotSaleDetailsStep } from './LandPlotSaleDetailsStep';
import { LandPlotAmenitiesStep } from './LandPlotAmenitiesStep';
import { LandPlotGalleryStep } from './LandPlotGalleryStep';
import { LandPlotAdditionalInfoStep } from './LandPlotAdditionalInfoStep';
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
}

export const LandPlotMultiStepForm: React.FC<LandPlotMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null
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

  const handleAdditionalInfoNext = (data: any) => {
    updateAdditionalInfo(data);
    nextStep();
    scrollToTop();
  };

  const handleScheduleNext = (data: any) => {
    updateScheduleInfo(data);
    nextStep();
    scrollToTop();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    onSubmit(formData as LandPlotFormData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          List Your Land/Plot for Sale
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to list your land/plot for sale on our platform
        </p>
      </div>

      {/* Progress Indicator */}
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
                { number: 1, title: "Plot Details", completed: completedSteps.includes(1), active: currentStep === 1 },
                { number: 2, title: "Location Details", completed: completedSteps.includes(2), active: currentStep === 2 },
                { number: 3, title: "Sale Details", completed: completedSteps.includes(3), active: currentStep === 3 },
                { number: 4, title: "Infrastructure", completed: completedSteps.includes(4), active: currentStep === 4 },
                { number: 5, title: "Photos & Videos", completed: completedSteps.includes(5), active: currentStep === 5 },
                { number: 6, title: "Additional Info", completed: completedSteps.includes(6), active: currentStep === 6 },
                { number: 7, title: "Schedule", completed: completedSteps.includes(7), active: currentStep === 7 },
                { number: 8, title: "Preview & Submit", completed: completedSteps.includes(8), active: currentStep === 8 },
              ].map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    step.active 
                      ? 'bg-red-50 text-red-600 border-l-4 border-red-500' 
                      : step.completed 
                        ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => step.completed && goToStep(step.number)}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.active 
                      ? 'border-red-500 bg-red-500 text-white' 
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
          <div className="flex-1 p-6 md:p-8">
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
              <LandPlotAdditionalInfoStep
                initialData={additionalInfo}
                onNext={handleAdditionalInfoNext}
                onBack={prevStep}
              />
            )}

            {currentStep === 7 && (
              <LandPlotScheduleStep
                initialData={scheduleInfo}
                onNext={handleScheduleNext}
                onBack={prevStep}
              />
            )}

            {currentStep === 8 && (
              <LandPlotPreviewStep
                formData={getFormData() as LandPlotFormData}
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