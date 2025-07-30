import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SubmissionState {
  isSubmitting: boolean;
  uploadProgress: string;
  error: string | null;
}

export const useFormSubmission = () => {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    uploadProgress: '',
    error: null
  });
  const { toast } = useToast();

  const updateProgress = (message: string) => {
    setSubmissionState(prev => ({ ...prev, uploadProgress: message }));
  };

  const setSubmitting = (isSubmitting: boolean) => {
    setSubmissionState(prev => ({ 
      ...prev, 
      isSubmitting,
      error: isSubmitting ? null : prev.error,
      uploadProgress: isSubmitting ? 'Starting submission...' : ''
    }));
  };

  const setError = (error: string) => {
    setSubmissionState(prev => ({ ...prev, error, isSubmitting: false }));
  };

  const showSuccessToast = (title: string, description: string) => {
    toast({ title, description });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({ title, description, variant: "destructive" });
  };

  const showProgressToast = (title: string, description: string) => {
    toast({ title, description });
  };

  return {
    submissionState,
    updateProgress,
    setSubmitting,
    setError,
    showSuccessToast,
    showErrorToast,
    showProgressToast
  };
};