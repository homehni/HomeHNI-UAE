import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertyDraft } from '@/hooks/usePropertyDraft';
import { PropertyDraft } from '@/types/propertyDraft';
import { FormProgressBar } from './FormProgressBar';
import { OwnerInfoStep } from './OwnerInfoStep';
import { PropertyInfoStep } from './PropertyInfoStep';
import { PreviewStep } from './PreviewStep';

export const MultiStepPropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { draft, isSaving, saveDraft, clearDraft } = usePropertyDraft();

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

  // Load draft data when available
  useEffect(() => {
    if (draft) {
      setFormData(draft);
      setCurrentStep(Math.min(draft.step_completed + 1, 3));
    }
  }, [draft]);

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

  const handleSaveAsDraft = () => {
    saveDraft(formData);
    toast.success('Draft saved successfully!');
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Please log in to submit your property');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for final submission to properties table
      const propertyData = {
        user_id: user.id,
        title: formData.title,
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        bhk_type: formData.bhk_type,
        bathrooms: formData.bathrooms || 0,
        balconies: formData.balconies || 0,
        super_area: formData.super_area,
        carpet_area: formData.carpet_area,
        expected_price: formData.expected_price,
        state: formData.state,
        city: formData.city,
        locality: formData.locality,
        pincode: formData.pincode,
        description: formData.description,
        images: formData.images || [],
        videos: formData.videos || [],
        // Default values for required fields
        availability_type: formData.listing_type === 'rent' ? 'immediate' : 'ready_to_move',
        status: 'active'
      };

      // Submit to properties table
      const { error } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (error) {
        throw error;
      }

      // Clear the draft after successful submission
      await clearDraft();

      toast.success('Property listing submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error('Failed to submit property listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            onEdit={handleEditStep}
            onSaveAsDraft={handleSaveAsDraft}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSavingDraft={isSaving}
          />
        )}
      </div>
    </div>
  );
};