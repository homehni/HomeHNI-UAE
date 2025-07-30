import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MultiStepForm } from '@/components/property-form';
import { OwnerInfo, PropertyInfo } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadFilesToStorage, uploadSingleFile } from '@/services/fileUploadService';
import { validatePropertySubmission } from '@/utils/propertyValidation';
import { mapBhkType, mapPropertyType, mapListingType, validateMappedValues } from '@/utils/propertyMappings';

export const PostProperty: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a property listing.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting property submission with data:', data);

      // Comprehensive validation
      const validation = validatePropertySubmission(data.ownerInfo, data.propertyInfo);
      
      if (!validation.isValid) {
        console.error('Validation failed:', validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Validation warnings:', validation.warnings);
      }

      // Validate property data mappings
      const mappingValidation = validateMappedValues({
        bhkType: data.propertyInfo.bhkType,
        propertyType: data.propertyInfo.propertyType,
        listingType: data.propertyInfo.listingType
      });

      if (!mappingValidation.isValid) {
        console.error('Property mapping validation failed:', mappingValidation.errors);
        throw new Error(`Invalid property data: ${mappingValidation.errors.join(', ')}`);
      }

      // Upload images to storage
      toast({
        title: "Uploading Images...",
        description: "Please wait while we upload your property images.",
      });

      const imageUrls = await uploadFilesToStorage(
        data.propertyInfo.images,
        'images',
        user.id
      );

      // Upload video if provided
      let videoUrls: string[] = [];
      if (data.propertyInfo.video) {
        toast({
          title: "Uploading Video...",
          description: "Please wait while we upload your property video.",
        });

        const videoResult = await uploadSingleFile(
          data.propertyInfo.video,
          'videos',
          user.id
        );
        videoUrls = [videoResult.url];
      }

      // Prepare property data for database with proper mapping
      const propertyData = {
        user_id: user.id,
        title: data.propertyInfo.title,
        property_type: mapPropertyType(data.propertyInfo.propertyType),
        listing_type: mapListingType(data.propertyInfo.listingType),
        bhk_type: data.propertyInfo.bhkType ? mapBhkType(data.propertyInfo.bhkType) : null,
        bathrooms: Number(data.propertyInfo.bathrooms) || 0,
        balconies: Number(data.propertyInfo.balconies) || 0,
        super_area: Number(data.propertyInfo.superArea),
        carpet_area: data.propertyInfo.carpetArea ? Number(data.propertyInfo.carpetArea) : null,
        expected_price: Number(data.propertyInfo.expectedPrice),
        state: data.propertyInfo.state,
        city: data.propertyInfo.city,
        locality: data.propertyInfo.locality,
        pincode: data.propertyInfo.pincode,
        description: data.propertyInfo.description || null,
        images: imageUrls.map(img => img.url),
        videos: videoUrls,
        availability_type: 'immediate', // Fixed case sensitivity
        status: 'active'
      };

      console.log('Prepared property data for database:', propertyData);

      toast({
        title: "Saving Property...",
        description: "Almost done! Saving your property listing.",
      });

      // Insert property into database
      const { data: property, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        
        // Provide specific error messages based on error type
        let errorMessage = "There was an error submitting your property. Please try again.";
        
        if (error.message.includes('availability_type')) {
          errorMessage = "Invalid availability type. Please contact support.";
        } else if (error.message.includes('violates check constraint')) {
          errorMessage = "Some property details don't meet our requirements. Please check your inputs.";
        } else if (error.message.includes('violates row-level security')) {
          errorMessage = "Authentication error. Please log out and log back in.";
        }
        
        throw new Error(errorMessage);
      }

      console.log('Property created successfully:', property);

      // Store owner contact information as metadata (could be extended to separate table)
      // For now, we'll log it for future enhancement
      console.log('Owner contact info:', data.ownerInfo);

      toast({
        title: "Success!",
        description: "Your property has been submitted successfully. Redirecting to dashboard...",
      });

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting property:', error);
      
      // Clean up uploaded files if property creation failed
      // This could be enhanced with a cleanup service
      
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MultiStepForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};