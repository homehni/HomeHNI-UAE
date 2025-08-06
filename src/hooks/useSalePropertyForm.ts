import { useState } from 'react';
import { 
  OwnerInfo, 
  PropertyDetails, 
  LocationDetails, 
  PropertyAmenities, 
  PropertyGallery, 
  AdditionalInfo,
  ScheduleInfo 
} from '@/types/property';
import { SaleDetails } from '@/types/saleProperty';

export const useSalePropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [propertyDetails, setPropertyDetails] = useState<Partial<PropertyDetails>>({});
  const [locationDetails, setLocationDetails] = useState<Partial<LocationDetails>>({});
  const [saleDetails, setSaleDetails] = useState<Partial<SaleDetails>>({
    listingType: 'Sale',
    priceNegotiable: true,
    homeLoanAvailable: true,
    registrationStatus: 'ready_to_move'
  });
  const [amenities, setAmenities] = useState<Partial<PropertyAmenities>>({});
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
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 9) {
      setCurrentStep(step);
    }
  };

  const updateOwnerInfo = (data: Partial<OwnerInfo>) => {
    setOwnerInfo(prev => ({ ...prev, ...data }));
  };

  const updatePropertyDetails = (data: Partial<PropertyDetails>) => {
    setPropertyDetails(prev => ({ ...prev, ...data }));
  };

  const updateLocationDetails = (data: Partial<LocationDetails>) => {
    setLocationDetails(prev => ({ ...prev, ...data }));
  };

  const updateSaleDetails = (data: Partial<SaleDetails>) => {
    setSaleDetails(prev => ({ ...prev, ...data }));
  };

  const updateAmenities = (data: Partial<PropertyAmenities>) => {
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
      saleDetails,
      amenities,
      gallery,
      additionalInfo,
      scheduleInfo
    }
  });

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(ownerInfo.phoneNumber && ownerInfo.role &&
                 ownerInfo.city && ownerInfo.propertyType && ownerInfo.listingType);
      case 2:
        return !!(propertyDetails.title && propertyDetails.propertyType && propertyDetails.bhkType && 
                 propertyDetails.bathrooms && propertyDetails.furnishingStatus);
      case 3:
        return !!(locationDetails.state && locationDetails.city && locationDetails.locality && 
                 locationDetails.pincode);
      case 4:
        return !!(saleDetails.listingType && saleDetails.expectedPrice);
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
  };
};