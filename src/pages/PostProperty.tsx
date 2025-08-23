import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OwnerInfoStep } from '@/components/property-form/OwnerInfoStep';
import { MultiStepForm } from '@/components/property-form/MultiStepForm';
import { ResaleMultiStepForm } from '@/components/property-form/ResaleMultiStepForm';
import { PGHostelMultiStepForm } from '@/components/property-form/PGHostelMultiStepForm';
import { FlattmatesMultiStepForm } from '@/components/property-form/FlattmatesMultiStepForm';
import { CommercialMultiStepForm } from '@/components/property-form/CommercialMultiStepForm';
import { LandPlotMultiStepForm } from '@/components/property-form/LandPlotMultiStepForm';
import { CommercialSaleMultiStepForm } from '@/components/property-form/CommercialSaleMultiStepForm';
import { OwnerInfo, PropertyInfo, PGHostelFormData, FlattmatesFormData, CommercialFormData } from '@/types/property';
import { SalePropertyFormData, SalePropertyInfo } from '@/types/saleProperty';
import { CommercialSaleFormData } from '@/types/commercialSaleProperty';
import { LandPlotFormData } from '@/types/landPlotProperty';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadFilesToStorage, uploadSingleFile } from '@/services/fileUploadService';
import { validatePropertySubmission } from '@/utils/propertyValidation';
import { mapBhkType, mapPropertyType, mapListingType, validateMappedValues } from '@/utils/propertyMappings';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';

type FormStep = 'owner-info' | 'rental-form' | 'resale-form' | 'pg-hostel-form' | 'flatmates-form' | 'commercial-rental-form' | 'commercial-sale-form' | 'land-plot-form';

export const PostProperty: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('owner-info');
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [initialOwnerData, setInitialOwnerData] = useState<Partial<OwnerInfo>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract role from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get('role');
    if (role && ['Owner', 'Agent', 'Builder'].includes(role)) {
      setInitialOwnerData({ role: role as 'Owner' | 'Agent' | 'Builder' });
    }
  }, [location.search]);

  const handleOwnerInfoNext = (data: OwnerInfo) => {
    setOwnerInfo(data);
    
    // Route to appropriate form based on property type and listing type
    if (data.propertyType === 'Commercial') {
      if (data.listingType === 'Rent') {
        setCurrentStep('commercial-rental-form');
      } else if (data.listingType === 'Sale') {
        setCurrentStep('commercial-sale-form');
      }
    } else {
      // Route to appropriate form based on listing type for non-commercial
      switch (data.listingType) {
        case 'Resale':
          if (data.propertyType === 'Land/Plot') {
            setCurrentStep('land-plot-form');
          } else {
            setCurrentStep('resale-form');
          }
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

  const handleSubmit = async (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo | SalePropertyInfo } | PGHostelFormData | FlattmatesFormData | CommercialFormData | CommercialSaleFormData | LandPlotFormData) => {
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
      let listingType: string = 'Sale'; // Default fallback
      
      // Debug logging to identify undefined values
      console.log('Form data structure:', Object.keys(data.propertyInfo));
      console.log('Property info object:', data.propertyInfo);
      
      if ('rentalDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as PropertyInfo).rentalDetails.listingType;
      } else if ('saleDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as SalePropertyInfo).saleDetails.listingType;
      } else if ('pgDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as any).pgDetails.listingType;
      } else if ('flattmatesDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as any).flattmatesDetails.listingType;
      } else if ('commercialDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as any).commercialDetails.listingType || 'Rent';
      } else if ('commercialSaleDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as any).commercialSaleDetails.listingType || 'Sale';
      }
      
      console.log('Extracted listing type:', listingType);
        
      const mappingValidation = validateMappedValues({
        bhkType: ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? data.propertyInfo.propertyDetails.bhkType : null,
        propertyType: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.propertyType : 
                     ('plotDetails' in data.propertyInfo) ? data.propertyInfo.plotDetails.propertyType : 'Commercial',
        listingType: listingType || 'Sale'
      });

      if (!mappingValidation.isValid) {
        console.error('Property mapping validation failed:', mappingValidation.errors);
        throw new Error(`Invalid property data: ${mappingValidation.errors.join(', ')}`);
      }

      // Validate using centralized validator before uploads
      const expectedPriceValue = ('rentalDetails' in data.propertyInfo)
        ? (data.propertyInfo as PropertyInfo).rentalDetails.expectedPrice
        : ('saleDetails' in data.propertyInfo)
          ? (data.propertyInfo as SalePropertyInfo).saleDetails.expectedPrice
          : ('pgDetails' in data.propertyInfo)
            ? (data.propertyInfo as any).pgDetails.expectedPrice
            : ('flattmatesDetails' in data.propertyInfo)
              ? (data.propertyInfo as any).flattmatesDetails.expectedPrice
              : undefined;

      const normalizedPropertyInfo = {
        propertyDetails: {
          title: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.title : 
                 ('plotDetails' in data.propertyInfo) ? data.propertyInfo.plotDetails.title : '',
          propertyType: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.propertyType : 
                       ('plotDetails' in data.propertyInfo) ? data.propertyInfo.plotDetails.propertyType : '',
          superBuiltUpArea: ('propertyDetails' in data.propertyInfo) ? Number(data.propertyInfo.propertyDetails.superBuiltUpArea) :
                           ('plotDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).plotDetails.plotArea) : 0,
          bathrooms: ('propertyDetails' in data.propertyInfo && 'bathrooms' in data.propertyInfo.propertyDetails) ? Number(data.propertyInfo.propertyDetails.bathrooms) : 0,
          balconies: ('propertyDetails' in data.propertyInfo && 'balconies' in data.propertyInfo.propertyDetails) ? Number(data.propertyInfo.propertyDetails.balconies) : 0,
        },
        locationDetails: {
          state: (data.propertyInfo as any).locationDetails?.state || '',
          city: (data.propertyInfo as any).locationDetails?.city || '',
          locality: (data.propertyInfo as any).locationDetails?.locality || '',
          pincode: (data.propertyInfo as any).locationDetails?.pincode || '',
        },
        rentalDetails: {
          expectedPrice: Number(expectedPriceValue),
          listingType: listingType as any,
        },
        additionalInfo: {
          description: (data.propertyInfo as any).additionalInfo?.description || '',
        },
        gallery: (data.propertyInfo as any).gallery || { images: [], video: null }
      } as any;

      console.log('Starting property submission process...');
      console.log('Owner info:', data.ownerInfo);
      console.log('Property info before normalization:', data.propertyInfo);
      
      const validation = validatePropertySubmission(
        data.ownerInfo as any,
        normalizedPropertyInfo as any,
        user.id
      );
      
      console.log('Validation result:', validation);

      if (!validation.isValid) {
        console.error('Validation failed:', validation.errors);
        toast({
          title: 'Submission Failed',
          description: validation.errors.slice(0, 3).join(' | '),
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
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
      
      // Hard validation to avoid DB errors
      if (!priceDetails || priceDetails.expectedPrice === undefined || !Number.isFinite(Number(priceDetails.expectedPrice))) {
        throw new Error('Expected price is required and must be a valid number.');
      }
      
      const propertyData = {
        user_id: user.id,
        title: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.title : 
               ('plotDetails' in data.propertyInfo) ? data.propertyInfo.plotDetails.title : 'Untitled',
        property_type: mapPropertyType(('propertyDetails' in data.propertyInfo) ? 
                                     data.propertyInfo.propertyDetails.propertyType : 
                                     data.propertyInfo.plotDetails.propertyType),
        listing_type: mapListingType(listingType),
        bhk_type: ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? 
                 mapBhkType(data.propertyInfo.propertyDetails.bhkType) : null,
        bathrooms: ('propertyDetails' in data.propertyInfo && 'bathrooms' in data.propertyInfo.propertyDetails) ? 
                  Number(data.propertyInfo.propertyDetails.bathrooms) || 0 : 0,
        balconies: ('propertyDetails' in data.propertyInfo && 'balconies' in data.propertyInfo.propertyDetails) ? 
                  Number(data.propertyInfo.propertyDetails.balconies) || 0 : 0,
        super_area: ('propertyDetails' in data.propertyInfo) ? 
                   Number(data.propertyInfo.propertyDetails.superBuiltUpArea) :
                   ('plotDetails' in data.propertyInfo) ? Number(data.propertyInfo.plotDetails.plotArea) : 0,
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
        is_featured: true, // Mark all submitted properties as featured candidates
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
      console.log('About to insert property into database...');
      const { data: property, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Database insertion error - Full details:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          propertyDataSent: propertyData
        });
        
        // Provide specific error messages based on error type
        let errorMessage = `Database error: ${error.message}`;
        
        if (error.message.includes('availability_type')) {
          errorMessage = "Invalid availability type. Please contact support.";
        } else if (error.message.includes('violates check constraint')) {
          if (error.message.includes('property_type')) {
            const propType = ('propertyDetails' in data.propertyInfo) ? 
                           data.propertyInfo.propertyDetails.propertyType : 
                           data.propertyInfo.plotDetails.propertyType;
            errorMessage = `Invalid property type: "${propType}". Please select a valid property type.`;
          } else if (error.message.includes('listing_type')) {
            errorMessage = `Invalid listing type: "${listingType}". Please select Sale or Rent.`;
          } else if (error.message.includes('bhk_type')) {
            const bhkType = ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? 
                          data.propertyInfo.propertyDetails.bhkType : 'N/A';
            errorMessage = `Invalid BHK type: "${bhkType}". Please select a valid BHK configuration.`;
          } else {
            errorMessage = "Some property details don't meet our requirements. Please check your inputs.";
          }
        } else if (error.message.includes('violates row-level security')) {
          errorMessage = "Authentication error. Please log out and log back in.";
        } else if (error.message.includes('null value in column')) {
          const match = error.message.match(/null value in column \"([^\"]+)\"/i);
          const column = match?.[1];
          errorMessage = column
            ? `Missing required field: ${column.replace(/_/g, ' ')}. Please fill it and try again.`
            : "Required fields are missing. Please ensure all mandatory fields are filled.";
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
        title: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.title : 
               data.propertyInfo.plotDetails.title,
        property_type: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.propertyType : 
                      data.propertyInfo.plotDetails.propertyType,
        listing_type: priceDetailsDraft.listingType,
        bhk_type: ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? 
                 data.propertyInfo.propertyDetails.bhkType : null,
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
        return <OwnerInfoStep initialData={initialOwnerData} onNext={handleOwnerInfoNext} />;
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
      case 'commercial-sale-form':
        return (
          <CommercialSaleMultiStepForm 
            onSubmit={handleSubmit as (data: CommercialSaleFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
          />
        );
      case 'land-plot-form':
        return (
          <LandPlotMultiStepForm 
            onSubmit={handleSubmit as (data: LandPlotFormData) => void}
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