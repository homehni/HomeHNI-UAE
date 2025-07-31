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

  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(data || []);
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
      filtered = filtered.filter(property => property.status === statusFilter);
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Properties Management</h1>
        <p className="text-muted-foreground">Review, approve, reject, and manage all property listings</p>
      </div>

      <PropertyTable
        properties={filteredProperties}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
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