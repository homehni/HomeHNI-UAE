import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { PropertyReviewModal } from '@/components/admin/PropertyReviewModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { useToast } from '@/hooks/use-toast';
import { mapBhkType, mapPropertyType, mapListingType } from '@/utils/propertyMappings';
 
// Property submission interface for new table
interface PropertySubmission {
  id: string;
  title: string;
  city: string;
  state: string;
  status: string;
  payload: any;
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
  updated_at?: string;
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
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [newPropertyCount, setNewPropertyCount] = useState(0);
  const [lastViewedTime, setLastViewedTime] = useState<string>(new Date().toISOString());
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deleted: 0,
    featuredPending: 0
  });

  const { toast } = useToast();

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
  }, [toast]);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter, featuredFilter]);

  const fetchProperties = async () => {
    try {
      // Fetch both property submissions AND edited properties that need re-approval
      const [submissionsResult, editedPropertiesResult] = await Promise.all([
        // Fetch new property submissions
        supabase
          .from('property_submissions')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // Fetch edited properties that are pending re-approval
        supabase
          .from('properties')
          .select('*')
          .eq('status', 'pending')
          .not('updated_at', 'is', null)
          .order('updated_at', { ascending: false })
      ]);

      if (submissionsResult.error) throw submissionsResult.error;
      if (editedPropertiesResult.error) throw editedPropertiesResult.error;

      // Transform submissions to match PropertyTable interface
      const transformedSubmissions = submissionsResult.data?.map(submission => {
        // Parse the payload if it's a string
        let payload: any = {};
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
          property_type: payload?.property_type || 'Unknown',
          listing_type: payload?.listing_type || 'Unknown',
          bhk_type: payload?.bhk_type || '',
          locality: payload?.locality || 'Unknown',
          expected_price: payload?.expected_price || 0,
          super_area: payload?.super_area || 0,
          description: payload?.description || '',
          images: payload?.images || [],
          rejection_reason: payload?.rejection_reason || '',
          owner_name: payload?.owner_name || 'Unknown',
          owner_email: payload?.owner_email || '',
          owner_phone: payload?.owner_phone || '',
          owner_role: payload?.owner_role || 'Owner',
          is_featured: payload?.is_featured || false
        };
      }) || [];

      // Transform edited properties to match PropertyTable interface
      const transformedEditedProperties = editedPropertiesResult.data?.map(property => {
        // Check if this property was edited (updated_at > created_at)
        const wasEdited = property.updated_at && property.created_at && 
                         new Date(property.updated_at) > new Date(property.created_at);
        
        return {
          ...property,
          // Mark as edited for identification
          is_edited: wasEdited,
          // Ensure status is 'new' for admin review workflow
          status: 'new'
        };
      }) || [];

      // Combine both submissions and edited properties
      const allProperties = [...transformedSubmissions, ...transformedEditedProperties];
      
      // Sort by date (newest first)
      allProperties.sort((a, b) => {
        const dateA = new Date(a.created_at || a.updated_at || 0);
        const dateB = new Date(b.created_at || b.updated_at || 0);
        return dateB.getTime() - dateA.getTime();
      });

      setProperties(allProperties);
      
      // Calculate stats based on combined data
      const total = allProperties?.length || 0;
      const pending = allProperties?.filter(p => p.status === 'new').length || 0;
      const approved = allProperties?.filter(p => p.status === 'approved').length || 0;
      const rejected = allProperties?.filter(p => p.status === 'rejected').length || 0;
      const deleted = allProperties?.filter(p => p.status === 'deleted').length || 0;
      const featuredPending = 0; // Not applicable for submissions

      setStats({ total, pending, approved, rejected, deleted, featuredPending });
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
  };

  const filterProperties = () => {
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

    setFilteredProperties(filtered);
  };

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
      let payload: any = {};
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
      const userIdToAssign = submission.user_id || authUser.user?.id;
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

      const { data: insertedProperty, error: insertError } = await supabase
        .from('properties')
        .insert({
          user_id: userIdToAssign,
          title: submission.title || payload.title || 'Untitled Property',
          property_type: mappedPropertyType,
          listing_type: mappedListingType,
          bhk_type: bhkValue,
          
          // Enhanced property details mapping
          furnishing: payload.furnishing ? (['unfurnished','semi-furnished','semi furnished','furnished'].includes(String(payload.furnishing).toLowerCase()) ? String(payload.furnishing).toLowerCase().replace(' ','-') : null) : null,
          availability_type: payload.availability_type || 'immediate',
          
          // NEW: Additional property characteristics
          property_age: propertyDetails.propertyAge || saleDetails.propertyAge || null,
          facing_direction: propertyDetails.facing || null,
          floor_type: propertyDetails.floorType || null,
          registration_status: saleDetails.registrationStatus || null,
          
          // Location details
          state: submission.state || payload.state || '',
          city: submission.city || payload.city || '',
          locality: payload.locality || '',
          street_address: payload.street_address || '',
          pincode: payload.pincode || '',
          landmarks: payload.landmarks || additionalInfo.directionsTip || '',
          
          // Property specifications
          description: payload.description || additionalInfo.description || '',
          bathrooms: propertyDetails.bathrooms || payload.bathrooms || amenities.bathrooms || 0,
          balconies: propertyDetails.balconies || payload.balconies || amenities.balcony || 0,
          floor_no: propertyDetails.floorNo || payload.floor_no || null,
          total_floors: propertyDetails.totalFloors || payload.total_floors || null,
          super_area: Math.max(Number(payload.super_area || propertyDetails.superBuiltUpArea) || 0, 1),
          carpet_area: payload.carpet_area || null,
          
          // Financial details
          availability_date: payload.availability_date || saleDetails.possessionDate || rentalDetails.availableFrom || null,
          expected_price: Math.max(payload.expected_price || saleDetails.expectedPrice || rentalDetails.expectedPrice || 1, 1),
          price_negotiable: payload.price_negotiable !== false,
          maintenance_charges: Math.max(Number(payload.maintenance_charges || saleDetails.maintenanceCharges || rentalDetails.maintenanceCharges) || 0, 0),
          security_deposit: Math.max(Number(payload.security_deposit || saleDetails.bookingAmount || rentalDetails.securityDeposit) || 0, 0),
          
          // NEW: Additional financial and service details
          booking_amount: Math.max(Number(saleDetails.bookingAmount) || 0, 0),
          home_loan_available: saleDetails.homeLoanAvailable === true || saleDetails.homeLoanAvailable === 'Yes',
          
          // NEW: Property services and amenities
          water_supply: amenities.waterSupply || null,
          power_backup: amenities.powerBackup || null,
          gated_security: amenities.gatedSecurity === true || amenities.gatedSecurity === 'Yes' || amenities.gatedSecurity === 'yes',
          who_will_show: amenities.whoWillShow || additionalInfo.whoWillShow || null,
          current_property_condition: amenities.currentPropertyCondition || null,
          secondary_phone: additionalInfo.secondaryNumber || null,
          
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
          },
          additional_documents: {
            allotmentLetter: additionalInfo.allotmentLetter,
            saleDeedCertificate: additionalInfo.saleDeedCertificate,
            propertyTaxPaid: additionalInfo.propertyTaxPaid,
            occupancyCertificate: additionalInfo.occupancyCertificate
          },
          
          // Media
          images: imagesNormalized,
          videos: payload.videos || [],
          
          // Owner information
          owner_name: payload.owner_name || originalFormData.ownerInfo?.fullName || '',
          owner_email: payload.owner_email || originalFormData.ownerInfo?.email || '',
          owner_phone: payload.owner_phone || originalFormData.ownerInfo?.phoneNumber || '',
          owner_role: payload.owner_role || originalFormData.ownerInfo?.role || 'Owner',
          
          status: 'approved',
          is_featured: payload.is_featured || false
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

  const handleRejectWithProperty = (property: PropertySubmission) => {
    setSelectedProperty(property);
    setReviewModalOpen(true);
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
        onReject={handleRejectWithProperty as any}
        onDelete={(id) => {
          setPropertyToDelete(id);
          setDeleteModalOpen(true);
        }}
        actionLoading={actionLoading}
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
    </div>
  );
};

export default AdminProperties;