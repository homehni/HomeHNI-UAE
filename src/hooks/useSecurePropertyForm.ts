import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validatePropertySubmission } from '@/utils/propertyValidation';
import { OwnerInfo, PropertyInfo } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';

export interface SecureSubmissionState {
  isSubmitting: boolean;
  uploadProgress: string;
  error: string | null;
  validationErrors: string[];
  validationWarnings: string[];
}

/**
 * Enhanced hook for secure property form submission with validation and sanitization
 */
export const useSecurePropertyForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [submissionState, setSubmissionState] = useState<SecureSubmissionState>({
    isSubmitting: false,
    uploadProgress: '',
    error: null,
    validationErrors: [],
    validationWarnings: []
  });

  const updateProgress = useCallback((message: string) => {
    setSubmissionState(prev => ({ ...prev, uploadProgress: message }));
  }, []);

  const setError = useCallback((error: string) => {
    setSubmissionState(prev => ({ 
      ...prev, 
      error, 
      isSubmitting: false 
    }));
  }, []);

  const showSecurityToast = useCallback((title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    toast({ title, description, variant });
  }, [toast]);

  /**
   * Securely submit property with enhanced validation
   */
  const submitProperty = useCallback(async (
    ownerInfo: OwnerInfo,
    propertyInfo: PropertyInfo
  ): Promise<boolean> => {
    if (!user) {
      setError('User authentication required');
      return false;
    }

    // Start submission process
    setSubmissionState({
      isSubmitting: true,
      uploadProgress: 'Validating submission...',
      error: null,
      validationErrors: [],
      validationWarnings: []
    });

    try {
      // Enhanced validation with sanitization
      const validation = validatePropertySubmission(
        ownerInfo, 
        propertyInfo, 
        user.id
      );

      // Update validation state
      setSubmissionState(prev => ({
        ...prev,
        validationErrors: validation.errors,
        validationWarnings: validation.warnings
      }));

      // Check for validation errors
      if (!validation.isValid) {
        setError('Validation failed. Please correct the errors and try again.');
        showSecurityToast(
          'Validation Failed',
          `Found ${validation.errors.length} error(s). Please review and correct them.`,
          'destructive'
        );
        return false;
      }

      // Show warnings if present
      if (validation.warnings.length > 0) {
        showSecurityToast(
          'Submission Warnings',
          `${validation.warnings.length} warning(s) detected. Review before proceeding.`
        );
      }

      updateProgress('Preparing secure upload...');

      // Use sanitized data for submission
      const sanitizedOwnerInfo = validation.sanitizedData?.ownerInfo || ownerInfo;
      const sanitizedPropertyInfo = validation.sanitizedData?.propertyInfo || {};

      // Upload images securely
      updateProgress('Uploading images...');
      const imageUrls: string[] = [];
      
      if (propertyInfo.gallery?.images) {
        for (let i = 0; i < propertyInfo.gallery.images.length; i++) {
          const image = propertyInfo.gallery.images[i];
          
          // Generate secure filename
          const fileExt = image.name.split('.').pop()?.toLowerCase();
          const secureFileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          updateProgress(`Uploading image ${i + 1} of ${propertyInfo.gallery.images.length}...`);
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property-media')
            .upload(secureFileName, image, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('property-media')
            .getPublicUrl(uploadData.path);
          
          imageUrls.push(publicUrl);
        }
      }

      // Upload video securely (if present)
      let videoUrl: string | null = null;
      if (propertyInfo.gallery?.video) {
        updateProgress('Uploading video...');
        
        const videoExt = propertyInfo.gallery.video.name.split('.').pop()?.toLowerCase();
        const secureVideoFileName = `${user.id}/videos/${Date.now()}_${Math.random().toString(36).substring(7)}.${videoExt}`;
        
        const { data: videoUploadData, error: videoUploadError } = await supabase.storage
          .from('property-media')
          .upload(secureVideoFileName, propertyInfo.gallery.video, {
            cacheControl: '3600',
            upsert: false
          });

        if (videoUploadError) {
          throw new Error(`Video upload failed: ${videoUploadError.message}`);
        }

        const { data: { publicUrl: videoPublicUrl } } = supabase.storage
          .from('property-media')
          .getPublicUrl(videoUploadData.path);
        
        videoUrl = videoPublicUrl;
      }

      updateProgress('Creating property record...');

      // Create property record with sanitized data
      const propertyData = {
        user_id: user.id,
        title: sanitizedPropertyInfo.propertyDetails?.title || propertyInfo.propertyDetails.title,
        property_type: sanitizedPropertyInfo.propertyDetails?.propertyType || propertyInfo.propertyDetails.propertyType,
        listing_type: sanitizedPropertyInfo.rentalDetails?.listingType || propertyInfo.rentalDetails.listingType,
        bhk_type: propertyInfo.propertyDetails.bhkType,
        bathrooms: sanitizedPropertyInfo.propertyDetails?.bathrooms || propertyInfo.propertyDetails.bathrooms,
        balconies: sanitizedPropertyInfo.propertyDetails?.balconies || propertyInfo.propertyDetails.balconies,
        super_area: sanitizedPropertyInfo.propertyDetails?.superBuiltUpArea || propertyInfo.propertyDetails.superBuiltUpArea,
        carpet_area: propertyInfo.propertyDetails.superBuiltUpArea, // Assuming same as super area
        expected_price: sanitizedPropertyInfo.rentalDetails?.expectedPrice || propertyInfo.rentalDetails.expectedPrice,
        state: sanitizedPropertyInfo.locationDetails?.state || propertyInfo.locationDetails.state,
        city: sanitizedPropertyInfo.locationDetails?.city || propertyInfo.locationDetails.city,
        locality: sanitizedPropertyInfo.locationDetails?.locality || propertyInfo.locationDetails.locality,
        pincode: sanitizedPropertyInfo.locationDetails?.pincode || propertyInfo.locationDetails.pincode,
        street_address: propertyInfo.locationDetails.societyName || '',
        landmarks: propertyInfo.locationDetails.landmark || '',
        description: sanitizedPropertyInfo.additionalInfo?.description || propertyInfo.additionalInfo?.description,
        images: imageUrls,
        videos: videoUrl ? [videoUrl] : [],
        furnishing: propertyInfo.propertyDetails.furnishingStatus,
        availability_type: propertyInfo.scheduleInfo.availability,
        price_negotiable: propertyInfo.rentalDetails.rentNegotiable || false,
        maintenance_charges: propertyInfo.rentalDetails.maintenanceCharges || 0,
        security_deposit: propertyInfo.rentalDetails.securityDeposit || 0,
        owner_name: sanitizedOwnerInfo.fullName || ownerInfo.fullName,
        owner_phone: sanitizedOwnerInfo.phoneNumber || ownerInfo.phoneNumber,
        owner_email: sanitizedOwnerInfo.email || ownerInfo.email,
        owner_role: sanitizedOwnerInfo.role || ownerInfo.role,
        status: 'pending'
      };

      const { error: insertError } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (insertError) {
        throw new Error(`Property submission failed: ${insertError.message}`);
      }

      updateProgress('Property submitted successfully!');
      
      showSecurityToast(
        'Property Submitted',
        'Your property has been submitted securely and is pending admin approval.'
      );

      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        uploadProgress: 'Complete'
      }));

      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      showSecurityToast(
        'Submission Failed',
        errorMessage,
        'destructive'
      );

      return false;
    }
  }, [user, updateProgress, setError, showSecurityToast]);

  return {
    submissionState,
    submitProperty,
    updateProgress,
    setError,
    showSecurityToast
  };
};