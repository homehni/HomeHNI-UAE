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
import { PropertyEditModal } from '@/components/PropertyEditModal';
import { RequirementMatches } from '@/components/RequirementMatches';
import { RequirementsChatLayout } from '@/components/requirements/RequirementsChatLayout';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import { NotificationManager } from '@/components/notifications/NotificationManager';
import { PropertyProgressCompact } from '@/components/notifications/PropertyProgressCompact';
import { MissingImagesNotification } from '@/components/notifications/MissingImagesNotification';
import { calculatePropertyCompletion, calculatePGPropertyCompletion } from '@/utils/propertyCompletion';

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
  updated_at?: string;
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
    // Navigate to the property's individual details page
    navigate(`/property/${property.id}`);
  };


  const handleEditProperty = (property: Property) => {
    navigate(`/edit-property/${property.id}`);
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
            <TabsTrigger value="properties" className="text-xs md:text-sm">My Listings</TabsTrigger>
            <TabsTrigger value="requirements" className="text-xs md:text-sm">My Requirements</TabsTrigger>
            <TabsTrigger value="leads" className="text-xs md:text-sm">Contact Leads</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs md:text-sm">Profile</TabsTrigger>
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
                      <div className="flex justify-between items-start gap-4">
                         <div className="flex-1 min-w-0">
                            {/* Title and Actions Row */}
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 flex-1 min-w-0 pr-4">
                                {property.title}
                              </h3>
                              <div className="flex space-x-2 flex-shrink-0">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewProperty(property)}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditProperty(property)}
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="hidden sm:inline">Edit</span>
                                </Button>
                                <Button 
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  size="sm"
                                  onClick={() => openDeleteModal('property', property.id, property.title)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Main Property Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Type:</span>
                                  <span className="text-sm text-gray-900 capitalize">{property.property_type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">For:</span>
                                  <span className="text-sm text-gray-900 capitalize">{property.listing_type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Price:</span>
                                  <span className="text-sm font-semibold text-green-600">₹{property.expected_price.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Location:</span>
                                  <span className="text-sm text-gray-900 text-right max-w-48 truncate" title={property.locality}>
                                    {property.locality}
                                  </span>
                                </div>
                                {property.super_area && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Area:</span>
                                    <span className="text-sm text-gray-900">{property.super_area} sq.ft</span>
                                  </div>
                                )}
                                {property.bhk_type && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">BHK:</span>
                                    <span className="text-sm text-gray-900">{property.bhk_type}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Additional Details and Stats */}
                            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 mb-3">
                              <div className="flex items-center gap-4">
                                {property.images && property.images.length > 0 && (
                                  <div className="flex items-center">
                                    <span className="font-medium">Images:</span>
                                    <span className="ml-1">{property.images.length} photos</span>
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  <span>Views: 0</span>
                                </div>
                                <div className="flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  <span>Leads: 0</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Expires: {new Date(new Date(property.created_at).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
                                    toast({
                                      title: "Link copied!",
                                      description: "Property link copied to clipboard",
                                    });
                                  }}
                                >
                                  📋 Copy Link
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-xs text-green-600 hover:text-green-800 hover:bg-green-50"
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: property.title,
                                        text: `Check out this property: ${property.title}`,
                                        url: `${window.location.origin}/property/${property.id}`
                                      });
                                    } else {
                                      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
                                      toast({
                                        title: "Link copied!",
                                        description: "Share this link with potential buyers/tenants",
                                      });
                                    }
                                  }}
                                >
                                  📤 Share
                                </Button>
                              </div>
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
                           <div className="mt-2 flex items-center gap-2 flex-wrap">
                             {/* Enhanced Status Badge */}
                             <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                               property.status === 'approved' 
                                 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                 : property.status === 'pending'
                                 ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                 : 'bg-gray-100 text-gray-800 border border-gray-200'
                             }`}>
                               {property.status === 'approved' ? '🟢 Active' : 
                                property.status === 'pending' ? '🟡 Under Review' : 
                                '⚪ ' + property.status}
                             </span>
                             
                             {/* Property edited recently flag */}
                             {property.status === 'pending' && property.updated_at && property.created_at && 
                              new Date(property.updated_at) > new Date(property.created_at) && (
                               <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 border border-orange-200" title={`Last edited: ${new Date(property.updated_at).toLocaleString()}`}>
                                 ✏️ Recently Edited
                               </span>
                             )}

                             {/* Listing ID Badge */}
                             <span className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded border">
                               ID: {property.id.slice(-8).toUpperCase()}
                             </span>

                             {/* Posted Date */}
                             <span className="text-xs text-gray-500">
                               Posted: {new Date(property.created_at).toLocaleDateString()}
                             </span>
                           </div>
                           

                           {/* Property Notifications */}
                           {property.status === 'approved' && (
                             <>
                               {/* Missing Images Notification - Priority */}
                               {(!property.images || property.images.length === 0) && (
                                 <MissingImagesNotification
                                   propertyId={property.id}
                                   propertyTitle={property.title}
                                 />
                               )}
                               
                               {/* Progress Notification - Only if has images but other fields missing */}
                               {property.images && property.images.length > 0 && (
                                 <PropertyProgressCompact
                                   propertyId={property.id}
                                   completionPercentage={
                                     property.property_type === 'pg_hostel' 
                                       ? calculatePGPropertyCompletion(property as any).percentage
                                       : calculatePropertyCompletion(property).percentage
                                   }
                                   missingFields={
                                     property.property_type === 'pg_hostel' 
                                       ? calculatePGPropertyCompletion(property as any).missingFields
                                       : calculatePropertyCompletion(property).missingFields
                                   }
                                   propertyType={property.property_type}
                                 />
                               )}
                             </>
                           )}
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