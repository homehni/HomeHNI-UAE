import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Star, Search, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedPropertyEditModal } from '@/components/EnhancedPropertyEditModal';
import { PropertyDetailModal } from '@/components/PropertyDetailModal';

interface Property {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area: number;
  carpet_area?: number;
  bathrooms: number;
  balconies: number;
  furnishing?: string;
  availability_type: string;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  updated_at: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
}

interface FeaturedPropertyRecord {
  id: string;
  property_id: string;
  sort_order: number;
  is_active: boolean;
  featured_until?: string;
  created_at: string;
}

export const AdminFeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedPropertyRecord[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectPropertyDialogOpen, setSelectPropertyDialogOpen] = useState(false);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  
  // Property edit modal state
  const [editPropertyModal, setEditPropertyModal] = useState<{
    isOpen: boolean;
    property: Property | null;
  }>({ isOpen: false, property: null });
  
  // Property view modal state
  const [viewPropertyModal, setViewPropertyModal] = useState<{
    isOpen: boolean;
    property: Property | null;
  }>({ isOpen: false, property: null });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions
    const propertiesChannel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        () => fetchData()
      )
      .subscribe();
      
    const featuredChannel = supabase
      .channel('featured-properties-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'featured_properties' },
        () => fetchData()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(featuredChannel);
    };
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, featuredProperties, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      // Fetch all properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);
      
      // Fetch featured properties records
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_properties')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (featuredError) throw featuredError;
      setFeaturedProperties(featuredData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch properties data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    // Show ONLY properties that are in featured_properties (mirrors homepage)
    const featuredIds = new Set(featuredProperties.map(fp => fp.property_id));
    let filtered = properties.filter(p => featuredIds.has(p.id));

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(term) ||
        property.locality.toLowerCase().includes(term) ||
        property.city.toLowerCase().includes(term) ||
        property.property_type.toLowerCase().includes(term)
      );
    }

    // map for quick access to featured meta (status/sort_order)
    const featuredRecords = featuredProperties.reduce((acc, fp) => {
      acc[fp.property_id] = fp;
      return acc;
    }, {} as Record<string, FeaturedPropertyRecord>);

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => {
        const featuredRecord = featuredRecords[property.id];
        return statusFilter === 'active' ? featuredRecord?.is_active : !featuredRecord?.is_active;
      });
    }

    // Sort by sort_order to exactly match homepage order
    filtered.sort((a, b) => (featuredRecords[a.id]?.sort_order ?? 0) - (featuredRecords[b.id]?.sort_order ?? 0));

    setFilteredProperties(filtered);
  };

  const handleAddFeatured = async () => {
    // Get properties that are not already featured
    const featuredPropertyIds = featuredProperties.map(fp => fp.property_id);
    const available = properties.filter(p => !featuredPropertyIds.includes(p.id));
    setAvailableProperties(available);
    setSelectPropertyDialogOpen(true);
  };

  const handleSelectProperty = async (propertyId: string) => {
    try {
      const maxOrder = Math.max(...featuredProperties.map(fp => fp.sort_order), 0);
      
      const { error } = await supabase
        .from('featured_properties')
        .insert({
          property_id: propertyId,
          sort_order: maxOrder + 1,
          is_active: true
        });

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Property added to featured list'
      });
      
      setSelectPropertyDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error adding featured property:', error);
      toast({
        title: 'Error',
        description: 'Failed to add featured property',
        variant: 'destructive'
      });
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditPropertyModal({ isOpen: true, property });
  };

  const handleViewProperty = (property: Property) => {
    setViewPropertyModal({ isOpen: true, property });
  };

  const handleRemoveFeatured = async (propertyId: string) => {
    try {
      const featuredRecord = featuredProperties.find(fp => fp.property_id === propertyId);
      if (!featuredRecord) return;

      const { error } = await supabase
        .from('featured_properties')
        .delete()
        .eq('id', featuredRecord.id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Property removed from featured list'
      });
      
      fetchData();
    } catch (error) {
      console.error('Error removing featured property:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove featured property',
        variant: 'destructive'
      });
    }
  };

  const toggleFeaturedStatus = async (propertyId: string) => {
    try {
      const featuredRecord = featuredProperties.find(fp => fp.property_id === propertyId);
      if (!featuredRecord) return;

      const { error } = await supabase
        .from('featured_properties')
        .update({ is_active: !featuredRecord.is_active })
        .eq('id', featuredRecord.id);

      if (error) throw error;
      
      fetchData();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive'
      });
    }
  };

  const handlePropertyUpdated = () => {
    fetchData();
    setEditPropertyModal({ isOpen: false, property: null });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Featured Properties</h1>
          <p className="text-muted-foreground">Manage properties displayed on the homepage</p>
        </div>
        <Button onClick={handleAddFeatured}>
          <Plus className="h-4 w-4 mr-2" />
          Add Featured Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{properties.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {featuredProperties.filter(fp => fp.is_active).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {properties.filter(p => p.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Featured List</CardTitle>
          <CardDescription>This matches the Featured Properties on the homepage</CardDescription>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search featured properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Featured Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => {
                const featuredRecord = featuredProperties.find(fp => fp.property_id === property.id);
                const isFeatured = !!featuredRecord;
                return (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {property.images && property.images.length > 0 && (
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {property.title}
                            {isFeatured && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {property.bhk_type} • {property.super_area} sq ft
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{property.locality}</div>
                        <div className="text-sm text-muted-foreground">{property.city}, {property.state}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{(property.expected_price / 100000).toFixed(1)}L
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{property.property_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{property.owner_name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{property.owner_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isFeatured ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeaturedStatus(property.id)}
                          className={featuredRecord?.is_active ? 'text-green-600' : 'text-red-600'}
                        >
                          {featuredRecord?.is_active ? 'Active' : 'Inactive'}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectProperty(property.id)}
                          className="text-blue-600"
                        >
                          Add to Featured
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewProperty(property)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditProperty(property)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isFeatured && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveFeatured(property.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Select Property Dialog */}
      <Dialog open={selectPropertyDialogOpen} onOpenChange={setSelectPropertyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Property to Feature</DialogTitle>
            <DialogDescription>
              Choose a property from your listings to feature on the homepage
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {availableProperties.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No properties available to feature. All approved properties are already featured.
              </div>
            ) : (
              <div className="grid gap-4">
                {availableProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleSelectProperty(property.id)}
                  >
                    <div className="flex items-center gap-4">
                      {property.images && property.images.length > 0 && (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {property.locality}, {property.city} • {property.property_type} • ₹{(property.expected_price / 100000).toFixed(1)}L
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={property.status === 'approved' ? 'default' : 'secondary'}>
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectPropertyDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Property Edit Modal */}
      <EnhancedPropertyEditModal
        property={editPropertyModal.property}
        isOpen={editPropertyModal.isOpen}
        onClose={() => setEditPropertyModal({ isOpen: false, property: null })}
        onPropertyUpdated={handlePropertyUpdated}
      />

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={viewPropertyModal.property}
        isOpen={viewPropertyModal.isOpen}
        onClose={() => setViewPropertyModal({ isOpen: false, property: null })}
      />
    </div>
  );
};