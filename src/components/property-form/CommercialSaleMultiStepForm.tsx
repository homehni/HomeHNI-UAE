import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCommercialSalePropertyForm } from '@/hooks/useCommercialSalePropertyForm';
import { CommercialSaleSidebar } from './CommercialSaleSidebar';
import { CommercialSalePropertyDetailsStep } from './CommercialSalePropertyDetailsStep';
import { CommercialSaleLocationDetailsStep } from './CommercialSaleLocationDetailsStep';
import { CommercialSaleSaleDetailsStep } from './CommercialSaleSaleDetailsStep';
import { CommercialSaleAmenitiesStep } from './CommercialSaleAmenitiesStep';
import { CommercialSaleGalleryStep } from './CommercialSaleGalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';

import { CommercialSaleScheduleStep } from './CommercialSaleScheduleStep';
import { CommercialSaleSuccessStep } from './CommercialSaleSuccessStep';
import { OwnerInfo } from '@/types/property';
import { PropertyDraftService } from '@/services/propertyDraftService';

interface CommercialSaleMultiStepFormProps {
  onSubmit: (data: any, draftId?: string | null) => void;
  isSubmitting: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const CommercialSaleMultiStepForm = ({
  onSubmit,
  isSubmitting,
  initialOwnerInfo,
  targetStep = null,
  createdSubmissionId
}: CommercialSaleMultiStepFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
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
    isStepValid,
  } = useCommercialSalePropertyForm();

  useEffect(() => {
    if (initialOwnerInfo) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Navigate to target step if provided
  useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 8) {
      console.log('Navigating to target step:', targetStep);
      goToStep(targetStep);
    }
  }, [targetStep, goToStep]);

  // Load draft data when resuming from Dashboard (prevents empty fields and duplicate drafts)
  useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resumeDraftId');
    const resumeDraftData = sessionStorage.getItem('resumeDraftData');

    if (resumeDraftId && resumeDraftData) {
      try {
        const parsed = JSON.parse(resumeDraftData);
        // Support both legacy shape (flat fields) and new shape { ownerInfo, formData, currentStep }
        const data = parsed?.formData ? parsed.formData : parsed;
        console.log('Commercial Sale: loading resume draft data', { resumeDraftId, parsed, usedDataShape: Object.keys(data || {}) });

        // Owner info when available
        if (parsed?.ownerInfo) updateOwnerInfo(parsed.ownerInfo);

        if (data?.propertyDetails) updatePropertyDetails(data.propertyDetails);
        if (data?.locationDetails) updateLocationDetails(data.locationDetails);
        if (data?.saleDetails) updateSaleDetails(data.saleDetails);
        if (data?.amenities) updateAmenities(data.amenities);

        // Robust gallery hydration: accept camelCase, snake_case, or raw draft fields
        if (data?.gallery) {
          updateGallery({
            images: data.gallery.images || [],
            categorizedImages: data.gallery.categorizedImages || (data.gallery as any).categorized_images || {},
            video: data.gallery.video
          });
        } else if (parsed?.images || parsed?.categorized_images) {
          updateGallery({
            images: parsed.images || [],
            categorizedImages: parsed.categorized_images || {},
            video: parsed.video
          });
        }

        if (data?.additionalInfo) updateAdditionalInfo(data.additionalInfo);
        if (data?.scheduleInfo) updateScheduleInfo(data.scheduleInfo);

        // Set draft ID so subsequent saves update the same draft (no duplicates)
        setDraftId(resumeDraftId);

        // Optionally jump to stored step if present
        if (parsed?.currentStep && typeof parsed.currentStep === 'number') {
          goToStep(Math.min(Math.max(parsed.currentStep, 2), 8));
        }

        // Clear after successful load
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
      } catch (err) {
        console.error('Commercial Sale: failed to load resume draft data', err);
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
      }
    }
  }, [updateOwnerInfo, updatePropertyDetails, updateLocationDetails, updateSaleDetails, updateAmenities, updateGallery, updateAdditionalInfo, updateScheduleInfo, goToStep]);

  // Auto-save current step index only when navigating between steps manually (not during save operations)
  useEffect(() => {
    if (draftId && currentStep >= 2 && !isSavingDraft) {
      PropertyDraftService.updateDraft(draftId, {
        current_step: currentStep,
        updated_at: new Date().toISOString()
      }).catch((e) => console.error('Commercial Sale: auto-save step failed', e));
    }
  }, [currentStep, draftId, isSavingDraft]);

  // Save step once when draftId is first set
  useEffect(() => {
    if (draftId && currentStep >= 2) {
      PropertyDraftService.updateDraft(draftId, {
        current_step: currentStep,
        updated_at: new Date().toISOString()
      }).catch((e) => console.error('Commercial Sale: initial step save failed', e));
    }
  }, [draftId]);

  const completedSteps = useMemo(() => {
    const completed = [];
    for (let i = 2; i <= 7; i++) {
      if (isStepValid(i) && i < currentStep) {
        completed.push(i);
      }
    }
    return completed;
  }, [currentStep, isStepValid]);

  const handleScheduleSubmit = (data: any) => {
    updateScheduleInfo(data);
    const formData = getFormData();
    onSubmit(formData, draftId);
    setIsSubmitted(true);
  };

  const handleSubmit = () => {
    const formData = getFormData();
    onSubmit(formData, draftId);
    setIsSubmitted(true);
  };

  const handleEdit = (step: number) => {
    setIsSubmitted(false);
    goToStep(step);
  };

  // Save draft and proceed to next step
  const saveDraftAndNext = async (stepData: any) => {
    if (isSavingDraft) return;
    
    setIsSavingDraft(true);
    try {
      console.log('Commercial Sale - Saving draft for step:', currentStep, 'with data:', stepData);
      
      // Map Commercial Sale step numbers to PropertyDraftService step numbers
      let draftStepNumber = currentStep;
      if (currentStep === 2) draftStepNumber = 1; // Property Details
      if (currentStep === 3) draftStepNumber = 2; // Location Details
      if (currentStep === 4) draftStepNumber = 3; // Sale Details
      if (currentStep === 5) draftStepNumber = 4; // Amenities
      if (currentStep === 6) draftStepNumber = 5; // Gallery
      if (currentStep === 7) draftStepNumber = 6; // Schedule
      
      console.log('Commercial Sale - Mapped step number:', draftStepNumber);
      
      const savedDraft = await PropertyDraftService.saveFormData(
        draftId,
        stepData,
        draftStepNumber,
        'commercial-sale'
      );
      
      if (savedDraft?.id) {
        setDraftId(savedDraft.id);
        console.log('Commercial Sale - Draft saved successfully with ID:', savedDraft.id);
      }
      
      nextStep();
      scrollToTop();
    } catch (error) {
      console.error('Commercial Sale - Failed to save draft:', error);
      // Still proceed to next step even if draft save fails
      nextStep();
      scrollToTop();
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle preview button click
  const handlePreview = () => {
    if (draftId) {
      const previewUrl = PropertyDraftService.generatePreviewUrl(draftId);
      window.open(previewUrl, '_blank');
    }
  };

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

  const renderCurrentStep = () => {
    if (isSubmitted) {
      return (
        <CommercialSaleSuccessStep
          onEditProperty={() => handleEdit(2)}
          onPreviewListing={() => {
            if (createdSubmissionId) {
              // Use the preview page instead of separate property page
              window.open(`/buy/preview/${createdSubmissionId}/detail`, '_blank');
            }
          }}
          onGoToDashboard={() => {
            // Navigate to dashboard
            window.location.href = '/dashboard';
          }}
          createdSubmissionId={createdSubmissionId}
          onEdit={handleEdit}
          gallery={gallery as any}
          ownerInfo={ownerInfo}
        />
      );
    }

    switch (currentStep) {
      case 2:
        return (
          <CommercialSalePropertyDetailsStep
            initialData={propertyDetails}
            onNext={(data) => {
              updatePropertyDetails(data);
              saveDraftAndNext(data);
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 3:
        return (
          <CommercialSaleLocationDetailsStep
            initialData={locationDetails}
            onNext={(data) => {
              console.log('Step 3 onNext called with data:', data);
              updateLocationDetails(data);
              saveDraftAndNext(data);
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 4:
        return (
          <CommercialSaleSaleDetailsStep
            initialData={saleDetails}
            onNext={(data) => {
              console.log('Step 4 onNext called with data:', data);
              updateSaleDetails(data);
              saveDraftAndNext(data);
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 5:
        return (
          <CommercialSaleAmenitiesStep
            initialData={amenities}
            onNext={(data) => {
              console.log('Step 5 onNext called with data:', data);
              updateAmenities(data);
              saveDraftAndNext(data);
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 6:
        return (
          <CommercialSaleGalleryStep
            key={`gallery-${draftId || 'new'}-${
              gallery?.categorizedImages
                ? [
                    ...(gallery.categorizedImages.frontView || []),
                    ...(gallery.categorizedImages.interiorView || []),
                    ...(gallery.categorizedImages.others || [])
                  ].length
                : Array.isArray(gallery?.images)
                ? (gallery?.images as any[]).length
                : 0
            }`}
            initialData={gallery}
            onNext={(data) => {
              console.log('Step 6 onNext called with data:', data);
              updateGallery(data);
              saveDraftAndNext(data);
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
          />
        );
      case 7:
        return (
          <CommercialSaleScheduleStep
            initialData={scheduleInfo}
            onNext={(data) => {
              console.log('Step 7 onNext called with data:', data);
              updateScheduleInfo(data);
              // Directly submit the form instead of going to next step
              const formData = getFormData();
              onSubmit(formData, draftId);
              setIsSubmitted(true);
              scrollToTop();
            }}
            onBack={prevStep}
            currentStep={currentStep}
            totalSteps={8}
            onSubmit={handleScheduleSubmit}
            ownerInfo={ownerInfo}
            propertyInfo={{
              propertyDetails,
              locationDetails,
              saleDetails
            }}
          />
        );
      case 8:
        // Step 8 is now handled by the isSubmitted state
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Single Layout - Responsive */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <CommercialSaleSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
            onPreview={handlePreview}
            draftId={draftId}
            isSavingDraft={isSavingDraft}
          />
        </div>

        {/* Main Content */}
        <div id="commercial-sale-step-content" className="flex-1 bg-white p-4 sm:p-6 md:p-8 pb-32 overflow-y-auto">
          {renderCurrentStep()}
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <GetTenantsFasterSection ownerInfo={ownerInfo} />
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar - Hidden on success page */}
      {!isSubmitted && currentStep < 8 && (
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
                // Trigger the current step's form submission and scroll to top
                const container = document.getElementById('commercial-sale-step-content');
                const currentStepForm = container?.querySelector('form') as HTMLFormElement | null;
                if (currentStepForm) {
                  if (typeof currentStepForm.requestSubmit === 'function') {
                    currentStepForm.requestSubmit();
                  } else {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    currentStepForm.dispatchEvent(submitEvent);
                  }
                }
                // Always scroll to top when Save & Continue is clicked
                setTimeout(scrollToTop, 100);
              }}
              className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              style={{ display: currentStep === 7 ? 'block' : 'block' }}
            >
              {currentStep === 7 ? 'Submit Property' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};