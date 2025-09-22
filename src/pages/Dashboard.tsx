import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, MessageSquare, User, LogOut, Plus, Eye, Edit, Trash, FileText, Shield, MapPin, Home, Medal, Heart, Search, Filter, ArrowUpDown, Phone, TrendingUp, Menu, X } from 'lucide-react';
import ChatBot from '@/components/ChatBot';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { PropertyEditModal } from '@/components/PropertyEditModal';
import { RequirementMatches } from '@/components/RequirementMatches';
import { RequirementsChatLayout } from '@/components/requirements/RequirementsChatLayout';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import { NotificationManager } from '@/components/notifications/NotificationManager';
import { MissingImagesNotification } from '@/components/notifications/MissingImagesNotification';
import { calculatePropertyCompletion, calculatePGPropertyCompletion } from '@/utils/propertyCompletion';
import { useFavorites } from '@/hooks/useFavorites';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface FavoriteProperty {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  properties: Property;
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
  
  // Sidebar navigation state - map tab to sidebar item
  const getSidebarItemFromTab = (tab: string) => {
    switch (tab) {
      case 'interest': return 'interest';
      case 'leads': return 'leads';
      case 'profile': return 'profile';
      case 'payments': return 'payments';
      case 'interested': return 'interested';
      default: return 'properties';
    }
  };
  
  const [activeSidebarItem, setActiveSidebarItem] = useState(getSidebarItemFromTab(initialTab));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [properties, setProperties] = useState<CombinedProperty[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [serviceSubmissions, setServiceSubmissions] = useState<ServiceSubmission[]>([]);
  const [propertyRequirements, setPropertyRequirements] = useState<PropertyRequirement[]>([]);
  const [requirementsPage, setRequirementsPage] = useState(1);
  const requirementsPerPage = 3;
  const [loading, setLoading] = useState(true);
  
  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteProperty[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'rent' | 'sale'>('all');
  const { refetchFavorites, toggleFavorite, favorites: localFavorites } = useFavorites();
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
  
  // Profile states
  const [profileName, setProfileName] = useState('');
  const [originalProfileName, setOriginalProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [originalProfilePhone, setOriginalProfilePhone] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchLeads();
      fetchServiceSubmissions();
      fetchPropertyRequirements();
      fetchFavorites();
    }
  }, [user]);

  // Load profile name from Supabase profiles when user changes
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      console.log('Loading profile data for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('user_id', user.id)
        .maybeSingle();
        
      console.log('Profile data loaded:', data, 'Error:', error);
      
      if (!error && data) {
        if (data.full_name) {
          setProfileName(data.full_name);
          setOriginalProfileName(data.full_name);
        }
        if (data.phone) {
          setProfilePhone(data.phone);
          setOriginalProfilePhone(data.phone);
        }
      }
    };
    loadProfileData();
  }, [user?.id]);

  // Update active tab when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get('tab') || 'properties';
    setActiveTab(tabFromUrl);
    setActiveSidebarItem(getSidebarItemFromTab(tabFromUrl));
  }, [location.search]);

  // Handle tab change
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', newTab);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  // Handle sidebar navigation
  const handleSidebarNavigation = (item: string) => {
    setActiveSidebarItem(item);
    setActiveTab(item);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', item);
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

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setFavoritesLoading(true);
      console.log('Fetching favorites for user:', user.id);
      
      // First get the favorite property IDs from database
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('user_favorites')
        .select('id, property_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) {
        console.error('Error fetching favorites from DB:', favoritesError);
        throw favoritesError;
      }

      console.log('Database favorites:', favoritesData);

      // Handle database favorites (real properties)
      let combinedData: FavoriteProperty[] = [];

      if (favoritesData && favoritesData.length > 0) {
        // Get the property IDs
        const propertyIds = favoritesData.map(fav => fav.property_id);
        console.log('Fetching properties for IDs:', propertyIds);

        // Fetch via RPC to bypass RLS and get visible, approved properties
        const publicProps = await Promise.all(
          propertyIds.map(async (id) => {
            const { data, error } = await supabase.rpc('get_public_property_by_id', { property_id: id });
            if (error) {
              console.error('Error fetching property via RPC:', id, error);
              return null;
            }
            // RPC returns an array (TABLE), take first row
            return (data && Array.isArray(data) ? data[0] : null) as any | null;
          })
        );

        const uniqueProperties = (publicProps.filter(Boolean) as any[]);

        if (uniqueProperties.length > 0) {
          // Combine the database data for properties that exist
          const dbFavorites = favoritesData.map(favorite => {
            const property = uniqueProperties.find(p => p.id === favorite.property_id);
            if (property) {
              return {
                id: favorite.id,
                user_id: user.id,
                property_id: favorite.property_id,
                created_at: favorite.created_at,
                properties: property
              };
            }
            return null;
          }).filter(Boolean) as FavoriteProperty[];
          
          combinedData = [...combinedData, ...dbFavorites];
          console.log('Successfully mapped database favorites:', dbFavorites.length);
        }
      }

      console.log('Final combined data:', combinedData);
      setFavorites(combinedData);
      setFilteredFavorites(combinedData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load your saved properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Filter and sort favorites
  useEffect(() => {
    let filtered = [...favorites];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(fav => 
        fav.properties.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.properties.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.properties.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(fav => 
        fav.properties.listing_type.toLowerCase() === filterType
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price_low':
          return a.properties.expected_price - b.properties.expected_price;
        case 'price_high':
          return b.properties.expected_price - a.properties.expected_price;
        default:
          return 0;
      }
    });

    setFilteredFavorites(filtered);
  }, [favorites, searchTerm, sortBy, filterType]);

  const handleRemoveFavorite = async (favoriteId: string, propertyTitle: string) => {
    try {
      // Check if this is a demo or missing property
      const isDemo = favoriteId.startsWith('demo-');
      const isMissing = favoriteId.startsWith('missing-');
      
      if (isDemo || isMissing) {
        // For demo and missing properties, just toggle the favorite status
        const propertyId = isDemo 
          ? favoriteId.replace('demo-', '')
          : favoriteId.replace('missing-', '');
        await toggleFavorite(propertyId);
        
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        
        toast({
          title: isDemo ? "Demo property removed" : "Property removed",
          description: `"${propertyTitle}" has been removed from your saved properties.`,
        });
      } else {
        // For real properties, delete from database
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('id', favoriteId);

        if (error) throw error;

        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        
        // Refresh the favorites in the global hook
        refetchFavorites();
        
        toast({
          title: "Property removed",
          description: `"${propertyTitle}" has been removed from your saved properties.`,
        });
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove property from favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewFavoriteProperty = (propertyId: string, property: Property) => {
    try {
      console.log('Opening property details for:', propertyId, property.title);
      
      // Store comprehensive property data in sessionStorage for new tab access
      const propertyForDetails = {
        ...property,
        // Ensure all required fields are present
        id: propertyId,
        title: property.title || 'Property Details',
        images: property.images || [],
        videos: property.videos || []
      };
      
      sessionStorage.setItem(`property-${propertyId}`, JSON.stringify(propertyForDetails));
      
      // Open property details in new tab - this will show the full PropertyDetails page
      const newWindow = window.open(`/property/${propertyId}`, '_blank');
      
      if (!newWindow) {
        // Fallback if popup is blocked - navigate in same tab
        window.location.href = `/property/${propertyId}`;
      }
      
      console.log('Property details opened successfully');
    } catch (error) {
      console.error('Error opening property details:', error);
      toast({
        title: "Error",
        description: "Failed to open property details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
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
    // Calculate missing fields to determine the best tab to open
    const completion = calculatePropertyCompletion(property);
    const missingFields = completion.missingFields;
    const propertyType = property.property_type;
    
    // Determine target tab based on missing fields (same logic as PropertyProgressCompact)
    const getTargetTab = (missingFields: string[], propertyType: string) => {
      const isCommercial = propertyType === 'commercial' || propertyType === 'office' || 
                          propertyType === 'shop' || propertyType === 'warehouse' || propertyType === 'showroom';
      
      const priorityOrder = isCommercial 
        ? ['images', 'locality', 'super_area', 'description', 'expected_price']
        : ['images', 'locality', 'super_area', 'bhk_type', 'expected_price'];
      
      const topField = priorityOrder.find(field => missingFields.includes(field));
      
      switch (topField) {
        case 'images': return 'images';
        case 'amenities': return 'details';
        case 'locality': return 'location';
        case 'super_area': return 'details';
        case 'bhk_type': return 'basic';
        case 'description': return 'basic';
        case 'expected_price': return 'basic';
        default: return 'basic';
      }
    };
    
    const targetTab = getTargetTab(missingFields, propertyType);
    navigate(`/edit-property/${property.id}?tab=${targetTab}`);
  };
  const closeEditModal = () => {
    setEditPropertyModal({
      isOpen: false,
      property: null,
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

  const handleUpdateName = async () => {
    if (!user || !profileName.trim()) return;

    setIsUpdatingName(true);
    try {
      const newName = profileName.trim();

      // Update the existing profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profiles update error:', profileError);
        throw profileError;
      }

      // Also update auth user metadata so it stays in sync on reloads
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: newName },
      });
      if (authError) {
        console.warn('Auth metadata update failed (non-blocking):', authError);
      }

      setOriginalProfileName(newName);

      toast({
        title: "Profile updated",
        description: "Your name has been updated successfully.",
      });

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: `Failed to update your name: ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!user || !profilePhone.trim()) return;

    setIsUpdatingPhone(true);
    try {
      const newPhone = profilePhone.trim();
      console.log('Updating phone for user:', user.id, 'to:', newPhone);

      // Update the existing profile record
      const { data, error: profileError } = await supabase
        .from('profiles')
        .update({ phone: newPhone })
        .eq('user_id', user.id)
        .select();

      if (profileError) {
        console.error('Profiles update error:', profileError);
        throw profileError;
      }

      console.log('Phone update successful:', data);
      
      // Call admin edge function to update auth.users phone field
      try {
        const { data: authUpdateData, error: authUpdateError } = await supabase.functions.invoke('update-auth-phone', {
          body: { 
            userId: user.id,
            phoneNumber: newPhone 
          }
        });

        if (authUpdateError) {
          console.warn('Auth phone update via edge function failed:', authUpdateError);
        } else {
          console.log('Auth phone updated successfully via edge function:', authUpdateData);
        }
      } catch (edgeFunctionError) {
        console.warn('Edge function call failed:', edgeFunctionError);
      }

      // Also sync into auth user metadata for additional reference
      const { error: authError } = await supabase.auth.updateUser({
        data: { profile_phone: newPhone },
      });
      if (authError) {
        console.warn('Auth metadata phone update failed (non-blocking):', authError);
      }

      setOriginalProfilePhone(newPhone);

      toast({
        title: "Profile updated",
        description: "Your phone number has been updated successfully.",
      });

    } catch (error: any) {
      console.error('Error updating phone:', error);
      toast({
        title: "Error",
        description: `Failed to update your phone number: ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPhone(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Marquee />
      
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
          </div>

      <div className="flex pt-20 lg:pt-20">
        {/* Sidebar Navigation - Hidden on mobile, visible on desktop */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-64 bg-white shadow-lg lg:shadow-sm border-r border-gray-200 min-h-screen transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
        </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-6">Manage your Account</h2>
            <nav className="space-y-2">
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'profile' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  handleSidebarNavigation('profile');
                  setIsMobileMenuOpen(false);
                }}
              >
                Basic Profile
                  </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'interest' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                    onClick={() => {
                  handleSidebarNavigation('interest');
                  setIsMobileMenuOpen(false);
                }}
              >
                Your Shortlists
                </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'leads' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  handleSidebarNavigation('leads');
                  setIsMobileMenuOpen(false);
                }}
              >
                Owners you Contacted
          </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'payments' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  handleSidebarNavigation('payments');
                  setIsMobileMenuOpen(false);
                }}
              >
                Your Payments
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'properties' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  handleSidebarNavigation('properties');
                  setIsMobileMenuOpen(false);
                }}
              >
                Your Properties
          </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'interested' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  handleSidebarNavigation('interested');
                  setIsMobileMenuOpen(false);
                }}
              >
                Interested in your Properties
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-6 lg:ml-0 min-h-screen">
          {/* Content based on sidebar selection */}
          {activeSidebarItem === 'properties' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                You have already posted {properties.length} properties on Home HNI
                </h1>
              </div>

              {/* Filter Tabs */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
                  <div className="flex flex-wrap gap-1">
                    {['All', 'Rent', 'Sale', 'Commercial-Rent', 'Commercial-Sale', 'PG/Hostel', 'Flatmates', 'Land/Plot'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          selectedFilter === filter
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
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
              </div>
            </div>

              {/* Properties Content */}
            {loading ? (
              <div className="text-center py-8">Loading properties...</div>
            ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties listed yet</h3>
                  <p className="text-gray-500 mb-4">Start by adding your first property listing</p>
                  <Button onClick={() => navigate('/post-property')}>
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Property
                  </Button>
                </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredProperties.map((property) => {
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
                        <div className="flex items-center">
                          {/* Left Side - Text Content */}
                          <div className="flex-1 p-3">
                            {/* Title with External Link Icon */}
                            <div className="mb-2 mt-8">
                              <div 
                                className="inline-flex items-center gap-1 cursor-pointer group"
                                title={property.title}
                                onClick={() => handleViewProperty(property)}
                              >
                                <h3 className="font-medium text-gray-800 text-sm leading-tight truncate hover:text-red-500 transition-colors">
                                  {property.title}
                                </h3>
                                <svg className="w-3 h-3 text-gray-400 group-hover:text-red-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-500 mb-1">
                              {property.locality || property.city}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              <span>{property.listing_type === 'rent' ? 'Rent:' : 'Price:'} </span>
                              <span className="font-medium text-gray-900">₹{property.expected_price.toLocaleString()}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mb-3">
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
                                onClick={() => openDeleteModal('property', property.id, property.title)}
                                className="text-xs px-3 py-1 h-7 font-normal text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>

                            {/* Go Premium Button */}
                            <Button
                              onClick={() => handleUpgradeProperty(property)}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 px-3 h-7 font-normal w-auto mb-3"
                            >
                              <Medal className="w-3 h-3 mr-1" />
                              Go Premium
                            </Button>

                          </div>

                          {/* Right Side - Image Area */}
                          <div className="flex-shrink-0 ml-3 w-24 h-24 bg-white rounded-md flex items-center justify-center pr-3">
                            {(property.images && property.images.length > 0) ? (
                              <img
                                src={getImageUrl()}
                                alt={property.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <div className="relative w-20 h-20 bg-gray-200/70 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300/70 transition-colors group p-4">
                                  <svg className="w-6 h-6 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="text-xs font-normal text-gray-600 text-center leading-tight">
                                    Upload Media
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            </div>
          )}

          {/* Requirements/Shortlists Content */}
          {activeSidebarItem === 'interest' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Saved Properties</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        {favorites.length > 0 
                          ? `${favorites.length} ${favorites.length === 1 ? 'property' : 'properties'} saved`
                          : 'Keep track of properties you\'re interested in'
                        }
                      </span>
                      {filteredFavorites.length !== favorites.length && (
                        <span className="text-blue-600">
                          {filteredFavorites.length} shown
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate('/property-search')} variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Properties
                    </Button>
                    {favorites.length > 0 && (
                      <Button 
                        onClick={() => {
                          const totalValue = favorites.reduce((sum, fav) => sum + fav.properties.expected_price, 0);
                          toast({
                            title: "Portfolio Stats",
                            description: `Total value of saved properties: ${formatPrice(totalValue)}`,
                          });
                        }}
                        variant="outline" 
                        size="sm"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Stats
                      </Button>
                    )}
                  </div>
                </div>
              </div>


              {/* Loading State */}
              {favoritesLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your saved properties...</p>
                </div>
              )}

              {/* Empty State */}
              {!favoritesLoading && favorites.length === 0 && (
                <Card className="mx-auto max-w-md">
                  <CardContent className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Saved Properties Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Click the ❤️ on any property to save it to your interests.
                    </p>
                    <Button onClick={() => navigate('/property-search')} className="bg-red-800 hover:bg-red-900 text-white">
                      Browse Properties
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* No Results State */}
              {!favoritesLoading && favorites.length > 0 && filteredFavorites.length === 0 && (
                <Card className="mx-auto max-w-md">
                  <CardContent className="text-center py-12">
                    <Search className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Properties Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search or filter criteria.
                    </p>
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterType('all');
                        setSortBy('newest');
                      }} 
                      className="bg-brand-red hover:bg-brand-red-dark text-white"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Properties Grid - Horizontal Card Layout */}
              {!favoritesLoading && filteredFavorites.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {filteredFavorites.map((favorite) => {
                    const property = favorite.properties;
                    return (
                      <div
                        key={favorite.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red/40"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); handleViewFavoriteProperty(property.id, property); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleViewFavoriteProperty(property.id, property);
                          }
                        }}
                      >
                        {/* Property Image */}
                        <div className="relative h-32 bg-gray-200">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <svg 
                                width="120" 
                                height="120" 
                                viewBox="0 0 32 32" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-600"
                              >
                                {/* House icon */}
                                <path 
                                  d="M6 24V12L16 4L26 12V24H20V18H12V24H6Z" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                                {/* Chimney */}
                                <path 
                                  d="M8 8V4H10V8" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                                {/* Door */}
                                <rect 
                                  x="12" 
                                  y="18" 
                                  width="3" 
                                  height="6" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  fill="none"
                                />
                                {/* Window */}
                                <rect 
                                  x="20" 
                                  y="16" 
                                  width="3" 
                                  height="3" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  fill="none"
                                />
                                {/* Ground line */}
                                <path 
                                  d="M4 24H28" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round"
                                />
                                {/* Cloud with dashed lines */}
                                <path 
                                  d="M22 8C23.5 8 24.5 9 24.5 10.5C24.5 10.5 25 10.5 25 12C25 13 24 14 23 14" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round" 
                                  fill="none"
                                />
                                {/* Dashed lines */}
                                <path 
                                  d="M26 10.5H28M26 11.5H28M26 12.5H28" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round" 
                                  strokeDasharray="2,2"
                                />
                              </svg>
                            </div>
                          )}
                          
                          {/* New Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                              New
                            </span>
                          </div>

                          {/* Heart Icon */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(favorite.id, property.title); }}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                          </button>
                        </div>

                        <div className="p-3">
                          {/* Property Title */}
                          <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-1">
                            {property.title}
                          </h3>

                          {/* Contact Button with Price */}
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleViewFavoriteProperty(property.id, property)}
                              className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              <span className="text-xs font-medium">Contact</span>
                            </button>
                            <span className="text-sm font-bold text-gray-900">
                              {formatPrice(property.expected_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Leads Content */}
          {activeSidebarItem === 'leads' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Contact Leads</h1>
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
            </div>
          )}

          {/* Profile Content */}
          {activeSidebarItem === 'profile' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Profile Information</h1>
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
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Enter your name"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleUpdateName}
                      disabled={isUpdatingName || profileName.trim() === originalProfileName.trim()}
                      size="sm"
                    >
                      {isUpdatingName ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
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
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="flex-1"
                      type="tel"
                    />
                    <Button
                      onClick={handleUpdatePhone}
                      disabled={isUpdatingPhone || profilePhone.trim() === originalProfilePhone.trim()}
                      size="sm"
                    >
                      {isUpdatingPhone ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>
          )}

          {/* Payments Content */}
          {activeSidebarItem === 'payments' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Your Payments</h1>
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
                <p className="text-gray-500">Your payment history will appear here</p>
              </div>
            </div>
          )}

          {/* Interested in your Properties Content */}
          {activeSidebarItem === 'interested' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Interested in your Properties</h1>
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interested parties</h3>
                <p className="text-gray-500">People interested in your properties will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ChatBot Component */}
      <ChatBot />

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