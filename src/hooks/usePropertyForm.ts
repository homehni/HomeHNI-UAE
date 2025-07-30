import { useState } from 'react';
import { PropertyFormData, OwnerInfo, PropertyInfo } from '@/types/property';

export const usePropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [propertyInfo, setPropertyInfo] = useState<Partial<PropertyInfo>>({});

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };

  const updateOwnerInfo = (data: Partial<OwnerInfo>) => {
    setOwnerInfo(prev => ({ ...prev, ...data }));
  };

  const updatePropertyInfo = (data: Partial<PropertyInfo>) => {
    setPropertyInfo(prev => ({ ...prev, ...data }));
  };

  const getFormData = () => ({
    ownerInfo,
    propertyInfo,
  });

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(ownerInfo.fullName && ownerInfo.phoneNumber && ownerInfo.email && ownerInfo.role);
      case 2:
        return !!(propertyInfo.title && propertyInfo.propertyType && propertyInfo.listingType && 
                 propertyInfo.superArea && propertyInfo.expectedPrice && propertyInfo.state && 
                 propertyInfo.city && propertyInfo.locality && propertyInfo.pincode);
      default:
        return true;
    }
  };

  return {
    currentStep,
    ownerInfo,
    propertyInfo,
    nextStep,
    prevStep,
    goToStep,
    updateOwnerInfo,
    updatePropertyInfo,
    getFormData,
    isStepValid,
  };
};