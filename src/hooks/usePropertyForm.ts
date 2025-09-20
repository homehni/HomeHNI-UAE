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
  AdditionalInfo,
  ScheduleInfo 
} from '@/types/property';

export const usePropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [propertyDetails, setPropertyDetails] = useState<Partial<PropertyDetails>>({
    title: ''
  });
  const [locationDetails, setLocationDetails] = useState<Partial<LocationDetails>>({});
  const [rentalDetails, setRentalDetails] = useState<Partial<RentalDetails>>({});
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
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
    }
  };

  const updateOwnerInfo = (data: Partial<OwnerInfo>) => {
    setOwnerInfo(prev => ({ ...prev, ...data }));
  };

    const updatePropertyDetails = (data: Partial<PropertyDetails>) => {
    console.log('Updating property details with:', data);
    setPropertyDetails(prev => {
      const updated = { ...prev, ...data };
      console.log('Updated property details:', updated);
      return updated;
    });
  };

  const updateLocationDetails = (data: Partial<LocationDetails>) => {
    setLocationDetails(prev => ({ ...prev, ...data }));
  };

  const updateRentalDetails = (data: Partial<RentalDetails>) => {
    setRentalDetails(prev => ({ ...prev, ...data }));
  };

  const updateAmenities = (data: Partial<PropertyAmenities>) => {
    console.log('Updating amenities with:', data);
    setAmenities(prev => {
      const updated = { ...prev, ...data };
      console.log('Updated amenities:', updated);
      return updated;
    });
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

  const getFormData = () => {
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
    console.log('Getting form data (rental):', formData);
    console.log('Property title in form data:', formData.propertyInfo.propertyDetails.title);
    return formData;
  };

  const isStepValid = (step: number): boolean => {
    // All steps are valid since all fields are now optional
    return true;
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