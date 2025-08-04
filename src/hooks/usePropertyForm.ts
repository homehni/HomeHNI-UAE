import { useState } from 'react';
import { 
  PropertyFormData, 
  OwnerInfo, 
  PropertyInfo, 
  PropertyDetails, 
  LocationDetails, 
  RentalDetails, 
  PropertyAmenities, 
  PropertyGallery, 
  AdditionalInfo 
} from '@/types/property';

export const usePropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [propertyDetails, setPropertyDetails] = useState<Partial<PropertyDetails>>({});
  const [locationDetails, setLocationDetails] = useState<Partial<LocationDetails>>({});
  const [rentalDetails, setRentalDetails] = useState<Partial<RentalDetails>>({});
  const [amenities, setAmenities] = useState<Partial<PropertyAmenities>>({});
  const [gallery, setGallery] = useState<Partial<PropertyGallery>>({
    images: []
  });
  const [additionalInfo, setAdditionalInfo] = useState<Partial<AdditionalInfo>>({});

  const nextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 8) {
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

  const updateRentalDetails = (data: Partial<RentalDetails>) => {
    setRentalDetails(prev => ({ ...prev, ...data }));
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

  const getFormData = () => ({
    ownerInfo,
    propertyInfo: {
      propertyDetails,
      locationDetails,
      rentalDetails,
      amenities,
      gallery,
      additionalInfo
    }
  });

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(ownerInfo.fullName && ownerInfo.phoneNumber && ownerInfo.email && ownerInfo.role &&
                 ownerInfo.city && ownerInfo.propertyType && ownerInfo.listingType);
      case 2:
        return !!(propertyDetails.title && propertyDetails.propertyType && propertyDetails.bhkType && 
                 propertyDetails.bathrooms && propertyDetails.furnishingStatus);
      case 3:
        return !!(locationDetails.state && locationDetails.city && locationDetails.locality && 
                 locationDetails.pincode);
      case 4:
        return !!(rentalDetails.listingType && rentalDetails.expectedPrice && rentalDetails.superArea);
      case 5:
        return true; // Amenities are optional
      case 6:
        return !!(gallery.images && gallery.images.length >= 3);
      case 7:
        return true; // Additional info is optional
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
    getFormData,
    isStepValid,
  };
};