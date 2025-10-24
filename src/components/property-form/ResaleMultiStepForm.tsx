import React, { useState } from 'react';
import { useSalePropertyForm } from '@/hooks/useSalePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyFormSidebar } from './PropertyFormSidebar';
import { ResalePropertyDetailsStep } from './ResalePropertyDetailsStep';
import { ResaleLocationDetailsStep } from './ResaleLocationDetailsStep';
import { SaleDetailsStep } from './SaleDetailsStep';
import { ResaleAmenitiesStep } from './ResaleAmenitiesStep';
import { ResaleGalleryStep } from './ResaleGalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { Button } from '@/components/ui/button';

import { ResaleScheduleStep } from './ResaleScheduleStep';
import { ResalePreviewStep } from './ResalePreviewStep';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, DollarSign, Sparkles, Camera, Info, Calendar, CheckCircle } from 'lucide-react';

import { OwnerInfo } from '@/types/property';
import { SalePropertyFormData } from '@/types/saleProperty';
import { PropertyDraftService } from '@/services/propertyDraftService';
import { useToast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';

interface ResaleMultiStepFormProps {
  onSubmit: (data: SalePropertyFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const ResaleMultiStepForm: React.FC<ResaleMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId = null
}) => {
  const { toast } = useToast();
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);

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

  // Load draft data if resuming from a draft
  React.useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resumeDraftId');
    const resumeDraftData = sessionStorage.getItem('resumeDraftData');
    
    if (resumeDraftId && resumeDraftData) {
      try {
        const draftData = JSON.parse(resumeDraftData);
        console.log('Loading draft data for ResaleMultiStepForm:', draftData);
        
        // Load form data from draft
        if (draftData.propertyDetails) {
          console.log('Loading propertyDetails:', draftData.propertyDetails);
          updatePropertyDetails(draftData.propertyDetails);
        }
        if (draftData.locationDetails) {
          console.log('Loading locationDetails:', draftData.locationDetails);
          updateLocationDetails(draftData.locationDetails);
        }
        if (draftData.saleDetails) {
          console.log('Loading saleDetails:', draftData.saleDetails);
          updateSaleDetails(draftData.saleDetails);
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
        
        console.log('Successfully loaded draft data for ResaleMultiStepForm');
      } catch (error) {
        console.error('Error loading draft data:', error);
        // Clear sessionStorage on error
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
      }
    }
  }, [updatePropertyDetails, updateLocationDetails, updateSaleDetails, updateAmenities, updateGallery, updateAdditionalInfo, updateScheduleInfo]);

  // Track if we've already navigated to target step to prevent interference
  const hasNavigatedToTargetStep = React.useRef(false);

  // Navigate to target step if provided (only once) - combined logic
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 7 && !hasNavigatedToTargetStep.current) {
      console.log('ResaleMultiStepForm navigating to target step:', targetStep, 'draftId:', draftId);
      goToStep(targetStep);
      hasNavigatedToTargetStep.current = true;
    }
  }, [targetStep, goToStep, draftId]);

  // Handle preview functionality
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

  // Save draft and proceed to next step
  const saveDraftAndNext = async (stepData: any, stepNumber: number, formType: 'rental' | 'sale' | 'commercial' | 'land') => {
    try {
      setIsSavingDraft(true);
      
      // Prepare owner info for draft
      const ownerData = {
        owner_name: ownerInfo.fullName,
        owner_email: ownerInfo.email,
        owner_phone: ownerInfo.phoneNumber,
        whatsapp_updates: ownerInfo.whatsappUpdates
      };

      console.log('ResaleMultiStepForm saveDraftAndNext called with:', { stepData, stepNumber, formType, draftId });
      
      // Save draft
      const draft = await PropertyDraftService.saveFormData(draftId, stepData, stepNumber, formType);
      console.log('ResaleMultiStepForm draft saved successfully:', draft);
      
      // Update owner info if not already set
      if (stepNumber === 0) {
        await PropertyDraftService.updateDraft(draft.id, ownerData);
      }
      
      setDraftId(draft.id);
      console.log('ResaleMultiStepForm calling nextStep()');
      nextStep();
      console.log('ResaleMultiStepForm nextStep() completed');
      
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
      console.warn('Draft save failed, but allowing user to continue to next step');
      nextStep();
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Initialize with owner info if provided
  const ownerInfoInitRef = React.useRef(false);
  React.useEffect(() => {
    if (!ownerInfoInitRef.current && initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
      ownerInfoInitRef.current = true;
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Navigate to target step if provided - REMOVED TO PREVENT LOOP
  // React.useEffect(() => {
  //   if (targetStep && targetStep > 0 && targetStep <= 7) {
  //     console.log('Navigating to target step:', targetStep);
  //     goToStep(targetStep);
  //   }
  // }, [targetStep, goToStep]);

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

  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const desktopFormId = 'resale-step-form-d', mobileFormId = 'resale-step-form-m';
  
  // Create a ref to store the current step's submit function
  const currentStepSubmitRef = React.useRef<(() => void) | null>(null);

  // Save intermediate data after each successful step (backup like other forms)
  const saveIntermediateData = (stepData: any, stepNumber: number) => {
    try {
      const completeFormData = {
        ownerInfo,
        propertyDetails: stepNumber === 1 ? stepData : propertyDetails,
        locationDetails: stepNumber === 2 ? stepData : locationDetails,
        saleDetails: stepNumber === 3 ? stepData : saleDetails,
        amenities: stepNumber === 4 ? stepData : amenities,
        gallery: stepNumber === 5 ? stepData : gallery,
        additionalInfo,
        scheduleInfo: stepNumber === 6 ? stepData : scheduleInfo,
        currentStep: stepNumber,
        completedSteps,
        formType: 'resale'
      };
      localStorage.setItem('resale-form-data', JSON.stringify(completeFormData));
      console.log('Saved resale draft to localStorage:', completeFormData);
    } catch (error) {
      console.error('Error saving resale draft:', error);
    }
  };

  const handleOwnerInfoNext = (data: any) => {
    updateOwnerInfo(data);
    saveDraftAndNext(data, 0, 'sale'); // Step 0 for owner info
  };

  const handlePropertyDetailsNext = (data: any) => {
    console.log('ResaleMultiStepForm handlePropertyDetailsNext called with:', data);
    updatePropertyDetails(data);
    console.log('ResaleMultiStepForm calling saveDraftAndNext');
    saveDraftAndNext(data, 1, 'sale');
    console.log('ResaleMultiStepForm saveDraftAndNext completed');
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: any) => {
    console.log('ResaleMultiStepForm handleLocationDetailsNext called with:', data);
    updateLocationDetails(data);
    console.log('ResaleMultiStepForm calling saveDraftAndNext');
    saveDraftAndNext(data, 2, 'sale');
    console.log('ResaleMultiStepForm saveDraftAndNext completed');
    scrollToTop();
  };

  const handleSaleDetailsNext = (data: any) => {
    updateSaleDetails(data);
    saveDraftAndNext(data, 3, 'sale');
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    updateAmenities(data);
    saveDraftAndNext(data, 4, 'sale');
    scrollToTop();
  };

  const handleGalleryNext = (data: any) => {
    console.log('Gallery step next - data received:', data);
    updateGallery(data);
    saveDraftAndNext(data, 5, 'sale');
    scrollToTop();
  };


  const handleScheduleNext = (data: any) => {
    updateScheduleInfo(data);
    saveDraftAndNext(data, 6, 'sale');
    scrollToTop();
  };

const handleScheduleSubmit = async (data: any) => {
  console.log('[ResaleMultiStepForm] Schedule submit: received data', data);
  updateScheduleInfo(data);
  
  try {
    // Save the final draft data
    await saveDraftAndNext(data, 6, 'sale');
    
    // Mark the draft as completed after successful submission
    if (draftId) {
      console.log('[ResaleMultiStepForm] Marking draft as completed:', draftId);
      await PropertyDraftService.updateDraft(draftId, { 
        is_completed: true,
        current_step: 7 // Mark as completed at preview step
      });
    }
    
    const formData = getFormData();
    console.log('[ResaleMultiStepForm] Submitting resale form data:', formData);
    onSubmit(formData as SalePropertyFormData);
    console.log('[ResaleMultiStepForm] Submission triggered. Going to Preview step (7)');
    goToStep(7);
    scrollToTop();
  } catch (error) {
    console.error('[ResaleMultiStepForm] Error in handleScheduleSubmit:', error);
    // Still proceed with submission even if draft update fails
    const formData = getFormData();
    onSubmit(formData as SalePropertyFormData);
    goToStep(7);
    scrollToTop();
  }
};

  const handleSubmit = async () => {
    const formData = getFormData();
    
    // Submit form without validation - all fields are now optional
    console.log('Resale form submitted with data:', formData);
    
    // Mark the draft as completed after successful submission
    if (draftId) {
      console.log('[ResaleMultiStepForm] Marking draft as completed in handleSubmit:', draftId);
      try {
        await PropertyDraftService.updateDraft(draftId, { 
          is_completed: true,
          current_step: 7 // Mark as completed at preview step
        });
      } catch (error) {
        console.error('[ResaleMultiStepForm] Error marking draft as completed:', error);
      }
    }
    
    if (formData.ownerInfo && formData.propertyInfo) {
      onSubmit(formData as SalePropertyFormData);
    }
  };
  const sidebarSteps = [
    { title: "Property Details", icon: <Home className="w-4 h-4" /> },
    { title: "Locality Details", icon: <MapPin className="w-4 h-4" /> },
    { title: "Sale Details", icon: <DollarSign className="w-4 h-4" /> },
    { title: "Amenities", icon: <Sparkles className="w-4 h-4" /> },
    { title: "Gallery", icon: <Camera className="w-4 h-4" /> },
    { title: "Schedule", icon: <Calendar className="w-4 h-4" /> },
    { title: "Preview", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {currentStep === 1 && (
              <ResalePropertyDetailsStep
                initialData={propertyDetails}
                onNext={handlePropertyDetailsNext}
                onBack={() => {}}
                formId={mobileFormId}
              />
            )}

            {currentStep === 2 && (
              <ResaleLocationDetailsStep
                initialData={locationDetails}
                onNext={handleLocationDetailsNext}
                onBack={prevStep}
                currentStep={2}
                totalSteps={4}
                formId={mobileFormId}
              />
            )}

            {currentStep === 3 && (
              <SaleDetailsStep
                initialData={saleDetails}
                propertyDetails={propertyDetails}
                onNext={handleSaleDetailsNext}
                onBack={prevStep}
                formId={mobileFormId}
              />
            )}

            {currentStep === 4 && (
              <ResaleAmenitiesStep
                initialData={amenities as any}
                onNext={handleAmenitiesNext}
                onBack={prevStep}
                formId={mobileFormId}
              />
            )}

            {currentStep === 5 && (
              <ResaleGalleryStep
                initialData={gallery}
                onNext={handleGalleryNext}
                onBack={prevStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                formId={mobileFormId}
              />
            )}

            {currentStep === 6 && (
              <ResaleScheduleStep
                initialData={scheduleInfo}
                onNext={handleScheduleNext}
                onBack={prevStep}
                onSubmit={handleScheduleSubmit}
                formId={mobileFormId}
              />
            )}

            {currentStep === 7 && (
              <ResalePreviewStep
                formData={getFormData() as SalePropertyFormData}
                onBack={prevStep}
                onEdit={goToStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                previewPropertyId={createdSubmissionId || undefined}
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full min-h-screen">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
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
        <div className="flex-1 min-w-0 bg-white">
          {/* Form Content */}
          <div className="p-3 pb-20">
            <div className="bg-white">
              <div className="max-w-4xl mx-auto w-full">
                {currentStep === 1 && (
                  <ResalePropertyDetailsStep
                    key="desktop-step-1"
                    initialData={propertyDetails}
                    onNext={handlePropertyDetailsNext}
                    onBack={() => {}} // No back on first step
                    formId={desktopFormId}
                  />
                )}

                {currentStep === 2 && (
                  <ResaleLocationDetailsStep
                    key="desktop-step-2"
                    initialData={locationDetails}
                    onNext={handleLocationDetailsNext}
                    onBack={prevStep}
                    currentStep={2}
                    totalSteps={4}
                    formId={desktopFormId}
                  />
                )}

                {currentStep === 3 && (
                  <SaleDetailsStep
                    key="desktop-step-3"
                    initialData={saleDetails}
                    propertyDetails={propertyDetails}
                    onNext={handleSaleDetailsNext}
                    onBack={prevStep}
                    formId={desktopFormId}
                  />
                )}

                {currentStep === 4 && (
                  <ResaleAmenitiesStep
                    key="desktop-step-4"
                    initialData={amenities as any}
                    onNext={handleAmenitiesNext}
                    onBack={prevStep}
                    formId={desktopFormId}
                  />
                )}

                {currentStep === 5 && (
                  <ResaleGalleryStep
                    key="desktop-step-5"
                    initialData={gallery}
                    onNext={handleGalleryNext}
                    onBack={prevStep}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    formId={desktopFormId}
                  />
                )}

                {currentStep === 6 && (
                  <ResaleScheduleStep
                    key="desktop-step-6"
                    initialData={scheduleInfo}
                    onNext={handleScheduleNext}
                    onBack={prevStep}
                    onSubmit={handleScheduleSubmit}
                    formId={desktopFormId}
                  />
                )}

                {currentStep === 7 && (
                  <ResalePreviewStep
                    key="desktop-step-7"
                    formData={getFormData() as SalePropertyFormData}
                    onBack={prevStep}
                    onEdit={goToStep}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    previewPropertyId={createdSubmissionId || undefined}
                  />
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="w-80 flex-shrink-0 h-full">
          <GetTenantsFasterSection ownerInfo={ownerInfo} />
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar - Visible on all screens */}
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
                // Submit the visible form (desktop first, then mobile)
                let formSubmitted = false;

                const trySubmit = (id: string) => {
                  const formEl = document.getElementById(id) as HTMLFormElement | null;
                  if (formEl) {
                    const isHidden = formEl.offsetParent === null;
                    if (!isHidden) {
                      formEl.requestSubmit();
                      return true;
                    }
                  }
                  return false;
                };

                formSubmitted = trySubmit('resale-step-form-d') || trySubmit('resale-step-form-m');

                // Fallbacks
                if (!formSubmitted) {
                  const anyForm = document.querySelector('form') as HTMLFormElement | null;
                  if (anyForm) {
                    anyForm.requestSubmit();
                    formSubmitted = true;
                  }
                }

                if (!formSubmitted) {
                  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
                  if (submitButton) {
                    submitButton.click();
                    formSubmitted = true;
                  }
                }

                if (!formSubmitted) {
                  const forms = document.querySelectorAll('form');
                  if (forms.length > 0) {
                    const event = new Event('submit', { bubbles: true, cancelable: true });
                    (forms[0] as HTMLFormElement).dispatchEvent(event);
                  }
                }
              }}
              className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
            >
              {currentStep === 6 ? 'Submit Property' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};