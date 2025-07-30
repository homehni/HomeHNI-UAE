import React from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { OwnerInfoStep } from './OwnerInfoStep';
import { PropertyInfoStep } from './PropertyInfoStep';
import { PreviewStep } from './PreviewStep';
import { OwnerInfo, PropertyInfo } from '@/types/property';

interface MultiStepFormProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void;
  isSubmitting?: boolean;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  const {
    currentStep,
    ownerInfo,
    propertyInfo,
    nextStep,
    prevStep,
    goToStep,
    updateOwnerInfo,
    updatePropertyInfo,
    getFormData,
    isStepValid
  } = usePropertyForm();

  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    if (isStepValid(1)) completed.push(1);
    if (isStepValid(1) && isStepValid(2)) completed.push(2);
    return completed;
  }, [isStepValid]);

  const handleOwnerInfoNext = (data: OwnerInfo) => {
    updateOwnerInfo(data);
    nextStep();
  };

  const handlePropertyInfoNext = (data: PropertyInfo) => {
    updatePropertyInfo(data);
    nextStep();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    if (formData.ownerInfo && formData.propertyInfo && 
        isStepValid(1) && isStepValid(2)) {
      onSubmit({
        ownerInfo: formData.ownerInfo as OwnerInfo,
        propertyInfo: formData.propertyInfo as PropertyInfo
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={3}
        completedSteps={completedSteps}
      />

      {currentStep === 1 && (
        <OwnerInfoStep
          initialData={ownerInfo}
          onNext={handleOwnerInfoNext}
        />
      )}

      {currentStep === 2 && (
        <PropertyInfoStep
          initialData={propertyInfo}
          onNext={handlePropertyInfoNext}
          onBack={prevStep}
        />
      )}

      {currentStep === 3 && (
        <PreviewStep
          formData={getFormData()}
          onBack={prevStep}
          onEdit={goToStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};