import { useState } from 'react';
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
  const [propertyDetails, setPropertyDetails] = useState<Partial<CommercialPropertyDetails>>({});
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

  const nextStep = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 2) { // Don't go below step 2 since we skip owner info step
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 2 && step <= 9) { // Valid steps are 2-9
      setCurrentStep(step);
    }
  };

  const updateOwnerInfo = (data: Partial<OwnerInfo>) => {
    setOwnerInfo(prev => ({ ...prev, ...data }));
  };

  const updatePropertyDetails = (data: Partial<CommercialPropertyDetails>) => {
    setPropertyDetails(prev => ({ ...prev, ...data }));
  };

  const updateLocationDetails = (data: Partial<LocationDetails>) => {
    setLocationDetails(prev => ({ ...prev, ...data }));
  };

  const updateRentalDetails = (data: Partial<CommercialRentalDetails>) => {
    setRentalDetails(prev => ({ ...prev, ...data }));
  };

  const updateAmenities = (data: Partial<CommercialAmenities>) => {
    setAmenities(prev => ({ ...prev, ...data }));
  };

  const updateGallery = (data: Partial<PropertyGallery>) => {
    setGallery(prev => ({ ...prev, ...data }));
  };

  const updateAdditionalInfo = (data: Partial<AdditionalInfo>) => {
    setAdditionalInfo(prev => ({ ...prev, ...data }));
  };

  const updateScheduleInfo = (data: Partial<ScheduleInfo>) => {
    setScheduleInfo(prev => ({ ...prev, ...data }));
  };

  const getFormData = () => ({
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
  });

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 2:
        return !!(propertyDetails.title && propertyDetails.propertyType && 
                 propertyDetails.spaceType && propertyDetails.furnishingStatus);
      case 3:
        return !!(locationDetails.state && locationDetails.city && locationDetails.locality && 
                 locationDetails.pincode);
      case 4:
        return !!(rentalDetails.listingType && rentalDetails.expectedPrice);
      case 5:
        return true; // Amenities are optional
      case 6:
        return !!(gallery.images && gallery.images.length >= 3);
      case 7:
        return true; // Additional info is optional
      case 8:
        return !!(scheduleInfo.availability); // Schedule step
      default:
        return true;
    }
  };

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