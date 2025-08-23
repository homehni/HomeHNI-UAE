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
      // Fetch all property submissions from new table
      const { data: submissionsData, error } = await supabase
        .from('property_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform submissions to match PropertyTable interface
      const transformedProperties = submissionsData?.map(submission => {
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

      setProperties(transformedProperties);
      
      // Calculate stats based on new status system
      const total = transformedProperties?.length || 0;
      const pending = transformedProperties?.filter(p => p.status === 'new').length || 0;
      const approved = transformedProperties?.filter(p => p.status === 'approved').length || 0;
      const rejected = transformedProperties?.filter(p => p.status === 'rejected').length || 0;
      const deleted = transformedProperties?.filter(p => p.status === 'deleted').length || 0;
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
      } else {
        filtered = filtered.filter(property => property.status === statusFilter);
      }
    }

    setFilteredProperties(filtered);
  };

  const handleApprove = async (propertyId: string) => {
    setActionLoading(true);
    try {
      // First, get the submission data
      const { data: submission, error: fetchError } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (fetchError) throw fetchError;

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
      const bhkValue = mappedBhkRaw && mappedBhkRaw.trim().length > 0 ? mappedBhkRaw : null;

      // Insert into main properties table for homepage display
      const { data: insertedProperty, error: insertError } = await supabase
        .from('properties')
        .insert({
          user_id: userIdToAssign,
          title: submission.title || payload.title || 'Untitled Property',
          property_type: mappedPropertyType,
          listing_type: mappedListingType,
          bhk_type: bhkValue,
          furnishing: payload.furnishing ? (['unfurnished','semi-furnished','semi furnished','furnished'].includes(String(payload.furnishing).toLowerCase()) ? String(payload.furnishing).toLowerCase().replace(' ','-') : null) : null,
          availability_type: payload.availability_type || 'immediate',
          state: submission.state || payload.state || '',
          city: submission.city || payload.city || '',
          locality: payload.locality || '',
          street_address: payload.street_address || '',
          pincode: payload.pincode || '',
          landmarks: payload.landmarks || '',
          description: payload.description || '',
          bathrooms: payload.bathrooms || 0,
          balconies: payload.balconies || 0,
          floor_no: payload.floor_no || null,
          total_floors: payload.total_floors || null,
          super_area: Math.max(Number(payload.super_area) || 0, 1),
          carpet_area: payload.carpet_area || null,
          availability_date: payload.availability_date || null,
          expected_price: Math.max(payload.expected_price || 1, 1),
          price_negotiable: payload.price_negotiable !== false,
          maintenance_charges: Math.max(Number(payload.maintenance_charges) || 0, 0),
          security_deposit: Math.max(Number(payload.security_deposit) || 0, 0),
          images: payload.images || [],
          videos: payload.videos || [],
          owner_name: payload.owner_name || '',
          owner_email: payload.owner_email || '',
          owner_phone: payload.owner_phone || '',
          owner_role: payload.owner_role || 'Owner',
          status: 'approved',
          is_featured: payload.is_featured || false
        })
        .select()
        .single();

      if (insertError) throw insertError;

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
          location: `${insertedProperty.locality}, ${insertedProperty.city}`,
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
      const { error } = await supabase
        .from('property_submissions')
        .delete()
        .eq('id', propertyToDelete);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Property submission deleted successfully'
      });

      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property submission',
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