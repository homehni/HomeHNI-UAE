import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { fetchContactedOwners, type ContactedProperty } from '@/services/leadService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, MessageSquare, MessageCircle, User, LogOut, Plus, Eye, Edit, Trash, FileText, Shield, MapPin, Home, Medal, Heart, Search, Filter, ArrowUpDown, Phone, TrendingUp, Menu, X, Check, ShoppingCart, CreditCard, Briefcase, Mail, Loader2, Users } from 'lucide-react';
import PaymentsSection from '@/components/PaymentsSection';
import PayButton from '@/components/PayButton';
import { checkLeadAccess, fetchAvailableLeads, sendLeadFollowUp, type PostRequirementLead, type LeadAccessStatus } from '@/services/leadAccessService';

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
import { Switch } from '@/components/ui/switch';
import MyChats from '@/components/dashboard/MyChats';
import { DraftPropertyCard } from '@/components/dashboard/DraftPropertyCard';
import { DealRoomLayout } from '@/components/deal-room/DealRoomLayout';
import { PropertyWatermark } from '@/components/property-details/PropertyWatermark';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { PropertyDraftService, type PropertyDraft } from '@/services/propertyDraftService';
import { generatePropertyUrl } from '@/utils/propertyUrlGenerator';
import { getCurrentUserProfile } from '@/services/profileService';

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
  // Premium flag from payments trigger
  is_premium?: boolean;
  rental_status?: string;
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
    id: string;
    title: string;
    property_type: string;
    listing_type: string;
    expected_price: number;
    city: string;
    locality: string;
    images?: string[];
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
      case 'chats': return 'chats';
      case 'dealroom': return 'dealroom';
      case 'buyleads': return 'buyleads';
      default: return 'properties';
    }
  };
  
  const [activeSidebarItem, setActiveSidebarItem] = useState(getSidebarItemFromTab(initialTab));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [properties, setProperties] = useState<CombinedProperty[]>([]);
  const [drafts, setDrafts] = useState<PropertyDraft[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contactedProperties, setContactedProperties] = useState<ContactedProperty[]>([]);
  const [contactedPropertiesLoading, setContactedPropertiesLoading] = useState(true);
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState<{ type: 'error' | 'success' | null; text: string }>({ type: null, text: '' });
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  
  // Buy Leads state
  const [leadAccess, setLeadAccess] = useState<LeadAccessStatus>({ hasBasicAccess: false, hasPremiumAccess: false, accessType: 'none' });
  const [availableLeads, setAvailableLeads] = useState<PostRequirementLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [sendingFollowUp, setSendingFollowUp] = useState<string | null>(null);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  
  // Contact lead modal state
  const [contactLeadModal, setContactLeadModal] = useState<{
    isOpen: boolean;
    leadId: string;
    leadName: string;
    leadEmail: string;
    propertyTitle: string;
  }>({
    isOpen: false,
    leadId: '',
    leadName: '',
    leadEmail: '',
    propertyTitle: ''
  });
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Fetch properties where the current user has contacted owners
  const fetchContactedOwnersData = useCallback(async () => {
    if (!user) return;
    
    try {
      setContactedPropertiesLoading(true);
      console.log('Dashboard: Fetching properties where user has contacted owners');
      
      const data = await fetchContactedOwners(user.id);
      
      console.log('Dashboard: Fetched contacted properties:', data);
      setContactedProperties(data);
    } catch (error) {
      console.error('Error fetching contacted owners:', error);
      toast({
        title: "Error",
        description: "Failed to load your contacted properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setContactedPropertiesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchLeads();
      fetchServiceSubmissions();
      fetchPropertyRequirements();
      fetchFavorites();
      fetchContactedOwnersData();
      checkAndFetchLeads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle follow-up email for premium leads
  const handleFollowUp = async (lead: PostRequirementLead) => {
    if (!leadAccess.hasPremiumAccess) {
      toast({
        title: "Premium Feature",
        description: "Follow-up emails are only available for Premium Leads subscribers.",
        variant: "destructive",
      });
      return;
    }

    setSendingFollowUp(lead.id);
    try {
      const result = await sendLeadFollowUp(lead.id, lead.email, lead.name);
      
      if (result.success) {
        toast({
          title: "Follow-up Sent",
          description: `An automated email has been sent to ${lead.name} expressing your interest in their requirement.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send follow-up email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to send follow-up email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingFollowUp(null);
    }
  };

  // Format budget range
  const formatBudget = (min: number | null, max: number | null): string => {
    if (!min && !max) return 'Not specified';
    if (!min) return `Up to ₹${(max! / 100000).toFixed(1)} L`;
    if (!max) return `₹${(min / 100000).toFixed(1)} L+`;
    return `₹${(min / 100000).toFixed(1)} L - ₹${(max / 100000).toFixed(1)} L`;
  };

  // Refresh leads after payment success
  useEffect(() => {
    const handlePaymentSuccess = () => {
      // Refresh lead access and leads after payment
      setTimeout(() => {
        checkAndFetchLeads();
        setShowPremiumUpgrade(false); // Close upgrade modal after successful payment
      }, 2000);
    };

    window.addEventListener('paymentSuccess', handlePaymentSuccess);
    return () => window.removeEventListener('paymentSuccess', handlePaymentSuccess);
  }, []);

  // Check lead access and fetch leads
  const checkAndFetchLeads = async () => {
    if (!user?.id) return;
    
    try {
      const access = await checkLeadAccess(user.id);
      setLeadAccess(access);
      
      if (access.accessType !== 'none') {
        setLeadsLoading(true);
        const leads = await fetchAvailableLeads();
        setAvailableLeads(leads);
      }
    } catch (error) {
      console.error('Error checking lead access:', error);
    } finally {
      setLeadsLoading(false);
    }
  };
  
  // Listen for contact creation events from ContactOwnerModal
  useEffect(() => {
    const handleContactCreated = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Dashboard: Contact created event received:', customEvent.detail);
      
      // Refresh contacted properties after a delay to ensure DB write completes
      setTimeout(() => {
        console.log('Dashboard: Refreshing contacted properties after new contact');
        fetchContactedOwnersData();
      }, 2000); // Increased to 2 seconds for more reliable database sync
    };
    
    window.addEventListener('contactCreated', handleContactCreated);
    
    return () => {
      window.removeEventListener('contactCreated', handleContactCreated);
    };
  }, [fetchContactedOwnersData]);
  
  // Real-time subscription for new leads (when user contacts a property) - backup method
  useEffect(() => {
    if (!user?.email) return;
    
    const channel = supabase
      .channel('user-leads-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `interested_user_email=eq.${user.email}`
        },
        (payload) => {
          console.log('Dashboard: New lead detected via realtime, refreshing contacted properties');
          // Refresh contacted properties when a new lead is created
          fetchContactedOwnersData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email, fetchContactedOwnersData]);

  // Helper function to format role display name
  const getRoleDisplayName = (role: string | null): string => {
    if (!role) return 'User';
    const roleMap: Record<string, string> = {
      'buyer': 'Property Seeker',
      'seller': 'Property Owner',
      'owner': 'Owner',
      'agent': 'Agent',
      'consultant': 'Consultant',
      'admin': 'Administrator',
      'user': 'User'
    };
    return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Load profile name from Supabase profiles when user changes
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      console.log('Loading profile data for user:', user.id);
      
      // Fetch basic profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, whatsapp_opted_in')
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
        setWhatsappOptIn(!!data.whatsapp_opted_in);
      }

      // Fetch user role using the profile service
      try {
        const userProfile = await getCurrentUserProfile();
        if (userProfile?.role) {
          setUserRole(userProfile.role);
          console.log('User role loaded:', userProfile.role);
        }
      } catch (error) {
        console.error('Error loading user role:', error);
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

  // Draft management functions
  const handleResumeDraft = async (draftId: string) => {
    try {
      console.log('Resuming draft:', draftId);
      
      // Load draft data using PropertyDraftService
      const draftData = await PropertyDraftService.loadDraftForResume(draftId);
      
      if (!draftData) {
        throw new Error('Failed to load draft data');
      }
      
      console.log('Loaded draft data:', draftData);
      
      // Store draft ID and full resume data in sessionStorage for forms to access
      sessionStorage.setItem('resumeDraftId', draftId);
      // Store the complete object (ownerInfo, formData, currentStep)
      sessionStorage.setItem('resumeDraftData', JSON.stringify(draftData));
      
      // Navigate to post property page
      navigate('/post-property');
      
      toast({
        title: "Draft Resumed",
        description: "Your draft has been loaded. Continue from where you left off.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error resuming draft:', error);
      toast({
        title: "Error",
        description: "Failed to resume draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      await PropertyDraftService.deleteDraft(draftId);
      
      // Remove from local state
      setDrafts(prev => prev.filter(draft => draft.id !== draftId));
      
      toast({
        title: "Draft Deleted",
        description: "The draft has been permanently deleted.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Error",
        description: "Failed to delete draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePreviewDraft = (draftId: string) => {
    // Open preview in new tab using the unified preview page
    window.open(`/buy/preview/${draftId}/detail`, '_blank');
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
      // Fetch both posted properties and drafts in parallel
      const [propertiesResult, draftsResult] = await Promise.all([
        // Show ONLY properties table entries belonging to the user
        supabase
          .from('properties')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        
        // Fetch user's incomplete drafts
        PropertyDraftService.getUserDrafts()
      ]);

      const { data: propertiesData, error: propertiesError } = propertiesResult;
      if (propertiesError) throw propertiesError;

      console.log('🔍 Dashboard fetchProperties - Raw data:', propertiesData);
      console.log('🔍 Dashboard fetchProperties - Sample property:', propertiesData?.[0]);
      
      // Debug: Check if any properties have images
      const propertiesWithImages = propertiesData?.filter(p => p.images && p.images.length > 0);
      console.log('🔍 Dashboard fetchProperties - Properties with images:', propertiesWithImages?.length);
      console.log('🔍 Dashboard fetchProperties - Properties without images:', propertiesData?.filter(p => !p.images || p.images.length === 0)?.length);
      
      if (propertiesWithImages && propertiesWithImages.length > 0) {
        console.log('🔍 Dashboard fetchProperties - Sample property with images:', propertiesWithImages[0]);
      }
      
      // Filter out completed drafts and set state
      const incompleteDrafts = draftsResult.filter(draft => !draft.is_completed);
      console.log('🔍 Dashboard fetchProperties - Incomplete drafts:', incompleteDrafts.length);
      
      setProperties((propertiesData || []) as CombinedProperty[]);
      setDrafts(incompleteDrafts);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Realtime updates: reflect premium status changes immediately
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('properties-premium-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'properties', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const updated = payload.new as Partial<Property> & { id: string };
          if (updated?.id) {
            setProperties(prev => prev.map(p => p.id === updated.id ? { ...p, is_premium: (updated as any).is_premium } : p));
          }
        }
      )
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch {}
    };
  }, [user?.id]);

  const fetchLeads = async () => {
    try {
      console.log('Dashboard: Fetching leads for user:', user?.id);
      
      // First, try the standard approach with property join
      const { data: standardLeads, error: standardError } = await supabase
        .from('leads')
        .select(`
          *,
          properties!inner(id, title, property_type, listing_type, expected_price, city, locality, images, user_id)
        `)
        .eq('properties.user_id', user?.id)
        .order('created_at', { ascending: false });

      console.log('Dashboard: Standard leads query result:', { standardLeads, standardError, userID: user?.id });
      
      // If standard approach works, use it
      if (!standardError && standardLeads && standardLeads.length > 0) {
        setLeads(standardLeads);
        console.log('Dashboard: Set leads count (standard):', standardLeads.length);
        return;
      }
      
      // Fallback: Get all leads and try to match property ownership differently
      console.log('Dashboard: Standard approach failed, trying fallback approach...');
      
      const { data: allLeads, error: allLeadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Dashboard: All leads query result:', { allLeads, allLeadsError });
      
      if (allLeadsError) throw allLeadsError;
      
      // For each lead, try to get property info and check ownership
      const leadsWithProperties = [];
      for (const lead of allLeads || []) {
        try {
          // Try to get property info using the same RPC function that works for display
          const { data: propertyData, error: propertyError } = await supabase
            .rpc('get_public_property_by_id', { property_id: lead.property_id });
          
          console.log(`Dashboard: Property info for lead ${lead.id}:`, { propertyData, propertyError });
          
          if (propertyData && propertyData.length > 0) {
            // Add property info to lead
            leadsWithProperties.push({
              ...lead,
              properties: {
                id: propertyData[0].id,
                title: propertyData[0].title,
                property_type: propertyData[0].property_type,
                listing_type: propertyData[0].listing_type,
                expected_price: propertyData[0].expected_price,
                city: propertyData[0].city,
                locality: propertyData[0].locality,
                images: propertyData[0].images || []
              }
            });
          } else {
            // Add lead without property info
            leadsWithProperties.push({
              ...lead,
              properties: {
                id: '',
                title: 'Property information unavailable',
                property_type: '',
                listing_type: '',
                expected_price: 0,
                city: '',
                locality: '',
                images: []
              }
            });
          }
        } catch (propertyFetchError) {
          console.error(`Dashboard: Error fetching property for lead ${lead.id}:`, propertyFetchError);
          // Add lead without property info
          leadsWithProperties.push({
            ...lead,
            properties: {
              id: '',
              title: 'Property information unavailable',
              property_type: '',
              listing_type: '',
              expected_price: 0,
              city: '',
              locality: '',
              images: []
            }
          });
        }
      }
      
      console.log('Dashboard: All leads with property info:', leadsWithProperties);
      
      // For now, show all leads (admin can filter later)
      // TODO: Once property ownership is fixed, filter by user ownership
      setLeads(leadsWithProperties);
      console.log('Dashboard: Set leads count (fallback):', leadsWithProperties.length);
      
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
        fav.properties.listing_type?.toLowerCase() === filterType
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
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "12px solid hsl(var(--brand-red))",
          },
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
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "12px solid hsl(var(--brand-red))",
          },
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
      
      // Open property details in new tab - use unified preview page
      const newWindow = window.open(`/buy/preview/${propertyId}/detail`, '_blank');
      
      if (!newWindow) {
        // Fallback if popup is blocked - navigate in same tab
        window.location.href = `/buy/preview/${propertyId}/detail`;
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

  const handleTogglePropertyStatus = async (property: CombinedProperty) => {
    const propertyId = property.id;
    const currentStatus = property.rental_status || 'available';
    const newStatus = currentStatus === 'available' ? 'inactive' : 'available';

    // Optimistic UI
    setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, rental_status: newStatus } : p)));

    try {
      // Try properties table first
      const { data: propsUpdated, error: propsErr } = await supabase
        .from('properties')
        .update({ rental_status: newStatus })
        .eq('id', propertyId)
        .select('id');

      if (propsErr) throw propsErr;

      if (!propsUpdated || propsUpdated.length === 0) {
        // Fallback to submissions table
        const { data: subsUpdated, error: subsErr } = await supabase
          .from('property_submissions')
          .update({ rental_status: newStatus })
          .eq('id', propertyId)
          .select('id');

        if (subsErr) throw subsErr;
        if (!subsUpdated || subsUpdated.length === 0) throw new Error('No matching property found to update');
      }

      toast({
        title: newStatus === 'available' ? 'Property Activated' : 'Property Deactivated',
        description: `Your property is now ${newStatus === 'available' ? 'active' : 'inactive'}.`,
      });

      fetchProperties();
    } catch (error) {
      console.error('Toggle property status failed', error);
      // Revert optimistic UI
      setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, rental_status: currentStatus } : p)));
      toast({ title: 'Error', description: 'Failed to update property status. Please try again.', variant: 'destructive' });
    }
  };

  const handleViewProperty = (property: CombinedProperty) => {
    // Navigate to the property's individual details page with SEO-friendly URL
    const propertyUrl = generatePropertyUrl(property.id, {
      propertyType: property.property_type,
      listingType: property.listing_type,
      locality: property.locality,
      city: property.city,
      bhkType: property.bhk_type
    });
    navigate(propertyUrl);
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

  // Contact lead modal functions
  const openContactLeadModal = (leadId: string, leadName: string, leadEmail: string, propertyTitle: string) => {
    setContactLeadModal({
      isOpen: true,
      leadId,
      leadName,
      leadEmail,
      propertyTitle
    });
    setContactMessage('');
  };

  const closeContactLeadModal = () => {
    setContactLeadModal({
      isOpen: false,
      leadId: '',
      leadName: '',
      leadEmail: '',
      propertyTitle: ''
    });
    setContactMessage('');
  };

  const handleSendMessageToLead = async () => {
    if (!contactMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingMessage(true);
    try {
      // Store message in database
      const { data, error } = await supabase
        .from('lead_messages' as any)
        .insert({
          lead_id: contactLeadModal.leadId,
          sender_id: user?.id,
          sender_type: 'owner',
          message: contactMessage.trim(),
          is_read: false
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${contactLeadModal.leadName}.`,
      });

      // Refresh the contacted properties to show the new message
      if (user?.email) {
        await fetchContactedOwners(user.email);
      }

      closeContactLeadModal();
    } catch (error) {
      console.error('Error sending message to lead:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleUpgradeProperty = (property: CombinedProperty) => {
    // First, check for specific land types that need custom handling
    
    // Check if it's agricultural land based on title or property type
    const isAgriculturalLand = property.title?.toLowerCase().includes('agricultural land') || 
                              property.property_type?.toLowerCase().includes('agricultural');
    
    // Check if it's industrial land based on title
    const isIndustrialLand = property.title?.toLowerCase().includes('industrial land');
    
    // Check if it's commercial land based on title
    const isCommercialLand = property.title?.toLowerCase().includes('commercial land');
    
    // Direct routing for specific land types (as per the requirement)
    if (isAgriculturalLand && property.listing_type !== 'rent') {
      navigate(`/plans?tab=seller&category=agricultural&propertyId=${property.id}`);
      return;
    }
    
    if (isIndustrialLand && property.listing_type !== 'rent') {
      navigate(`/plans?tab=seller&category=industrial&propertyId=${property.id}`);
      return;
    }
    
    if (isCommercialLand && property.listing_type !== 'rent') {
      navigate(`/plans?tab=seller&category=commercial&propertyId=${property.id}`);
      return;
    }
    
    // For other property types, continue with the original logic
    
    // Check if it's industrial property (warehouse, industrial) 
    const isIndustrial = property.property_type === 'warehouse' || 
                        property.property_type === 'industrial' ||
                        property.property_type?.toLowerCase().includes('industrial');
    
    // Determine the appropriate pricing plan based on property type and listing type
    const isCommercial = (isCommercialLand ||
                        property.property_type === 'commercial' || 
                        property.property_type === 'office' || 
                        property.property_type === 'shop' || 
                        property.property_type === 'showroom') && !isIndustrial; // Exclude industrial from commercial
    
    const isRent = property.listing_type === 'rent';
    
    let planTab = '';
    let category = 'residential';
    
    if (isAgriculturalLand) {
      // Agricultural land properties
      category = 'agricultural';
      planTab = isRent ? 'rental' : 'seller';
    } else if (isIndustrial) {
      // Industrial properties (warehouse, industrial)
      category = 'industrial';
      planTab = isRent ? 'rental' : 'seller';
    } else if (isCommercial) {
      // Commercial properties (office, shop, showroom, commercial land)
      category = 'commercial';
      if (isRent) {
        // Commercial rental properties now use rental tab with owner role
        planTab = 'rental';
      } else {
        planTab = 'seller';
      }
    } else {
      // Residential properties
      category = 'residential';
      if (isRent) {
        // All residential rental properties (including PG/Hostel) use rental tab
        planTab = 'rental';
      } else {
        planTab = 'seller';
      }
    }
    
    // Navigate with property ID so payment can be linked to this specific property
    // For rental properties, add rentalRole=owner parameter
    const url = planTab === 'rental' 
      ? `/plans?tab=${planTab}&category=${category}&skipWizard=true&propertyId=${property.id}&rentalRole=owner`
      : `/plans?tab=${planTab}&category=${category}&skipWizard=true&propertyId=${property.id}`;
    
    navigate(url);
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

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSavingProfile(true);
    setProfileSaveMessage({ type: null, text: '' });
    try {
      const newName = profileName.trim();
      const newPhone = profilePhone.trim();

      // Update profile data in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: newName,
          phone: newPhone,
          whatsapp_opted_in: whatsappOptIn,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update auth metadata
      const { error: authMetaError } = await supabase.auth.updateUser({
        data: { full_name: newName, profile_phone: newPhone },
      });
      if (authMetaError) {
        console.warn('Auth metadata update failed (non-blocking):', authMetaError);
      }

      // If phone changed, update auth.users via edge function
      if (newPhone !== originalProfilePhone) {
        try {
          const { error: authUpdateError } = await supabase.functions.invoke('update-auth-phone', {
            body: { userId: user.id, phoneNumber: newPhone },
          });
          if (authUpdateError) {
            console.warn('Auth phone update via edge function failed:', authUpdateError);
          }
        } catch (e) {
          console.warn('Edge function call failed:', e);
        }
      }

      setOriginalProfileName(newName);
      setOriginalProfilePhone(newPhone);

      setProfileSaveMessage({ type: 'success', text: 'Your profile has been updated.' });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setProfileSaveMessage({ type: 'error', text: `Failed to save profile: ${error.message || 'Please try again.'}` });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Filter properties based on selected filter and active toggle
  const filteredProperties = properties.filter(property => {
    // Apply "Only Active" filter
    if (showOnlyActive && property.rental_status !== 'available') {
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
    if (selectedFilter === 'Drafts') {
      return false; // Drafts are handled separately
    }
    
    return true;
  });

  const filteredDrafts = drafts.filter(draft => {
    // Apply category filter to drafts
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Drafts') return true;
    
    if (selectedFilter === 'Rent') {
      return draft.listing_type === 'Rent' && draft.property_type !== 'Commercial';
    }
    if (selectedFilter === 'Sale') {
      return draft.listing_type === 'Sale' && draft.property_type !== 'Commercial';
    }
    if (selectedFilter === 'Commercial-Rent') {
      return draft.listing_type === 'Rent' && draft.property_type === 'Commercial';
    }
    if (selectedFilter === 'Commercial-Sale') {
      return draft.listing_type === 'Sale' && draft.property_type === 'Commercial';
    }
    if (selectedFilter === 'PG/Hostel') {
      return draft.property_type === 'PG/Hostel';
    }
    if (selectedFilter === 'Flatmates') {
      return draft.listing_type === 'Flatmates';
    }
    if (selectedFilter === 'Land/Plot') {
      return draft.property_type === 'Land/Plot';
    }

    return false;
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
      <div className="lg:hidden fixed top-24 right-4 z-50">
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
        <div className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-80 bg-white shadow-lg lg:shadow-sm border-r border-gray-200 min-h-screen transform transition-transform duration-300 ease-in-out ${
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
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Profile
                </div>
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
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Your Shortlists
                </div>
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
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  People Showing Interest
                </div>
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
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Your Payments
                </div>
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'chats' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  handleSidebarNavigation('chats');
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  My Chats
                </div>
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'dealroom' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  handleSidebarNavigation('dealroom');
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Deal Room
                </div>
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
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Your Properties
                </div>
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
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Owners you contacted
                </div>
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  activeSidebarItem === 'buyleads' 
                    ? 'font-medium text-gray-900 bg-gray-100 rounded-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  handleSidebarNavigation('buyleads');
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  LEADS
                </div>
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
        <div className="flex-1 p-3 sm:p-4 lg:p-6 lg:ml-0 min-h-screen">
          {/* Content based on sidebar selection */}
          {activeSidebarItem === 'properties' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 break-words">
                You have already posted {properties.length} properties{drafts.length > 0 ? ` and ${drafts.length} draft${drafts.length > 1 ? 's' : ''}` : ''} on Home HNI
                </h1>
              </div>

              {/* Filter Tabs */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['All', 'Rent', 'Sale', 'Commercial-Rent', 'Commercial-Sale', 'PG/Hostel', 'Flatmates', 'Land/Plot', 'Drafts'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                          selectedFilter === filter
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 self-end">
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Only Active</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={showOnlyActive}
                      onChange={(e) => setShowOnlyActive(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>

              {/* Properties Content */}
            {loading ? (
              <div className="text-center py-8">Loading properties...</div>
            ) : filteredProperties.length === 0 && filteredDrafts.length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-gray-200 px-4">
                  <Building className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No properties listed yet</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">Start by adding your first property listing</p>
                  <Button onClick={() => navigate('/post-property')} className="text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Property
                  </Button>
                </div>
            ) : (
              <div className="space-y-6">
                {/* Posted Properties */}
                {filteredProperties.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {filteredProperties.map((property) => {
                  const getImageUrl = () => {
                    console.log('🔍 Dashboard getImageUrl - Property:', property.title, 'Images:', property.images);
                    console.log('🔍 Dashboard getImageUrl - Images length:', property.images?.length);
                    console.log('🔍 Dashboard getImageUrl - Images type:', typeof property.images);
                    console.log('🔍 Dashboard getImageUrl - Full property object:', property);
                    
                    if (property.images && property.images.length > 0) {
                      let firstImage = property.images[0];
                      console.log('🔍 Dashboard getImageUrl - First image:', firstImage, 'Type:', typeof firstImage);
                      
                      if (typeof firstImage === 'string') {
                        // Clean up double-stringified URLs (remove extra quotes)
                        firstImage = firstImage.trim();
                        if (firstImage.startsWith('"') && firstImage.endsWith('"')) {
                          firstImage = firstImage.slice(1, -1);
                        }
                        // Handle escaped quotes
                        if (firstImage.startsWith('\\"') && firstImage.endsWith('\\"')) {
                          firstImage = firstImage.slice(2, -2);
                        }
                        // Remove any remaining backslashes from escaped quotes
                        firstImage = firstImage.replace(/\\"/g, '"');
                        
                        const result = firstImage.startsWith('http') ? firstImage : firstImage;
                        console.log('🔍 Dashboard getImageUrl - Cleaned string result:', result);
                        return result;
                      }
                      if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
                        const result = (firstImage as any).url;
                        console.log('🔍 Dashboard getImageUrl - Object result:', result);
                        return result;
                      }
                    }
                    console.log('🔍 Dashboard getImageUrl - Returning placeholder because no images found');
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
                    <Card key={property.id} className={`relative bg-white border ${property.is_premium ? 'border-amber-200 ring-2 ring-amber-300 hover:ring-4 hover:ring-amber-400' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
                      {/* Status Badge - Top Left */}
                      <div className={`absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-20 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded text-white ${
                        (property.rental_status || 'available') === 'available' 
                          ? 'bg-gray-500' 
                          : 'bg-gray-500'
                      }`}>
                        {(property.rental_status || 'available') === 'available' ? 'Active' : 'Inactive'}
                      </div>

                      {/* Premium Badge - Bottom right corner if premium */}
                      {property.is_premium && (
                        <div className="pointer-events-none absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 z-20">
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-amber-400/95 text-amber-950 shadow px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] lg:text-xs">
                            <Medal className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            Premium
                          </span>
                        </div>
                      )}

                      {/* Diagonal Ribbon - Top Right Corner */}
                      <div className="absolute top-0 right-0 z-10">
                        <div className={`${property.listing_type === 'rent' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-[9px] sm:text-xs font-medium py-0.5 sm:py-1 px-4 sm:px-6 transform rotate-45 translate-x-2 sm:translate-x-3 translate-y-1.5 sm:translate-y-2`}>
                          For {property.listing_type === 'rent' ? 'Rent' : 'Buy'}
                        </div>
                      </div>

                      <CardContent className="p-0">
                        {/* Horizontal Layout: Text Left, Image Right */}
                        <div className="flex items-center">
                          {/* Left Side - Text Content */}
                          <div className="flex-1 p-2 sm:p-3 min-w-0">
                            {/* Title with External Link Icon */}
                            <div className="mb-1.5 sm:mb-2 mt-6 sm:mt-8">
                              <div 
                                className="inline-flex items-center gap-1 cursor-pointer group max-w-full"
                                title={property.title}
                                onClick={() => handleViewProperty(property)}
                              >
                                <h3 className="font-medium text-gray-800 text-xs sm:text-sm leading-tight truncate hover:text-red-500 transition-colors">
                                  {property.title}
                                </h3>
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 group-hover:text-red-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            </div>
                            
                            <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 truncate">
                              {property.locality || property.city}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                              <span className="text-[10px] sm:text-xs">{property.listing_type === 'rent' ? 'Rent:' : 'Price:'} </span>
                              <span className="font-medium text-gray-900 text-xs sm:text-sm">₹{property.expected_price.toLocaleString()}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProperty(property)}
                                className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 h-6 sm:h-7 font-normal"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTogglePropertyStatus(property)}
                                className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 h-6 sm:h-7 font-normal whitespace-nowrap ${
                                  (property.rental_status || 'available') === 'available' 
                                    ? 'text-orange-600 hover:text-orange-700' 
                                    : 'text-green-600 hover:text-green-700'
                                }`}
                              >
                                {(property.rental_status || 'available') === 'available' ? 'Mark Inactive' : 'Mark Active'}
                              </Button>
                            </div>

                            {/* Go Premium Button */}
                            {!property.is_premium && (
                              <Button
                                onClick={() => handleUpgradeProperty(property)}
                                className="bg-red-500 hover:bg-red-600 text-white text-[10px] sm:text-xs py-1 sm:py-1.5 px-2 sm:px-3 h-6 sm:h-7 font-normal w-auto mb-2 sm:mb-3"
                              >
                                <Medal className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                                Go Premium
                              </Button>
                            )}

                          </div>

                          {/* Right Side - Image Area */}
                          <div className="flex-shrink-0 ml-2 sm:ml-3 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-md flex items-center justify-center pr-2 sm:pr-3">
                            {(property.images && property.images.length > 0) ? (
                              <>
                                {console.log('🔍 Rendering image for:', property.title, 'URL:', getImageUrl())}
                                <img
                                  src={getImageUrl()}
                                  alt={property.title}
                                  className="w-full h-full object-cover rounded-md"
                                  onError={(e) => {
                                    console.log('🔍 Image load error for:', property.title, 'URL:', e.currentTarget.src);
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                  onLoad={() => {
                                    console.log('🔍 Image loaded successfully for:', property.title);
                                  }}
                                />
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <div className="relative w-20 h-20 bg-gray-200/70 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300/70 transition-colors group p-4">
                                  <svg className="w-6 h-6 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 002-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
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

                {/* Drafts Section */}
                {filteredDrafts.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Draft Properties ({filteredDrafts.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                      {filteredDrafts.map((draft) => (
                        <DraftPropertyCard
                          key={draft.id}
                          draft={draft}
                          onContinue={() => handleResumeDraft(draft.id!)}
                          onDelete={() => handleDeleteDraft(draft.id!)}
                          onPreview={() => handlePreviewDraft(draft.id!)}
                        />
                      ))}
                    </div>
                  </div>
                )}
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
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Contact Leads</h1>
                <p className="text-gray-600 mt-1">
                  People who have shown interest in your properties
                </p>
              </div>
              
              {/* Empty State */}
              {leads.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                  <p className="text-gray-500 mb-4">When people show interest in your properties, you'll see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leads.map((lead) => (
                    <Card key={lead.id} className="overflow-hidden hover:shadow-lg transition-all">
                      {/* Property Image */}
                      <div className="h-48 bg-gray-200 relative">
                        {lead.properties.images && lead.properties.images.length > 0 ? (
                          <img
                            src={lead.properties.images[0]}
                            alt={lead.properties.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <Home className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Lead Badge */}
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-green-600">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Lead
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <h3 className="font-medium text-gray-900 line-clamp-1">{lead.properties.title}</h3>
                          <p className="text-sm text-gray-600">
                            {lead.properties.locality}, {lead.properties.city}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{lead.properties.expected_price.toLocaleString('en-IN')}
                          </span>
                          <Badge className={`${lead.properties.listing_type === 'rent' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                            For {lead.properties.listing_type === 'rent' ? 'Rent' : 'Sale'}
                          </Badge>
                        </div>
                        
                        {/* Lead Information */}
                        <div className="border-t pt-3 mt-2">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Lead Contact</h4>
                          
                          <div className="flex items-center text-sm mb-1">
                            <User className="h-3 w-3 mr-2 text-gray-500" />
                            <span>{lead.interested_user_name}</span>
                          </div>
                          
                          {lead.interested_user_phone && (
                            <div className="flex items-center text-sm mb-1">
                              <Phone className="h-3 w-3 mr-2 text-gray-500" />
                              <span>{lead.interested_user_phone}</span>
                            </div>
                          )}
                          
                          {lead.interested_user_email && (
                            <div className="flex items-center text-sm mb-1 break-all">
                              <MessageCircle className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
                              <span className="truncate">{lead.interested_user_email}</span>
                            </div>
                          )}
                          
                          {lead.message && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                              <strong>Message:</strong> {lead.message}
                            </div>
                          )}
                          
                          <div className="flex items-center text-xs text-gray-500 mt-2">
                            <span>Lead received on {new Date(lead.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                      
                       {/* Action Buttons */}
                       <div className="px-4 pb-4 space-y-2">
                         <Button 
                          className="w-full"
                          onClick={() => {
                            const propertyUrl = generatePropertyUrl(lead.properties.id, {
                              propertyType: lead.properties.property_type,
                              listingType: lead.properties.listing_type,
                              locality: lead.properties.locality,
                              city: lead.properties.city
                            });
                            navigate(propertyUrl);
                          }}
                        >
                          View Property
                        </Button>
                        {/* Contact Lead button hidden as requested */}
                        {/* <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => openContactLeadModal(lead.id, lead.interested_user_name, lead.interested_user_email, lead.properties.title)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Lead
                        </Button> */}
                       </div>
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
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Account Role Badge */}
                {userRole && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Account Type</label>
                      <Badge 
                        variant="default" 
                        className={`text-sm px-3 py-1 ${
                          userRole === 'owner' || userRole === 'agent' 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : userRole === 'seller'
                            ? 'bg-green-600 hover:bg-green-700'
                            : userRole === 'buyer'
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                        } text-white`}
                      >
                        {getRoleDisplayName(userRole)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Your account type determines how you interact with properties on HomeHNI
                    </p>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <div className="mt-1">
                    <Input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Email readonly with green check */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative mt-1">
                    <Input value={user.email || ''} readOnly className="w-full bg-gray-50 cursor-not-allowed pr-10" />
                    <Check className="h-5 w-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Phone with green check when present */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="relative mt-1">
                    <Input
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full pr-10"
                      type="tel"
                    />
                    {profilePhone && (
                      <Check className="h-5 w-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                {/* WhatsApp toggle */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Get Updates on WhatsApp</span>
                  </div>
                  <Switch checked={whatsappOptIn} onCheckedChange={setWhatsappOptIn} />
                </div>

                {/* Inline message */}
                {profileSaveMessage.type && (
                  <div className={`mt-2 p-3 rounded-lg text-sm ${
                    profileSaveMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {profileSaveMessage.text}
                  </div>
                )}

                {/* Save button */}
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="bg-red-500 hover:bg-red-600 text-white px-8">
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
      </div>
          )}

          {/* Payments Content */}
          {activeSidebarItem === 'payments' && (
            <PaymentsSection />
          )}

          {/* Owners you contacted tab */}
          {activeSidebarItem === 'interested' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Owners You Contacted</h1>
                <p className="text-gray-600 mt-1">
                  Properties where you've reached out to owners through contact forms
                </p>
              </div>
              
              {/* Loading State */}
              {contactedPropertiesLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading properties you've contacted...</p>
                </div>
              )}
              
              {/* Empty State */}
              {!contactedPropertiesLoading && contactedProperties.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contacted properties yet</h3>
                  <p className="text-gray-500 mb-4">When you contact property owners, they'll appear here</p>
                  <Button onClick={() => navigate('/property-search')}>
                    <Search className="h-4 w-4 mr-2" />
                    Browse Properties
                  </Button>
                </div>
              )}
              
              {/* Properties Grid */}
              {!contactedPropertiesLoading && contactedProperties.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contactedProperties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all">
                      {/* Property Image */}
                      <div className="h-48 bg-gray-200 relative">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <Home className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Contact Badge */}
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-green-600">
                            <Phone className="h-3 w-3 mr-1" />

                            Contacted
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <h3 className="font-medium text-gray-900 line-clamp-1">{property.title}</h3>
                          <p className="text-sm text-gray-600">
                            {property.locality}, {property.city}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{property.expected_price.toLocaleString('en-IN')}
                          </span>
                          <Badge className={`${property.listing_type === 'rent' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                            For {property.listing_type === 'rent' ? 'Rent' : 'Sale'}
                          </Badge>
                        </div>
                        
                        {/* Contact Information */}
                        <div className="border-t pt-3 mt-2">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Owner Contact</h4>
                          
                          {property.owner_name && (
                            <div className="flex items-center text-sm mb-1">
                              <User className="h-3 w-3 mr-2 text-gray-500" />
                              <span>{property.owner_name}</span>
                            </div>
                          )}
                          
                          {property.owner_phone && (
                            <div className="flex items-center text-sm mb-1">
                              <Phone className="h-3 w-3 mr-2 text-gray-500" />
                              <span>{property.owner_phone}</span>
                            </div>
                          )}
                          
                          {property.owner_email && (
                            <div className="flex items-center text-sm mb-1 break-all">
                              <MessageCircle className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
                              <span className="truncate">{property.owner_email}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-xs text-gray-500 mt-2">
                            <span>Contacted on {new Date(property.contact_date).toLocaleDateString()}</span>
                          </div>
                          
                          {/* Message Section */}
                          {property.message && (
                            <div className="mt-3 pt-3 border-t">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Your Message</h5>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {property.message}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      {/* Action Button */}
                      <div className="px-4 pb-4">
                         <Button 
                          className="w-full"
                          onClick={() => {
                            const propertyUrl = generatePropertyUrl(property.id, {
                              propertyType: property.property_type,
                              listingType: property.listing_type,
                              locality: property.locality,
                              city: property.city
                            });
                            navigate(propertyUrl);
                          }}
                        >
                          View Property
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Chats Content */}
          {activeSidebarItem === 'chats' && (
            <MyChats />
          )}

          {/* Deal Room Content */}
          {activeSidebarItem === 'dealroom' && (
            <div className="h-full">
              <DealRoomLayout />
            </div>
          )}

          {/* Buy Leads Content */}
          {activeSidebarItem === 'buyleads' && (
            <div className="space-y-6 max-w-full">
              <div className="mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">LEADS</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {leadAccess.accessType !== 'none' 
                    ? `You have ${leadAccess.hasPremiumAccess ? 'Premium' : 'Basic'} access to leads`
                    : 'Purchase quality leads from HomeHNI to grow your business'
                  }
                </p>
              </div>

              {/* Show leads if user has access */}
              {leadAccess.accessType !== 'none' ? (
                <div className="space-y-4">
                  {/* Go Premium Banner for Basic Users */}
                  {leadAccess.hasBasicAccess && !leadAccess.hasPremiumAccess && (
                    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                      <CardContent className="py-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">Unlock Premium Features</h3>
                            <p className="text-sm text-gray-700">
                              Upgrade to Premium Leads to get automated follow-up emails and priority access to high-quality leads.
                            </p>
                          </div>
                          <Button
                            onClick={() => setShowPremiumUpgrade(true)}
                            className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap"
                            size="sm"
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Go Premium
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {leadsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading leads...</p>
                    </div>
                  ) : availableLeads.length === 0 ? (
                    <Card className="max-w-full">
                      <CardContent className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Leads Available
                        </h3>
                        <p className="text-gray-600">
                          There are currently no leads available. Check back later for new leads.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                      {availableLeads.map((lead) => (
                        <Card key={lead.id} className="hover:shadow-lg transition-shadow overflow-hidden max-w-full">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <CardTitle className="text-base sm:text-lg truncate">{lead.name}</CardTitle>
                                <CardDescription className="mt-1 text-xs sm:text-sm line-clamp-1">
                                  {lead.intent} • {lead.city}{lead.locality ? `, ${lead.locality}` : ''}
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {lead.intent}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 sm:space-y-4">
                            {/* Contact Information */}
                            <div className="space-y-2">
                              <div className="flex items-start gap-2 text-sm min-w-0">
                                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 break-all text-xs sm:text-sm min-w-0">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-700 text-xs sm:text-sm">{lead.phone}</span>
                              </div>
                            </div>

                            {/* Property Types */}
                            {lead.property_types && lead.property_types.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1.5">Property Types</p>
                                <div className="flex flex-wrap gap-1">
                                  {lead.property_types.map((type, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Budget */}
                            {(lead.budget_min || lead.budget_max) && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Budget</p>
                                <p className="text-xs sm:text-sm text-gray-700">{formatBudget(lead.budget_min, lead.budget_max)}</p>
                              </div>
                            )}

                            {/* Notes/Preferences */}
                            {lead.notes && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Additional Requirements</p>
                                <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words line-clamp-3">{lead.notes}</p>
                              </div>
                            )}

                            {/* Reference ID */}
                            <div className="pt-2 border-t">
                              <p className="text-xs text-gray-500 truncate">Reference: {lead.reference_id}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Posted: {new Date(lead.created_at).toLocaleDateString()}
                              </p>
                            </div>

                            {/* Follow-up Button (Premium only) */}
                            {leadAccess.hasPremiumAccess && (
                              <div className="pt-2">
                                <Button
                                  onClick={() => handleFollowUp(lead)}
                                  disabled={sendingFollowUp === lead.id}
                                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                                  size="sm"
                                >
                                  {sendingFollowUp === lead.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Follow-up Email
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Show payment options if no access */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-full">
                  {/* Basic Leads Card */}
                  <Card className="hover:shadow-lg transition-shadow flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Basic
                        </Badge>
                        <span>Basic Leads</span>
                      </CardTitle>
                      <CardDescription>
                        Access quality leads to expand your business reach
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gray-900">₹1,999</span>
                          <span className="text-sm text-gray-500">+ GST</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          One-time payment for basic lead access
                        </p>
                      </div>
                      
                      <div className="space-y-2 pt-4 border-t flex-1">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Access to verified basic leads</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Contact information included</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Lead details and preferences</span>
                        </div>
                        <div className="flex items-start gap-2 opacity-0">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Placeholder for alignment</span>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <PayButton
                          label="Buy Basic Leads"
                          amountPaise={199900}
                          planName="Basic Leads Package"
                          notes={{
                            lead_type: 'basic',
                            package_name: 'Basic Leads'
                          }}
                          prefill={{
                            name: profileName || user?.email?.split('@')[0] || '',
                            email: user?.email || '',
                            contact: profilePhone || ''
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Premium Leads Card */}
                  <Card className="hover:shadow-lg transition-shadow border-2 border-red-200 flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-red-600 text-white">
                          Premium
                        </Badge>
                        <span>Premium Leads</span>
                      </CardTitle>
                      <CardDescription>
                        Get premium quality leads with enhanced features
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gray-900">₹4,999</span>
                          <span className="text-sm text-gray-500">+ GST</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          One-time payment for premium lead access
                        </p>
                      </div>
                      
                      <div className="space-y-2 pt-4 border-t flex-1">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">All basic lead features</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Priority verified premium leads</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Enhanced lead insights & analytics</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Automated follow-up email feature</span>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <PayButton
                          label="Buy Premium Leads"
                          amountPaise={499900}
                          planName="Premium Leads Package"
                          notes={{
                            lead_type: 'premium',
                            package_name: 'Premium Leads'
                          }}
                          prefill={{
                            name: profileName || user?.email?.split('@')[0] || '',
                            email: user?.email || '',
                            contact: profilePhone || ''
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Premium Upgrade Dialog Modal */}
      <Dialog open={showPremiumUpgrade && leadAccess.hasBasicAccess && !leadAccess.hasPremiumAccess} onOpenChange={setShowPremiumUpgrade}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge className="bg-red-600 text-white">
                Premium
              </Badge>
              <span>Upgrade to Premium Leads</span>
            </DialogTitle>
            <DialogDescription>
              Get premium quality leads with enhanced features
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">₹4,999</span>
                <span className="text-sm text-gray-500">+ GST</span>
              </div>
              <p className="text-sm text-gray-600">
                One-time payment for premium lead access
              </p>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">All basic lead features</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Priority verified premium leads</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Enhanced lead insights & analytics</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Automated follow-up email feature</span>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <PayButton
                label="Upgrade to Premium Leads"
                amountPaise={499900}
                planName="Premium Leads Package"
                notes={{
                  lead_type: 'premium',
                  package_name: 'Premium Leads'
                }}
                prefill={{
                  name: profileName || user?.email?.split('@')[0] || '',
                  email: user?.email || '',
                  contact: profilePhone || ''
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              />
              <Button
                variant="outline"
                onClick={() => setShowPremiumUpgrade(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

       {/* Contact Lead Modal */}
       <Dialog open={contactLeadModal.isOpen} onOpenChange={closeContactLeadModal}>
         <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
             <DialogTitle>Contact Lead</DialogTitle>
             <DialogDescription>
               Send a message to {contactLeadModal.leadName} about {contactLeadModal.propertyTitle}
             </DialogDescription>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <div className="space-y-2">
               <label htmlFor="message" className="text-sm font-medium">
                 Your Message
               </label>
               <Textarea
                 id="message"
                 placeholder="Type your message here..."
                 value={contactMessage}
                 onChange={(e) => setContactMessage(e.target.value)}
                 className="min-h-[100px]"
               />
             </div>
           </div>
           <DialogFooter>
             <Button variant="outline" onClick={closeContactLeadModal}>
               Cancel
             </Button>
             <Button 
               onClick={handleSendMessageToLead} 
               disabled={isSendingMessage || !contactMessage.trim()}
             >
               {isSendingMessage ? 'Sending...' : 'Send Message'}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
   );
};