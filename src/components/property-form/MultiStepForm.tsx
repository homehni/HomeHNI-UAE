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
import { User, Home, MapPin, DollarSign, Sparkles, Camera, Calendar, CheckCircle, Eye } from 'lucide-react';
import { OwnerInfo, PropertyInfo } from '@/types/property';
import { PropertyDraftService } from '@/services/propertyDraftService';
import { useToast } from '@/hooks/use-toast';

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

  const { toast } = useToast();
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);

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

  // Load draft data if resuming from a draft
  React.useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resumeDraftId');
    const resumeDraftData = sessionStorage.getItem('resumeDraftData');
    
    if (resumeDraftId && resumeDraftData) {
      try {
        const draftData = JSON.parse(resumeDraftData);
        console.log('Loading draft data for MultiStepForm:', draftData);
        
        // Load form data from draft
        console.log('🔍 MultiStepForm: Full draft data structure:', draftData);
        console.log('🔍 MultiStepForm: Available keys:', Object.keys(draftData));
        
        if (draftData.propertyDetails) {
          console.log('✅ MultiStepForm: Calling updatePropertyDetails with:', draftData.propertyDetails);
          updatePropertyDetails(draftData.propertyDetails);
          console.log('✅ MultiStepForm: updatePropertyDetails called successfully');
        } else {
          console.log('❌ MultiStepForm: No propertyDetails found in draft data');
        }
        
        if (draftData.locationDetails) {
          console.log('✅ MultiStepForm: Calling updateLocationDetails with:', draftData.locationDetails);
          updateLocationDetails(draftData.locationDetails);
          console.log('✅ MultiStepForm: updateLocationDetails called successfully');
        } else {
          console.log('❌ MultiStepForm: No locationDetails found in draft data');
        }
        
        if (draftData.rentalDetails) {
          console.log('✅ MultiStepForm: Calling updateRentalDetails with:', draftData.rentalDetails);
          updateRentalDetails(draftData.rentalDetails);
          console.log('✅ MultiStepForm: updateRentalDetails called successfully');
        } else {
          console.log('❌ MultiStepForm: No rentalDetails found in draft data');
        }
        
        if (draftData.amenities) {
          console.log('✅ MultiStepForm: Calling updateAmenities with:', draftData.amenities);
          updateAmenities(draftData.amenities);
          console.log('✅ MultiStepForm: updateAmenities called successfully');
        } else {
          console.log('❌ MultiStepForm: No amenities found in draft data');
        }
        
        if (draftData.gallery) {
          console.log('✅ MultiStepForm: Calling updateGallery with:', draftData.gallery);
          updateGallery(draftData.gallery);
          console.log('✅ MultiStepForm: updateGallery called successfully');
        } else {
          console.log('❌ MultiStepForm: No gallery found in draft data');
        }
        
        if (draftData.additionalInfo) {
          console.log('✅ MultiStepForm: Calling updateAdditionalInfo with:', draftData.additionalInfo);
          updateAdditionalInfo(draftData.additionalInfo);
          console.log('✅ MultiStepForm: updateAdditionalInfo called successfully');
        } else {
          console.log('❌ MultiStepForm: No additionalInfo found in draft data');
        }
        
        if (draftData.scheduleInfo) {
          console.log('✅ MultiStepForm: Calling updateScheduleInfo with:', draftData.scheduleInfo);
          updateScheduleInfo(draftData.scheduleInfo);
          console.log('✅ MultiStepForm: updateScheduleInfo called successfully');
        } else {
          console.log('❌ MultiStepForm: No scheduleInfo found in draft data');
        }
        
        // Set draft ID for saving
        setDraftId(resumeDraftId);
        
        // Clear sessionStorage after loading
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
        
        // Clear targetStep after loading draft data to prevent interference with navigation
        // The targetStep was used to navigate to the resume step, but now we need to allow normal navigation
        if (targetStep) {
          console.log('Clearing targetStep after loading draft data');
          // We need to clear this from the parent component, but for now we'll work around it
        }
        
        console.log('Successfully loaded draft data for MultiStepForm');
      } catch (error) {
        console.error('Error loading draft data:', error);
        // Clear sessionStorage on error
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
      }
    }
  }, [updatePropertyDetails, updateLocationDetails, updateRentalDetails, updateAmenities, updateGallery, updateAdditionalInfo, updateScheduleInfo]);

  // Navigate to target step if provided (only once)
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 7 && !hasNavigatedToTargetStep.current) {
      console.log('Navigating to target step:', targetStep);
      goToStep(targetStep);
      hasNavigatedToTargetStep.current = true;
    }
  }, [targetStep, goToStep]);

  // Navigate to target step after draft data is loaded (only once)
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 7 && draftId && !hasNavigatedToTargetStep.current) {
      console.log('Navigating to target step after draft loaded:', targetStep);
      goToStep(targetStep);
      hasNavigatedToTargetStep.current = true;
    }
  }, [targetStep, goToStep, draftId]);

  // Track one-time auto-navigation to preview
  const hasNavigatedToPreview = React.useRef(false);
  
  // Track if we've already navigated to target step to prevent interference
  const hasNavigatedToTargetStep = React.useRef(false);

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

  // Function to save draft and proceed to next step
  const saveDraftAndNext = async (stepData: any, stepNumber: number, formType: 'rental' | 'sale' | 'commercial' | 'land') => {
    console.log('saveDraftAndNext called with:', { stepData, stepNumber, formType, draftId });
    
    try {
      setIsSavingDraft(true);
      
      // Prepare owner info for draft
      const ownerData = {
        owner_name: ownerInfo.fullName,
        owner_email: ownerInfo.email,
        owner_phone: ownerInfo.phoneNumber,
        whatsapp_updates: ownerInfo.whatsappUpdates
      };

      console.log('Saving draft with owner data:', ownerData);
      // Save draft
      const draft = await PropertyDraftService.saveFormData(draftId, stepData, stepNumber, formType);
      console.log('Draft saved successfully:', draft);
      
      // Update owner info if not already set
      if (stepNumber === 0) {
        await PropertyDraftService.updateDraft(draft.id, ownerData);
      }
      
      setDraftId(draft.id);
      console.log('Calling nextStep()');
      nextStep();
      console.log('nextStep() completed');
      scrollToTop();
      
    } catch (error) {
      console.error('Error saving draft:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : "Failed to save draft. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Still allow user to proceed to next step even if draft save fails
      // This prevents blocking the user's progress
      console.warn('Draft save failed, but allowing user to continue to next step');
      nextStep();
      scrollToTop();
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Function to open preview
  const handlePreview = async () => {
    if (!draftId) {
      toast({
        title: "No Preview Available",
        description: "Please complete at least one step to preview your property.",
        variant: "destructive"
      });
      return;
    }

    const previewUrl = PropertyDraftService.generatePreviewUrl(draftId);
    window.open(previewUrl, '_blank');
  };

  const handleOwnerInfoNext = (data: any) => {
    updateOwnerInfo(data);
    saveDraftAndNext(data, 0, 'rental'); // Step 0 for owner info
  };

  const handlePropertyDetailsNext = (data: any) => {
    updatePropertyDetails(data);
    saveDraftAndNext(data, 1, 'rental');
  };

  const handleLocationDetailsNext = (data: any) => {
    updateLocationDetails(data);
    saveDraftAndNext(data, 2, 'rental');
  };

  const handleRentalDetailsNext = async (data: any, amenitiesData?: any) => {
    console.log('MultiStepForm handleRentalDetailsNext called with:', { data, amenitiesData });
    
    try {
      updateRentalDetails(data);
      if (amenitiesData) {
        updateAmenities(amenitiesData);
        // Also save amenities data to step 4
        await PropertyDraftService.saveFormData(draftId, amenitiesData, 4, 'rental');
      }
      console.log('Calling saveDraftAndNext with data:', data);
      await saveDraftAndNext(data, 3, 'rental');
      console.log('saveDraftAndNext completed successfully');
    } catch (error) {
      console.error('Error in handleRentalDetailsNext:', error);
    }
  };

  const handleAmenitiesNext = (data: any) => {
    updateAmenities(data);
    saveDraftAndNext(data, 4, 'rental');
  };

  const handleGalleryNext = (data: any) => {
    console.log('Gallery step next - data received:', data);
    updateGallery(data);
    saveDraftAndNext(data, 5, 'rental');
  };

  const handleScheduleSubmit = async (data: any) => {
    console.log('MultiStepForm handleScheduleSubmit called');
    console.log('Schedule data:', data);
    
    // Update schedule info, submit the property, then go to Preview
    updateScheduleInfo(data);
    
    // Mark the draft as completed after successful submission
    if (draftId) {
      console.log('[MultiStepForm] Marking draft as completed:', draftId);
      try {
        await PropertyDraftService.updateDraft(draftId, { 
          is_completed: true,
          current_step: 7 // Mark as completed at preview step
        });
      } catch (error) {
        console.error('[MultiStepForm] Error marking draft as completed:', error);
      }
    }
    
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
            onPreview={handlePreview}
            draftId={draftId}
            isSavingDraft={isSavingDraft}
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
                className="h-10 sm:h-10 px-4 sm:px-6 w-full sm:w-auto order-3 sm:order-1"
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              {/* Preview Button - Moved to top left corner */}
              
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
                className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-3 font-semibold"
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