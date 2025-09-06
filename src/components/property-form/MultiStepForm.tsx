import React, { useState, useEffect } from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { RentalDetailsStep } from './RentalDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { AdditionalInfoStep } from './AdditionalInfoStep';
import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';
import { RentalSidebar } from './RentalSidebar';

import { OwnerInfo, PropertyInfo } from '@/types/property';
import { Badge } from '@/components/ui/badge';

interface MultiStepFormProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {}
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

  const handleAdditionalInfoNext = (data: any) => {
    updateAdditionalInfo(data);
    nextStep();
    scrollToTop();
  };

  const handleScheduleNext = (data: any) => {
    updateScheduleInfo(data);
    nextStep();
    scrollToTop();
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          List Your Property for Rent
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to list your property for rent on our platform
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in">
        {/* Progress Indicator inside container */}
        <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={8}
            completedSteps={completedSteps}
          />
        </div>
        <div className="flex">
          {/* Sidebar - Hidden on mobile and tablet, visible on desktop */}
          <div className="hidden lg:block">
            <RentalSidebar currentStep={currentStep} />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {currentStep === 1 && (
              <div className="p-6 md:p-8">
                <PropertyDetailsStep
                  initialData={propertyDetails}
                  onNext={handlePropertyDetailsNext}
                  onBack={() => {}} // No back on first step
                  currentStep={currentStep}
                  totalSteps={8}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-6 md:p-8">
                <LocationDetailsStep
                  initialData={{
                    ...locationDetails,
                    city: ownerInfo.city || locationDetails.city,
                    state: getStateFromCity(ownerInfo.city) || locationDetails.state
                  }}
                  onNext={handleLocationDetailsNext}
                  onBack={prevStep}
                  currentStep={currentStep}
                  totalSteps={8}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-6 md:p-8">
                <RentalDetailsStep
                  initialData={rentalDetails}
                  onNext={handleRentalDetailsNext}
                  onBack={prevStep}
                  currentStep={currentStep}
                  totalSteps={8}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="p-6 md:p-8">
                <AmenitiesStep
                  initialData={amenities}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                />
              </div>
            )}

            {currentStep === 5 && (
              <div className="p-6 md:p-8">
                <GalleryStep
                  initialData={gallery}
                  onNext={handleGalleryNext}
                  onBack={prevStep}
                />
              </div>
            )}

            {currentStep === 6 && (
              <div className="p-6 md:p-8">
                <AdditionalInfoStep
                  initialData={additionalInfo}
                  onNext={handleAdditionalInfoNext}
                  onBack={prevStep}
                />
              </div>
            )}

            {currentStep === 7 && (
              <div className="p-6 md:p-8">
                <ScheduleStep
                  initialData={scheduleInfo}
                  onNext={handleScheduleNext}
                  onBack={prevStep}
                />
              </div>
            )}

            {currentStep === 8 && (
              <div className="p-6 md:p-8">
                <PreviewStep
                  formData={getFormData()}
                  onBack={prevStep}
                  onEdit={goToStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};