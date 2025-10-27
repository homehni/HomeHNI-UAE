import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCommercialPropertyForm } from '@/hooks/useCommercialPropertyForm';
import { CommercialSidebar } from './CommercialSidebar';
import { CommercialPropertyDetailsStep } from './CommercialPropertyDetailsStep';
import { CommercialLocationDetailsStep } from './CommercialLocationDetailsStep';
import { CommercialRentalDetailsStep } from './CommercialRentalDetailsStep';
import { CommercialAmenitiesStep } from './CommercialAmenitiesStep';
import { CommercialGalleryStep } from './CommercialGalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { ScheduleStep } from './ScheduleStep';
import { CommercialPreviewStep } from './CommercialPreviewStep';
import { OwnerInfo, CommercialFormData, CommercialPropertyDetails, LocationDetails, CommercialRentalDetails, CommercialAmenities, PropertyGallery, AdditionalInfo, ScheduleInfo } from '@/types/property';
import { PropertyDraftService } from '@/services/propertyDraftService';
import { useToast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';

interface CommercialMultiStepFormProps {
  onSubmit: (data: CommercialFormData, draftId?: string | null) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const CommercialMultiStepForm: React.FC<CommercialMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId
}) => {
  const { toast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  } = useCommercialPropertyForm(targetStep || 2);

  // Handle preview functionality
  const handlePreview = async () => {
    if (!draftId) {
      toast({
        title: "No Draft Available",
        description: "Please save your progress first before previewing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Open preview in new tab using the unified preview page
      window.open(`/buy/preview/${draftId}/detail`, '_blank');
    } catch (error) {
      console.error('Error opening preview:', error);
      toast({
        title: "Preview Error",
        description: "Failed to open preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Save draft and proceed to next step
  const saveDraftAndNext = async (stepData: any, stepNumber: number, formType: 'rental' | 'sale' | 'commercial' | 'land') => {
    try {
      setIsSavingDraft(true);
      
      console.log('=== COMMERCIAL DRAFT SAVE DEBUG ===');
      console.log('Step number:', stepNumber);
      console.log('Form type:', formType);
      console.log('Step data:', stepData);
      console.log('Draft ID:', draftId);
      
      // Prepare owner info for draft
      const ownerData = {
        owner_name: ownerInfo.fullName,
        owner_email: ownerInfo.email,
        owner_phone: ownerInfo.phoneNumber,
        whatsapp_updates: ownerInfo.whatsappUpdates
      };

      // Save draft
      const draft = await PropertyDraftService.saveFormData(draftId, stepData, stepNumber, formType);
      
      console.log('Draft saved successfully:', draft);
      
      // Update owner info if not already set
      if (stepNumber === 0) {
        await PropertyDraftService.updateDraft(draft.id, ownerData);
      }
      
      setDraftId(draft.id);
      nextStep();
      
    } catch (error) {
      console.error('Error saving draft:', error);
      
      // Show user-friendly error message with more details
      let errorMessage = "Failed to save draft. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific error messages for common issues
        if (error.message.includes('Failed to create property draft')) {
          errorMessage = "Failed to create draft. Please check your internet connection and try again.";
        } else if (error.message.includes('User not authenticated')) {
          errorMessage = "Please log in again to continue.";
        } else if (error.message.includes('duplicate key')) {
          errorMessage = "A draft already exists. Please refresh the page and try again.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Still allow user to proceed to next step even if draft save fails
      console.warn('Draft save failed, but allowing user to continue to next step');
      nextStep();
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Initialize with owner info from previous step
  useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Load draft data if resuming from a draft
  useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resumeDraftId');
    const resumeDraftData = sessionStorage.getItem('resumeDraftData');
    
    if (resumeDraftId && resumeDraftData) {
      try {
        const draftData = JSON.parse(resumeDraftData);
        console.log('Loading draft data for CommercialMultiStepForm:', draftData);
        
        // Load form data from draft
        if (draftData.propertyDetails) {
          console.log('Loading propertyDetails:', draftData.propertyDetails);
          updatePropertyDetails(draftData.propertyDetails);
        }
        if (draftData.locationDetails) {
          console.log('Loading locationDetails:', draftData.locationDetails);
          updateLocationDetails(draftData.locationDetails);
        }
        if (draftData.rentalDetails) {
          console.log('Loading rentalDetails:', draftData.rentalDetails);
          updateRentalDetails(draftData.rentalDetails);
        }
        if (draftData.amenities) {
          console.log('Loading amenities:', draftData.amenities);
          updateAmenities(draftData.amenities);
        }
        if (draftData.gallery) {
          console.log('Loading gallery:', draftData.gallery);
          updateGallery(draftData.gallery);
        }
        if (draftData.additionalInfo) {
          console.log('Loading additionalInfo:', draftData.additionalInfo);
          updateAdditionalInfo(draftData.additionalInfo);
        }
        if (draftData.scheduleInfo) {
          console.log('Loading scheduleInfo:', draftData.scheduleInfo);
          updateScheduleInfo(draftData.scheduleInfo);
        }
        
        // Set draft ID for saving
        setDraftId(resumeDraftId);
        
        // Clear sessionStorage after loading
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
        
        console.log('Successfully loaded draft data for CommercialMultiStepForm');
      } catch (error) {
        console.error('Error loading draft data:', error);
        // Clear sessionStorage on error
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
      }
    }
  }, [updatePropertyDetails, updateLocationDetails, updateRentalDetails, updateAmenities, updateGallery, updateAdditionalInfo, updateScheduleInfo]);

  // Auto-save current step when user navigates to a step (only if draft already exists)
  useEffect(() => {
    console.log(`🔍 Auto-save check: currentStep=${currentStep}, draftId=${draftId}`);
    if (draftId && currentStep >= 2) {
      console.log(`💾 Auto-saving current step: ${currentStep} for draft: ${draftId}`);
      // Save the current step without changing form data
      PropertyDraftService.updateDraft(draftId, {
        current_step: currentStep,
        updated_at: new Date().toISOString()
      }).then(() => {
        console.log(`✅ Successfully auto-saved current step: ${currentStep}`);
      }).catch(error => {
        console.error('❌ Error auto-saving current step:', error);
      });
    } else {
      console.log(`⏭️ Skipping auto-save: draftId=${draftId}, currentStep=${currentStep}`);
    }
  }, [currentStep, draftId]);

  // Also save current step when draftId is first set (for initial navigation)
  useEffect(() => {
    if (draftId && currentStep >= 2) {
      console.log(`🎯 Draft ID set, saving current step: ${currentStep}`);
      PropertyDraftService.updateDraft(draftId, {
        current_step: currentStep,
        updated_at: new Date().toISOString()
      }).then(() => {
        console.log(`✅ Successfully saved current step on draft ID set: ${currentStep}`);
      }).catch(error => {
        console.error('❌ Error saving current step on draft ID set:', error);
      });
    }
  }, [draftId]); // Only run when draftId changes, not currentStep

  const completedSteps = useMemo(() => {
    const completed = [];
    for (let i = 1; i <= currentStep - 1; i++) {
      if (isStepValid(i)) {
        completed.push(i);
      }
    }
    return completed;
  }, [currentStep, isStepValid]);

  const scrollToTop = () => {
    try {
      const el = document.scrollingElement || document.documentElement || document.body;
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  // Step handlers
  const handlePropertyDetailsNext = (data: Partial<CommercialPropertyDetails>) => {
    updatePropertyDetails(data);
    saveDraftAndNext(data, 1, 'commercial');
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: Partial<LocationDetails>) => {
    updateLocationDetails(data);
    saveDraftAndNext(data, 2, 'commercial');
    scrollToTop();
  };

  const handleRentalDetailsNext = (data: Partial<CommercialRentalDetails>) => {
    updateRentalDetails(data);
    saveDraftAndNext(data, 3, 'commercial');
    scrollToTop();
  };

  const handleAmenitiesNext = (data: CommercialAmenities) => {
    updateAmenities(data);
    saveDraftAndNext(data, 4, 'commercial');
    scrollToTop();
  };

  const handleGalleryNext = (data: Partial<PropertyGallery>) => {
    updateGallery(data);
    saveDraftAndNext(data, 5, 'commercial');
    scrollToTop();
  };


const handleScheduleNext = (data: Partial<ScheduleInfo>) => {
  updateScheduleInfo(data);
  saveDraftAndNext(data, 6, 'commercial');
  scrollToTop();
};

const handleScheduleSubmit = async (data: Partial<ScheduleInfo>) => {
  updateScheduleInfo(data);
  
  // Mark draft as completed if it exists
  if (draftId) {
    try {
      await PropertyDraftService.updateDraft(draftId, {
        is_completed: true,
        current_step: 7,
        updated_at: new Date().toISOString()
      });
      console.log('Marked commercial draft as completed:', draftId);
    } catch (error) {
      console.error('Error marking draft as completed:', error);
    }
  }
  
  const formData = getFormData();
  onSubmit(formData as CommercialFormData, draftId);
  setIsSubmitted(true);
};

  const handleSubmit = async () => {
    const formData = getFormData();
    
    // Mark draft as completed if it exists
    if (draftId) {
      try {
        await PropertyDraftService.updateDraft(draftId, {
          is_completed: true,
          current_step: 7,
          updated_at: new Date().toISOString()
        });
        console.log('Marked commercial draft as completed:', draftId);
      } catch (error) {
        console.error('Error marking draft as completed:', error);
      }
    }
    
    // No validation required - all fields are optional
    onSubmit(formData as CommercialFormData, draftId);
  };

  const handleEdit = (step: number) => {
    setIsSubmitted(false);
    goToStep(step);
  };

  const renderCurrentStep = () => {
    console.log('=== RENDERING CURRENT STEP ===');
    console.log('Current step:', currentStep);
    console.log('Is submitted:', isSubmitted);
    
    if (isSubmitted) {
      console.log('Rendering CommercialPreviewStep');
      return (
        <CommercialPreviewStep
          formData={getFormData() as CommercialFormData}
          onBack={prevStep}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          currentStep={currentStep}
          totalSteps={7}
          isSubmitting={isSubmitting}
          previewPropertyId={createdSubmissionId || undefined}
        />
      );
    }

    switch (currentStep) {
      case 2:
        console.log('Rendering CommercialPropertyDetailsStep');
        return (
          <CommercialPropertyDetailsStep
            initialData={propertyDetails}
            onNext={handlePropertyDetailsNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 3:
        console.log('Rendering CommercialLocationDetailsStep');
        return (
          <CommercialLocationDetailsStep
            initialData={locationDetails}
            onNext={handleLocationDetailsNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 4:
        console.log('Rendering CommercialRentalDetailsStep');
        return (
          <CommercialRentalDetailsStep
            initialData={rentalDetails}
            onNext={handleRentalDetailsNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 5:
        console.log('Rendering CommercialAmenitiesStep');
        return (
          <CommercialAmenitiesStep
            initialData={amenities}
            onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 6:
        console.log('Rendering CommercialGalleryStep');
        return (
          <CommercialGalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={7}
          />
        );
      case 7:
        console.log('Rendering ScheduleStep');
        return (
          <ScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
            onSubmit={handleScheduleSubmit}
            ownerInfo={ownerInfo}
            propertyInfo={getFormData().propertyInfo as any}
          />
        );
      default:
        console.log('Unknown step, returning null');
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Single Layout - Responsive */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <CommercialSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
            onPreview={handlePreview}
            draftId={draftId}
            isSavingDraft={isSavingDraft}
          />
        </div>

        {/* Main Content */}
        <div id="commercial-step-content" className="flex-1 bg-white p-4 sm:p-6 md:p-8 pb-32 overflow-y-auto">
          {renderCurrentStep()}
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <GetTenantsFasterSection ownerInfo={ownerInfo} />
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar - Hidden on Preview step */}
      {!isSubmitted && (
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
                console.log('=== COMMERCIAL SAVE & CONTINUE CLICKED ===');
                console.log('Current step:', currentStep);
                
                // Trigger the current step's form submission like Commercial Sale flow
                const container = document.getElementById('commercial-step-content');
                const currentStepForm = container?.querySelector('form') as HTMLFormElement | null;
                console.log('Found form element:', currentStepForm);
                
                if (currentStepForm) {
                  console.log('Dispatching requestSubmit to form');
                  if (typeof currentStepForm.requestSubmit === 'function') {
                    currentStepForm.requestSubmit();
                  } else {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    currentStepForm.dispatchEvent(submitEvent);
                  }
                } else {
                  console.log('No form element found - checking for step-specific handlers');
                  
                  // If no form found, try to trigger step progression manually
                  switch (currentStep) {
                    case 2:
                      console.log('Manually triggering property details next');
                      break;
                    case 3:
                      console.log('Manually triggering location details next');
                      break;
                    case 4:
                      console.log('Manually triggering rental details next');
                      break;
                    case 5:
                      console.log('Manually triggering amenities next');
                      break;
                    case 6:
                      console.log('Manually triggering gallery next');
                      break;
                    case 7:
                      console.log('Manually triggering schedule submit');
                      break;
                    default:
                      console.log('Unknown step:', currentStep);
                  }
                }
                
                // Scroll to top after triggering submit
                setTimeout(scrollToTop, 100);
              }}
              className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              style={{ display: isSubmitted ? 'none' : 'block' }}
            >
              {currentStep === 7 ? 'Submit Property' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};