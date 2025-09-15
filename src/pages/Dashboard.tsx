import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, MessageSquare, User, LogOut, Plus, Eye, Edit, Trash, FileText, Shield, MapPin, Home } from 'lucide-react';
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

type CombinedProperty = Property & {
  isSubmission?: boolean;
  submissionId?: string;
};

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
  
  const [properties, setProperties] = useState<CombinedProperty[]>([]);
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
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showOnlyActive, setShowOnlyActive] = useState(false);

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
      // 1) Fetch approved/pending properties belonging to user
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // 2) Fetch user's submissions that are still under review
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('user_id', user?.id)
        .in('status', ['new', 'review', 'pending'])
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Map submissions to CombinedProperty shape for dashboard display
      const mappedSubmissions: CombinedProperty[] = (submissionsData || []).map((sub: any) => {
        let payload: any = {};
        try {
          payload = typeof sub.payload === 'string' ? JSON.parse(sub.payload) : (sub.payload || {});
        } catch {
          payload = {};
        }
        return {
          id: sub.id, // use submission id; flagged by isSubmission
          submissionId: sub.id,
          isSubmission: true,
          user_id: user!.id,
          title: payload.title || sub.title || 'Untitled',
          property_type: payload.property_type || payload.propertyType || 'residential',
          listing_type: payload.listing_type || payload.listingType || 'sale',
          bhk_type: payload.bhk_type || null as any,
          expected_price: Number(payload.expected_price) || 0,
          super_area: Number(payload.super_area) || undefined,
          carpet_area: Number(payload.carpet_area) || undefined,
          bathrooms: payload.bathrooms || undefined,
          balconies: payload.balconies || undefined,
          city: payload.city || 'Unknown',
          locality: payload.locality || '',
          state: payload.state || 'Unknown',
          pincode: payload.pincode || '000000',
          description: payload.description || '',
          images: Array.isArray(payload.images) ? payload.images : [],
          videos: Array.isArray(payload.videos) ? payload.videos : [],
          status: 'pending',
          created_at: sub.created_at,
          updated_at: sub.updated_at,
          owner_name: undefined,
          owner_email: undefined,
          owner_phone: undefined,
          owner_role: undefined,
        } as CombinedProperty;
      });

      const combined: CombinedProperty[] = [
        ...(propertiesData || []),
        ...mappedSubmissions,
      ]
      // Sort newest first consistently
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setProperties(combined);
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

  const handleViewProperty = (property: CombinedProperty) => {
    // Navigate to the property's individual details page
    // Both approved properties and submissions can be viewed
    navigate(`/property/${property.id}`);
  };


  const handleEditProperty = (property: CombinedProperty) => {
    if (property.isSubmission) {
      // For flatmates properties, route to amenities step (step 4)
      // For other properties, route to images step (step 5)
      console.log('Property data:', property);
      console.log('Property type:', property.property_type);
      console.log('Listing type:', property.listing_type);
      
      const targetStep = property.property_type === 'apartment' && property.listing_type === 'rent' 
        ? 'amenities' 
        : 'images';
      
      console.log('Target step:', targetStep);
      navigate(`/post-property?step=${targetStep}`);
      return;
    }
    // For approved properties, go to the edit page
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

  const handleUpgradeProperty = (property: CombinedProperty) => {
    // Determine the appropriate pricing plan based on property type and listing type
    const isCommercial = property.property_type === 'commercial' || 
                        property.property_type === 'office' || 
                        property.property_type === 'shop' || 
                        property.property_type === 'warehouse' || 
                        property.property_type === 'showroom';
    
    const isRent = property.listing_type === 'rent';
    
    let planTab = '';
    
    if (isCommercial) {
      if (isRent) {
        planTab = 'commercial-owner';
      } else {
        planTab = 'commercial-seller';
      }
    } else {
      if (isRent) {
        planTab = 'owner';
      } else {
        planTab = 'seller';
      }
    }
    
    navigate(`/plans?tab=${planTab}`);
  };

  // Filter properties based on selected filter and active toggle
  const filteredProperties = properties.filter(property => {
    // Apply "Only Active" filter
    if (showOnlyActive && property.status !== 'active' && property.status !== 'approved') {
      return false;
    }
    
    // Apply category filter
    if (selectedFilter === 'All') return true;
    
    if (selectedFilter === 'Rent') {
      return property.listing_type === 'rent' && property.property_type !== 'commercial';
    }
    if (selectedFilter === 'Sale') {
      return property.listing_type === 'sale' && property.property_type !== 'commercial';
    }
    if (selectedFilter === 'Commercial-Rent') {
      return property.listing_type === 'rent' && property.property_type === 'commercial';
    }
    if (selectedFilter === 'Commercial-Sale') {
      return property.listing_type === 'sale' && property.property_type === 'commercial';
    }
    if (selectedFilter === 'PG/Hostel') {
      return property.property_type === 'pg_hostel';
    }
    if (selectedFilter === 'Flatmates') {
      return property.listing_type === 'rent' && property.property_type === 'apartment';
    }
    if (selectedFilter === 'Land/Plot') {
      return property.property_type === 'land' || property.property_type === 'plot';
    }
    
    return true;
  });

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


        {/* Employee Panel Access - Hidden */}
        {false && (
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
        )}

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
            {/* Header with Property Count and Toggle */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-700">
                You have already posted {properties.length} properties on PropertyMatch
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Only Active</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={showOnlyActive}
                      onChange={(e) => setShowOnlyActive(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <Button onClick={() => navigate('/post-property')} className="bg-brand-red hover:bg-brand-red/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {['All', 'Rent', 'Sale', 'Commercial-Rent', 'Commercial-Sale', 'PG/Hostel', 'Flatmates', 'Land/Plot'].map((filter) => (
                <Button 
                  key={filter}
                  variant="outline" 
                  onClick={() => setSelectedFilter(filter)}
                  className={selectedFilter === filter 
                    ? "border-2 border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100" 
                    : "border-gray-300 hover:border-teal-500"
                  }
                >
                  {filter}
                </Button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-8">Loading properties...</div>
            ) : filteredProperties.length === 0 ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  // Get the first image for preview
                  const getImageUrl = () => {
                    if (property.images && property.images.length > 0) {
                      const firstImage = property.images[0];
                      if (typeof firstImage === 'string') {
                        return firstImage.startsWith('http') ? firstImage : firstImage;
                      }
                      if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
                        return (firstImage as any).url;
                      }
                    }
                    return '/placeholder.svg';
                  };

                  const getStatusBadge = () => {
                    if ('isSubmission' in property) {
                      return { text: 'In Progress', className: 'bg-gray-500 text-white' };
                    }
                    
                    if (property.status === 'approved' || property.status === 'active') {
                      return { text: 'For Rent', className: 'bg-orange-500 text-white' };
                    }
                    
                    if (property.status === 'inactive') {
                      return { text: 'Inactive', className: 'bg-gray-400 text-white' };
                    }

                    return { text: 'Pending', className: 'bg-blue-500 text-white' };
                  };

                  const statusBadge = getStatusBadge();

                  return (
                    <Card key={property.id} className="relative bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      {/* Inactive Status Badge - Top Left */}
                      <div className="absolute top-2 left-2 z-20 px-2 py-1 text-xs font-medium rounded bg-gray-500 text-white">
                        Inactive
                      </div>

                      {/* Diagonal Ribbon - Top Right Corner */}
                      <div className="absolute top-0 right-0 z-10">
                        <div className={`${property.listing_type === 'rent' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-xs font-medium py-1 px-6 transform rotate-45 translate-x-3 translate-y-2`}>
                          For {property.listing_type === 'rent' ? 'Rent' : 'Buy'}
                        </div>
                      </div>

                      <CardContent className="p-0">
                        {/* Horizontal Layout: Text Left, Image Right */}
                        <div className="flex h-32">
                          {/* Left Side - Text Content */}
                          <div className="flex-1 p-3 flex flex-col justify-between">
                            {/* Title with External Link Icon */}
                            <div>
                              <div className="flex items-start gap-2 mb-1">
                                <h3 className="font-normal text-gray-900 text-sm flex-1 leading-tight" title={property.title}>
                                  {property.title}
                                </h3>
                                <svg className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                              
                              {/* Price and Location */}
                              <div className="text-sm text-gray-700 mb-2">
                                <span className="text-gray-500">
                                  Price: 
                                </span>
                                <span className="font-medium">₹{property.expected_price.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">• Hyderabad</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProperty(property)}
                                className="text-xs px-3 py-1 h-7 font-normal"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-3 py-1 h-7 font-normal"
                              >
                                Upload Media
                              </Button>
                            </div>
                          </div>

                          {/* Right Side - Image */}
                          <div className="w-24 bg-gray-50 flex items-center justify-center">
                            <img
                              src={getImageUrl()}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                            {/* Camera icon placeholder if no image */}
                            {(!property.images || property.images.length === 0) && (
                              <div className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center bg-white">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Section - Contact Status and Go Premium */}
                        <div className="px-3 pb-3">
                          {/* Contact Status */}
                          <div className="text-sm text-gray-500 mb-2">
                            None Contacted
                          </div>

                          {/* Go Premium Button */}
                          <Button
                            onClick={() => handleUpgradeProperty(property)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 h-7 font-normal"
                          >
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.894.553l2.991 5.982a.869.869 0 010 .775l-2.991 5.982A1 1 0 0112 16H9a1 1 0 01-1-1V3a1 1 0 011-1h3z" clipRule="evenodd" />
                            </svg>
                            Go Premium
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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