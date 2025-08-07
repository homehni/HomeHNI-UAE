import { useState } from 'react';
import { 
  OwnerInfo, 
  PropertyGallery, 
  AdditionalInfo,
  ScheduleInfo 
} from '@/types/property';
import { 
  LandPlotDetails, 
  LandPlotLocationDetails,
  LandPlotSaleDetails, 
  LandPlotAmenities 
} from '@/types/landPlotProperty';

export const useLandPlotPropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerInfo>>({});
  const [plotDetails, setPlotDetails] = useState<Partial<LandPlotDetails>>({
    propertyType: 'Land/Plot',
    plotAreaUnit: 'sq-ft',
    boundaryWall: 'no',
    cornerPlot: false,
    roadFacing: 'east',
    landType: 'residential',
    plotShape: 'regular',
    gatedCommunity: false,
    roadWidth: 20
  });
  const [locationDetails, setLocationDetails] = useState<Partial<LandPlotLocationDetails>>({});
  const [saleDetails, setSaleDetails] = useState<Partial<LandPlotSaleDetails>>({
    listingType: 'Sale',
    priceNegotiable: true,
    ownershipType: 'freehold',
    clearTitles: true
  });
  const [amenities, setAmenities] = useState<Partial<LandPlotAmenities>>({
    waterConnection: 'no',
    electricityConnection: 'no',
    sewerageConnection: 'no',
    gasConnection: 'no',
    internetConnectivity: 'no',
    roadConnectivity: 'good',
    publicTransport: 'no',
    streetLights: false,
    drainage: 'average',
    floodProne: false
  });
  const [gallery, setGallery] = useState<Partial<PropertyGallery>>({
    images: []
  });
  const [additionalInfo, setAdditionalInfo] = useState<Partial<AdditionalInfo>>({});
  const [scheduleInfo, setScheduleInfo] = useState<Partial<ScheduleInfo>>({
    availability: 'everyday',
    availableAllDay: true
  });

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

  const updatePlotDetails = (data: Partial<LandPlotDetails>) => {
    setPlotDetails(prev => ({ ...prev, ...data }));
  };

  const updateLocationDetails = (data: Partial<LandPlotLocationDetails>) => {
    setLocationDetails(prev => ({ ...prev, ...data }));
  };

  const updateSaleDetails = (data: Partial<LandPlotSaleDetails>) => {
    setSaleDetails(prev => ({ ...prev, ...data }));
  };

  const updateAmenities = (data: Partial<LandPlotAmenities>) => {
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
      plotDetails,
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
        return !!(plotDetails.title && plotDetails.plotArea && plotDetails.landType);
      case 2:
        return !!(locationDetails.state && locationDetails.city && locationDetails.locality && 
                 locationDetails.pincode);
      case 3:
        return !!(saleDetails.expectedPrice && saleDetails.pricePerUnit);
      case 4:
        return true; // Amenities are optional
      case 5:
        return !!(gallery.images && gallery.images.length >= 3);
      case 6:
        return true; // Additional info is optional
      case 7:
        return !!(scheduleInfo.availability);
      default:
        return true;
    }
  };

  return {
    currentStep,
    ownerInfo,
    plotDetails,
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
    updatePlotDetails,
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