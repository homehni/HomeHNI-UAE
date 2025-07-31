import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminStats } from '@/components/admin/AdminStats';
import { PropertyReviewModal } from '@/components/admin/PropertyReviewModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, CheckCircle, XCircle, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

const Admin = () => {
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
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deleted: 0
  });

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
      
      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter(p => p.status === 'pending').length || 0;
      const approved = data?.filter(p => p.status === 'approved').length || 0;
      const rejected = data?.filter(p => p.status === 'rejected').length || 0;
      const deleted = data?.filter(p => p.status === 'deleted').length || 0;

      setStats({ total, pending, approved, rejected, deleted });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'deleted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage property listings and user submissions</p>
        </div>

        <AdminStats stats={stats} />

        <Card>
          <CardHeader>
            <CardTitle>Property Listings</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, city, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate">
                          {property.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {property.city}, {property.state}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {property.property_type}
                          <br />
                          <span className="text-gray-500">{property.listing_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        ₹{property.expected_price?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(property.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProperty(property);
                              setReviewModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {property.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(property.id)}
                                disabled={actionLoading}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setReviewModalOpen(true);
                                }}
                                disabled={actionLoading}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {property.status !== 'deleted' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPropertyToDelete(property.id);
                                setDeleteModalOpen(true);
                              }}
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredProperties.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No properties found matching your filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
};

export default Admin;