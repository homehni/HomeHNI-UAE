import { useMemo, useEffect } from 'react';
import { useCommercialSalePropertyForm } from '@/hooks/useCommercialSalePropertyForm';
import { CommercialSaleSidebar } from './CommercialSaleSidebar';
import { CommercialSalePropertyDetailsStep } from './CommercialSalePropertyDetailsStep';
import { CommercialSaleLocationDetailsStep } from './CommercialSaleLocationDetailsStep';
import { CommercialSaleSaleDetailsStep } from './CommercialSaleSaleDetailsStep';
import { CommercialSaleAmenitiesStep } from './CommercialSaleAmenitiesStep';
import { CommercialSaleGalleryStep } from './CommercialSaleGalleryStep';
import { CommercialSaleAdditionalInfoStep } from './CommercialSaleAdditionalInfoStep';
import { CommercialSaleScheduleStep } from './CommercialSaleScheduleStep';
import { CommercialSalePreviewStep } from './CommercialSalePreviewStep';
import { OwnerInfo } from '@/types/property';

interface CommercialSaleMultiStepFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
}

export const CommercialSaleMultiStepForm = ({
  onSubmit,
  isSubmitting,
  initialOwnerInfo
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

  const completedSteps = useMemo(() => {
    const completed = [];
    for (let i = 2; i <= 8; i++) {
      if (isStepValid(i) && i < currentStep) {
        completed.push(i);
      }
    }
    return completed;
  }, [currentStep, isStepValid]);

  const handleSubmit = async () => {
    const formData = getFormData();
    
    if (!formData.propertyInfo.propertyDetails.title || !formData.propertyInfo.saleDetails.expectedPrice) {
      alert('Please fill in all required fields');
      return;
    }

    await onSubmit(formData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <CommercialSalePropertyDetailsStep
            initialData={propertyDetails}
            onNext={updatePropertyDetails}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 3:
        return (
          <CommercialSaleLocationDetailsStep
            initialData={locationDetails}
            onNext={updateLocationDetails}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 4:
        return (
          <CommercialSaleSaleDetailsStep
            initialData={saleDetails}
            onNext={updateSaleDetails}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 5:
        return (
          <CommercialSaleAmenitiesStep
            initialData={amenities}
            onNext={updateAmenities}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 6:
        return (
          <CommercialSaleGalleryStep
            initialData={gallery}
            onNext={updateGallery}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 7:
        return (
          <CommercialSaleAdditionalInfoStep
            initialData={additionalInfo}
            onNext={updateAdditionalInfo}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 8:
        return (
          <CommercialSaleScheduleStep
            initialData={scheduleInfo}
            onNext={updateScheduleInfo}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 9:
        return (
          <CommercialSalePreviewStep
            formData={getFormData() as any}
            onSubmit={handleSubmit}
            onBack={prevStep}
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
      <div className="container mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              List Your Commercial Property for Sale
            </h1>
            <p className="text-gray-600 mt-1">
              Step {currentStep} of 8: Complete your property listing
            </p>
          </div>
        </div>

        <div className="flex">
          <CommercialSaleSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />

          <div className="flex-1">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};