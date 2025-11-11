import { useState, useCallback } from 'react';
import { 
  OwnerInfo, 
  CommercialPropertyDetails, 
  LocationDetails, 
  CommercialAmenities, 
  PropertyGallery, 
  AdditionalInfo,
  ScheduleInfo 
} from '@/types/property';
import { CommercialSaleDetails } from '@/types/commercialSaleProperty';

export const useCommercialSalePropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(2); // Start at Property Details step
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [propertyDetails, setPropertyDetails] = useState<Partial<CommercialPropertyDetails>>({
    title: ''
  });
  const [locationDetails, setLocationDetails] = useState<Partial<LocationDetails>>({});
  const [saleDetails, setSaleDetails] = useState<Partial<CommercialSaleDetails>>({});
  const [amenities, setAmenities] = useState<Partial<CommercialAmenities>>({});
  const [gallery, setGallery] = useState<Partial<PropertyGallery>>({
    images: []
  });
  const [additionalInfo, setAdditionalInfo] = useState<Partial<AdditionalInfo>>({});
  const [scheduleInfo, setScheduleInfo] = useState<Partial<ScheduleInfo>>({
    availability: 'everyday',
    availableAllDay: true
  });

  const nextStep = useCallback(() => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 2) { // Don't go below step 2 since we skip owner info step
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 2 && step <= 9) { // Valid steps are 2-9
      setCurrentStep(step);
    } else {
      console.warn(`Invalid step number: ${step}. Valid range is 2-9.`);
    }
  }, []);

  const updateOwnerInfo = useCallback((data: Partial<OwnerInfo>) => {
    setOwnerInfo(prev => ({ ...prev, ...data }));
  }, []);

  const updatePropertyDetails = useCallback((data: Partial<CommercialPropertyDetails>) => {
    setPropertyDetails(prev => ({ ...prev, ...data }));
  }, []);

  const updateLocationDetails = useCallback((data: Partial<LocationDetails>) => {
    setLocationDetails(prev => ({ ...prev, ...data }));
  }, []);

  const updateSaleDetails = useCallback((data: Partial<CommercialSaleDetails>) => {
    setSaleDetails(prev => ({ ...prev, ...data }));
  }, []);

  const updateAmenities = useCallback((data: Partial<CommercialAmenities>) => {
    setAmenities(prev => ({ ...prev, ...data }));
  }, []);

  const updateGallery = useCallback((data: Partial<PropertyGallery>) => {
    setGallery(prev => ({ ...prev, ...data }));
  }, []);

  const updateAdditionalInfo = useCallback((data: Partial<AdditionalInfo>) => {
    setAdditionalInfo(prev => ({ ...prev, ...data }));
  }, []);

  const updateScheduleInfo = useCallback((data: Partial<ScheduleInfo>) => {
    setScheduleInfo(prev => ({ ...prev, ...data }));
  }, []);

  const getFormData = useCallback(() => ({
    ownerInfo,
    propertyInfo: {
      propertyDetails,
      locationDetails,
      saleDetails,
      amenities,
      gallery,
      additionalInfo,
      scheduleInfo
    }
  }), [ownerInfo, propertyDetails, locationDetails, saleDetails, amenities, gallery, additionalInfo, scheduleInfo]);

  const resetForm = useCallback(() => {
    setCurrentStep(2);
    setOwnerInfo({});
    setPropertyDetails({ title: '' });
    setLocationDetails({});
    setSaleDetails({});
    setAmenities({});
    setGallery({ images: [] });
    setAdditionalInfo({});
    setScheduleInfo({ availability: 'everyday', availableAllDay: true });
  }, []);

  const isStepValid = useCallback((step: number): boolean => {
    // All steps are optional now
    return true;
  }, []);

  return {
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
    resetForm,
    isStepValid,
  };
};
