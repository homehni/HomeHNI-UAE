import React from 'react';
import { Button } from '@/components/ui/button';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { OwnerInfoStep } from './OwnerInfoStep';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { RentalDetailsStep } from './RentalDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { PropertyFormSidebar } from './PropertyFormSidebar';
import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';
import { User, Home, MapPin, DollarSign, Sparkles, Camera, Calendar, CheckCircle } from 'lucide-react';
import { OwnerInfo, PropertyInfo } from '@/types/property';

interface MultiStepFormProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId = null
}) => {
  console.log('MultiStepForm rendering with props:', {
    isSubmitting,
    initialOwnerInfo,
    targetStep,
    createdSubmissionId
  });

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

  console.log('MultiStepForm currentStep:', currentStep);

  // Initialize with owner info if provided
  React.useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Navigate to target step if provided
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 7) {
      console.log('Navigating to target step:', targetStep);
      goToStep(targetStep);
    }
  }, [targetStep, goToStep]);

  // Track one-time auto-navigation to preview
  const hasNavigatedToPreview = React.useRef(false);

  // Navigate to congratulations page once if submission is complete
  React.useEffect(() => {
    if (createdSubmissionId && !hasNavigatedToPreview.current) {
      console.log('Submission complete, navigating to congratulations page');
      hasNavigatedToPreview.current = true;
      goToStep(7);
    }
  }, [createdSubmissionId, goToStep]);

  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepValid(i)) completed.push(i);
    }
    return completed;
  }, [isStepValid, currentStep]);

  const scrollToTop = () => {
    try {
      const el = document.scrollingElement || document.documentElement || document.body;
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const handleOwnerInfoNext = (data: any) => {
    updateOwnerInfo(data);
    nextStep();
    scrollToTop();
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

  const handleRentalDetailsNext = (data: any, amenitiesData?: any) => {
    updateRentalDetails(data);
    if (amenitiesData) {
      updateAmenities(amenitiesData);
    }
    nextStep();
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    updateAmenities(data);
    nextStep();
    scrollToTop();
  };

  const handleGalleryNext = (data: any) => {
    console.log('Gallery step next - data received:', data);
    updateGallery(data);
    
    // Save complete form data including gallery to localStorage
    const completeFormData = {
      ownerInfo,
      propertyDetails,
      locationDetails,
      rentalDetails,
      amenities,
      gallery: data, // Use the new gallery data
      additionalInfo,
      scheduleInfo,
      currentStep: 6, // Moving to next step
      completedSteps: [...completedSteps, 5],
      formType: 'rental'
    };
    localStorage.setItem('rental-form-data', JSON.stringify(completeFormData));
    console.log('Saved complete rental form data with gallery to localStorage:', completeFormData);
    
    nextStep();
    scrollToTop();
  };

  const handleScheduleSubmit = async (data: any) => {
    console.log('MultiStepForm handleScheduleSubmit called');
    console.log('Schedule data:', data);
    
    // Update schedule info, submit the property, then go to Preview
    updateScheduleInfo(data);
    const formData = getFormData();
    console.log('Complete form data for submission:', formData);
    
    await onSubmit({
      ownerInfo: formData.ownerInfo as OwnerInfo,
      propertyInfo: formData.propertyInfo as PropertyInfo
    });
    goToStep(7);
    scrollToTop();
  };

  const handleSubmit = () => {
    console.log('MultiStepForm handleSubmit called');
    const formData = getFormData();
    console.log('Form data for submission:', formData);
    onSubmit({
      ownerInfo: formData.ownerInfo as OwnerInfo,
      propertyInfo: formData.propertyInfo as PropertyInfo
    });
  };

  const sidebarSteps = [
    { title: "Property Details", icon: <Home className="w-4 h-4" /> },
    { title: "Locality Details", icon: <MapPin className="w-4 h-4" /> },
    { title: "Rental Details", icon: <DollarSign className="w-4 h-4" /> },
    { title: "Amenities", icon: <Sparkles className="w-4 h-4" /> },
    { title: "Gallery", icon: <Camera className="w-4 h-4" /> },
    { title: "Schedule", icon: <Calendar className="w-4 h-4" /> },
    { title: "Preview", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Three Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <PropertyFormSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            steps={sidebarSteps}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white p-6 md:p-8 pb-32">
              {currentStep === 1 && (
                <PropertyDetailsStep
                  initialData={propertyDetails}
                  onNext={handlePropertyDetailsNext}
                  onBack={prevStep}
                  currentStep={1}
                  totalSteps={7}
                />
              )}

              {currentStep === 2 && (
                <LocationDetailsStep
                  initialData={locationDetails}
                  onNext={handleLocationDetailsNext}
                  onBack={prevStep}
                  currentStep={2}
                  totalSteps={7}
                />
              )}

              {currentStep === 3 && (
                <RentalDetailsStep
                  initialData={rentalDetails}
                  initialAmenities={{ furnishing: amenities.furnishing, parking: amenities.parking }}
                  onNext={handleRentalDetailsNext}
                  onBack={prevStep}
                  currentStep={3}
                  totalSteps={7}
                />
              )}

              {currentStep === 4 && (
                <AmenitiesStep
                  initialData={amenities}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                  currentStep={4}
                  totalSteps={7}
                />
              )}

            {currentStep === 5 && (
              <GalleryStep
                initialData={gallery}
                onNext={handleGalleryNext}
                onBack={prevStep}
                currentStep={5}
                totalSteps={7}
                formId="rental-gallery-form"
              />
            )}

              {currentStep === 6 && (
                <ScheduleStep
                  initialData={scheduleInfo}
                  onNext={handleScheduleSubmit}
                  onBack={prevStep}
                  onSubmit={handleScheduleSubmit}
                  ownerInfo={ownerInfo}
                  propertyInfo={getFormData().propertyInfo as any}
                />
              )}

              {currentStep === 7 && (
                <PreviewStep
                  formData={getFormData()}
                  onBack={prevStep}
                  onEdit={goToStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  previewPropertyId={createdSubmissionId || undefined}
                />
              )}

          {/* Sticky Bottom Navigation Bar - Hidden on Preview step */}
          {currentStep !== 7 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={currentStep === 1 ? () => {} : prevStep}
                className="h-10 sm:h-10 px-4 sm:px-6 w-full sm:w-auto order-2 sm:order-1"
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={() => {
                  console.log('MultiStepForm sticky Save & Continue button clicked');
                  console.log('Current step:', currentStep);
                  
                  // Determine which form ID to look for based on current step
                  let formId = 'rental-gallery-form';
                  if (currentStep === 1) formId = 'property-details-form';
                  else if (currentStep === 2) formId = 'location-details-form';
                  else if (currentStep === 3) formId = 'rental-details-form';
                  else if (currentStep === 4) formId = 'amenities-form';
                  else if (currentStep === 5) formId = 'rental-gallery-form';
                  else if (currentStep === 6) formId = 'schedule-form';
                  
                  console.log('Looking for form with ID:', formId);
                  
                  const formEl = document.getElementById(formId) as HTMLFormElement | null;
                  console.log('Form element found:', formEl);
                  
                  if (formEl) {
                    console.log('✅ Calling requestSubmit on form element');
                    formEl.requestSubmit();
                  } else {
                    console.warn('❌ Form element not found, trying to find any form');
                    const anyForm = document.querySelector('form') as HTMLFormElement | null;
                    if (anyForm) {
                      console.log('Found fallback form, calling requestSubmit');
                      anyForm.requestSubmit();
                    }
                  }
                  
                  scrollToTop();
                }}
                className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              >
                {currentStep === 6 ? 'Submit Property' : 'Save & Continue'}
              </Button>
            </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <GetTenantsFasterSection ownerInfo={ownerInfo} />
        </div>
      </div>
    </div>
  );
};