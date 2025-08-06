import { useState } from 'react';
import { OwnerInfo, PropertyDetails, LocationDetails, PropertyAmenities, PropertyGallery, AdditionalInfo, ScheduleInfo } from '@/types/property';
import { SaleDetails, SalePropertyInfo } from '@/types/saleProperty';

export const useSalePropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [propertyDetails, setPropertyDetails] = useState<Partial<PropertyDetails>>({});
  const [locationDetails, setLocationDetails] = useState<Partial<LocationDetails>>({});
  const [saleDetails, setSaleDetails] = useState<Partial<SaleDetails>>({});
  const [amenities, setAmenities] = useState<Partial<PropertyAmenities>>({});
  const [gallery, setGallery] = useState<Partial<PropertyGallery>>({});
  const [additionalInfo, setAdditionalInfo] = useState<Partial<AdditionalInfo>>({});
  const [scheduleInfo, setScheduleInfo] = useState<Partial<ScheduleInfo>>({});

  // Navigation functions
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 9));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(Math.max(1, Math.min(step, 9)));

  // Update functions
  const updateOwnerInfo = (data: Partial<OwnerInfo>) => setOwnerInfo(prev => ({ ...prev, ...data }));
  const updatePropertyDetails = (data: Partial<PropertyDetails>) => setPropertyDetails(prev => ({ ...prev, ...data }));
  const updateLocationDetails = (data: Partial<LocationDetails>) => setLocationDetails(prev => ({ ...prev, ...data }));
  const updateSaleDetails = (data: Partial<SaleDetails>) => setSaleDetails(prev => ({ ...prev, ...data }));
  const updateAmenities = (data: Partial<PropertyAmenities>) => setAmenities(prev => ({ ...prev, ...data }));
  const updateGallery = (data: Partial<PropertyGallery>) => setGallery(prev => ({ ...prev, ...data }));
  const updateAdditionalInfo = (data: Partial<AdditionalInfo>) => setAdditionalInfo(prev => ({ ...prev, ...data }));
  const updateScheduleInfo = (data: Partial<ScheduleInfo>) => setScheduleInfo(prev => ({ ...prev, ...data }));

  // Get complete form data
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
    } as SalePropertyInfo
  });

  // Validation function
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(ownerInfo.fullName && ownerInfo.phoneNumber && ownerInfo.email && ownerInfo.role);
      case 2:
        return !!(propertyDetails.title && propertyDetails.propertyType && propertyDetails.bhkType);
      case 3:
        return !!(locationDetails.state && locationDetails.city && locationDetails.locality);
      case 4:
        return !!(saleDetails.expectedPrice && saleDetails.listingType);
      case 5:
        return true; // Amenities are optional
      case 6:
        return !!(gallery.images && gallery.images.length >= 3);
      case 7:
        return true; // Additional info is optional
      case 8:
        return !!(scheduleInfo.availability);
      default:
        return false;
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
    isStepValid
  };
};