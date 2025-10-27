import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { PropertyReviewModal } from '@/components/admin/PropertyReviewModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { mapBhkType, mapPropertyType, mapListingType, mapFurnishing } from '@/utils/propertyMappings';
 
// Property submission interface for new table
interface PropertySubmission {
  id: string;
  title: string;
  city: string;
  state: string;
  status: string;
  payload: PropertyPayload;
  created_at: string;
  user_id?: string;
  // Add fields that PropertyTable expects
  property_type?: string;
  listing_type?: string;
  bhk_type?: string;
  locality?: string;
  expected_price?: number;
  super_area?: number;
  description?: string;
  images?: string[];
  rejection_reason?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_role?: string;
  is_featured?: boolean;
  is_edited?: boolean;
  is_visible?: boolean;
  updated_at?: string;
  rental_status?: 'available' | 'inactive' | 'rented' | 'sold';
}

interface PropertyPayload {
  property_type?: string;
  propertyType?: string; // camelCase version
  listing_type?: string;
  listingType?: string; // camelCase version
  bhk_type?: string;
  bhkType?: string; // camelCase version
  locality?: string;
  expected_price?: number;
  super_area?: number;
  description?: string;
  images?: string[];
  rejection_reason?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_role?: string;
  is_featured?: boolean;
  is_visible?: boolean;
  state?: string;
  city?: string;
  street_address?: string;
  pincode?: string;
  carpet_area?: number;
  availability_type?: string;
  videos?: string[];
  ownerInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string; // Alternative field name
    role?: string;
  };
  propertyInfo?: {
    propertyDetails?: Record<string, unknown>;
    saleDetails?: Record<string, unknown>;
    rentalDetails?: Record<string, unknown>;
    additionalInfo?: Record<string, unknown>;
    amenities?: Record<string, unknown>;
  };
  originalFormData?: {
    ownerInfo?: {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      role?: string;
    };
    propertyInfo?: {
      propertyDetails?: Record<string, unknown>;
      saleDetails?: Record<string, unknown>;
      rentalDetails?: Record<string, unknown>;
      additionalInfo?: Record<string, unknown>;
      amenities?: Record<string, unknown>;
    };
  };
  [key: string]: unknown; // For additional properties
}

const AdminProperties = () => {
  const [properties, setProperties] = useState<PropertySubmission[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertySubmission | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rentalStatusFilter, setRentalStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [newPropertyCount, setNewPropertyCount] = useState(0);
  const [lastViewedTime, setLastViewedTime] = useState<string>(new Date().toISOString());
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [propertiesToBulkDelete, setPropertiesToBulkDelete] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deleted: 0,
    featuredPending: 0,
    rented: 0,
    sold: 0
  });

  const { toast } = useToast();

  // Get location to parse URL parameters
  const location = useLocation();
  
  // Define fetchProperties with useCallback
  const fetchProperties = useCallback(async () => {
    try {
      // Fetch only property submissions (properties table is auto-synced via trigger)
      const submissionsResult = await supabase
        .from('property_submissions')
        .select('*, rental_status')
        .order('created_at', { ascending: false });

      if (submissionsResult.error) throw submissionsResult.error;

      // Transform submissions to match PropertyTable interface
      const transformedSubmissions = submissionsResult.data?.map(submission => {
        // Parse the payload if it's a string
        let payload: Record<string, unknown> = {};
        try {
          payload = typeof submission.payload === 'string' 
            ? JSON.parse(submission.payload) 
            : submission.payload || {};
        } catch (e) {
          console.warn('Error parsing payload for submission:', submission.id, e);
          payload = {};
        }
        
        return {
          ...submission,
          property_type: payload?.property_type as string || 'Unknown',
          listing_type: payload?.listing_type as string || 'Unknown',
          bhk_type: payload?.bhk_type as string || '',
          locality: payload?.locality as string || 'Unknown',
          expected_price: payload?.expected_price as number || 0,
          super_area: payload?.super_area as number || 0,
          description: payload?.description as string || '',
          images: payload?.images as string[] || [],
          rejection_reason: payload?.rejection_reason as string || '',
          owner_name: payload?.owner_name as string || 'Unknown',
          owner_email: payload?.owner_email as string || '',
          owner_phone: payload?.owner_phone as string || '',
          owner_role: payload?.owner_role as string || 'Owner',
          is_featured: payload?.is_featured as boolean || false,
          is_visible: payload?.is_visible !== false // Default to true unless explicitly false
        };
      }) || [];

      setProperties(transformedSubmissions as PropertySubmission[]);
      
      // Calculate stats based on submissions data
      const total = transformedSubmissions?.length || 0;
      const pending = transformedSubmissions?.filter(p => p.status === 'new').length || 0;
      const approved = transformedSubmissions?.filter(p => p.status === 'approved').length || 0;
      const rejected = transformedSubmissions?.filter(p => p.status === 'rejected').length || 0;
      const deleted = transformedSubmissions?.filter(p => p.status === 'deleted').length || 0;
      const featuredPending = 0;
      const rented = transformedSubmissions?.filter(p => p.rental_status === 'rented').length || 0;
      const sold = transformedSubmissions?.filter(p => p.rental_status === 'sold').length || 0;

      setStats({ total, pending, approved, rejected, deleted, featuredPending, rented, sold });
    } catch (error) {
      console.error('Error fetching property submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch property submissions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Define filterProperties with useCallback
  const filterProperties = useCallback(() => {
    let filtered = properties;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status (map 'pending' to 'new' for submissions)
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        filtered = filtered.filter(property => property.status === 'new');
      } else if (statusFilter === 'edited-recently') {
        // Show only edited properties
        filtered = filtered.filter(property => property.is_edited === true);
      } else {
        filtered = filtered.filter(property => property.status === statusFilter);
      }
    }
    
    // Filter by rental status
    if (rentalStatusFilter !== 'all') {
      filtered = filtered.filter(property => property.rental_status === rentalStatusFilter);
    }

    // Filter by featured status
    if (featuredFilter) {
      filtered = filtered.filter(property => property.is_featured === true);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter, rentalStatusFilter, featuredFilter]);
  
  // Initialize filters from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const statusParam = searchParams.get('status');
    const rentalStatusParam = searchParams.get('rentalstatus');
    
    if (statusParam) {
      setStatusFilter(statusParam);
    }
    
    if (rentalStatusParam) {
      setRentalStatusFilter(rentalStatusParam);
    }
  }, [location]);

  useEffect(() => {
    fetchProperties();
    
    // Set up real-time subscription for property submission changes
    const channel = supabase
      .channel('property-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_submissions'
        },
        (payload) => {
          const newSubmission = payload.new as PropertySubmission;
          
          // Show real-time notification for new property submission
          toast({
            title: '🎉 New Property Submitted!',
            description: `"${newSubmission.title}" needs review`,
            duration: 6000,
          });
          
          // Update property count and refresh list
          setNewPropertyCount(prev => prev + 1);
          fetchProperties();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'property_submissions'
        },
        (payload) => {
          // Refresh list for updates (status changes, etc.)
          fetchProperties();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, fetchProperties]);

  useEffect(() => {
    filterProperties();
  }, [filterProperties]);

  const handleApprove = async (propertyId: string) => {
    setActionLoading(true);
    try {
      // Check if current user has admin role
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('User not authenticated');
      }

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.user.id);
      
      const isAdmin = userRoles?.some(r => r.role === 'admin');
      console.log('Current user admin status:', isAdmin);
      
      if (!isAdmin) {
        throw new Error('Only administrators can approve property submissions');
      }

      // Check if this is an edited property or a new submission
      const property = properties.find(p => p.id === propertyId);
      const isEditedProperty = property?.is_edited;

      if (isEditedProperty) {
        // Handle edited property approval - update the properties table
        const { error } = await supabase
          .from('properties')
          .update({
            status: 'approved',
            admin_reviewed_at: new Date().toISOString(),
            rejection_reason: null
          })
          .eq('id', propertyId);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Edited property approved successfully'
        });
      } else {
        // Handle new submission approval - existing logic
        // First, get the submission data
        const { data: submission, error: fetchError } = await supabase
          .from('property_submissions')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (fetchError) {
          console.error('Error fetching submission:', fetchError);
          throw fetchError;
        }

      // Parse the payload
      let payload: PropertyPayload = {};
      try {
        payload = typeof submission.payload === 'string' 
          ? JSON.parse(submission.payload) 
          : submission.payload || {};
      } catch (e) {
        console.warn('Error parsing payload for approval:', e);
        payload = {};
      }

      // Ensure we have a user_id to assign (fallback to current admin if submission has none)
      const { data: authUser } = await supabase.auth.getUser();
      let userIdToAssign = submission.user_id || authUser.user?.id;
      
      // If submission doesn't have user_id, try to get it from properties table (for rejected properties)
      if (!userIdToAssign || userIdToAssign === authUser.user?.id) {
        console.log('Submission user_id not found, checking properties table for original owner...');
        const { data: existingProperty } = await supabase
          .from('properties')
          .select('user_id')
          .eq('id', propertyId)
          .single();
        
        if (existingProperty?.user_id) {
          userIdToAssign = existingProperty.user_id;
          console.log('Found original owner in properties table:', userIdToAssign);
        }
      }
      
      if (!userIdToAssign) {
        throw new Error('Approval requires an authenticated admin user.');
      }

      // Map values to satisfy DB CHECK constraints
      const mappedPropertyType = mapPropertyType(payload.property_type || payload.propertyType || '');
      const mappedListingType = mapListingType(payload.listing_type || payload.listingType || '');
      const mappedBhkRaw = mapBhkType(payload.bhk_type || payload.bhkType || '');
      const allowedBhk = new Set(['studio','1rk','1bhk','2bhk','3bhk','4bhk','5bhk','6bhk','7bhk','8bhk','9bhk','10bhk']);
      const bhkValue = allowedBhk.has(mappedBhkRaw) ? mappedBhkRaw : null;

      // Insert into main properties table for homepage display
      console.log('Attempting to insert property with user_id:', userIdToAssign);

      // Normalize images from submission payload to string public URLs
      const resolveUrlFromString = (raw?: string): string | null => {
        if (!raw) return null;
        const s = String(raw).trim();
        if (/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
        const cleaned = s
          .replace(/^\/?storage\/v1\/object\/public\/property-media\//i, '')
          .replace(/^property-media\//i, '')
          .replace(/^public\//i, '');
        try {
          const { data } = supabase.storage.from('property-media').getPublicUrl(cleaned);
          return data.publicUrl || null;
        } catch {
          return null;
        }
      };
      const imagesNormalized: string[] = Array.isArray(payload.images)
        ? (payload.images as any[])
            .map((img: any) => {
              if (typeof img === 'string') return resolveUrlFromString(img);
              if (img && typeof img === 'object') {
                return resolveUrlFromString(img.url || img.publicUrl || img.path || img.name);
              }
              return null;
            })
            .filter(Boolean) as string[]
        : [];

      // Extract additional details from form data stored in payload
      const originalFormData = payload.originalFormData || {};
      const propertyDetails = originalFormData.propertyInfo?.propertyDetails || {};
      const saleDetails = originalFormData.propertyInfo?.saleDetails || {};
      const rentalDetails = originalFormData.propertyInfo?.rentalDetails || {};
      const additionalInfo = originalFormData.propertyInfo?.additionalInfo || {};
      const amenities = originalFormData.propertyInfo?.amenities || {};
      
      console.log('Mapping property data:', {
        propertyDetails,
        saleDetails, 
        amenities,
        additionalInfo
      });
      
      console.log('Bathrooms data:', {
        'propertyDetails.bathrooms': propertyDetails.bathrooms,
        'payload.bathrooms': payload.bathrooms,
        'amenities.bathrooms': amenities.bathrooms
      });

      // Generate proper title with consistent casing
      const propertyTitle = (() => {
        // Generate proper title for land properties based on listing type from ownerInfo
        const ownerInfo = originalFormData.ownerInfo;
        
        // First check if there's an existing title we can use (prevents duplication)
        if (submission.title) {
          console.log('Using existing submission title:', submission.title);
          return submission.title;
        }
        
        // Check if this is a land property and generate appropriate title
        if (mappedPropertyType.toLowerCase().includes('land')) {
          // Use consistent casing for sale/Sale to prevent duplicates
          const saleText = mappedListingType.toLowerCase() === 'sale' ? 'Sale' : 'Rent';
          
          const propertyTypeMap: { [key: string]: string } = {
            'industrial land': `Industrial Land For ${saleText}`,
            'agricultural land': `Agricultural Land For ${saleText}`,
            'commercial land': `Commercial Land For ${saleText}`
          };
          const normalized = mappedPropertyType.toLowerCase();
          const generatedTitle = propertyTypeMap[normalized];
          if (generatedTitle) {
            console.log('Generated title for land property:', generatedTitle);
            return generatedTitle;
          }
        }
        // Fallback to existing title logic
        return submission.title || payload.title || 'Untitled Property';
      })();

      // Use upsert to handle both new and existing properties (prevents duplicates, handles rejected re-approvals)
      const { data: insertedProperty, error: insertError } = await supabase
        .from('properties')
        .upsert({
          id: propertyId, // Include ID for upsert to work correctly
          user_id: userIdToAssign,
          title: propertyTitle as string,
          property_type: mappedPropertyType,
          listing_type: mappedListingType,
          bhk_type: bhkValue,
          
          // Enhanced property details mapping
          furnishing: mapFurnishing(String(payload.furnishing || amenities.furnishing || '')),
          availability_type: (payload.availability_type as string) || 'immediate',
          
          // NEW: Additional property characteristics
          property_age: String(propertyDetails.propertyAge || saleDetails.propertyAge || ''),
          facing_direction: String(propertyDetails.facing || ''),
          floor_type: String(propertyDetails.floorType || ''),
          registration_status: String(saleDetails.registrationStatus || ''),
          
          // Location details
          state: submission.state || payload.state || '',
          city: submission.city || payload.city || '',
          locality: payload.locality || '',
          street_address: payload.street_address || '',
          pincode: payload.pincode || '',
          landmarks: String(payload.landmarks || additionalInfo.directionsTip || ''),
          
          // Property specifications
          description: String(payload.description || additionalInfo.description || ''),
          bathrooms: Number(propertyDetails.bathrooms || payload.bathrooms || amenities.bathrooms || 0),
          balconies: Number(propertyDetails.balconies || payload.balconies || amenities.balcony || 0),
          floor_no: Number(propertyDetails.floorNo || payload.floor_no || 0) || null,
          total_floors: Number(propertyDetails.totalFloors || payload.total_floors || 0) || null,
          super_area: Math.max(Number(payload.super_area || propertyDetails.superBuiltUpArea) || 0, 1),
          carpet_area: Number(payload.carpet_area || 0) || null,
          
          // Financial details
          availability_date: String(payload.availability_date || saleDetails.possessionDate || rentalDetails.availableFrom || ''),
          expected_price: Math.max(Number(payload.expected_price || saleDetails.expectedPrice || rentalDetails.expectedPrice) || 1, 1),
          price_negotiable: payload.price_negotiable !== false,
          maintenance_charges: Math.max(Number(payload.maintenance_charges || saleDetails.maintenanceCharges || rentalDetails.maintenanceCharges) || 0, 0),
          // Security deposit only for rental properties, not for sale/land properties
          security_deposit: mappedListingType === 'Rent' ? Math.max(Number(payload.security_deposit || rentalDetails.securityDeposit) || 0, 0) : 0,
          
          // NEW: Additional financial and service details
          booking_amount: Math.max(Number(saleDetails.bookingAmount) || 0, 0),
          home_loan_available: saleDetails.homeLoanAvailable === true || saleDetails.homeLoanAvailable === 'Yes',
          
          // NEW: Property services and amenities
          water_supply: String(amenities.waterSupply || ''),
          power_backup: String(amenities.powerBackup || ''),
          gated_security: amenities.gatedSecurity === true || amenities.gatedSecurity === 'Yes' || amenities.gatedSecurity === 'yes',
          who_will_show: String(amenities.whoWillShow || additionalInfo.whoWillShow || ''),
          current_property_condition: String(amenities.currentPropertyCondition || ''),
          secondary_phone: String(additionalInfo.secondaryNumber || ''),
          
          // NEW: Store amenities and documents as JSON
          amenities: {
            // Original amenities
            gym: amenities.gym,
            clubHouse: amenities.clubHouse,
            swimmingPool: amenities.swimmingPool,
            lift: amenities.lift,
            intercom: amenities.intercom,
            sewageTreatmentPlant: amenities.sewageTreatmentPlant,
            fireSafety: amenities.fireSafety,
            shoppingCenter: amenities.shoppingCenter,
            childrenPlayArea: amenities.childrenPlayArea,
            visitorParking: amenities.visitorParking,
            gasPipeline: amenities.gasPipeline,
            park: amenities.park,
            internetProvider: amenities.internetProvider,
            // "What You Get" section amenities
            powerBackup: amenities.powerBackup,
            parking: amenities.parking,
            waterStorageFacility: amenities.waterStorageFacility,
            security: amenities.security,
            wifi: amenities.wifi,
            currentPropertyCondition: amenities.currentPropertyCondition
          } as any,
          additional_documents: {
            allotmentLetter: additionalInfo.allotmentLetter,
            saleDeedCertificate: additionalInfo.saleDeedCertificate,
            propertyTaxPaid: additionalInfo.propertyTaxPaid,
            occupancyCertificate: additionalInfo.occupancyCertificate
          } as any,
          
          // Media
          images: imagesNormalized,
          videos: payload.videos || [],
          
          // Owner information
          owner_name: payload.owner_name || originalFormData.ownerInfo?.fullName || '',
          owner_email: payload.owner_email || originalFormData.ownerInfo?.email || '',
          owner_phone: payload.owner_phone || originalFormData.ownerInfo?.phoneNumber || '',
          owner_role: payload.owner_role || originalFormData.ownerInfo?.role || 'Owner',
          
          status: 'approved',
          is_featured: payload.is_featured || false,
          admin_reviewed_at: new Date().toISOString(),
          admin_reviewed_by: currentUser.user.id
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting property:', insertError);
        console.error('Insert error details:', JSON.stringify(insertError, null, 2));
        throw insertError;
      }

      console.log('Property inserted successfully:', insertedProperty);

      // Find the next available property key in content_elements
      const { data: existingElements } = await supabase
        .from('content_elements')
        .select('element_key')
        .eq('page_location', 'homepage')
        .eq('section_location', 'featured_properties')
        .eq('element_type', 'featured_property')
        .like('element_key', 'property_%')
        .order('sort_order', { ascending: true });

      // Find the highest property number
      let nextPropertyNumber = 20; // Start from property_20
      if (existingElements) {
        const propertyNumbers = existingElements
          .map(el => {
            const match = el.element_key.match(/^property_(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter(num => num > 0);
        
        if (propertyNumbers.length > 0) {
          nextPropertyNumber = Math.max(...propertyNumbers) + 1;
        }
      }

      // Add to content_elements table
      const contentElement = {
        element_type: 'featured_property',
        element_key: `property_${nextPropertyNumber}`,
        title: insertedProperty.title,
        content: {
          id: insertedProperty.id,
          title: insertedProperty.title,
          price: `₹${insertedProperty.expected_price}`,
          location: insertedProperty.locality || '',
          propertyType: insertedProperty.property_type,
          bhk: insertedProperty.bhk_type,
          size: `${insertedProperty.super_area} sq ft`,
          image: insertedProperty.images?.[0] || '/placeholder.svg'
        },
        images: insertedProperty.images || [],
        sort_order: nextPropertyNumber,
        is_active: true,
        page_location: 'homepage',
        section_location: 'featured_properties',
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error: contentError } = await supabase
        .from('content_elements')
        .insert(contentElement);

      if (contentError) {
        console.error('Error adding to content_elements:', contentError);
        // Don't fail the entire operation if content_elements insert fails
        toast({
          title: 'Success',
          description: 'Property approved successfully (content element creation failed)'
        });
      } else {
        toast({
          title: 'Success',
          description: 'Property approved and added to featured properties'
        });
      }

      // Update submission status
      const { error: updateError } = await supabase
        .from('property_submissions')
        .update({
          status: 'approved'
        })
        .eq('id', propertyId);

      if (updateError) throw updateError;

        setReviewModalOpen(false);
        fetchProperties();
      }
    } catch (error) {
      console.error('Error approving property submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve property submission',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (propertyId: string, reason: string) => {
    setActionLoading(true);
    try {
      // Check if this is an edited property or a new submission
      const property = properties.find(p => p.id === propertyId);
      const isEditedProperty = property?.is_edited;

      if (isEditedProperty) {
        // Handle edited property rejection - update the properties table
        const { error } = await supabase
          .from('properties')
          .update({
            status: 'rejected',
            rejection_reason: reason,
            admin_reviewed_at: new Date().toISOString()
          })
          .eq('id', propertyId);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Edited property rejected successfully'
        });
      } else {
        // Handle new submission rejection - existing logic
        // Parse existing payload and add rejection reason
        let updatedPayload: any = {};
        try {
          updatedPayload = typeof selectedProperty?.payload === 'string' 
            ? JSON.parse(selectedProperty.payload) 
            : selectedProperty?.payload || {};
        } catch (e) {
          console.warn('Error parsing payload for rejection:', e);
          updatedPayload = {};
        }
        
        updatedPayload.rejection_reason = reason;
        
        const { error } = await supabase
          .from('property_submissions')
          .update({
            status: 'rejected',
            payload: JSON.stringify(updatedPayload)
          })
          .eq('id', propertyId);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Property submission rejected successfully'
        });
      }

      setReviewModalOpen(false);
      fetchProperties();
    } catch (error) {
      console.error('Error rejecting property submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject property submission',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    setActionLoading(true);
    try {
      // First, get the submission to find associated property if approved
      const { data: submission } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('id', propertyToDelete)
        .single();

      if (submission?.status === 'approved') {
        // Find and delete from main properties table using title match
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('title', submission.title)
          .eq('city', submission.city)
          .eq('state', submission.state);

        if (properties && properties.length > 0) {
          const propertyId = properties[0].id;
          
          // Delete from properties table
          await supabase
            .from('properties')
            .delete()
            .eq('id', propertyId);

          // Delete from content_elements (featured properties)
          await supabase
            .from('content_elements')
            .delete()
            .eq('element_type', 'featured_property')
            .like('content', `%"id":"${propertyId}"%`);

          // Also delete type-specific featured entries
          await supabase
            .from('content_elements')
            .delete()
            .eq('element_type', 'featured_property')
            .like('content', `%"id":"${propertyId}"%`);
        }
      }

      // Delete the submission
      const { error } = await supabase
        .from('property_submissions')
        .delete()
        .eq('id', propertyToDelete);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Property deleted successfully from all locations'
      });

      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property completely',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;

    // Show confirmation modal
    setPropertiesToBulkDelete(selectedIds);
    setBulkDeleteModalOpen(true);
  };

  const handleBulkAddToFeatured = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;

    setBulkActionLoading(true);
    try {
      // First, update the properties to set is_featured = true
      const { error: updateError } = await supabase
        .from('properties')
        .update({ is_featured: true })
        .in('id', selectedIds);

      if (updateError) throw updateError;

      // Then, insert into featured_properties table (with conflict handling)
      const featuredRecords = selectedIds.map(propertyId => ({
        property_id: propertyId,
        is_active: true,
        sort_order: 0
      }));

      const { error: insertError } = await supabase
        .from('featured_properties')
        .upsert(featuredRecords, { 
          onConflict: 'property_id',
          ignoreDuplicates: false 
        });

      if (insertError) throw insertError;

      toast({
        title: 'Success',
        description: `${selectedIds.length} propert${selectedIds.length === 1 ? 'y' : 'ies'} added to featured`,
      });

      // Clear selection and refresh
      setSelectedProperties([]);
      await fetchProperties();
    } catch (error) {
      console.error('Error adding properties to featured:', error);
      toast({
        title: 'Error',
        description: 'Failed to add properties to featured',
        variant: 'destructive'
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (propertiesToBulkDelete.length === 0) return;

    setBulkActionLoading(true);
    try {
      // Check if current user has admin role
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('User not authenticated');
      }

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.user.id);
      
      const isAdmin = userRoles?.some(r => r.role === 'admin');
      
      if (!isAdmin) {
        throw new Error('Only administrators can delete properties');
      }

      // Process each selected property
      const deletePromises = propertiesToBulkDelete.map(async (propertyId) => {
        // First, get the submission to find associated property if approved
        const { data: submission } = await supabase
          .from('property_submissions')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (submission?.status === 'approved') {
          // Find and delete from main properties table using title match
          const { data: properties } = await supabase
            .from('properties')
            .select('id')
            .eq('title', submission.title)
            .eq('city', submission.city)
            .eq('state', submission.state);

          if (properties && properties.length > 0) {
            const propertyId = properties[0].id;
            
            // Delete from properties table
            await supabase
              .from('properties')
              .delete()
              .eq('id', propertyId);

            // Delete from content_elements (featured properties)
            await supabase
              .from('content_elements')
              .delete()
              .eq('element_type', 'featured_property')
              .like('content', `%"id":"${propertyId}"%`);
          }
        }

        // Delete the submission
        return supabase
          .from('property_submissions')
          .delete()
          .eq('id', propertyId);
      });

      // Execute all delete operations
      await Promise.all(deletePromises);

      toast({
        title: 'Success',
        description: `${propertiesToBulkDelete.length} propert${propertiesToBulkDelete.length === 1 ? 'y' : 'ies'} deleted successfully`
      });

      // Clear selection and refresh data
      setSelectedProperties([]);
      setBulkDeleteModalOpen(false);
      setPropertiesToBulkDelete([]);
      fetchProperties();
    } catch (error) {
      console.error('Error bulk deleting properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete selected properties',
        variant: 'destructive'
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleRejectWithProperty = (property: PropertySubmission) => {
    setSelectedProperty(property);
    setReviewModalOpen(true);
  };

  // Direct reject without modal - just marks as rejected
  const handleDirectReject = async (property: PropertySubmission) => {
    setActionLoading(true);
    try {
      const isEditedProperty = property?.is_edited;

      if (isEditedProperty) {
        // Update the properties table
        const { error } = await supabase
          .from('properties')
          .update({
            status: 'rejected',
            rejection_reason: 'Rejected by admin',
            admin_reviewed_at: new Date().toISOString()
          })
          .eq('id', property.id);

        if (error) throw error;
      } else {
        // Update property_submissions
        let updatedPayload: any = {};
        try {
          updatedPayload = typeof property?.payload === 'string' 
            ? JSON.parse(property.payload) 
            : property?.payload || {};
        } catch (e) {
          updatedPayload = {};
        }
        
        updatedPayload.rejection_reason = 'Rejected by admin';
        
        const { error: submissionError } = await supabase
          .from('property_submissions')
          .update({
            status: 'rejected',
            payload: updatedPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', property.id);

        if (submissionError) throw submissionError;

        // Also update in properties table if it exists there
        const { error: propertiesError } = await supabase
          .from('properties')
          .update({
            status: 'rejected',
            rejection_reason: 'Rejected by admin',
            admin_reviewed_at: new Date().toISOString()
            // Note: We don't update owner fields here to preserve them
          })
          .eq('id', property.id);

        // Don't throw error if property doesn't exist in properties table
        if (propertiesError) {
          console.log('Property not found in properties table (might be submission only)');
        }
      }

      toast({
        title: 'Property Rejected',
        description: 'The property has been marked as rejected and is no longer visible to users.',
      });

      fetchProperties();
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject property',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle visibility toggle for properties
  const handleToggleVisibility = async (propertyId: string, isVisible: boolean) => {
    setActionLoading(true);
    try {
      // First find the submission to check if it's approved
      const { data: submission } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (submission?.status === 'approved') {
        // Find and update the main property table
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('title', submission.title)
          .eq('city', submission.city)
          .eq('state', submission.state);

        if (properties && properties.length > 0) {
          await supabase
            .from('properties')
            .update({ is_visible: isVisible })
            .eq('id', properties[0].id);
        }
      }

      // Update the submission's visibility in payload
      let updatedPayload: any = {};
      try {
        updatedPayload = typeof submission?.payload === 'string' 
          ? JSON.parse(submission.payload) 
          : submission?.payload || {};
      } catch (e) {
        updatedPayload = {};
      }
      
      updatedPayload.is_visible = isVisible;
      
      await supabase
        .from('property_submissions')
        .update({ payload: JSON.stringify(updatedPayload) })
        .eq('id', propertyId);

      toast({
        title: 'Success',
        description: `Property ${isVisible ? 'shown' : 'hidden'} successfully`
      });

      fetchProperties();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update property visibility',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Property Submissions</h1>
            <p className="text-muted-foreground">Review instant property submissions from users</p>
          </div>
          {newPropertyCount > 0 && (
            <div className="flex items-center gap-3">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                {newPropertyCount} new propert{newPropertyCount === 1 ? 'y' : 'ies'} submitted!
              </div>
              <button
                onClick={() => {
                  setNewPropertyCount(0);
                  setLastViewedTime(new Date().toISOString());
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Mark as viewed
              </button>
            </div>
          )}
        </div>
      </div>

      <PropertyTable
        properties={filteredProperties as any}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        featuredFilter={featuredFilter}
        onFeaturedFilterChange={setFeaturedFilter}
        stats={stats}
        onView={(property) => {
          setSelectedProperty(property as PropertySubmission);
          setReviewModalOpen(true);
        }}
        onApprove={handleApprove}
        onReject={handleDirectReject as any}
        onDelete={(id) => {
          setPropertyToDelete(id);
          setDeleteModalOpen(true);
        }}
        onToggleVisibility={handleToggleVisibility}
        actionLoading={actionLoading}
        selectedProperties={selectedProperties}
        onSelectionChange={setSelectedProperties}
        onBulkDelete={handleBulkDelete}
        onBulkAddToFeatured={handleBulkAddToFeatured}
        bulkActionLoading={bulkActionLoading}
      />

      <PropertyReviewModal
        property={selectedProperty as any}
        open={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedProperty(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={actionLoading}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action will mark it as deleted."
        isDeleting={actionLoading}
      />

      <DeleteConfirmationModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => {
          setBulkDeleteModalOpen(false);
          setPropertiesToBulkDelete([]);
        }}
        onConfirm={confirmBulkDelete}
        title="Delete Selected Properties"
        description={`Are you sure you want to delete ${propertiesToBulkDelete.length} propert${propertiesToBulkDelete.length === 1 ? 'y' : 'ies'}? This action cannot be undone.`}
        isDeleting={bulkActionLoading}
      />
    </div>
  );
};

export default AdminProperties;