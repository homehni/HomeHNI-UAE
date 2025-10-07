import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { PropertySelectionStep } from '@/components/property-form/PropertySelectionStep';
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
import { uploadSingleFile, uploadPropertyImagesByType } from '@/services/fileUploadService';
import { validatePropertySubmission } from '@/utils/propertyValidation';
import { mapBhkType, mapPropertyType, mapListingType, validateMappedValues } from '@/utils/propertyMappings';
import { generatePropertyName } from '@/utils/propertyNameGenerator';
import { createPropertyContact } from '@/services/propertyContactService';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import WhyPostSection from '@/components/WhyPostSection';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PropertyFAQSection from '@/components/PropertyFAQSection';

type FormStep = 'property-selection' | 'owner-info' | 'rental-form' | 'resale-form' | 'pg-hostel-form' | 'flatmates-form' | 'commercial-rental-form' | 'commercial-sale-form' | 'land-plot-form';

export const PostProperty: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('property-selection');
  
  // Debug logging for currentStep changes
  React.useEffect(() => {
    console.log('PostProperty currentStep changed to:', currentStep);
  }, [currentStep]);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [initialOwnerData, setInitialOwnerData] = useState<Partial<OwnerInfo>>({});
  const [propertySelectionData, setPropertySelectionData] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
    whatsappUpdates: boolean;
    propertyType: 'Residential' | 'Commercial' | 'Land/Plot';
    listingType: 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates' | 'Sale' | 'Industrial land' | 'Agricultural Land' | 'Commercial land';
  } | null>(null);
  const [targetStep, setTargetStep] = useState<number | null>(null);
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract edit mode, and step from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editPropertyId = searchParams.get('edit');
    const step = searchParams.get('step');
    
    // Handle edit mode from sessionStorage
    const editData = sessionStorage.getItem('editPropertyData');
    if (editData) {
      try {
        const { propertyId, formType, propertyData, initialFormData } = JSON.parse(editData);
        console.log('Edit mode from sessionStorage:', { propertyId, formType, propertyData });
        
        // Set initial owner data from property
        setInitialOwnerData({
          fullName: propertyData.owner_name || '',
          email: propertyData.owner_email || '',
          phoneNumber: propertyData.owner_phone || ''
        });
        
        // Determine the form step based on form type
        switch (formType) {
          case 'rental':
            setCurrentStep('rental-form');
            break;
          case 'resale':
            setCurrentStep('resale-form');
            break;
          case 'pg-hostel':
            setCurrentStep('pg-hostel-form');
            break;
          case 'flatmates':
            setCurrentStep('flatmates-form');
            break;
          case 'commercial-rental':
            setCurrentStep('commercial-rental-form');
            break;
          case 'commercial-sale':
            setCurrentStep('commercial-sale-form');
            break;
          case 'land-plot':
            setCurrentStep('land-plot-form');
            break;
          default:
            setCurrentStep('rental-form');
        }
        
        // Clear the sessionStorage data
        sessionStorage.removeItem('editPropertyData');
        return;
      } catch (error) {
        console.error('Error parsing edit data from sessionStorage:', error);
        sessionStorage.removeItem('editPropertyData');
      }
    }
    
    // Handle edit mode from URL parameters
    if (editPropertyId) {
      console.log('Edit mode for property:', editPropertyId);
      loadPropertyForEdit(editPropertyId);
    }
    
    // Handle step navigation
    if (step) {
      console.log('PostProperty - Navigate to step:', step);
      // Map step names to step numbers
      const stepMap: { [key: string]: number } = {
        'gallery': 5, // Gallery step is step 5 in most forms
        'images': 5,
        'upload': 5,
        'amenities': 4 // Amenities step is step 4 in most forms
      };
      const stepNumber = stepMap[step.toLowerCase()] || parseInt(step);
      console.log('PostProperty - Mapped step number:', stepNumber);
      if (stepNumber && stepNumber > 0) {
        setTargetStep(stepNumber);
        console.log('PostProperty - Set target step to:', stepNumber);
      }
    }
  }, [location.search]);

  // Function to load property data for editing
  const loadPropertyForEdit = async (propertyId: string) => {
    try {
      console.log('Loading property data for editing:', propertyId);
      
      // Fetch property data from database
      const { data: propertyData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('user_id', user?.id) // Ensure user can only edit their own properties
        .single();

      if (error) {
        console.error('Error loading property for edit:', error);
        toast({
          title: "Error",
          description: "Failed to load property data for editing.",
          variant: "destructive",
        });
        return;
      }

      if (propertyData) {
        console.log('Property data loaded:', propertyData);
        
        // Set the owner info from the property data
        const ownerInfoData = {
          fullName: propertyData.owner_name || '',
          email: propertyData.owner_email || '',
          phoneNumber: propertyData.owner_phone || '',
          whatsappUpdates: false,
          propertyType: (propertyData.property_type === 'commercial' ? 'Commercial' : 
                       propertyData.property_type === 'plot' ? 'Land/Plot' : 'Residential') as 'Residential' | 'Commercial' | 'Land/Plot',
          listingType: (propertyData.listing_type === 'sale' ? 'Sale' : 
                      propertyData.listing_type === 'rent' ? 'Rent' : 
                      propertyData.listing_type === 'apartment' ? 'Flatmates' : 'Rent') as 'Sale' | 'Rent' | 'Flatmates'
        };
        
        setOwnerInfo(ownerInfoData);

        // Store property data globally for child forms to access
        (window as any).editingPropertyData = propertyData;
        
        // Auto-proceed to the correct form step
        setTimeout(() => {
          handleOwnerInfoNext(ownerInfoData);
        }, 100);
        
        toast({
          title: "Edit Mode",
          description: `Loaded property "${propertyData.title}" for editing.`,
        });
      }
    } catch (error) {
      console.error('Error in loadPropertyForEdit:', error);
      toast({
        title: "Error",
        description: "Failed to load property for editing.",
        variant: "destructive",
      });
    }
  };

  const handlePropertySelectionNext = async (data: {
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
    whatsappUpdates: boolean;
    propertyType: 'Residential' | 'Commercial' | 'Land/Plot';
    listingType: 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates' | 'Sale' | 'Industrial land' | 'Agricultural Land' | 'Commercial land';
  }) => {
    try {
      // Save contact data to database
      await createPropertyContact({
        name: data.name,
        email: data.email,
        phone: data.phoneNumber,
        city: data.city,
        whatsapp_opted_in: data.whatsappUpdates,
        property_type: data.propertyType,
        listing_type: data.listingType
      });

    } catch (error) {
      console.error('Error saving contact data:', error);
      // Continue anyway - don't block form access due to database issues
      console.log('Continuing to form despite database error');
    }

    console.log('Property selection data received:', data);
    setPropertySelectionData(data);
    
    // Clear any existing form drafts when starting fresh from property selection
    if (data.listingType === 'Resale') {
      localStorage.removeItem('resale-form-data');
      console.log('Cleared resale form draft - starting fresh');
    } else if (data.listingType === 'Rent') {
      localStorage.removeItem('rental-form-data');
      console.log('Cleared rental form draft - starting fresh');
    } else if (data.listingType === 'PG/Hostel') {
      localStorage.removeItem('pg-hostel-form-data');
      console.log('Cleared PG/Hostel form draft - starting fresh');
    } else if (data.listingType === 'Flatmates') {
      localStorage.removeItem('flatmates-form-data');
      console.log('Cleared flatmates form draft - starting fresh');
    }
    
    // Create owner info from the selection data
    const ownerInfoData: OwnerInfo = {
      fullName: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      whatsappUpdates: data.whatsappUpdates,
      propertyType: data.propertyType,
      listingType: data.listingType
    };
    
    setOwnerInfo(ownerInfoData);
    
    // Route directly to appropriate form based on property type and listing type
    console.log('Routing based on:', { propertyType: data.propertyType, listingType: data.listingType });
    
    if (data.propertyType === 'Commercial') {
      if (data.listingType === 'Rent') {
        console.log('Routing to commercial-rental-form');
        setCurrentStep('commercial-rental-form');
      } else if (data.listingType === 'Sale') {
        console.log('Routing to commercial-sale-form');
        setCurrentStep('commercial-sale-form');
      }
    } else {
      // Route to appropriate form based on listing type for non-commercial
      switch (data.listingType) {
        case 'Resale':
          if (data.propertyType === 'Land/Plot') {
            console.log('Routing to land-plot-form for Land/Plot Resale');
            setCurrentStep('land-plot-form');
          } else {
            console.log('Routing to resale-form for Residential Resale');
            setCurrentStep('resale-form');
          }
          break;
        case 'Industrial land':
        case 'Agricultural Land':
        case 'Commercial land':
          console.log(`Routing to land-plot-form for Land/Plot ${data.listingType}`);
          setCurrentStep('land-plot-form');
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
        case 'Industrial land':
        case 'Agricultural Land':
        case 'Commercial land':
          setCurrentStep('land-plot-form');
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
    console.log('PostProperty handleSubmit called with data:', data);
    console.log('Data type check:', {
      hasOwnerInfo: 'ownerInfo' in data,
      hasPropertyInfo: 'propertyInfo' in data,
      hasPlotDetails: 'propertyInfo' in data && 'plotDetails' in data.propertyInfo,
      dataKeys: Object.keys(data)
    });
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a property listing.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Check if we're in edit mode
    const isEditMode = !!(window as any).editingPropertyData;
    const editingPropertyId = isEditMode ? (window as any).editingPropertyData.id : null;

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
      } else if ('rentalDetails' in data.propertyInfo && (data.propertyInfo as any).rentalDetails) {
        listingType = (data.propertyInfo as any).rentalDetails.listingType || 'Rent';
      } else if ('commercialSaleDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as any).commercialSaleDetails.listingType || 'Sale';
      }
      
      console.log('Extracted listing type:', listingType);
        
      const mappingValidation = validateMappedValues({
        bhkType: ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? data.propertyInfo.propertyDetails.bhkType : null,
        propertyType: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.propertyType : 
                     ('plotDetails' in data.propertyInfo) ? data.propertyInfo.plotDetails.propertyType : 
                     ('commercialSaleDetails' in data.propertyInfo) ? 'Commercial' : 
                     ('commercialRentalDetails' in data.propertyInfo) ? 'Commercial' : 
                     data.ownerInfo?.propertyType || 'Residential',
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
              : ('commercialSaleDetails' in data.propertyInfo)
                ? (data.propertyInfo as any).commercialSaleDetails.expectedPrice
                : undefined;

      const normalizedPropertyInfo = {
        propertyDetails: {
          title: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.title : 
                 ('plotDetails' in data.propertyInfo) ? data.propertyInfo.plotDetails.title : '',
          propertyType: ('propertyDetails' in data.propertyInfo) ? data.propertyInfo.propertyDetails.propertyType : 
                       ('plotDetails' in data.propertyInfo) ? data.propertyInfo.plotDetails.propertyType : 
                       ('commercialSaleDetails' in data.propertyInfo) ? 'Commercial' : 
                       ('commercialRentalDetails' in data.propertyInfo) ? 'Commercial' : 
                       data.ownerInfo?.propertyType || 'Residential',
          superBuiltUpArea: ('propertyDetails' in data.propertyInfo) ? Number(data.propertyInfo.propertyDetails.superBuiltUpArea) :
                           ('plotDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).plotDetails.plotArea) : 0,
          bathrooms: ('amenities' in data.propertyInfo) ? Number((data.propertyInfo as any).amenities.bathrooms) || 0 : 0,
          balconies: ('amenities' in data.propertyInfo) ? Number((data.propertyInfo as any).amenities.balconies) || 0 : 0,
          bhkType: ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? data.propertyInfo.propertyDetails.bhkType : '',
          furnishingStatus: ('propertyDetails' in data.propertyInfo && 'furnishingStatus' in data.propertyInfo.propertyDetails) ? data.propertyInfo.propertyDetails.furnishingStatus : '',
          propertyAge: ('propertyDetails' in data.propertyInfo && 'propertyAge' in data.propertyInfo.propertyDetails) ? data.propertyInfo.propertyDetails.propertyAge : '',
          floorNo: ('propertyDetails' in data.propertyInfo && 'floorNo' in data.propertyInfo.propertyDetails) ? Number(data.propertyInfo.propertyDetails.floorNo) : 0,
          totalFloors: ('propertyDetails' in data.propertyInfo && 'totalFloors' in data.propertyInfo.propertyDetails) ? Number(data.propertyInfo.propertyDetails.totalFloors) : 0,
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
          rentNegotiable: ('rentalDetails' in data.propertyInfo) ? (data.propertyInfo as any).rentalDetails?.rentNegotiable || false : false,
          maintenanceExtra: ('rentalDetails' in data.propertyInfo) ? (data.propertyInfo as any).rentalDetails?.maintenanceExtra || false : false,
          maintenanceCharges: ('rentalDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).rentalDetails?.maintenanceCharges) || 0 : 0,
          securityDeposit: ('rentalDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).rentalDetails?.securityDeposit) || 0 : 0,
          leaseDuration: ('rentalDetails' in data.propertyInfo) ? (data.propertyInfo as any).rentalDetails?.leaseDuration || '' : '',
          availableFrom: ('rentalDetails' in data.propertyInfo) ? (data.propertyInfo as any).rentalDetails?.availableFrom || '' : '',
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
      
      console.log('Validation result (soft-checked):', validation);
      // Proceed even if validation reports errors; treat as non-blocking
      if (validation.errors.length > 0) {
        console.warn('Non-blocking validation issues:', validation.errors);
      }

      // Determine property type for storage folder
      const propertyTypeRawForFolder = ('propertyDetails' in (data as any).propertyInfo)
        ? (data as any).propertyInfo.propertyDetails.propertyType
        : (('plotDetails' in (data as any).propertyInfo)
          ? (data as any).propertyInfo.plotDetails.propertyType
          : 'Commercial');

      // Upload images to typed folder under property-media/content-images/<type>
      const imageUrls = await uploadPropertyImagesByType(
        ((data as any)?.propertyInfo?.gallery?.images || []) as File[],
        propertyTypeRawForFolder,
        user.id
      );

      // Upload video if provided
      let videoUrls: string[] = [];
      const videoFile = (data as any)?.propertyInfo?.gallery?.video;
      if (videoFile) {
        // Show video upload toast only for property types that are not excluded
        const isLandPropertyForVideo = 'propertyInfo' in data && 'plotDetails' in data.propertyInfo;
        const isCommercialPropertyForVideo = 'propertyInfo' in data && 
          ('saleDetails' in data.propertyInfo || 'rentalDetails' in data.propertyInfo) &&
          !('pgDetails' in data.propertyInfo) && !('flattmatesDetails' in data.propertyInfo);
        const isPGHostelPropertyForVideo = 'propertyInfo' in data && 'pgDetails' in data.propertyInfo;
        const isFlattmatesPropertyForVideo = 'propertyInfo' in data && 'flattmatesDetails' in data.propertyInfo;
        const isResidentialPropertyForVideo = 'propertyInfo' in data && 
          (('saleDetails' in data.propertyInfo) || ('rentalDetails' in data.propertyInfo)) &&
          !isCommercialPropertyForVideo && !isPGHostelPropertyForVideo && !isFlattmatesPropertyForVideo;
        
        const shouldShowVideoToast = !isLandPropertyForVideo && !isCommercialPropertyForVideo && 
                                   !isPGHostelPropertyForVideo && !isFlattmatesPropertyForVideo && !isResidentialPropertyForVideo;
        
        if (shouldShowVideoToast) {
          toast({
            title: "Uploading Video...",
            description: "Please wait while we upload your property video.",
          });
        }

        const videoResult = await uploadSingleFile(
          videoFile,
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
      
      // Ensure we have a valid expected price for database constraint
      let safeExpectedPrice = Number(priceDetails?.expectedPrice ?? 0);
      if (Number.isNaN(safeExpectedPrice) || safeExpectedPrice <= 0) {
        // For rental properties, we need a valid price due to database constraints
        console.warn('Expected price missing or invalid. Setting to 1 to satisfy database constraints.');
        safeExpectedPrice = 1; // Set to 1 instead of 0 to satisfy > 0 constraint
      }
      
      // Generate property name if not provided
      let propertyTitle = '';
      if ('propertyDetails' in data.propertyInfo) {
        propertyTitle = data.propertyInfo.propertyDetails.title || '';
      } else if ('plotDetails' in data.propertyInfo) {
        propertyTitle = data.propertyInfo.plotDetails.title || '';
      }
      
      // If no title provided, generate one based on property details
      if (!propertyTitle || propertyTitle.trim() === '') {
        const nameData = {
          bhkType: ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) 
                   ? data.propertyInfo.propertyDetails.bhkType 
                   : undefined,
          propertyType: ('propertyDetails' in data.propertyInfo) 
                       ? data.propertyInfo.propertyDetails.propertyType 
                       : ('plotDetails' in data.propertyInfo) 
                         ? data.propertyInfo.plotDetails.propertyType 
                         : data.ownerInfo?.propertyType || 'Residential',
          listingType: listingType,
          commercialType: ('propertyDetails' in data.propertyInfo && 'spaceType' in data.propertyInfo.propertyDetails) 
                         ? (data.propertyInfo.propertyDetails as any).spaceType 
                         : undefined,
          landType: ('plotDetails' in data.propertyInfo) 
                   ? data.propertyInfo.plotDetails.landType 
                   : undefined
        };
        propertyTitle = generatePropertyName(nameData);
      }

      const propertyData = {
        user_id: user.id,
        title: propertyTitle,
        property_type: mapPropertyType(('propertyDetails' in data.propertyInfo) ? 
                                     data.propertyInfo.propertyDetails.propertyType : 
                                     ('plotDetails' in data.propertyInfo) ? 
                                     data.propertyInfo.plotDetails.propertyType : 
                                     listingType),
        listing_type: mapListingType(listingType),
        bhk_type: ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? 
                 mapBhkType(data.propertyInfo.propertyDetails.bhkType) : null,
        bathrooms: ('propertyDetails' in data.propertyInfo && 'bathrooms' in data.propertyInfo.propertyDetails) ? 
                  Number(data.propertyInfo.propertyDetails.bathrooms) || 0 : 0,
        balconies: ('propertyDetails' in data.propertyInfo && 'balconies' in data.propertyInfo.propertyDetails) ? 
                  Number(data.propertyInfo.propertyDetails.balconies) || 0 : 0,
        super_area: (() => {
          const area = ('propertyDetails' in data.propertyInfo) ? 
                      (Number(data.propertyInfo.propertyDetails.superBuiltUpArea) || 0) :
                      (('plotDetails' in data.propertyInfo) ? (Number(data.propertyInfo.plotDetails.plotArea) || 0) : 0);
          // Ensure super_area > 0 to satisfy database constraint
          return area > 0 ? area : 1;
        })(),
        carpet_area: null,
        expected_price: safeExpectedPrice,
        state: data.propertyInfo.locationDetails.state || 'Unknown',
        city: data.propertyInfo.locationDetails.city || 'Unknown',
        locality: data.propertyInfo.locationDetails.locality || 'Unknown',
        pincode: data.propertyInfo.locationDetails.pincode || '000000',
        description: data.propertyInfo.additionalInfo.description || null,
        images: imageUrls.map(img => img.url),
        videos: videoUrls,
        availability_type: 'immediate',
        status: 'pending',
        is_featured: true, // Mark all submitted properties as featured candidates
        // Plot area unit for Land/Plot properties
        plot_area_unit: ('plotDetails' in data.propertyInfo) ? 
          (data.propertyInfo.plotDetails.plotAreaUnit || 'sq-ft') : 'sq-ft',
  // Plot-specific fields for Land/Plot properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plot_length: ('plotDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).plotDetails?.plotLength) || null : null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plot_width: ('plotDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).plotDetails?.plotWidth) || null : null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  road_width: ('plotDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).plotDetails?.roadWidth) || null : null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boundary_wall: ('plotDetails' in data.propertyInfo) ? ((data.propertyInfo as any).plotDetails?.boundaryWall || null) : null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ownership_type: ('saleDetails' in (data.propertyInfo as any)) ? ((data.propertyInfo as any).saleDetails?.ownershipType || null) : null,
        // Extra fields for better details rendering
        security_deposit: Number(((data.propertyInfo as any)?.flattmatesDetails?.securityDeposit ?? (data.propertyInfo as any)?.rentalDetails?.securityDeposit ?? (data.propertyInfo as any)?.pgDetails?.securityDeposit) ?? 0) || null,
        // PG/Hostel specific fields for better display compatibility
        expected_rent: ('pgDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).pgDetails.expectedPrice) || null : null,
        expected_deposit: ('pgDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).pgDetails.securityDeposit) || null : null,
        available_from: ((data.propertyInfo as any)?.flattmatesDetails?.availableFrom) || ((data.propertyInfo as any)?.rentalDetails?.availableFrom) || null,
        parking: ((data.propertyInfo as any)?.amenities?.parking) || null,
        age_of_building: (('propertyDetails' in data.propertyInfo) && (data.propertyInfo as any).propertyDetails?.propertyAge) ? (data.propertyInfo as any).propertyDetails.propertyAge : null,
        preferred_tenant: ((data.propertyInfo as any)?.flattmatesDetails?.genderPreference) || ((data.propertyInfo as any)?.rentalDetails?.preferredTenants) || null,
        // Add owner information directly to properties table
        owner_name: data.ownerInfo.fullName || 'Anonymous',
        owner_email: data.ownerInfo.email || '',
        owner_phone: data.ownerInfo.phoneNumber || '',
        // Add amenities data
        amenities: (data.propertyInfo as any).amenities || null
      };

      console.log('Prepared property data for database:', propertyData);

      // Show saving toast only for property types that are not excluded
      const isLandPropertyType = 'propertyInfo' in data && 'plotDetails' in data.propertyInfo;
      const isCommercialPropertyType = 'propertyInfo' in data && 
        ('saleDetails' in data.propertyInfo || 'rentalDetails' in data.propertyInfo) &&
        !('pgDetails' in data.propertyInfo) && !('flattmatesDetails' in data.propertyInfo);
      const isPGHostelPropertyType = 'propertyInfo' in data && 'pgDetails' in data.propertyInfo;
      const isFlattmatesPropertyType = 'propertyInfo' in data && 'flattmatesDetails' in data.propertyInfo;
      const isResidentialPropertyType = 'propertyInfo' in data && 
        (('saleDetails' in data.propertyInfo) || ('rentalDetails' in data.propertyInfo)) &&
        !isCommercialPropertyType && !isPGHostelPropertyType && !isFlattmatesPropertyType;
      
      const shouldShowToast = !isLandPropertyType && !isCommercialPropertyType && 
                             !isPGHostelPropertyType && !isFlattmatesPropertyType && !isResidentialPropertyType;
      
      if (shouldShowToast) {
        toast({
          title: "Saving Property...",
          description: "Almost done! Saving your property listing.",
        });
      }

      // Insert or update property in database
      let error;
      if (isEditMode && editingPropertyId) {
        // Update existing property
        const { error: updateError } = await supabase
          .from('properties')
          .update({
            title: propertyData.title || 'Updated Property',
            property_type: propertyData.property_type,
            listing_type: propertyData.listing_type,
            bhk_type: propertyData.bhk_type,
            expected_price: propertyData.expected_price,
            super_area: propertyData.super_area,
            carpet_area: propertyData.carpet_area,
            bathrooms: propertyData.bathrooms,
            balconies: propertyData.balconies,
            city: propertyData.city || 'Unknown',
            locality: propertyData.locality || 'Unknown',
            state: propertyData.state || 'Unknown',
            pincode: propertyData.pincode || '',
            description: propertyData.description || '',
            images: imageUrls.map(img => img.url),
            videos: videoUrls,
            owner_name: data.ownerInfo.fullName || 'Anonymous',
            owner_email: data.ownerInfo.email || '',
            owner_phone: data.ownerInfo.phoneNumber || '',
            amenities: (window as any).editingPropertyData?.amenities || (data.propertyInfo as any).amenities || null,
            plot_area_unit: propertyData.plot_area_unit,
            // Persist plot-specific fields on update
            plot_length: propertyData.plot_length,
            plot_width: propertyData.plot_width,
            road_width: propertyData.road_width,
            boundary_wall: propertyData.boundary_wall,
            ownership_type: propertyData.ownership_type,
            status: 'pending', // Reset to pending for review - CRITICAL: prevents public visibility
            updated_at: new Date().toISOString(),
            // Additional fields - access from the original property data
            furnishing_status: (window as any).editingPropertyData?.furnishing_status,
            building_type: (window as any).editingPropertyData?.building_type,
            property_age: (window as any).editingPropertyData?.property_age,
            floor_type: (window as any).editingPropertyData?.floor_type,
            total_floors: (window as any).editingPropertyData?.total_floors,
            floor_no: (window as any).editingPropertyData?.floor_no,
            parking_type: (window as any).editingPropertyData?.parking_type,
            on_main_road: (window as any).editingPropertyData?.on_main_road,
            corner_property: (window as any).editingPropertyData?.corner_property,
            commercial_type: (window as any).editingPropertyData?.commercial_type,
            land_type: (window as any).editingPropertyData?.land_type,
            pg_type: (window as any).editingPropertyData?.pg_type,
            room_type: (window as any).editingPropertyData?.room_type,
            flatmates_type: (window as any).editingPropertyData?.flatmates_type
          })
          .eq('id', editingPropertyId)
          .eq('user_id', user.id);
        
        error = updateError;
        
        // Verify the status was actually updated to prevent public visibility
        if (!error) {
          const { data: verifyData, error: verifyError } = await supabase
            .from('properties')
            .select('status')
            .eq('id', editingPropertyId)
            .eq('user_id', user.id)
            .single();
            
          if (verifyError) {
            console.error('Failed to verify property status update:', verifyError);
          } else if (verifyData?.status !== 'pending') {
            console.error('Property status was not properly updated to pending:', verifyData);
            // Force update the status again
            await supabase
              .from('properties')
              .update({ status: 'pending' })
              .eq('id', editingPropertyId)
              .eq('user_id', user.id);
          }

          // Keep property_submissions in sync (title/city/state/payload)
          try {
            const submissionPayload = {
              ...propertyData,
              images: imageUrls.map(img => img.url),
              videos: videoUrls,
              originalFormData: {
                ownerInfo: JSON.parse(JSON.stringify((data as any).ownerInfo)),
                propertyInfo: JSON.parse(JSON.stringify((data as any).propertyInfo))
              }
            };
            const { error: subUpdateErr } = await supabase
              .from('property_submissions')
              .update({
                title: propertyData.title || 'Updated Property',
                city: propertyData.city || 'Unknown',
                state: propertyData.state || 'Unknown',
                updated_at: new Date().toISOString(),
                payload: submissionPayload
              })
              .eq('id', editingPropertyId)
              .eq('user_id', user.id);
            if (subUpdateErr) {
              console.warn('Failed to sync property_submissions, continuing:', subUpdateErr);
            }
          } catch (syncErr) {
            console.warn('Error syncing submission record:', syncErr);
          }
        }
      } else {
        // Insert into BOTH property_submissions (for admin review) AND properties (for immediate public visibility)
        
        // 1. Insert into property_submissions for admin review
        const { data: inserted, error: insertError } = await supabase
          .from('property_submissions')
          .insert({
            user_id: user.id,
            title: propertyData.title || 'New Property Submission',
            city: propertyData.city || 'Unknown',
            state: propertyData.state || 'Unknown', 
            status: 'new',
            payload: {
              ...propertyData,
              images: imageUrls.map(img => img.url),
              videos: videoUrls,
              originalFormData: {
                ownerInfo: JSON.parse(JSON.stringify(data.ownerInfo)),
                propertyInfo: JSON.parse(JSON.stringify(data.propertyInfo))
              }
            }
          })
          .select('id')
          .single();
        
        if (!insertError && inserted?.id) {
          setLastSubmissionId(inserted.id);
        }
        
        error = insertError;

        // 2. Also insert directly into properties table for immediate public visibility
        if (!insertError) {
          const { error: propertiesError } = await supabase
            .from('properties')
            .insert({
              id: inserted.id, // keep the same id as property_submissions for 1:1 mapping
              ...propertyData,
              user_id: user.id, // satisfy RLS: owner must be current user
              status: 'pending', // still pending for admin to review
              is_visible: true,  // immediately visible to public
              is_featured: true  // mark as featured for homepage
            });

          if (propertiesError) {
            console.error('Error inserting into properties table:', propertiesError);
            // Don't fail the entire submission if this fails
          } else {
            console.log('Property successfully inserted into both tables for immediate visibility');
          }
        }
      }

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

      console.log('Property submission created successfully.');

      // Send property listing live email
      try {
        const { sendListingLiveEmail } = await import('@/services/emailService');
        const userEmail = data.ownerInfo.email || user.email;
        const userName = data.ownerInfo.fullName || user.user_metadata?.name || user.email?.split('@')[0] || 'there';
        
        // Get property price for email
        let propertyPrice = 'N/A';
        if ('rentalDetails' in data.propertyInfo) {
          propertyPrice = `₹${Number((data.propertyInfo as any).rentalDetails.expectedPrice).toLocaleString()}`;
        } else if ('saleDetails' in data.propertyInfo) {
          propertyPrice = `₹${Number((data.propertyInfo as any).saleDetails.expectedPrice).toLocaleString()}`;
        } else if ('pgDetails' in data.propertyInfo) {
          propertyPrice = `₹${Number((data.propertyInfo as any).pgDetails.expectedPrice).toLocaleString()}`;
        } else if ('flattmatesDetails' in data.propertyInfo) {
          propertyPrice = `₹${Number((data.propertyInfo as any).flattmatesDetails.expectedPrice).toLocaleString()}`;
        } else if ('commercialSaleDetails' in data.propertyInfo) {
          propertyPrice = `₹${Number((data.propertyInfo as any).commercialSaleDetails.expectedPrice).toLocaleString()}`;
        }

        const bhkDetails = ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) 
          ? data.propertyInfo.propertyDetails.bhkType 
          : 'Property';
        
        const locality = data.propertyInfo.locationDetails.locality || 'Location';
        const phone = data.ownerInfo.phoneNumber || 'Not provided';
        
        await sendListingLiveEmail(userEmail, userName, {
          price: propertyPrice,
          bhkDetails: bhkDetails,
          locality: locality,
          phone: phone,
          id: lastSubmissionId || 'new-property'
        });
        
        console.log('Property listing live email sent successfully');
      } catch (error) {
        console.error('Failed to send property listing live email:', error);
        // Don't block the main flow if email fails
      }

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
        owner_name: data.ownerInfo.fullName || 'Anonymous',
        owner_email: data.ownerInfo.email || '',
        owner_phone: data.ownerInfo.phoneNumber || '',
        title: propertyTitle, // Use the same generated title
        property_type: ('propertyDetails' in data.propertyInfo)
                      ? (data.propertyInfo.propertyDetails.propertyType || 'Residential')
                      : (('plotDetails' in data.propertyInfo)
                        ? (data.propertyInfo.plotDetails.propertyType || 'Land/Plot')
                        : listingType === 'PG/Hostel' ? 'PG/Hostel' : listingType === 'Flatmates' ? 'Flatmates' : 'Commercial'),
        listing_type: priceDetailsDraft?.listingType || 'Sale',
        bhk_type: ('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? 
                 data.propertyInfo.propertyDetails.bhkType : null,
        state: data.propertyInfo.locationDetails.state || 'Unknown',
        city: data.propertyInfo.locationDetails.city || 'Unknown',
        locality: data.propertyInfo.locationDetails.locality || 'Unknown',
        pincode: data.propertyInfo.locationDetails.pincode || '000000',
        expected_price: (priceDetailsDraft?.expectedPrice != null && !Number.isNaN(Number(priceDetailsDraft.expectedPrice))) ? Number(priceDetailsDraft.expectedPrice) : 0,
        status: 'approved'
      };

      const { error: draftError } = await supabase
        .from('property_drafts')
        .insert([ownerData]);

      if (draftError) {
        console.error('Error saving owner info:', draftError);
        // Don't fail the entire submission if owner info save fails
      }

      // Show success toast only for property types that are not excluded
      const isLandProperty = 'propertyInfo' in data && 'plotDetails' in data.propertyInfo;
      const isCommercialProperty = 'propertyInfo' in data && 
        ('saleDetails' in data.propertyInfo || 'rentalDetails' in data.propertyInfo) &&
        !('pgDetails' in data.propertyInfo) && !('flattmatesDetails' in data.propertyInfo);
      const isPGHostelProperty = 'propertyInfo' in data && 'pgDetails' in data.propertyInfo;
      const isFlattmatesProperty = 'propertyInfo' in data && 'flattmatesDetails' in data.propertyInfo;
      const isResidentialProperty = 'propertyInfo' in data && 
        (('saleDetails' in data.propertyInfo) || ('rentalDetails' in data.propertyInfo)) &&
        !isCommercialProperty && !isPGHostelProperty && !isFlattmatesProperty;
      
      const shouldShowSuccessToast = !isLandProperty && !isCommercialProperty && 
                                   !isPGHostelProperty && !isFlattmatesProperty && !isResidentialProperty;
      
      if (shouldShowSuccessToast) {
        toast({
          title: isEditMode ? "Property Updated!" : "Success!",
          description: isEditMode 
            ? "Your property has been updated successfully and is now live."
            : "Your property has been published successfully and is now live on the platform.",
          variant: "success",
        });
      }

      // Stay on the Preview step after submission - no redirect


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
    console.log('renderCurrentStep called with currentStep:', currentStep);
    switch (currentStep) {
      case 'property-selection':
        return (
          <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 pt-20 lg:pt-6">
              <div className="flex justify-center">
                <div className="w-full max-w-5xl flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
                  <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 lg:pl-6">
                    Sell or Rent your Property For Free
                  </h1>
                  <div className="text-gray-600 text-sm lg:text-base">
                    Looking for a property? <Link to="/" className="text-blue-500 cursor-pointer hover:text-blue-600 underline font-medium">Click Here</Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Container - Centered and Compact */}
            <div className="flex justify-center py-4 px-4">
              <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-4 items-start justify-center">
                {/* Left Sidebar - Compact */}
                <div className="hidden lg:block lg:w-80 bg-gray-200 rounded-lg overflow-hidden">
                  <WhyPostSection />
                </div>
                
                {/* Right Form Area - Compact */}
                <div className="w-full lg:flex-1 max-w-2xl mx-auto lg:mx-0 bg-white rounded-lg shadow-sm border border-gray-200 min-h-fit">
                  <PropertySelectionStep onNext={handlePropertySelectionNext} />
                </div>
              </div>
            </div>
            
            {/* Mobile Sidebar - Hidden for mobile-first form experience */}
            <div className="hidden">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <WhyPostSection />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 hidden sm:block">
              <HowItWorksSection />
              <PropertyFAQSection />
            </div>
          </div>
        );
      case 'rental-form':
        return (
          <MultiStepForm 
            onSubmit={handleSubmit as (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'resale-form':
        return (
          <ResaleMultiStepForm 
            onSubmit={handleSubmit as (data: SalePropertyFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'pg-hostel-form':
        return (
          <PGHostelMultiStepForm 
            onSubmit={handleSubmit as (data: PGHostelFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'flatmates-form':
        return (
          <FlattmatesMultiStepForm 
            onSubmit={handleSubmit as (data: FlattmatesFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'commercial-rental-form':
        return (
          <CommercialMultiStepForm 
            onSubmit={handleSubmit as (data: CommercialFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'commercial-sale-form':
        return (
          <CommercialSaleMultiStepForm 
            onSubmit={handleSubmit as (data: CommercialSaleFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'land-plot-form':
        console.log('Rendering LandPlotMultiStepForm');
        return (
          <LandPlotMultiStepForm 
            onSubmit={handleSubmit as (data: LandPlotFormData) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
            listingType={ownerInfo?.listingType as 'Industrial land' | 'Agricultural Land' | 'Commercial land'}
          />
        );
      default:
        return <PropertySelectionStep onNext={handlePropertySelectionNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      <div className="md:pt-16 lg:pt-24">
        {renderCurrentStep()}
      </div>
      {/* Only show Footer on property-selection step */}
      {currentStep === 'property-selection' && <Footer />}
    </div>
  );
};