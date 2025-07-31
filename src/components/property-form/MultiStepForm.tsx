import React, { useState, useEffect } from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { OwnerInfoStep } from './OwnerInfoStep';
import { PropertyInfoStep } from './PropertyInfoStep';
import { PreviewStep } from './PreviewStep';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { OwnerInfo, PropertyInfo } from '@/types/property';

interface MultiStepFormProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void;
  isSubmitting?: boolean;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  
  const {
    currentStep,
    ownerInfo,
    propertyInfo,
    nextStep,
    prevStep,
    goToStep,
    updateOwnerInfo,
    updatePropertyInfo,
    getFormData,
    isStepValid
  } = usePropertyForm();

  // Check if WhatsApp modal should be shown with delay (only once per session)
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('whatsapp-modal-shown');
    if (currentStep === 2 && !hasSeenModal) {
      // Show modal after 2.5 seconds delay
      const timer = setTimeout(() => {
        setShowWhatsAppModal(true);
        sessionStorage.setItem('whatsapp-modal-shown', 'true');
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    if (isStepValid(1)) completed.push(1);
    if (isStepValid(1) && isStepValid(2)) completed.push(2);
    return completed;
  }, [isStepValid]);

  const handleOwnerInfoNext = (data: OwnerInfo) => {
    updateOwnerInfo(data);
    nextStep();
  };

  const handleContinueToForm = () => {
    setShowWhatsAppModal(false);
  };

  const handlePropertyInfoNext = (data: PropertyInfo) => {
    updatePropertyInfo(data);
    nextStep();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    
    // Enhanced validation before submission
    const ownerValid = !!(formData.ownerInfo?.fullName && formData.ownerInfo?.phoneNumber && 
                         formData.ownerInfo?.email && formData.ownerInfo?.role);
    const propertyValid = !!(formData.propertyInfo?.title && formData.propertyInfo?.propertyType && 
                           formData.propertyInfo?.listingType && formData.propertyInfo?.superArea && 
                           formData.propertyInfo?.expectedPrice && formData.propertyInfo?.state && 
                           formData.propertyInfo?.city && formData.propertyInfo?.locality && 
                           formData.propertyInfo?.pincode);
    
    // Enhanced image validation
    const imageValid = !!(formData.propertyInfo?.images && formData.propertyInfo.images.length >= 3);
    
    console.log('Form validation:', { 
      ownerValid, 
      propertyValid, 
      imageValid, 
      imageCount: formData.propertyInfo?.images?.length,
      formData 
    });
    
    if (ownerValid && propertyValid && imageValid && formData.ownerInfo && formData.propertyInfo) {
      onSubmit({
        ownerInfo: formData.ownerInfo as OwnerInfo,
        propertyInfo: formData.propertyInfo as PropertyInfo
      });
    } else {
      console.error('Form validation failed:', { 
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          List Your Property
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to list your property on our platform
        </p>
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="mb-12">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={3}
          completedSteps={completedSteps}
        />
      </div>

      {/* Form Content in Card Layout */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in">
        {currentStep === 1 && (
          <div className="p-6 md:p-8">
            <OwnerInfoStep
              initialData={ownerInfo}
              onNext={handleOwnerInfoNext}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-6 md:p-8">
            <PropertyInfoStep
              initialData={propertyInfo}
              onNext={handlePropertyInfoNext}
              onBack={prevStep}
            />
          </div>
        )}

        {currentStep === 3 && (
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

      {/* WhatsApp Modal */}
      <WhatsAppModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        onContinueToForm={handleContinueToForm}
      />
    </div>
  );
};