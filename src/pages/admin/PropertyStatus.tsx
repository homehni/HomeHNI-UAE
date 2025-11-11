import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Building2, ArrowLeft, MoreHorizontal, Trash2, Edit, EyeOff, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RentedSoldProperty {
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
  rental_status: 'rented' | 'sold';
  created_at: string;
  updated_at?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  images: string[];
  status: string;
  is_visible?: boolean;
}

const PropertyStatus = () => {
  const [properties, setProperties] = useState<RentedSoldProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<RentedSoldProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'rented' | 'sold'>('all');
  const [stats, setStats] = useState({
    total: 0,
    rented: 0,
    sold: 0
  });
  
  // Action dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<RentedSoldProperty | null>(null);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'available' | 'rented' | 'sold'>('available');
  
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Get initial filter from URL params
  useEffect(() => {
    const initialStatus = searchParams.get('status') as 'rented' | 'sold' | null;
    if (initialStatus && (initialStatus === 'rented' || initialStatus === 'sold')) {
      setStatusFilter(initialStatus);
    }
  }, [searchParams]);

  const fetchRentedSoldProperties = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch properties from both property_submissions and properties tables
      const [submissionsResult, propertiesResult] = await Promise.all([
        supabase
          .from('property_submissions')
          .select('*')
          .in('rental_status', ['rented', 'sold'])
          .order('updated_at', { ascending: false }),
        supabase
          .from('properties')
          .select('*')
          .in('rental_status', ['rented', 'sold'])
          .order('updated_at', { ascending: false })
      ]);

      if (submissionsResult.error) throw submissionsResult.error;
      if (propertiesResult.error) throw propertiesResult.error;

      // Transform submissions data
      const transformedSubmissions = submissionsResult.data?.map(submission => {
        let payload: any = {};
        try {
          payload = typeof submission.payload === 'string' 
            ? JSON.parse(submission.payload) 
            : submission.payload || {};
        } catch (e) {
          console.warn('Error parsing payload:', e);
          payload = {};
        }

        return {
          id: submission.id,
          title: submission.title,
          property_type: payload?.property_type || 'Unknown',
          listing_type: payload?.listing_type || 'Unknown',
          bhk_type: payload?.bhk_type || '',
          state: submission.state || payload?.state || '',
          city: submission.city || payload?.city || '',
          locality: payload?.locality || '',
          expected_price: payload?.expected_price || 0,
          super_area: payload?.super_area || 0,
          rental_status: submission.rental_status as 'rented' | 'sold',
          created_at: submission.created_at,
          updated_at: submission.updated_at,
          owner_name: payload?.owner_name || '',
          owner_email: payload?.owner_email || '',
          owner_phone: payload?.owner_phone || '',
          images: payload?.images || [],
          status: submission.status,
          is_visible: payload?.is_visible !== false,
        };
      }) || [];

      // Transform properties data
      const transformedProperties = propertiesResult.data?.map(property => ({
        id: property.id,
        title: property.title,
        property_type: property.property_type || 'Unknown',
        listing_type: property.listing_type || 'Unknown',
        bhk_type: property.bhk_type || '',
        state: property.state || '',
        city: property.city || '',
        locality: property.locality || '',
        expected_price: property.expected_price || 0,
        super_area: property.super_area || 0,
        rental_status: property.rental_status as 'rented' | 'sold',
        created_at: property.created_at,
        updated_at: property.updated_at,
        owner_name: property.owner_name || '',
        owner_email: property.owner_email || '',
        owner_phone: property.owner_phone || '',
        images: property.images || [],
        status: property.status,
        is_visible: property.is_visible !== false,
      })) || [];

      // Combine both datasets
      const allProperties = [...transformedSubmissions, ...transformedProperties];
      
      setProperties(allProperties);
      
      // Calculate stats
      const total = allProperties.length;
      const rented = allProperties.filter(p => p.rental_status === 'rented').length;
      const sold = allProperties.filter(p => p.rental_status === 'sold').length;
      
      setStats({ total, rented, sold });
      
    } catch (error) {
      console.error('Error fetching rented/sold properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch property status data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterProperties = useCallback(() => {
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

    // Filter by rental status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.rental_status === statusFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter]);

  useEffect(() => {
    fetchRentedSoldProperties();
  }, [fetchRentedSoldProperties]);

  useEffect(() => {
    filterProperties();
  }, [filterProperties]);

  // Action handlers
  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;
    
    setActionLoading(true);
    try {
      // Delete from both tables if exists
      const [submissionResult, propertyResult] = await Promise.all([
        supabase
          .from('property_submissions')
          .delete()
          .eq('id', selectedProperty.id),
        supabase
          .from('properties')
          .delete()
          .eq('id', selectedProperty.id)
      ]);

      toast({
        title: 'Success',
        description: 'Property deleted successfully',
      });
      
      // Refresh the list
      fetchRentedSoldProperties();
      
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
      setSelectedProperty(null);
    }
  };

  const handleChangeRentalStatus = async () => {
    if (!selectedProperty) return;
    
    setActionLoading(true);
    try {
      // Update in both tables if exists
      const [submissionResult, propertyResult] = await Promise.all([
        supabase
          .from('property_submissions')
          .update({ rental_status: newStatus })
          .eq('id', selectedProperty.id),
        supabase
          .from('properties')
          .update({ rental_status: newStatus })
          .eq('id', selectedProperty.id)
      ]);

      toast({
        title: 'Success',
        description: `Property status updated to ${newStatus}`,
      });
      
      // Refresh the list
      fetchRentedSoldProperties();
      
    } catch (error) {
      console.error('Error updating property status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update property status',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
      setStatusChangeDialogOpen(false);
      setSelectedProperty(null);
    }
  };

  const handleToggleVisibility = async (property: RentedSoldProperty) => {
    setActionLoading(true);
    try {
      const newVisibility = !property.is_visible;
      
      // Try to update in property_submissions table first
      const submissionUpdate = supabase
        .from('property_submissions')
        .update({ 
          payload: {
            ...property,
            is_visible: newVisibility
          }
        })
        .eq('id', property.id);
      
      // Try to update in properties table 
      const propertyUpdate = supabase
        .from('properties')
        .update({ is_visible: newVisibility })
        .eq('id', property.id);

      // Execute both updates
      await Promise.allSettled([submissionUpdate, propertyUpdate]);

      toast({
        title: 'Success',
        description: `Property ${newVisibility ? 'shown' : 'hidden'} on website`,
      });
      
      // Refresh the list
      fetchRentedSoldProperties();
      
    } catch (error) {
      console.error('Error toggling property visibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle property visibility',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewProperty = (property: RentedSoldProperty) => {
    // For now, just show property details in a toast
    // In a real app, this could open a modal or navigate to a detail page
    toast({
      title: 'Property Details',
      description: `${property.title} - ${property.city}, ${property.state}`,
    });
  };

  const getRentalStatusBadge = (status: 'rented' | 'sold') => {
    if (status === 'rented') {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          Rented
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Sold
        </Badge>
      );
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Status</h1>
          <p className="text-muted-foreground">View and manage properties marked as rented or sold</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <Building2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rented Properties</p>
                <p className="text-2xl font-bold text-red-600">{stats.rented}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sold Properties</p>
                <p className="text-2xl font-bold text-green-600">{stats.sold}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="w-full border-2 border-primary">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Property Status Listings</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: 'all' | 'rented' | 'sold') => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({stats.total})</SelectItem>
                <SelectItem value="rented">Rented ({stats.rented})</SelectItem>
                <SelectItem value="sold">Sold ({stats.sold})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredProperties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No properties found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {property.images?.length > 0 ? (
                              <img 
                                src={property.images[0]} 
                                alt={property.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <Building2 className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{property.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {property.bhk_type} • {property.super_area} sq ft
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium">{property.owner_name || 'Unknown'}</div>
                          <div className="text-muted-foreground">{property.owner_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="text-sm">
                          <div>{property.locality}</div>
                          <div className="text-muted-foreground">{property.city}, {property.state}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="text-sm">
                          <div className="capitalize">{property.property_type}</div>
                          <div className="text-muted-foreground capitalize">{property.listing_type}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="font-semibold text-foreground">
                          ₹{property.expected_price?.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="space-y-1">
                          {getRentalStatusBadge(property.rental_status)}
                          {property.is_visible === false && (
                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                              Hidden
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(property.updated_at || property.created_at), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 hover:bg-gray-100"
                              disabled={actionLoading}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewProperty(property)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedProperty(property);
                                setNewStatus('available');
                                setStatusChangeDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleVisibility(property)}>
                              {property.is_visible ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Hide from Website
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Show on Website
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setSelectedProperty(property);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Property
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProperty?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProperty}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Dialog */}
      <AlertDialog open={statusChangeDialogOpen} onOpenChange={setStatusChangeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Property Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change the rental status for "{selectedProperty?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Select value={newStatus} onValueChange={(value: 'available' | 'rented' | 'sold') => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangeRentalStatus}
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating...' : 'Update Status'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PropertyStatus;
