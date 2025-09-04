import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, MessageSquare, User, LogOut, Plus, Eye, Edit, Trash, FileText, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { PropertyDetailModal } from '@/components/PropertyDetailModal';
import { PropertyEditModal } from '@/components/PropertyEditModal';
import { RequirementMatches } from '@/components/RequirementMatches';
import { RequirementsChatLayout } from '@/components/requirements/RequirementsChatLayout';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';

interface Property {
  id: string;
  user_id: string; // Added for ownership check
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_role?: string;
}

interface Lead {
  id: string;
  interested_user_name: string;
  interested_user_email: string;
  interested_user_phone: string;
  message: string;
  created_at: string;
  properties: {
    title: string;
  };
}

interface ServiceSubmission {
  id: string;
  title: string | null;
  payload: Json;
  status: string;
  created_at: string;
  updated_at: string;
  city: string | null;
  state: string | null;
  user_id: string | null;
}

interface PropertyRequirement {
  id: string;
  user_id: string;
  title: string;
  payload: Json;
  status: string;
  created_at: string;
  city?: string;
  state?: string;
}

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get tab from URL parameters and manage active tab state
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'properties';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [serviceSubmissions, setServiceSubmissions] = useState<ServiceSubmission[]>([]);
  const [propertyRequirements, setPropertyRequirements] = useState<PropertyRequirement[]>([]);
  const [requirementsPage, setRequirementsPage] = useState(1);
  const requirementsPerPage = 3;
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'property' | 'draft';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'property',
    id: '',
    title: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewPropertyModal, setViewPropertyModal] = useState<{
    isOpen: boolean;
    property: Property | null;
  }>({
    isOpen: false,
    property: null
  });
  const [editPropertyModal, setEditPropertyModal] = useState<{
    isOpen: boolean;
    property: Property | null;
  }>({
    isOpen: false,
    property: null
  });

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchLeads();
      fetchServiceSubmissions();
      fetchPropertyRequirements();
    }
  }, [user]);

  // Update active tab when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get('tab') || 'properties';
    setActiveTab(tabFromUrl);
  }, [location.search]);

  // Handle tab change
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', newTab);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const fetchProperties = async () => {
    try {
      // Fetch all properties for the current user with owner information
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Owner information is now stored directly in properties table
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          properties!inner(title, user_id)
        `)
        .eq('properties.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchServiceSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter for service submissions (those with serviceType in payload)
      const serviceData = (data || []).filter(item => {
        try {
          const payload = typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload;
          return payload && typeof payload === 'object' && (payload.serviceType || payload.intent === 'Service');
        } catch (e) {
          console.error('Error parsing payload:', e, item);
          return false;
        }
      });
      
      setServiceSubmissions(serviceData);
    } catch (error) {
      console.error('Error fetching service submissions:', error);
    }
  };

  const fetchPropertyRequirements = async () => {
    try {
      console.log('🔍 Fetching property requirements for user:', user?.id);
      
      const { data, error } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      console.log('📊 Raw property_submissions data:', data);
      console.log('❌ Query error:', error);

      if (error) throw error;
      
      // Filter for property requirements (those with intent Buy, Sell, Lease, or Service)
      const requirementData = (data || []).filter(item => {
        try {
          const payload = typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload;
          console.log('📝 Processing item:', {
            id: item.id,
            title: item.title,
            payload: payload,
            intent: payload?.intent
          });
          
          const isRequirement = payload && typeof payload === 'object' && 
                 (payload.intent === 'Buy' || payload.intent === 'Sell' || payload.intent === 'Lease' || payload.intent === 'Service');
          
          console.log('✅ Is requirement:', isRequirement);
          return isRequirement;
        } catch (e) {
          console.error('Error parsing payload:', e, item);
          return false;
        }
      });
      
      console.log('🎯 Filtered requirements:', requirementData);
      console.log('📈 Total requirements found:', requirementData.length);
      
      setPropertyRequirements(requirementData);
    } catch (error) {
      console.error('💥 Error fetching property requirements:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeleteModal = (type: 'property' | 'draft', id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      type,
      id,
      title
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      type: 'property',
      id: '',
      title: ''
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModal.type === 'property') {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', deleteModal.id);

        if (error) throw error;

        toast({
          title: "Property deleted",
          description: "Your property has been removed from the listing.",
        });
        fetchProperties();
      } else {
        // Draft deletion functionality to be implemented
        toast({
          title: "Draft functionality coming soon",
          description: "Draft management will be available after the new form is implemented.",
        });
      }
      closeDeleteModal();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${deleteModal.type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewProperty = (property: Property) => {
    setViewPropertyModal({
      isOpen: true,
      property
    });
  };

  const closeViewModal = () => {
    setViewPropertyModal({
      isOpen: false,
      property: null
    });
  };

  const handleEditProperty = (property: Property) => {
    setEditPropertyModal({
      isOpen: true,
      property
    });
  };

  const closeEditModal = () => {
    setEditPropertyModal({
      isOpen: false,
      property: null
    });
  };

  const handlePropertyUpdated = () => {
    fetchProperties(); // Refresh the properties list
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Marquee />
      <div className="max-w-6xl mx-auto pt-32 p-4">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.user_metadata?.full_name || user.email}</p>
          </div>
        </div>

        {/* Employee Panel Access */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Employee Panel Access</h3>
                  <p className="text-blue-100">Access your employee dashboard to view payments and role information</p>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    // Check if user is a finance or HR admin first
                    if (window.location.pathname === '/dashboard') {
                      // For now, just navigate to employee dashboard and let the redirect handler take over
                      navigate('/employee-dashboard');
                    }
                  }}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  Employee Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.filter(p => p.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Leads</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="properties">My Listings</TabsTrigger>
            <TabsTrigger value="requirements">My Requirements</TabsTrigger>
            <TabsTrigger value="leads">Contact Leads</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Properties</h2>
              <Button onClick={() => navigate('/post-property')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading properties...</div>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties listed yet</h3>
                  <p className="text-gray-500 mb-4">Start by adding your first property listing</p>
                  <Button onClick={() => navigate('/post-property')}>
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Property
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {properties.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                         <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {property.title}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                              <div>Type: {property.property_type}</div>
                              <div>For: {property.listing_type}</div>
                              <div>Price: ₹{property.expected_price.toLocaleString()}</div>
                              <div>Location: {property.locality}, {property.city}</div>
                            </div>
                            {/* Show owner information only to the property owner (for their own listings) */}
                            {user && property.user_id === user.id && (property.owner_name || property.owner_email || property.owner_phone) && (
                              <div className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200">
                                <h4 className="text-sm font-medium text-blue-700 mb-1 flex items-center">
                                  <Shield className="h-4 w-4 mr-1" />
                                  Your Contact Information (Private)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-600">
                                  {property.owner_name && <div>Name: {property.owner_name}</div>}
                                  {property.owner_email && <div>Email: {property.owner_email}</div>}
                                  {property.owner_phone && <div>Phone: {property.owner_phone}</div>}
                                </div>
                                {property.owner_role && (
                                  <div className="text-sm text-blue-600 mt-1">Role: {property.owner_role}</div>
                                )}
                              </div>
                            )}
                           <div className="mt-2">
                             <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                               property.status === 'active' 
                                 ? 'bg-green-100 text-green-800'
                                 : 'bg-gray-100 text-gray-800'
                             }`}>
                               {property.status}
                             </span>
                           </div>
                         </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewProperty(property)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            className="bg-brand-red hover:bg-brand-red-dark text-white"
                            size="sm"
                            onClick={() => openDeleteModal('property', property.id, property.title)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-0 p-0 h-[calc(100vh-200px)]">
            <RequirementsChatLayout requirements={propertyRequirements} />
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <h2 className="text-xl font-semibold">Contact Leads</h2>
            
            {leads.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                  <p className="text-gray-500">When people show interest in your properties, you'll see them here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <Card key={lead.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{lead.interested_user_name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Interested in: {lead.properties.title}
                          </p>
                          {lead.interested_user_email && (
                            <p className="text-sm text-gray-600">Email: {lead.interested_user_email}</p>
                          )}
                          {lead.interested_user_phone && (
                            <p className="text-sm text-gray-600">Phone: {lead.interested_user_phone}</p>
                          )}
                          {lead.message && (
                            <p className="text-sm text-gray-600 mt-2">
                              Message: {lead.message}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{user.user_metadata?.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Verified</label>
                  <p className={user.email_confirmed_at ? 'text-green-600' : 'text-red-600'}>
                    {user.email_confirmed_at ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Member Since</label>
                  <p className="text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title={`Delete ${deleteModal.type === 'property' ? 'Property' : 'Draft'}`}
        description={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={viewPropertyModal.property}
        isOpen={viewPropertyModal.isOpen}
        onClose={closeViewModal}
      />

      {/* Property Edit Modal */}
      <PropertyEditModal
        property={editPropertyModal.property}
        isOpen={editPropertyModal.isOpen}
        onClose={closeEditModal}
        onPropertyUpdated={handlePropertyUpdated}
      />
    </div>
  );
};