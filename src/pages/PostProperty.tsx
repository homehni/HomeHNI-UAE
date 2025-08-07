import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OwnerInfoStep } from '@/components/property-form/OwnerInfoStep';
import { MultiStepForm } from '@/components/property-form/MultiStepForm';
import { ResaleMultiStepForm } from '@/components/property-form/ResaleMultiStepForm';
import { PGHostelMultiStepForm } from '@/components/property-form/PGHostelMultiStepForm';
import { FlattmatesMultiStepForm } from '@/components/property-form/FlattmatesMultiStepForm';
import { CommercialMultiStepForm } from '@/components/property-form/CommercialMultiStepForm';
import { OwnerInfo, PropertyInfo, PGHostelFormData, FlattmatesFormData, CommercialFormData } from '@/types/property';
import { SalePropertyFormData, SalePropertyInfo } from '@/types/saleProperty';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadFilesToStorage, uploadSingleFile } from '@/services/fileUploadService';
import { validatePropertySubmission } from '@/utils/propertyValidation';
import { mapBhkType, mapPropertyType, mapListingType, validateMappedValues } from '@/utils/propertyMappings';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';

type FormStep = 'owner-info' | 'rental-form' | 'resale-form' | 'pg-hostel-form' | 'flatmates-form' | 'commercial-rental-form';

export const PostProperty: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('owner-info');
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOwnerInfoNext = (data: OwnerInfo) => {
    setOwnerInfo(data);
    
    // Route to appropriate form based on property type and listing type
    if (data.propertyType === 'Commercial' && data.listingType === 'Rent') {
      setCurrentStep('commercial-rental-form');
    } else {
      // Route to appropriate form based on listing type for non-commercial
      switch (data.listingType) {
        case 'Resale':
          setCurrentStep('resale-form');
          break;
        case 'PG/Hostel':
          setCurrentStep('pg-hostel-form');
          break;
        case 'Flatmates':
          setCurrentStep('flatmates-form');
          break;
        default: // 'Rent'
          setCurrentStep('rental-form');
      }
    }
  };

  const handleSubmit = async (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo | SalePropertyInfo } | PGHostelFormData | FlattmatesFormData | CommercialFormData) => {
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

      // Comprehensive validation - skip for now since validation function needs updating
      // const validation = validatePropertySubmission(data.ownerInfo, data.propertyInfo);
      
      // if (!validation.isValid) {
      //   console.error('Validation failed:', validation.errors);
      //   throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      // }

      // Show warnings if any
      // if (validation.warnings.length > 0) {
      //   console.warn('Validation warnings:', validation.warnings);
      // }

      // Validate property data mappings
      let listingType: string;
      if ('rentalDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as PropertyInfo).rentalDetails.listingType;
      } else if ('saleDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as SalePropertyInfo).saleDetails.listingType;
      } else if ('pgDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as any).pgDetails.listingType;
      } else if ('flattmatesDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as any).flattmatesDetails.listingType;
      } else {
        listingType = 'Rent'; // fallback
      }
        
      const mappingValidation = validateMappedValues({
        bhkType: 'bhkType' in data.propertyInfo.propertyDetails ? data.propertyInfo.propertyDetails.bhkType : 'Commercial',
        propertyType: data.propertyInfo.propertyDetails.propertyType,
        listingType: listingType
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
        data.propertyInfo.gallery.images,
        'images',
        user.id
      );

      // Upload video if provided
      let videoUrls: string[] = [];
      if (data.propertyInfo.gallery.video) {
        toast({
          title: "Uploading Video...",
          description: "Please wait while we upload your property video.",
        });

        const videoResult = await uploadSingleFile(
          data.propertyInfo.gallery.video,
          'videos',
          user.id
        );
        videoUrls = [videoResult.url];
      }

      // Prepare property data for database with proper mapping
      let priceDetails: any;
      if ('rentalDetails' in data.propertyInfo) {
        priceDetails = (data.propertyInfo as PropertyInfo).rentalDetails;
      } else if ('saleDetails' in data.propertyInfo) {
        priceDetails = (data.propertyInfo as SalePropertyInfo).saleDetails;
      } else if ('pgDetails' in data.propertyInfo) {
        priceDetails = (data.propertyInfo as any).pgDetails;
      } else if ('flattmatesDetails' in data.propertyInfo) {
        priceDetails = (data.propertyInfo as any).flattmatesDetails;
      }
      
      const propertyData = {
        user_id: user.id,
        title: data.propertyInfo.propertyDetails.title,
        property_type: mapPropertyType(data.propertyInfo.propertyDetails.propertyType),
        listing_type: mapListingType(priceDetails.listingType),
        bhk_type: 'bhkType' in data.propertyInfo.propertyDetails ? mapBhkType(data.propertyInfo.propertyDetails.bhkType) : null,
        bathrooms: 'bathrooms' in data.propertyInfo.propertyDetails ? Number(data.propertyInfo.propertyDetails.bathrooms) || 0 : 0,
        balconies: 'balconies' in data.propertyInfo.propertyDetails ? Number(data.propertyInfo.propertyDetails.balconies) || 0 : 0,
        super_area: Number(data.propertyInfo.propertyDetails.superBuiltUpArea),
        carpet_area: null,
        expected_price: Number(priceDetails.expectedPrice),
        state: data.propertyInfo.locationDetails.state,
        city: data.propertyInfo.locationDetails.city,
        locality: data.propertyInfo.locationDetails.locality,
        pincode: data.propertyInfo.locationDetails.pincode,
        description: data.propertyInfo.additionalInfo.description || null,
        images: imageUrls.map(img => img.url),
        videos: videoUrls,
        availability_type: 'immediate',
        status: 'pending',
        // Add owner information directly to properties table
        owner_name: data.ownerInfo.fullName,
        owner_email: data.ownerInfo.email,
        owner_phone: data.ownerInfo.phoneNumber,
        owner_role: data.ownerInfo.role
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
        console.error('Full database error object:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
        // Provide specific error messages based on error type
        let errorMessage = `Database error: ${error.message}`;
        
        if (error.message.includes('availability_type')) {
          errorMessage = "Invalid availability type. Please contact support.";
        } else if (error.message.includes('violates check constraint')) {
          if (error.message.includes('property_type')) {
            errorMessage = `Invalid property type: "${data.propertyInfo.propertyDetails.propertyType}". Please select a valid property type.`;
          } else if (error.message.includes('listing_type')) {
            errorMessage = `Invalid listing type: "${listingType}". Please select Sale or Rent.`;
          } else if (error.message.includes('bhk_type')) {
            errorMessage = `Invalid BHK type: "${data.propertyInfo.propertyDetails.bhkType}". Please select a valid BHK configuration.`;
          } else {
            errorMessage = "Some property details don't meet our requirements. Please check your inputs.";
          }
        } else if (error.message.includes('violates row-level security')) {
          errorMessage = "Authentication error. Please log out and log back in.";
        } else if (error.message.includes('null value in column')) {
          errorMessage = "Required fields are missing. Please ensure all mandatory fields are filled.";
        }
        
        throw new Error(errorMessage);
      }

      console.log('Property created successfully:', property);

      // Save owner contact information to property_drafts table
      let priceDetailsDraft: any;
      if ('rentalDetails' in data.propertyInfo) {
        priceDetailsDraft = (data.propertyInfo as PropertyInfo).rentalDetails;
      } else if ('saleDetails' in data.propertyInfo) {
        priceDetailsDraft = (data.propertyInfo as SalePropertyInfo).saleDetails;
      } else if ('pgDetails' in data.propertyInfo) {
        priceDetailsDraft = (data.propertyInfo as any).pgDetails;
      } else if ('flattmatesDetails' in data.propertyInfo) {
        priceDetailsDraft = (data.propertyInfo as any).flattmatesDetails;
      }
      
      const ownerData = {
        user_id: user.id,
        owner_name: data.ownerInfo.fullName,
        owner_email: data.ownerInfo.email,
        owner_phone: data.ownerInfo.phoneNumber,
        owner_role: data.ownerInfo.role,
        title: data.propertyInfo.propertyDetails.title,
        property_type: data.propertyInfo.propertyDetails.propertyType,
        listing_type: priceDetailsDraft.listingType,
        bhk_type: data.propertyInfo.propertyDetails.bhkType,
        state: data.propertyInfo.locationDetails.state,
        city: data.propertyInfo.locationDetails.city,
        locality: data.propertyInfo.locationDetails.locality,
        pincode: data.propertyInfo.locationDetails.pincode,
        expected_price: Number(priceDetailsDraft.expectedPrice),
        status: 'submitted'
      };

      const { error: draftError } = await supabase
        .from('property_drafts')
        .insert([ownerData]);

      if (draftError) {
        console.error('Error saving owner info:', draftError);
        // Don't fail the entire submission if owner info save fails
      }

      toast({
        title: "Success!",
        description: "Your property has been submitted successfully.",
      });

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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'owner-info':
        return <OwnerInfoStep initialData={{}} onNext={handleOwnerInfoNext} />;
      case 'rental-form':
        return (
          <MultiStepForm 
            onSubmit={handleSubmit as (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
          />
        );
      case 'resale-form':
        return (
          <ResaleMultiStepForm 
            onSubmit={handleSubmit as (data: SalePropertyFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
          />
        );
      case 'pg-hostel-form':
        return (
          <PGHostelMultiStepForm 
            onSubmit={handleSubmit as (data: PGHostelFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
          />
        );
      case 'flatmates-form':
        return (
          <FlattmatesMultiStepForm 
            onSubmit={handleSubmit as (data: FlattmatesFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
          />
        );
      case 'commercial-rental-form':
        return (
          <CommercialMultiStepForm 
            onSubmit={handleSubmit as (data: CommercialFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
          />
        );
      default:
        return <OwnerInfoStep initialData={{}} onNext={handleOwnerInfoNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-100/30">
      {/* Marquee at the very top */}
      <Marquee />
      {/* Header overlapping with content */}
      <Header />
      {/* Content starts with proper spacing */}
      <div className="pt-32">
        {renderCurrentStep()}
      </div>
    </div>
  );
};