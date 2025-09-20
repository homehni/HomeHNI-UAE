import { useState, useCallback } from 'react';
import { 
  OwnerInfo, 
  CommercialInfo, 
  CommercialPropertyDetails, 
  LocationDetails, 
  CommercialRentalDetails, 
  CommercialAmenities, 
  PropertyGallery, 
  AdditionalInfo,
  ScheduleInfo 
} from '@/types/property';

export const useCommercialPropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(2); // Start at Property Details step
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [propertyDetails, setPropertyDetails] = useState<Partial<CommercialPropertyDetails>>({
    title: ''
  });
  const [locationDetails, setLocationDetails] = useState<Partial<LocationDetails>>({});
  const [rentalDetails, setRentalDetails] = useState<Partial<CommercialRentalDetails>>({});
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

  const updateRentalDetails = useCallback((data: Partial<CommercialRentalDetails>) => {
    setRentalDetails(prev => ({ ...prev, ...data }));
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

  const getFormData = useCallback(() => {
    const formData = {
      ownerInfo,
      propertyInfo: {
        propertyDetails,
        locationDetails,
        rentalDetails,
        amenities,
        gallery,
        additionalInfo,
        scheduleInfo
      }
    };
    console.log('Getting commercial form data:', formData);
    console.log('Commercial property title:', formData.propertyInfo.propertyDetails.title);
    return formData;
  }, [ownerInfo, propertyDetails, locationDetails, rentalDetails, amenities, gallery, additionalInfo, scheduleInfo]);

  const isStepValid = useCallback((step: number): boolean => {
    // All steps are now optional - always return true
    return true;
  }, []);

  return {
    currentStep,
    ownerInfo,
    propertyDetails,
    locationDetails,
    rentalDetails,
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
    updateRentalDetails,
    updateAmenities,
    updateGallery,
    updateAdditionalInfo,
    updateScheduleInfo,
    getFormData,
    isStepValid,
  };
};