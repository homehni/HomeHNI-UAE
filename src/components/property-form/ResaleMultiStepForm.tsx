import React, { useState } from 'react';
import { useSalePropertyForm } from '@/hooks/useSalePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { SaleDetailsStep } from './SaleDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { AdditionalInfoStep } from './AdditionalInfoStep';
import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';
import { Badge } from '@/components/ui/badge';

import { OwnerInfo } from '@/types/property';
import { SalePropertyFormData } from '@/types/saleProperty';

interface ResaleMultiStepFormProps {
  onSubmit: (data: SalePropertyFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
}

export const ResaleMultiStepForm: React.FC<ResaleMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {}
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

  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepValid(i)) completed.push(i);
    }
    return completed;
  }, [isStepValid, currentStep]);


  const handlePropertyDetailsNext = (data: any) => {
    updatePropertyDetails(data);
    nextStep();
  };

  const handleLocationDetailsNext = (data: any) => {
    updateLocationDetails(data);
    nextStep();
  };

  const handleSaleDetailsNext = (data: any) => {
    updateSaleDetails(data);
    nextStep();
  };

  const handleAmenitiesNext = (data: any) => {
    updateAmenities(data);
    nextStep();
  };

  const handleGalleryNext = (data: any) => {
    updateGallery(data);
    nextStep();
  };

  const handleAdditionalInfoNext = (data: any) => {
    updateAdditionalInfo(data);
    nextStep();
  };

  const handleScheduleNext = (data: any) => {
    updateScheduleInfo(data);
    nextStep();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    
    // Enhanced validation before submission
    const ownerValid = !!(formData.ownerInfo?.fullName && formData.ownerInfo?.phoneNumber && 
                         formData.ownerInfo?.email && formData.ownerInfo?.role);
    const propertyValid = !!(formData.propertyInfo?.propertyDetails?.title && 
                           formData.propertyInfo?.locationDetails?.state && 
                           formData.propertyInfo?.saleDetails?.expectedPrice);
    
    // Enhanced image validation
    const imageValid = !!(formData.propertyInfo?.gallery?.images && 
                         formData.propertyInfo.gallery.images.length >= 3);
    
    console.log('Resale form validation:', { 
      ownerValid, 
      propertyValid, 
      imageValid, 
      formData 
    });
    
    if (ownerValid && propertyValid && imageValid && formData.ownerInfo && formData.propertyInfo) {
      onSubmit({
        ownerInfo: formData.ownerInfo as OwnerInfo,
        propertyInfo: formData.propertyInfo as any
      });
    } else {
      console.error('Resale form validation failed:', { 
        ownerValid, 
        propertyValid, 
        imageValid,
        missingFields: {
          owner: !ownerValid ? 'Missing owner information' : null,
          property: !propertyValid ? 'Missing property information' : null,
          images: !imageValid ? 'Need at least 3 images' : null
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header with Resale Badge */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <Badge variant="secondary" className="bg-green-100 text-green-700 px-4 py-2 text-sm font-medium">
            🏠 RESALE PROPERTY FORM
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          List Your Property for Sale
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to list your property for sale on our platform
        </p>
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="mb-12">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={8}
          completedSteps={completedSteps}
        />
      </div>

      {/* Form Content in Card Layout */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in">
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
              initialData={locationDetails}
              onNext={handleLocationDetailsNext}
              onBack={prevStep}
              currentStep={currentStep}
              totalSteps={8}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="p-6 md:p-8">
            <SaleDetailsStep
              initialData={saleDetails}
              onNext={handleSaleDetailsNext}
              onBack={prevStep}
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
  );
};