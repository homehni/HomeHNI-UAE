import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { PropertyReviewModal } from '@/components/admin/PropertyReviewModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { useToast } from '@/hooks/use-toast';
import { mapBhkType, mapPropertyType, mapListingType, mapFurnishing } from '@/utils/propertyMappings';
 
// Property submission interface for new table
interface PropertySubmission {
  id: string;
  title: string;
  city: string;
  state: string;
  status: string;
  payload: Record<string, unknown>;
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

const AdminProperties = () => {
  const { toast } = useToast();
  const location = useLocation();
  
  // State declarations
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
  
  // Define fetchProperties before it's used in useEffect
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

  // Define filterProperties before it's used in useEffect
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

  // Fetch properties and set up real-time subscription
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
  }, [fetchProperties, toast]);

  // Apply filtering when criteria change
  useEffect(() => {
    filterProperties();
  }, [filterProperties]);

  // Add the rest of the component functionality here...
  // ...

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Property Listings</h1>
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
        properties={filteredProperties}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        rentalStatusFilter={rentalStatusFilter}
        onRentalStatusFilterChange={setRentalStatusFilter}
        featuredFilter={featuredFilter}
        onFeaturedFilterChange={setFeaturedFilter}
        stats={stats}
        onView={(property) => {
          setSelectedProperty(property as PropertySubmission);
          setReviewModalOpen(true);
        }}
        onApprove={handleApprove}
        onReject={handleRejectWithProperty}
        onDelete={(id) => {
          setPropertyToDelete(id);
          setDeleteModalOpen(true);
        }}
        onToggleVisibility={handleToggleVisibility}
        actionLoading={actionLoading}
        selectedProperties={selectedProperties}
        onSelectionChange={setSelectedProperties}
        onBulkDelete={(ids) => {
          setPropertiesToBulkDelete(ids);
          setBulkDeleteModalOpen(true);
        }}
        bulkActionLoading={bulkActionLoading}
      />

      {/* Property Review Modal */}
      {selectedProperty && (
        <PropertyReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          property={selectedProperty}
          onApprove={() => {
            handleApprove(selectedProperty.id);
            setReviewModalOpen(false);
          }}
          onReject={(reason) => {
            handleReject(selectedProperty.id, reason);
            setReviewModalOpen(false);
          }}
          onClose={() => setReviewModalOpen(false)}
          actionLoading={actionLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (propertyToDelete) {
            handleDelete(propertyToDelete);
            setDeleteModalOpen(false);
          }
        }}
        loading={actionLoading}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={bulkDeleteModalOpen}
        onOpenChange={setBulkDeleteModalOpen}
        onConfirm={() => {
          handleBulkDelete(propertiesToBulkDelete);
          setBulkDeleteModalOpen(false);
        }}
        loading={bulkActionLoading}
        title={`Delete ${propertiesToBulkDelete.length} Properties`}
        description={`Are you sure you want to delete ${propertiesToBulkDelete.length} selected properties? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminProperties;