import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { PropertyReviewModal } from '@/components/admin/PropertyReviewModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type: string;
  state: string;
  city: string;
  locality: string;
  expected_price: number;
  super_area: number;
  description: string;
  images: string[];
  status: string;
  created_at: string;
  rejection_reason?: string;
  user_id: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_role?: string;
  is_featured?: boolean;
}

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
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
    
    // Set up real-time subscription for property changes
    const channel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          const newProperty = payload.new as Property;
          
          // Show real-time notification for new property submission
          toast({
            title: '🎉 New Property Submitted!',
            description: `"${newProperty.title}" by ${newProperty.owner_name || 'Unknown'} needs review`,
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
          table: 'properties'
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
      // Fetch all properties with owner information directly from properties table
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Owner information is now stored directly in properties table
      setProperties(propertiesData || []);
      
      // Calculate stats
      const total = propertiesData?.length || 0;
      const pending = propertiesData?.filter(p => p.status === 'pending').length || 0;
      const approved = propertiesData?.filter(p => p.status === 'approved').length || 0;
      const rejected = propertiesData?.filter(p => p.status === 'rejected').length || 0;
      const deleted = propertiesData?.filter(p => p.status === 'deleted').length || 0;
      const featuredPending = propertiesData?.filter(p => p.status === 'pending' && p.is_featured === true).length || 0;

      setStats({ total, pending, approved, rejected, deleted, featuredPending });
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch properties',
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
        property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.locality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'featured-pending') {
        filtered = filtered.filter(property => property.status === 'pending' && property.is_featured === true);
      } else {
        filtered = filtered.filter(property => property.status === statusFilter);
      }
    }

    // Additional featured filter
    if (featuredFilter) {
      filtered = filtered.filter(property => property.is_featured === true);
    }

    setFilteredProperties(filtered);
  };

  const handleApprove = async (propertyId: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status: 'approved',
          is_featured: selectedProperty?.is_featured || false, // Preserve featured status on approval
          admin_reviewed_at: new Date().toISOString(),
          rejection_reason: null
        })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Property approved successfully'
      });

      setReviewModalOpen(false);
      fetchProperties();
    } catch (error) {
      console.error('Error approving property:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve property',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (propertyId: string, reason: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status: 'rejected',
          is_featured: false, // Clear featured status on rejection
          rejection_reason: reason,
          admin_reviewed_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Property rejected successfully'
      });

      setReviewModalOpen(false);
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

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status: 'deleted',
          is_featured: false, // Clear featured status on deletion
          admin_reviewed_at: new Date().toISOString()
        })
        .eq('id', propertyToDelete);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Property deleted successfully'
      });

      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectWithProperty = (property: Property) => {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Properties Management</h1>
            <p className="text-muted-foreground">Review, approve, reject, and manage all property listings</p>
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
        properties={filteredProperties}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        featuredFilter={featuredFilter}
        onFeaturedFilterChange={setFeaturedFilter}
        stats={stats}
        onView={(property) => {
          setSelectedProperty(property);
          setReviewModalOpen(true);
        }}
        onApprove={handleApprove}
        onReject={handleRejectWithProperty}
        onDelete={(id) => {
          setPropertyToDelete(id);
          setDeleteModalOpen(true);
        }}
        actionLoading={actionLoading}
      />

      <PropertyReviewModal
        property={selectedProperty}
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