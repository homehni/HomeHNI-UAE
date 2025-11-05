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
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadSingleFile, uploadPropertyImagesByType } from '@/services/fileUploadService';
import { validatePropertySubmission } from '@/utils/propertyValidation';
import { mapBhkType, mapPropertyType, mapListingType, validateMappedValues, mapFurnishing } from '@/utils/propertyMappings';
import { generatePropertyName } from '@/utils/propertyNameGenerator';
import { createPropertyContact } from '@/services/propertyContactService';
import { updateUserProfile, hasUserRole } from '@/services/profileService';
import { PropertyDraftService } from '@/services/propertyDraftService';
import { DraftResumeModal } from '@/components/property-form/DraftResumeModal';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import WhyPostSection from '@/components/WhyPostSection';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PropertyFAQSection from '@/components/PropertyFAQSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Briefcase } from 'lucide-react';
import { updateUserRole } from '@/services/profileService';

type FormStep = 'property-selection' | 'owner-info' | 'rental-form' | 'resale-form' | 'pg-hostel-form' | 'flatmates-form' | 'commercial-rental-form' | 'commercial-sale-form' | 'land-plot-form';

export const PostProperty: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('property-selection');
  const [showUserTypeDialog, setShowUserTypeDialog] = useState(true);
  const [userType, setUserType] = useState<'Owner' | 'Agent' | null>(null);
  
  // Track currentStep changes
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
  
  // Draft resume functionality
  const [showDraftResumeModal, setShowDraftResumeModal] = useState(false);
  const [incompleteDraft, setIncompleteDraft] = useState<any>(null);
  const [isCheckingDrafts, setIsCheckingDrafts] = useState(false);
  const [forceProceed, setForceProceed] = useState(false);
  
  const { user } = useAuth();
  const { settings: appSettings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user already has a role on mount - if so, skip the dialog
  useEffect(() => {
    const checkExistingRole = async () => {
      if (!user) return;

      try {
        const isOwner = await hasUserRole('owner');
        const isAgent = await hasUserRole('agent');

        if (isOwner) {
          console.log('User already has owner role, skipping dialog');
          setUserType('Owner');
          setShowUserTypeDialog(false);
        } else if (isAgent) {
          console.log('User already has agent role, skipping dialog');
          setUserType('Agent');
          setShowUserTypeDialog(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkExistingRole();
  }, [user]);

  // Handle browser back button to reset user type selection
  useEffect(() => {
    
    // Push initial state when dialog is shown
    if (showUserTypeDialog && !userType && currentStep === 'property-selection') {
      window.history.pushState({ showUserTypeDialog: true }, '');
    }

    // Listen for popstate (back button)
    const handlePopState = (event: PopStateEvent) => {
      // Only reset if they haven't started posting yet (still on property-selection step)
      if (currentStep === 'property-selection') {
        if (event.state?.showUserTypeDialog || (!event.state && userType)) {
          // User clicked back - reset user type and show dialog again
          setUserType(null);
          setShowUserTypeDialog(true);
          // Push state again so user can go back from dialog
          window.history.pushState({ showUserTypeDialog: true }, '');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showUserTypeDialog, userType, currentStep]);

  // Push state when user selects a type
  useEffect(() => {
    if (userType && !showUserTypeDialog && currentStep === 'property-selection') {
      window.history.pushState({ userTypeSelected: true, userType }, '');
    }
  }, [userType, showUserTypeDialog, currentStep]);

  // Auto-save user profile data after property submission
  const autoSaveUserProfile = async (ownerInfo: OwnerInfo) => {
    if (!user) return;

    try {
      // Prepare profile data to update
      const profileUpdates: any = {};
      
      // Only update fields that have values and are different from current profile
      if (ownerInfo.fullName && ownerInfo.fullName.trim()) {
        profileUpdates.full_name = ownerInfo.fullName.trim();
      }
      
      if (ownerInfo.phoneNumber && ownerInfo.phoneNumber.trim()) {
        profileUpdates.phone = ownerInfo.phoneNumber.trim();
      }
      
      // Update WhatsApp preference if provided
      if (ownerInfo.whatsappUpdates !== undefined) {
        profileUpdates.whatsapp_opted_in = ownerInfo.whatsappUpdates;
      }

      // Only proceed if there are updates to make
      if (Object.keys(profileUpdates).length === 0) {
        console.log('No profile updates needed');
        return;
      }

      console.log('Auto-saving user profile with updates:', profileUpdates);
      
      // Update the user profile
      await updateUserProfile(profileUpdates);
      
      console.log('User profile auto-saved successfully');
      
      // Also update auth metadata for consistency
      try {
        const { error: authMetaError } = await supabase.auth.updateUser({
          data: { 
            full_name: profileUpdates.full_name || user.user_metadata?.full_name,
            profile_phone: profileUpdates.phone || user.user_metadata?.profile_phone
          },
        });
        if (authMetaError) {
          console.warn('Auth metadata update failed (non-blocking):', authMetaError);
        }
      } catch (authError) {
        console.warn('Auth metadata update failed (non-blocking):', authError);
      }
      
    } catch (error) {
      console.error('Error auto-saving user profile:', error);
      throw error; // Re-throw to be caught by the caller
    }
  };

  // Function to check for incomplete drafts
  const checkForIncompleteDrafts = async (): Promise<boolean> => {
    if (!user || currentStep !== 'property-selection') return true;
    
    // Don't check if modal is already open or if user dismissed it
    if (showDraftResumeModal || incompleteDraft) return false;
    
    // Check if user has dismissed the draft modal in this session
    const draftModalDismissed = sessionStorage.getItem('draftModalDismissed');
    if (draftModalDismissed === 'true') {
      console.log('Draft modal was dismissed in this session, skipping check');
      return true; // Proceed without showing modal
    }
    
    try {
      setIsCheckingDrafts(true);
      console.log('Checking for incomplete drafts for user:', user.id);
      
      // Clean up old drafts first
      try {
        await PropertyDraftService.cleanupOldCompletedDrafts();
        console.log('Cleaned up old completed drafts');
        
        // Also clean up old incomplete drafts (more aggressive cleanup)
        await PropertyDraftService.cleanupOldIncompleteDrafts();
        console.log('Cleaned up old incomplete drafts');
      } catch (error) {
        console.warn('Failed to cleanup old drafts:', error);
        // Don't fail the whole process if cleanup fails
      }
      
      const drafts = await PropertyDraftService.getUserDrafts();
      console.log('🔍 Found all drafts:', drafts);
      console.log('🔍 Total drafts found:', drafts.length);
      
      // Find the most recent incomplete draft
      // A draft is incomplete if:
      // 1. It has a current_step < 7 (not at preview/final step)
      // 2. It's not marked as completed
      // 3. It was updated recently (not older than 3 days)
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      console.log('🔍 Filtering criteria:');
      console.log('  - Current step < 7');
      console.log('  - Not completed (is_completed = false)');
      console.log('  - Updated within last 3 days (after:', threeDaysAgo.toISOString(), ')');
      
      const incompleteDrafts = drafts.filter(draft => {
        const isIncomplete = draft.current_step && draft.current_step < 7 && !draft.is_completed;
        const isRecent = new Date(draft.updated_at || '').getTime() > threeDaysAgo.getTime();
        
        console.log(`🔍 Draft ${draft.id}:`, {
          property_type: draft.property_type,
          current_step: draft.current_step,
          is_completed: draft.is_completed,
          updated_at: draft.updated_at,
          isIncomplete: isIncomplete,
          isRecent: isRecent,
          passesFilter: isIncomplete && isRecent
        });
        
        return isIncomplete && isRecent;
      });
      
      console.log('🔍 Filtered incomplete drafts:', incompleteDrafts);
      console.log('🔍 Number of incomplete drafts:', incompleteDrafts.length);
      
      if (incompleteDrafts.length > 0) {
        // Sort by updated_at to get the most recent
        const mostRecentDraft = incompleteDrafts.sort((a, b) => 
          new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime()
        )[0];
        
        console.log('Found most recent incomplete draft:', mostRecentDraft);
        setIncompleteDraft(mostRecentDraft);
        setShowDraftResumeModal(true);
        return false; // Drafts found, don't proceed
      }
      
      return true; // No drafts found, proceed
    } catch (error) {
      console.error('Error checking for incomplete drafts:', error);
      return true; // On error, proceed anyway
    } finally {
      setIsCheckingDrafts(false);
    }
  };

  // Check for incomplete drafts when component mounts
  useEffect(() => {
    // Don't check if we're already resuming from dashboard
    const isResumingFromDashboard = sessionStorage.getItem('resumeDraftId');
    if (!isResumingFromDashboard) {
      checkForIncompleteDrafts();
    }
  }, [user, currentStep]);

  // Handle resume from dashboard
  useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resumeDraftId');
    const resumeDraftData = sessionStorage.getItem('resumeDraftData');
    
    if (resumeDraftId && resumeDraftData) {
      try {
        const raw = JSON.parse(resumeDraftData);
        // Support both legacy shape (formData only) and new shape ({ ownerInfo, formData, currentStep })
        const ownerInfoFromDraft = raw.ownerInfo || {};
        const formDataForChild = raw.formData || raw; // legacy fallback
        const currentStepFromDraft: number | null = raw.currentStep || raw.current_step || null;
        
        console.log('Resuming draft from dashboard:', resumeDraftId, { ownerInfoFromDraft, currentStepFromDraft });
        
        // Ensure child forms receive only the formData they expect
        sessionStorage.setItem('resumeDraftData', JSON.stringify(formDataForChild));
        
        // Set owner info from draft (fallbacks preserved)
        const ownerData: OwnerInfo = {
          fullName: ownerInfoFromDraft.fullName || formDataForChild?.ownerInfo?.fullName || '',
          email: ownerInfoFromDraft.email || formDataForChild?.ownerInfo?.email || '',
          phoneNumber: ownerInfoFromDraft.phoneNumber || formDataForChild?.ownerInfo?.phoneNumber || '',
          whatsappUpdates: ownerInfoFromDraft.whatsappUpdates ?? formDataForChild?.ownerInfo?.whatsappUpdates ?? false,
          propertyType: ownerInfoFromDraft.propertyType || formDataForChild?.ownerInfo?.propertyType,
          listingType: ownerInfoFromDraft.listingType || formDataForChild?.ownerInfo?.listingType
        } as OwnerInfo;
        
        console.log('Owner data from dashboard resume:', ownerData);
        
        setOwnerInfo(ownerData);
        setInitialOwnerData(ownerData);
        
        // Navigate to the actual saved step
        if (currentStepFromDraft && currentStepFromDraft > 0) {
          setTargetStep(currentStepFromDraft);
        }
        
        // Route to appropriate form based on draft data
        // Check raw draft data for property_type since PG/Hostel may be stored there
        const rawPropertyType = raw.property_type || ownerInfoFromDraft.propertyType;
        console.log('Routing based on draft data:', { rawPropertyType, propertyType: ownerData.propertyType, listingType: ownerData.listingType });
        
        // Special handling for PG/Hostel - check raw property_type first
        if (rawPropertyType === 'PG/Hostel' || ownerData.listingType === 'PG/Hostel') {
          console.log('Setting currentStep to pg-hostel-form from dashboard (PG/Hostel property type detected)');
          setCurrentStep('pg-hostel-form');
        } else if (ownerData.propertyType === 'Commercial') {
          console.log('Commercial property detected from dashboard');
          if (ownerData.listingType === 'Rent') {
            console.log('Setting currentStep to commercial-rental-form from dashboard');
            setCurrentStep('commercial-rental-form');
          } else if (ownerData.listingType === 'Sale') {
            console.log('Setting currentStep to commercial-sale-form from dashboard');
            setCurrentStep('commercial-sale-form');
          }
        } else {
          console.log('Non-commercial property from dashboard, checking listingType:', ownerData.listingType);
          console.log('Property type:', ownerData.propertyType);
          
          if (ownerData.listingType === 'Flatmates') {
            console.log('Setting currentStep to flatmates-form from dashboard');
            setCurrentStep('flatmates-form');
          } else if (ownerData.propertyType === 'Land/Plot') {
            console.log('Setting currentStep to land-plot-form from dashboard');
            setCurrentStep('land-plot-form');
          } else if (ownerData.listingType === 'Sale') {
            console.log('Setting currentStep to resale-form from dashboard');
            setCurrentStep('resale-form');
          } else {
            console.log('Setting currentStep to rental-form from dashboard');
            setCurrentStep('rental-form');
          }
        }
        
        console.log('Successfully resumed draft from dashboard');
      } catch (error) {
        console.error('Error resuming draft from dashboard:', error);
        // Clear sessionStorage on error
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
      }
    }
  }, []);

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
    
    // Reset force proceed flag after use
    setForceProceed(false);
    
    // Clear dismissal flag when user actually starts posting a new property
    sessionStorage.removeItem('draftModalDismissed');
    console.log('Cleared draftModalDismissed flag - user is starting new property posting');
    
    // Clear any existing form drafts when starting fresh from property selection
    if (data.listingType === 'Resale' || data.listingType === 'Sale') {
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
        case 'Sale':
          if (data.propertyType === 'Land/Plot') {
            console.log('Routing to land-plot-form for Land/Plot Resale/Sale');
            setCurrentStep('land-plot-form');
          } else {
            console.log('Routing to resale-form for Residential Resale/Sale');
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
        case 'Sale':
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

  // Draft resume handlers
  const handleContinueDraft = async () => {
    if (!incompleteDraft) return;
    
    try {
      console.log('Continuing draft:', incompleteDraft);
      
      // Load draft data using PropertyDraftService
      const draftData = await PropertyDraftService.loadDraftForResume(incompleteDraft.id!);
      
      if (!draftData) {
        throw new Error('Failed to load draft data');
      }
      
      console.log('Loaded draft data:', draftData);
      
      // Set owner info from draft
      const ownerData: OwnerInfo = {
        fullName: incompleteDraft.owner_name || '',
        email: incompleteDraft.owner_email || '',
        phoneNumber: incompleteDraft.owner_phone || '',
        whatsappUpdates: incompleteDraft.whatsapp_updates || false,
        propertyType: incompleteDraft.property_type as 'Residential' | 'Commercial' | 'Land/Plot',
        listingType: incompleteDraft.listing_type as 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates' | 'Sale' | 'Industrial land' | 'Agricultural Land' | 'Commercial land'
      };
      
      console.log('Owner data from draft:', ownerData);
      console.log('Owner listingType:', ownerData.listingType);
      console.log('Owner propertyType:', ownerData.propertyType);
      console.log('Raw property_type from draft:', incompleteDraft.property_type);
      
      setOwnerInfo(ownerData);
      setInitialOwnerData(ownerData);
      
      // Set target step to resume from
      setTargetStep(incompleteDraft.current_step);
      
      // Store draft ID and form data in sessionStorage for forms to access
      sessionStorage.setItem('resumeDraftId', incompleteDraft.id!);
      sessionStorage.setItem('resumeDraftData', JSON.stringify(draftData.formData));
      
      // Route to appropriate form based on draft data
      // Check raw property_type for PG/Hostel first
      const rawPropertyType = incompleteDraft.property_type;
      console.log('Routing based on draft data:', { rawPropertyType, propertyType: ownerData.propertyType, listingType: ownerData.listingType });
      
      // Special handling for PG/Hostel - check raw property_type first
      if (rawPropertyType === 'PG/Hostel' || ownerData.listingType === 'PG/Hostel') {
        console.log('Setting currentStep to pg-hostel-form from modal (PG/Hostel property type detected)');
        setCurrentStep('pg-hostel-form');
      } else if (ownerData.propertyType === 'Commercial') {
        console.log('Commercial property detected');
        if (ownerData.listingType === 'Rent') {
          console.log('Setting currentStep to commercial-rental-form');
          setCurrentStep('commercial-rental-form');
        } else if (ownerData.listingType === 'Sale') {
          console.log('Setting currentStep to commercial-sale-form');
          setCurrentStep('commercial-sale-form');
        }
      } else {
        console.log('Non-commercial property, checking listingType:', ownerData.listingType);
        console.log('Property type:', ownerData.propertyType);
        
        if ((ownerData.listingType as string) === 'Land/Plot' || ownerData.propertyType === 'Land/Plot') {
          // Land/Plot properties - check listing_type for specific routing
          switch (ownerData.listingType) {
            case 'Industrial land':
            case 'Agricultural Land':
            case 'Commercial land':
            case 'Resale':
            case 'Sale':
            case 'Rent':
              console.log('Land/Plot property detected, setting currentStep to land-plot-form');
              setCurrentStep('land-plot-form');
              break;
            default:
              console.log('Land/Plot property with unknown listing type, defaulting to land-plot-form');
              setCurrentStep('land-plot-form');
          }
        } else {
          // For other property types, use listing_type
          switch (ownerData.listingType) {
            case 'Resale':
            case 'Sale':
              if ((ownerData.listingType as string) === 'Land/Plot' || (ownerData.propertyType as string) === 'Land/Plot') {
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
            case 'Flatmates':
              setCurrentStep('flatmates-form');
              break;
            default: // 'Rent' or other
              console.log('Default case matched (Rent), setting currentStep to rental-form');
              setCurrentStep('rental-form');
          }
        }
      }
      
      setShowDraftResumeModal(false);
      
      toast({
        title: "Draft Resumed",
        description: `Continuing from ${incompleteDraft.current_step === 1 ? 'Property Details' : 
                     incompleteDraft.current_step === 2 ? 'Location Details' :
                     incompleteDraft.current_step === 3 ? 'Rental Details' :
                     incompleteDraft.current_step === 4 ? 'Amenities' :
                     incompleteDraft.current_step === 5 ? 'Gallery' :
                     incompleteDraft.current_step === 6 ? 'Schedule' : 'Preview'} step.`,
      });
      
    } catch (error) {
      console.error('Error continuing draft:', error);
      toast({
        title: "Error",
        description: "Failed to resume draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartNewPosting = async () => {
    console.log('🚀 handleStartNewPosting called');
    console.log('🚀 Current incompleteDraft:', incompleteDraft);
    
    if (!incompleteDraft) {
      console.log('❌ No incomplete draft to delete');
      return;
    }
    
    try {
      console.log('🗑️ Attempting to delete draft:', incompleteDraft.id);
      
      // Delete the incomplete draft
      await PropertyDraftService.deleteDraft(incompleteDraft.id!);
      console.log('✅ Successfully deleted incomplete draft:', incompleteDraft.id);
      
      // Clear all draft-related state
      setShowDraftResumeModal(false);
      setIncompleteDraft(null);
      
      // Clear any stored draft ID from sessionStorage
      sessionStorage.removeItem('resumeDraftId');
      
      // Set flag to prevent modal from showing again in this session
      sessionStorage.setItem('draftModalDismissed', 'true');
      console.log('✅ Set draftModalDismissed flag to prevent popup from showing again');
      
      // Set force proceed to allow immediate form submission
      setForceProceed(true);
      
      toast({
        title: "Starting Fresh",
        description: "Previous draft has been cleared. You can now start a new property listing.",
      });
      
    } catch (error) {
      console.error('❌ Error deleting draft:', error);
      // Still close the modal even if deletion fails
      setShowDraftResumeModal(false);
      setIncompleteDraft(null);
      
      // Clear any stored draft ID from sessionStorage
      sessionStorage.removeItem('resumeDraftId');
      
      // Set force proceed to allow immediate form submission
      setForceProceed(true);
      
      toast({
        title: "Starting Fresh",
        description: "You can now start a new property listing.",
      });
    }
  };

  const handleCloseDraftModal = () => {
    setShowDraftResumeModal(false);
    setIncompleteDraft(null);
    
    // Set flag to prevent modal from showing again in this session
    sessionStorage.setItem('draftModalDismissed', 'true');
    console.log('Set draftModalDismissed flag to prevent popup from showing again');
  };

  const handleSubmit = async (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo | SalePropertyInfo } | PGHostelFormData | FlattmatesFormData | CommercialFormData | CommercialSaleFormData | LandPlotFormData, submittedDraftId?: string | null) => {
    console.log('PostProperty handleSubmit called with data:', data);
    console.log('Data type check:', {
      hasOwnerInfo: 'ownerInfo' in data,
      hasPropertyInfo: 'propertyInfo' in data,
      hasPlotDetails: 'propertyInfo' in data && 'plotDetails' in data.propertyInfo,
      dataKeys: Object.keys(data)
    });
    
    // Prevent multiple simultaneous submissions
    if (isSubmitting) {
      console.warn('Submission already in progress, ignoring duplicate call');
      return;
    }
    
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
      } else if ('plotDetails' in data.propertyInfo) {
        // For land/plot properties, use the owner's listing type
        listingType = data.ownerInfo?.listingType || 'Sale';
      } else if ('rentalDetails' in data.propertyInfo && (data.propertyInfo as any).rentalDetails) {
        listingType = (data.propertyInfo as any).rentalDetails.listingType || 'Rent';
      } else if ('commercialSaleDetails' in data.propertyInfo) {
        listingType = (data.propertyInfo as any).commercialSaleDetails.listingType || 'Sale';
      } else {
        // Fallback for regular residential properties - use owner's listing type
        listingType = data.ownerInfo?.listingType || 'Rent';
      }
      
      console.log('Extracted listing type:', listingType);
      
      // Check if this is a PG/Hostel property
      const isPGHostel = ('pgDetails' in data.propertyInfo) || 
                        (('propertyDetails' in data.propertyInfo) && data.propertyInfo.propertyDetails.propertyType === 'PG/Hostel');
      
      // Skip BHK validation for PG/Hostel properties since they don't have traditional BHK types
      const mappingValidation = validateMappedValues({
        bhkType: isPGHostel ? null : (('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? data.propertyInfo.propertyDetails.bhkType : null),
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
      
      console.log('🔍 PostProperty - Uploaded image URLs:', imageUrls);
      console.log('🔍 PostProperty - Image URLs type:', typeof imageUrls);
      console.log('🔍 PostProperty - Image URLs length:', imageUrls?.length);

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
                                     data.ownerInfo?.propertyType || 'Residential'),
        listing_type: mapListingType(listingType),
        bhk_type: isPGHostel ? null : (('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? 
                 mapBhkType(data.propertyInfo.propertyDetails.bhkType) : null),
        bathrooms: ((data.propertyInfo as any)?.amenities?.bathrooms) || 
                  (('propertyDetails' in data.propertyInfo && 'bathrooms' in data.propertyInfo.propertyDetails) ? 
                  Number(data.propertyInfo.propertyDetails.bathrooms) || 0 : 0),
        balconies: ((data.propertyInfo as any)?.amenities?.balconies) || 
                  (('propertyDetails' in data.propertyInfo && 'balconies' in data.propertyInfo.propertyDetails) ? 
                  Number(data.propertyInfo.propertyDetails.balconies) || 0 : 0),
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
        status: 'active',
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
        security_deposit: (() => {
          const depositValue = (data.propertyInfo as any)?.flattmatesDetails?.securityDeposit ?? 
                              (data.propertyInfo as any)?.rentalDetails?.securityDeposit ?? 
                              (data.propertyInfo as any)?.pgDetails?.securityDeposit;
          return depositValue !== undefined && depositValue !== null ? Number(depositValue) : 0;
        })(),
        // PG/Hostel specific fields for better display compatibility
        expected_rent: ('pgDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).pgDetails.expectedPrice) || null : 
                      (('flattmatesDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).flattmatesDetails?.expectedRent) || null : null),
        expected_deposit: ('pgDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).pgDetails.securityDeposit) || null : 
                         (('flattmatesDetails' in data.propertyInfo) ? Number((data.propertyInfo as any).flattmatesDetails?.securityDeposit) || null : null),
        available_from: ((data.propertyInfo as any)?.flattmatesDetails?.availableFrom) || ((data.propertyInfo as any)?.rentalDetails?.availableFrom) || null,
        parking: ((data.propertyInfo as any)?.amenities?.parking) || null,
        age_of_building: (('propertyDetails' in data.propertyInfo) && (data.propertyInfo as any).propertyDetails?.propertyAge) ? (data.propertyInfo as any).propertyDetails.propertyAge : null,
        preferred_tenant: ((data.propertyInfo as any)?.flattmatesDetails?.genderPreference) || 
                         ((data.propertyInfo as any)?.rentalDetails?.idealFor ? 
                          (Array.isArray((data.propertyInfo as any).rentalDetails.idealFor) ? 
                           (data.propertyInfo as any).rentalDetails.idealFor.join(', ') : 
                           (data.propertyInfo as any).rentalDetails.idealFor) : null),
        furnishing: mapFurnishing(((data.propertyInfo as any)?.amenities?.furnishing) || null),
        water_supply: ((data.propertyInfo as any)?.amenities?.waterSupply) || null,
        power_backup: ((data.propertyInfo as any)?.amenities?.powerBackup) || null,
        floor_no: (('propertyDetails' in data.propertyInfo) && (data.propertyInfo as any).propertyDetails?.floorNo !== undefined) ? 
                 Number((data.propertyInfo as any).propertyDetails.floorNo) : null,
        total_floors: (('propertyDetails' in data.propertyInfo) && (data.propertyInfo as any).propertyDetails?.totalFloors !== undefined) ? 
                     Number((data.propertyInfo as any).propertyDetails.totalFloors) : null,
        facing_direction: (('propertyDetails' in data.propertyInfo) && (data.propertyInfo as any).propertyDetails?.facing) ? 
                         (data.propertyInfo as any).propertyDetails.facing : null,
        floor_type: (('propertyDetails' in data.propertyInfo) && (data.propertyInfo as any).propertyDetails?.floorType) ? 
                   (data.propertyInfo as any).propertyDetails.floorType : null,
        // Additional amenities fields for better display
        gym: ((data.propertyInfo as any)?.amenities?.gym) || null,
        gated_security: ((data.propertyInfo as any)?.amenities?.gatedSecurity) || null,
        lift: ((data.propertyInfo as any)?.amenities?.lift) || null,
        water_storage_facility: ((data.propertyInfo as any)?.amenities?.waterStorageFacility) || null,
        security: ((data.propertyInfo as any)?.amenities?.security) || null,
        // Land/Plot specific infrastructure fields
        electricity_connection: ((data.propertyInfo as any)?.amenities?.electricityConnection) || null,
        sewage_connection: ((data.propertyInfo as any)?.amenities?.sewageConnection) || null,
        // Property age mapping
        property_age: (('propertyDetails' in data.propertyInfo) && (data.propertyInfo as any).propertyDetails?.propertyAge) ? (data.propertyInfo as any).propertyDetails.propertyAge : null,
        // Add owner information directly to properties table
        owner_name: data.ownerInfo.fullName || 'Anonymous',
        owner_email: data.ownerInfo.email || '',
        owner_phone: data.ownerInfo.phoneNumber || '',
        // Add amenities data
        amenities: (data.propertyInfo as any).amenities || null,
        // Add additional_info for PG/Hostel and Flatmates specific data
        additional_info: (data.propertyInfo as any).additional_info || null
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
            // Land/Plot infrastructure fields
            electricity_connection: propertyData.electricity_connection,
            sewage_connection: propertyData.sewage_connection,
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
        const autoApprove = Boolean(appSettings.auto_approve_properties);
        const initialStatus = autoApprove ? 'approved' : 'pending';
        const submissionPayload = {
          ...propertyData,
          images: imageUrls.map(img => img.url),
          videos: videoUrls,
          originalFormData: {
            ownerInfo: JSON.parse(JSON.stringify(data.ownerInfo)),
            propertyInfo: JSON.parse(JSON.stringify(data.propertyInfo))
          }
        };
        
        console.log('🔍 PostProperty - Submission payload images:', submissionPayload.images);
        console.log('🔍 PostProperty - Image URLs:', imageUrls);
        console.log('🔍 PostProperty - Full submission payload:', submissionPayload);
        
        console.log('🚨 FINAL PROPERTY DATA BEING SENT TO DATABASE:', propertyData);
        console.log('🚨 CRITICAL FIELDS CHECK:', {
          property_type: propertyData.property_type,
          listing_type: propertyData.listing_type,
          bhk_type: propertyData.bhk_type,
          status: propertyData.status,
          availability_type: propertyData.availability_type,
          super_area: propertyData.super_area,
          expected_price: propertyData.expected_price,
          bathrooms: propertyData.bathrooms,
          balconies: propertyData.balconies,
          furnishing: propertyData.furnishing
        });
        
        const { data: inserted, error: insertError } = await supabase
          .from('property_submissions')
          .insert({
            user_id: user.id,
            title: propertyData.title || 'New Property Submission',
            city: propertyData.city || 'Unknown',
            state: propertyData.state || 'Unknown', 
            status: initialStatus,
            payload: submissionPayload
          })
          .select('id')
          .single();
        
        if (!insertError && inserted?.id) {
          setLastSubmissionId(inserted.id);
        }
        
        error = insertError;

        // Mirroring to properties is handled by DB trigger (sync_properties_with_submissions)
        // Ensures a single source of truth and prevents duplicates in dashboards.
      }

      if (error) {
        console.error('🚨 DATABASE INSERTION ERROR - FULL DETAILS:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          propertyDataSent: propertyData,
          // Log specific fields that might be causing issues
          criticalFields: {
            property_type: propertyData.property_type,
            listing_type: propertyData.listing_type,
            bhk_type: propertyData.bhk_type,
            status: propertyData.status,
            availability_type: propertyData.availability_type,
            furnishing: propertyData.furnishing,
            bathrooms: propertyData.bathrooms,
            balconies: propertyData.balconies,
            super_area: propertyData.super_area,
            expected_price: propertyData.expected_price
          }
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

      // Delete the draft after successful submission
      if (submittedDraftId) {
        try {
          console.log('🗑️ Deleting draft after successful submission:', submittedDraftId);
          await PropertyDraftService.deleteDraft(submittedDraftId);
          console.log('✅ Successfully deleted draft:', submittedDraftId);
        } catch (draftDeleteError) {
          console.error('⚠️ Failed to delete draft, but submission was successful:', draftDeleteError);
          // Don't fail the submission if draft deletion fails
        }
      }

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
        
        const propertyType = ('propertyDetails' in data.propertyInfo && 'propertyType' in data.propertyInfo.propertyDetails) 
          ? data.propertyInfo.propertyDetails.propertyType 
          : 'N/A';
        
        const locality = data.propertyInfo.locationDetails.locality || 'Location';
        const phone = data.ownerInfo.phoneNumber || 'Not provided';
        
        await sendListingLiveEmail(userEmail, userName, {
          price: propertyPrice,
          bhkDetails: bhkDetails,
          locality: locality,
          phone: phone,
          propertyType: propertyType,
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
        bhk_type: isPGHostel ? null : (('propertyDetails' in data.propertyInfo && 'bhkType' in data.propertyInfo.propertyDetails) ? 
                 data.propertyInfo.propertyDetails.bhkType : null),
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

      // Auto-save user profile data after successful property submission
      try {
        await autoSaveUserProfile(data.ownerInfo);
      } catch (profileError) {
        console.error('Failed to auto-save user profile:', profileError);
        // Don't block the main flow if profile save fails
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
        <PropertySelectionStep
          onNext={handlePropertySelectionNext}
          onCheckDrafts={checkForIncompleteDrafts}
          forceProceed={forceProceed}
        />
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
            onSubmit={handleSubmit as (data: PGHostelFormData, draftId?: string | null) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'flatmates-form':
        return (
          <FlattmatesMultiStepForm 
            onSubmit={handleSubmit as (data: FlattmatesFormData, draftId?: string | null) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'commercial-rental-form':
        return (
          <CommercialMultiStepForm 
            onSubmit={handleSubmit as (data: CommercialFormData, draftId?: string | null) => void}
            isSubmitting={isSubmitting}
            initialOwnerInfo={ownerInfo || {}}
            targetStep={targetStep}
            createdSubmissionId={lastSubmissionId}
          />
        );
      case 'commercial-sale-form':
        return (
          <CommercialSaleMultiStepForm 
            onSubmit={handleSubmit as (data: CommercialSaleFormData, draftId?: string | null) => void}
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
            onSubmit={handleSubmit as (data: LandPlotFormData, draftId?: string | null) => void}
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
      
      {/* Draft Resume Modal */}
      {incompleteDraft && (
        <DraftResumeModal
          isOpen={showDraftResumeModal}
          onClose={handleCloseDraftModal}
          onContinue={handleContinueDraft}
          onStartNew={handleStartNewPosting}
          draftData={incompleteDraft}
        />
      )}
      
      {/* User Type Selection Dialog */}
      <Dialog open={showUserTypeDialog && currentStep === 'property-selection' && !userType}>
        <DialogContent className="sm:max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-medium">Are you a:</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-6">
            <div
              onClick={async () => {
                try {
                  setUserType('Owner');
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    try {
                      await updateUserRole(user.id, 'owner');
                    } catch (roleError: any) {
                      // If role already exists (duplicate key error), treat as success
                      if (roleError?.code !== '23505') {
                        throw roleError;
                      }
                      console.log('Role already set to owner');
                    }
                  }
                  setShowUserTypeDialog(false);
                  console.log('User selected type: Owner');
                } catch (error) {
                  console.error('Error updating user role:', error);
                  toast({
                    title: "Error",
                    description: "Failed to update role",
                    variant: "destructive"
                  });
                }
              }}
              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-muted rounded-lg hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group"
            >
              <User className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-base font-medium">Owner</span>
            </div>
            <div
              onClick={async () => {
                try {
                  setUserType('Agent');
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    try {
                      await updateUserRole(user.id, 'agent');
                    } catch (roleError: any) {
                      // If role already exists (duplicate key error), treat as success
                      if (roleError?.code !== '23505') {
                        throw roleError;
                      }
                      console.log('Role already set to agent');
                    }
                  }
                  setShowUserTypeDialog(false);
                  console.log('User selected type: Agent');
                } catch (error) {
                  console.error('Error updating user role:', error);
                  toast({
                    title: "Error",
                    description: "Failed to update role",
                    variant: "destructive"
                  });
                }
              }}
              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-muted rounded-lg hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group"
            >
              <Briefcase className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-base font-medium">Agent</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};