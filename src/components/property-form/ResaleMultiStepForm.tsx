import React, { useState } from 'react';
import { useSalePropertyForm } from '@/hooks/useSalePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyFormSidebar } from './PropertyFormSidebar';
import { ResalePropertyDetailsStep } from './ResalePropertyDetailsStep';
import { ResaleLocationDetailsStep } from './ResaleLocationDetailsStep';
import { SaleDetailsStep } from './SaleDetailsStep';
import { ResaleAmenitiesStep } from './ResaleAmenitiesStep';
import { ResaleGalleryStep } from './ResaleGalleryStep';

import { ResaleScheduleStep } from './ResaleScheduleStep';
import { ResalePreviewStep } from './ResalePreviewStep';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, DollarSign, Sparkles, Camera, Info, Calendar, CheckCircle } from 'lucide-react';

import { OwnerInfo } from '@/types/property';
import { SalePropertyFormData } from '@/types/saleProperty';

interface ResaleMultiStepFormProps {
  onSubmit: (data: SalePropertyFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
}

export const ResaleMultiStepForm: React.FC<ResaleMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null
}) => {
  const {
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
  } = useSalePropertyForm();

  // Initialize with owner info if provided
  React.useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Navigate to target step if provided
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 8) {
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

  const handleSaleDetailsNext = (data: any) => {
    updateSaleDetails(data);
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


  const handleScheduleNext = (data: any) => {
    updateScheduleInfo(data);
    nextStep();
    scrollToTop();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    
    // Submit form without validation - all fields are now optional
    console.log('Resale form submitted with data:', formData);
    
    if (formData.ownerInfo && formData.propertyInfo) {
      onSubmit(formData as SalePropertyFormData);
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-6xl mx-auto h-screen">
        {/* Sidebar */}
        <PropertyFormSidebar
          currentStep={currentStep}
          completedSteps={completedSteps}
          steps={sidebarSteps}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-white flex flex-col">
          {/* Progress Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-semibold text-gray-900">Property Details</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{currentStep}/6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-white p-4">
              {currentStep === 1 && (
                <ResalePropertyDetailsStep
                  initialData={propertyDetails}
                  onNext={handlePropertyDetailsNext}
                  onBack={() => {}} // No back on first step
                />
              )}

              {currentStep === 2 && (
                <ResaleLocationDetailsStep
                  initialData={locationDetails}
                  onNext={handleLocationDetailsNext}
                  onBack={prevStep}
                  currentStep={2}
                  totalSteps={4}
                />
              )}

              {currentStep === 3 && (
                <SaleDetailsStep
                  initialData={saleDetails}
                  propertyDetails={propertyDetails}
                  onNext={handleSaleDetailsNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 4 && (
                <ResaleAmenitiesStep
                  initialData={amenities as any}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 5 && (
                <ResaleGalleryStep
                  initialData={gallery}
                  onNext={handleGalleryNext}
                  onBack={prevStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}

              {currentStep === 6 && (
                <ResaleScheduleStep
                  initialData={scheduleInfo}
                  onNext={handleScheduleNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 7 && (
                <ResalePreviewStep
                  formData={getFormData() as SalePropertyFormData}
                  onBack={prevStep}
                  onEdit={goToStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};