import { useState, useEffect, useCallback } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [propertyDetails, setPropertyDetails] = useState<Partial<PropertyDetails>>({
    title: ''
  });
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

  // Load saved draft from localStorage on mount
  useEffect(() => {
    if (isInitialized) return;
    
    try {
      const savedData = localStorage.getItem('resale-form-data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('Loading resale draft from localStorage:', parsed);
        
        if (parsed.propertyDetails) setPropertyDetails(parsed.propertyDetails);
        if (parsed.locationDetails) setLocationDetails(parsed.locationDetails);
        if (parsed.saleDetails) setSaleDetails(parsed.saleDetails);
        if (parsed.amenities) setAmenities(parsed.amenities);
        if (parsed.gallery) setGallery(parsed.gallery);
        if (parsed.additionalInfo) setAdditionalInfo(parsed.additionalInfo);
        if (parsed.scheduleInfo) setScheduleInfo(parsed.scheduleInfo);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        
        console.log('Resale draft loaded successfully');
      }
    } catch (error) {
      console.error('Error loading resale draft:', error);
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
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
    }
  };

  const updateOwnerInfo = (data: Partial<OwnerInfo>) => {
    setOwnerInfo(prev => ({ ...prev, ...data }));
  };

  const updatePropertyDetails = (data: Partial<PropertyDetails>) => {
    console.log('Updating sale property details with:', data);
    setPropertyDetails(prev => {
      const updated = { ...prev, ...data };
      console.log('Updated sale property details:', updated);
      return updated;
    });
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
    console.log('🖼️ [useSalePropertyForm] Updating gallery with data:', data);
    console.log('🖼️ [useSalePropertyForm] Categorized images:', data.categorizedImages);
    console.log('🖼️ [useSalePropertyForm] All images:', data.images);
    setGallery(prev => {
      const updated = { ...prev, ...data };
      console.log('🖼️ [useSalePropertyForm] Updated gallery state:', updated);
      
      // Immediately save to localStorage for persistence
      try {
        const savedData = localStorage.getItem('resale-form-data');
        const existingData = savedData ? JSON.parse(savedData) : {};
        const updatedFormData = {
          ...existingData,
          gallery: updated
        };
        localStorage.setItem('resale-form-data', JSON.stringify(updatedFormData));
        console.log('✅ [useSalePropertyForm] Gallery saved to localStorage:', updated);
      } catch (error) {
        console.error('❌ [useSalePropertyForm] Error saving gallery to localStorage:', error);
      }
      
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
        saleDetails,
        amenities,
        gallery,
        additionalInfo,
        scheduleInfo
      }
    };
    console.log('Getting form data (sale):', formData);
    console.log('Property title in sale form data:', formData.propertyInfo.propertyDetails.title);
    return formData;
  };

  const isStepValid = (step: number): boolean => {
    // All steps are now optional - users can progress regardless of field completion
    return true;
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