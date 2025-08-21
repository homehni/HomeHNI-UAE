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
import { contentElementsService } from '@/services/contentElementsService';

interface FeaturedProperty {
  id: string;
  element_key: string;
  title: string;
  content: {
    location: string;
    price: string;
    area: string;
    bedrooms: string;
    bathrooms: string;
    image: string;
    propertyType: string;
    isNew?: boolean;
  };
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export const AdminFeaturedProperties: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<FeaturedProperty | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    image: '',
    propertyType: 'Apartment',
    isNew: false,
    is_active: true
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProperties();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('featured-properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_elements',
          filter: 'element_type=eq.featured_property'
        },
        () => {
          fetchFeaturedProperties();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterProperties();
  }, [featuredProperties, searchTerm, statusFilter]);

  const fetchFeaturedProperties = async () => {
    try {
      const elements = await contentElementsService.getContentElements('homepage', 'featured_properties');
      
      const properties: FeaturedProperty[] = elements.map(element => ({
        id: element.id,
        element_key: element.element_key,
        title: element.title || 'Untitled Property',
        content: element.content as FeaturedProperty['content'],
        sort_order: element.sort_order,
        is_active: element.is_active,
        created_at: element.created_at
      }));

      setFeaturedProperties(properties);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch featured properties',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = featuredProperties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.content.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.content.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => 
        statusFilter === 'active' ? property.is_active : !property.is_active
      );
    }

    setFilteredProperties(filtered);
  };

  const handleCreate = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      location: '',
      price: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      image: '',
      propertyType: 'Apartment',
      isNew: false,
      is_active: true
    });
    setDialogOpen(true);
  };

  const handleEdit = (property: FeaturedProperty) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      location: property.content.location,
      price: property.content.price,
      area: property.content.area,
      bedrooms: property.content.bedrooms,
      bathrooms: property.content.bathrooms,
      image: property.content.image,
      propertyType: property.content.propertyType,
      isNew: property.content.isNew || false,
      is_active: property.is_active
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.location || !formData.price) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const content = {
        location: formData.location,
        price: formData.price,
        area: formData.area,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        image: formData.image,
        propertyType: formData.propertyType,
        isNew: formData.isNew
      };

      if (editingProperty) {
        // Update existing property
        await contentElementsService.updateContentElement(editingProperty.id, {
          title: formData.title,
          content,
          is_active: formData.is_active
        });
        
        toast({
          title: 'Success',
          description: 'Featured property updated successfully'
        });
      } else {
        // Create new property
        const maxOrder = Math.max(...featuredProperties.map(p => p.sort_order), 0);
        
        await contentElementsService.createContentElement({
          element_type: 'featured_property',
          element_key: `featured_property_${Date.now()}`,
          title: formData.title,
          content,
          sort_order: maxOrder + 1,
          is_active: formData.is_active,
          page_location: 'homepage',
          section_location: 'featured_properties'
        });
        
        toast({
          title: 'Success',
          description: 'Featured property created successfully'
        });
      }
      
      setDialogOpen(false);
      fetchFeaturedProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: 'Error',
        description: 'Failed to save featured property',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentElementsService.deleteContentElement(id);
      toast({
        title: 'Success',
        description: 'Featured property deleted successfully'
      });
      fetchFeaturedProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete featured property',
        variant: 'destructive'
      });
    }
  };

  const toggleActive = async (property: FeaturedProperty) => {
    try {
      await contentElementsService.updateContentElement(property.id, {
        is_active: !property.is_active
      });
      fetchFeaturedProperties();
    } catch (error) {
      console.error('Error toggling property status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update property status',
        variant: 'destructive'
      });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Featured Properties</h1>
          <p className="text-muted-foreground">Manage properties displayed on the homepage</p>
        </div>
        <Button onClick={handleCreate}>
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
            <div className="text-3xl font-bold text-foreground">{featuredProperties.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {featuredProperties.filter(p => p.is_active).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {featuredProperties.filter(p => p.content.isNew).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Properties Management</CardTitle>
          <CardDescription>Manage properties displayed on the homepage</CardDescription>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search properties..."
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
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {property.content.image && (
                        <img 
                          src={property.content.image} 
                          alt={property.title}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {property.title}
                          {property.content.isNew && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {property.content.bedrooms} bed, {property.content.bathrooms} bath
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{property.content.location}</TableCell>
                  <TableCell className="font-medium">{property.content.price}</TableCell>
                  <TableCell>{property.content.propertyType}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(property)}
                      className={property.is_active ? 'text-green-600' : 'text-red-600'}
                    >
                      {property.is_active ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                  <TableCell>{property.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(property)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Edit Featured Property' : 'Add Featured Property'}
            </DialogTitle>
            <DialogDescription>
              {editingProperty ? 'Update the property information' : 'Add a new featured property to the homepage'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Luxury Apartment in Mumbai"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., ₹1.2 Cr"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  placeholder="e.g., 3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                  placeholder="e.g., 2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="e.g., 1200 sq ft"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select 
                value={formData.propertyType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isNew"
                checked={formData.isNew}
                onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                className="rounded border border-input"
              />
              <Label htmlFor="isNew">Mark as "New" property</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border border-input"
              />
              <Label htmlFor="is_active">Active (visible on homepage)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingProperty ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};