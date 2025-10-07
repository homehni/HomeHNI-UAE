import { useState, useEffect } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);
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

  // Load saved draft from localStorage on mount
  useEffect(() => {
    if (isInitialized) return;
    
    try {
      const savedData = localStorage.getItem('rental-form-data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('Loading rental draft from localStorage:', parsed);
        
        if (parsed.propertyDetails) setPropertyDetails(parsed.propertyDetails);
        if (parsed.locationDetails) setLocationDetails(parsed.locationDetails);
        if (parsed.rentalDetails) setRentalDetails(parsed.rentalDetails);
        if (parsed.amenities) setAmenities(parsed.amenities);
        if (parsed.gallery) setGallery(parsed.gallery);
        if (parsed.additionalInfo) setAdditionalInfo(parsed.additionalInfo);
        if (parsed.scheduleInfo) setScheduleInfo(parsed.scheduleInfo);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        
        console.log('Rental draft loaded successfully');
      }
    } catch (error) {
      console.error('Error loading rental draft:', error);
    } finally {
      setIsInitialized(true);
    }
  }, [isInitialized]);

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
    console.log('🎯 goToStep called with step:', step);
    console.log('Current step before change:', currentStep);
    if (step >= 1 && step <= 7) {
      console.log('✅ Valid step, updating currentStep to:', step);
      setCurrentStep(step);
    } else {
      console.log('❌ Invalid step:', step, 'Valid range: 1-7');
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
    console.log('Updating gallery with data:', data);
    setGallery(prev => {
      const updated = { ...prev, ...data };
      console.log('Updated gallery state:', updated);
      return updated;
    });
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