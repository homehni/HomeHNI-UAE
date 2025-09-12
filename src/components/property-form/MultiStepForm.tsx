import React, { useState, useEffect } from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyFormSidebar } from './PropertyFormSidebar';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { RentalDetailsStep } from './RentalDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';

import { ScheduleStep } from './ScheduleStep';
import { Home, MapPin, DollarSign, Sparkles, Camera, Info, Calendar, CheckCircle } from 'lucide-react';

import { OwnerInfo, PropertyInfo } from '@/types/property';
import { Badge } from '@/components/ui/badge';

interface MultiStepFormProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null
}) => {
  // Helper function to get state from city
  const getStateFromCity = (city: string | undefined): string | undefined => {
    if (!city) return undefined;
    
    const cityStateMap: { [key: string]: string } = {
      'mumbai': 'Maharashtra',
      'delhi': 'Delhi',
      'bangalore': 'Karnataka',
      'pune': 'Maharashtra',
      'chennai': 'Tamil Nadu',
      'kolkata': 'West Bengal',
      'hyderabad': 'Telangana',
      'ahmedabad': 'Gujarat',
      'gurgaon': 'Haryana',
      'noida': 'Uttar Pradesh',
      'jaipur': 'Rajasthan',
      'chandigarh': 'Chandigarh',
      'kochi': 'Kerala',
      'indore': 'Madhya Pradesh',
      'bhopal': 'Madhya Pradesh',
      'visakhapatnam': 'Andhra Pradesh',
      'vadodara': 'Gujarat',
      'coimbatore': 'Tamil Nadu',
      'nashik': 'Maharashtra',
      'rajkot': 'Gujarat'
    };
    
    return cityStateMap[city.toLowerCase()] || undefined;
  };
  
  
  const {
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
    isStepValid
  } = usePropertyForm();

  // Initialize with owner info if provided
  React.useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Navigate to target step if provided
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 6) {
      console.log('Navigating to target step:', targetStep);
      goToStep(targetStep);
    }
  }, [targetStep, goToStep]);


  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepValid(i)) completed.push(i);
    }
    return completed;
  }, [isStepValid, currentStep]);



  const scrollToTop = () => {
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handlePropertyDetailsNext = (data: any) => {
    updatePropertyDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: any) => {
    updateLocationDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleRentalDetailsNext = (data: any) => {
    updateRentalDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    updateAmenities(data);
    nextStep();
    scrollToTop();
  };

  const handleGalleryNext = (data: any) => {
    updateGallery(data);
    nextStep();
    scrollToTop();
  };


  const handleScheduleSubmit = (data: any) => {
    updateScheduleInfo(data);
    handleSubmit();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    
    console.log('Form submission with optional validation:', { formData });
    
    // Since all fields are now optional, we can submit with any data
    if (formData.ownerInfo && formData.propertyInfo) {
      onSubmit({
        ownerInfo: formData.ownerInfo as OwnerInfo,
        propertyInfo: formData.propertyInfo as PropertyInfo
      });
    } else {
      console.error('Form data structure is invalid');
    }
  };

  const sidebarSteps = [
    { title: "Property Details", icon: <Home className="w-4 h-4" /> },
    { title: "Locality Details", icon: <MapPin className="w-4 h-4" /> },
    { title: "Rental Details", icon: <DollarSign className="w-4 h-4" /> },
    { title: "Amenities", icon: <Sparkles className="w-4 h-4" /> },
    { title: "Gallery", icon: <Camera className="w-4 h-4" /> },
    { title: "Schedule", icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="flex max-w-6xl mx-auto h-full">
        {/* Sidebar */}
        <PropertyFormSidebar
          currentStep={currentStep}
          completedSteps={completedSteps}
          steps={sidebarSteps}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-white flex flex-col">
          {/* Progress Bar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-base font-semibold text-gray-900">Property Details</h1>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{currentStep}/6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-teal-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-3 min-h-0">
            <div className="bg-white h-full overflow-hidden">
              {currentStep === 1 && (
                <PropertyDetailsStep
                  initialData={propertyDetails}
                  onNext={handlePropertyDetailsNext}
                  onBack={() => {}} // No back on first step
                  currentStep={currentStep}
                  totalSteps={6}
                />
              )}

              {currentStep === 2 && (
                <LocationDetailsStep
                  initialData={{
                    ...locationDetails
                  }}
                  onNext={handleLocationDetailsNext}
                  onBack={prevStep}
                  currentStep={currentStep}
                  totalSteps={6}
                />
              )}

              {currentStep === 3 && (
                <RentalDetailsStep
                  initialData={rentalDetails}
                  onNext={handleRentalDetailsNext}
                  onBack={prevStep}
                  currentStep={currentStep}
                  totalSteps={6}
                />
              )}

              {currentStep === 4 && (
                <AmenitiesStep
                  initialData={amenities}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 5 && (
                <GalleryStep
                  initialData={gallery}
                  onNext={handleGalleryNext}
                  onBack={prevStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}

              {currentStep === 6 && (
                <ScheduleStep
                  initialData={scheduleInfo}
                  onNext={handleScheduleSubmit}
                  onBack={prevStep}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};