import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertyDraft } from '@/hooks/usePropertyDraft';
import { PropertyDraft } from '@/types/propertyDraft';
import { FormProgressBar } from './FormProgressBar';
import { OwnerInfoStep } from './OwnerInfoStep';
import { PropertyInfoStep } from './PropertyInfoStep';
import { PreviewStep } from './PreviewStep';
import { ThankYouModal } from './ThankYouModal';
import { useToast } from '@/hooks/use-toast';

export const MultiStepPropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const mode = searchParams.get('mode');
  const draftId = searchParams.get('draftId');
  
  const { 
    draft, 
    isSaving, 
    saveDraft, 
    clearDraft,
    resetDraft,
    submitDraft
  } = usePropertyDraft(draftId || undefined);

  // Initialize form data from draft or empty state
  const [formData, setFormData] = useState<PropertyDraft>({
    step_completed: 1,
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    owner_role: 'owner',
    title: '',
    property_type: '',
    listing_type: 'sale',
    bhk_type: '',
    bathrooms: 0,
    balconies: 0,
    super_area: 0,
    carpet_area: 0,
    expected_price: 0,
    state: '',
    city: '',
    locality: '',
    pincode: '',
    description: '',
    images: [],
    videos: []
  });

  // Handle fresh form vs editing
  useEffect(() => {
    if (mode === 'new') {
      // Reset draft for fresh form
      resetDraft();
      setCurrentStep(1);
    } else if (draft) {
      // Load existing draft
      setFormData(draft);
      setCurrentStep(Math.min(draft.step_completed + 1, 3));
    }
  }, [draft, mode, resetDraft]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.owner_name || formData.title) {
        saveDraft(formData);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, saveDraft]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleStepData = (stepData: Partial<PropertyDraft>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    saveDraft(updatedData);
  };

  const handleNext = (stepData: Partial<PropertyDraft>) => {
    handleStepData(stepData);
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSaveAsDraft = async () => {
    await saveDraft(formData);
    toast({
      title: "✅ Draft Saved Successfully",
      description: "Draft saved successfully. You can continue editing it from your dashboard.",
    });
    // Redirect to dashboard after saving draft
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      const success = await submitDraft();
      
      if (success) {
        setShowThankYou(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: "❌ Submission Failed",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowThankYou(false);
    navigate('/dashboard');
  };

  const handleImagesChange = (images: string[]) => {
    const updatedData = { ...formData, images };
    setFormData(updatedData);
    saveDraft(updatedData);
  };

  const handleVideosChange = (videos: string[]) => {
    const updatedData = { ...formData, videos };
    setFormData(updatedData);
    saveDraft(updatedData);
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <FormProgressBar currentStep={currentStep} totalSteps={3} />
        
        {currentStep === 1 && (
          <OwnerInfoStep
            data={formData}
            onNext={handleNext}
          />
        )}
        
        {currentStep === 2 && (
          <PropertyInfoStep
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onImagesChange={handleImagesChange}
            onVideosChange={handleVideosChange}
          />
        )}
        
        {currentStep === 3 && (
          <PreviewStep
            data={formData}
            onBack={handleBack}
            onSaveAsDraft={handleSaveAsDraft}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSavingDraft={isSaving}
          />
        )}

        <ThankYouModal 
          isOpen={showThankYou}
          onClose={() => setShowThankYou(false)}
          onGoToDashboard={handleGoToDashboard}
        />
      </div>
    </div>
  );
};