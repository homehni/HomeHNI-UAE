import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contentElementsService, ContentElement } from '@/services/contentElementsService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

import { 
  Save, 
  Eye, 
  Plus, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Star, 
  Users, 
  Home,
  Settings,
  GripVertical,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { DraggableSectionItem } from './DraggableSectionItem';
import { SectionLibrary } from './SectionLibrary';
import { LiveWebsitePreview } from './LiveWebsitePreview';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PageSection {
  id: string;
  element_type: string;
  element_key: string;
  title: string;
  content: any;
  sort_order: number;
  is_active: boolean;
  page_location: string;
  section_location: string;
}

const SECTION_TEMPLATES = [
  {
    id: 'hero_banner',
    name: 'Hero Banner',
    icon: <Layout className="h-4 w-4" />,
    template: {
      element_type: 'hero_section',
      content: {
        title: 'Welcome to Our Platform',
        subtitle: 'Discover amazing features and services',
        buttonText: 'Get Started',
        buttonLink: '/signup',
        image: '/placeholder.svg'
      }
    }
  },
  {
    id: 'testimonial_card',
    name: 'Testimonial',
    icon: <Star className="h-4 w-4" />,
    template: {
      element_type: 'testimonial',
      content: {
        name: 'John Doe',
        rating: '5.0',
        review: 'Great service and amazing experience!',
        location: 'New York, USA',
        image: '/placeholder.svg'
      }
    }
  },
  {
    id: 'stats_section',
    name: 'Statistics',
    icon: <Users className="h-4 w-4" />,
    template: {
      element_type: 'stats_section',
      content: {
        properties: '10,000+',
        users: '50,000+',
        cities: '100+',
        satisfaction: '99%'
      }
    }
  },
  {
    id: 'service_card',
    name: 'Service Card',
    icon: <Settings className="h-4 w-4" />,
    template: {
      element_type: 'service',
      content: {
        title: 'Professional Service',
        description: 'High-quality service description here',
        icon: 'home',
        features: ['Feature 1', 'Feature 2', 'Feature 3']
      }
    }
  }
]; 

// Canonical CMS keys used by live site components and their metadata
const KEY_METADATA: Record<string, { element_type: string; title: string; defaultContent: any }> = {
  'stats': { 
    element_type: 'stats_section', 
    title: 'Statistics', 
    defaultContent: {
      PropertiesListed: '1,000',
      HappyCustomers: '50,000',
      CountriesCovered: '100',
      AwardsWon: '25'
    }
  },
  'testimonials_section': { 
    element_type: 'testimonials_section', 
    title: 'Testimonials', 
    defaultContent: {
      heading: 'What Our Customers Say',
      subtitle: 'Trusted by thousands of property seekers',
      testimonials: [
        {
          name: 'John Doe',
          rating: '5.0',
          review: 'Excellent service and great experience!',
          location: 'Mumbai, India'
        }
      ]
    }
  },
  'mobile_app_section': { 
    element_type: 'mobile_app_section', 
    title: 'Mobile App Promotion', 
    defaultContent: {
      heading: 'Get Our Mobile App',
      subtitle: 'Download now for the best property experience',
      description: 'Find your dream property on the go with our mobile app.',
      buttonText: 'Download App'
    }
  },
  'why-use': { 
    element_type: 'why_use_section', 
    title: 'Why Use Section', 
    defaultContent: {
      heading: 'Why Choose Us',
      subtitle: 'Your trusted property partner',
      description: 'Discover the benefits of using our platform',
      features: [
        {
          title: 'Verified Properties',
          description: 'All properties are verified for authenticity'
        },
        {
          title: 'Expert Support',
          description: '24/7 customer support from property experts'
        }
      ]
    }
  },
  'home_services_section': { 
    element_type: 'services_showcase', 
    title: 'Services Showcase', 
    defaultContent: {
      heading: 'Our Services',
      subtitle: 'Complete property solutions',
      description: 'From buying to selling, we have you covered'
    }
  },
  'featured_properties_header': { 
    element_type: 'featured_properties_header', 
    title: 'Featured Properties Header', 
    defaultContent: {
      heading: 'Featured Properties',
      subtitle: 'Handpicked properties just for you'
    }
  },
  'hero-search': { 
    element_type: 'hero_section', 
    title: 'Hero Search', 
    defaultContent: {
      heroImage: '/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png',
      heading: 'Find Your Dream Property',
      subtitle: 'Search from thousands of verified properties'
    }
  },
  'footer_content': { 
    element_type: 'footer', 
    title: 'Footer', 
    defaultContent: {
      companyName: 'Property Portal',
      description: 'Your trusted partner in finding the perfect property',
      address: '123 Business Street, City, State 12345',
      phone: '+1 (555) 123-4567',
      email: 'contact@propertyportal.com'
    }
  },
};

// Map of known homepage elements (by element_key) used across the site components
const PAGE_ELEMENT_KEYS: Record<string, string[]> = {
  homepage: [
    'hero-search',
    'stats',
    'testimonials_section',
    'mobile_app_section',
    'why-use',
    'home_services_section',
    'featured_properties_header',
    'footer_content',
  ],
  about: [
    'about_hero',
    'about_content',
    'about_team',
    'about_values',
    'about_stats'
  ],
  services: [
    'services_hero',
    'services_overview',
    'services_grid',
    'services_features'
  ],
  contact: [
    'contact_hero',
    'contact_form',
    'contact_info',
    'contact_map'
  ],
  loans: [
    'loans_hero',
    'loans_features',
    'loans_calculator',
    'loans_process',
    'loans_faq'
  ],
  'home-security-services': [
    'security_hero',
    'security_services',
    'security_features',
    'security_packages',
    'security_contact'
  ],
  'packers-movers': [
    'packers_hero',
    'packers_services',
    'packers_process',
    'packers_pricing',
    'packers_contact'
  ],
  'legal-services': [
    'legal_hero',
    'legal_services',
    'legal_process',
    'legal_pricing',
    'legal_contact'
  ],
  'handover-services': [
    'handover_hero',
    'handover_services',
    'handover_process',
    'handover_pricing',
    'handover_contact'
  ],
  'property-management': [
    'management_hero',
    'management_services',
    'management_process',
    'management_pricing',
    'management_contact'
  ],
  'painting-cleaning': [
    'painting_hero',
    'painting_services',
    'painting_process',
    'painting_pricing',
    'painting_contact'
  ],
  'interior': [
    'interior_hero',
    'interior_services',
    'interior_portfolio',
    'interior_process',
    'interior_contact'
  ],
  'architects': [
    'architects_hero',
    'architects_services',
    'architects_portfolio',
    'architects_process',
    'architects_contact'
  ],
  'agent-plans': [
    'agent_plans_hero',
    'agent_plans_overview',
    'agent_plans_pricing',
    'agent_plans_features',
    'agent_plans_contact'
  ],
  'builder-lifetime-plans': [
    'builder_plans_hero',
    'builder_plans_overview',
    'builder_plans_pricing',
    'builder_plans_features',
    'builder_plans_contact'
  ],
  'owner-plans': [
    'owner_plans_hero',
    'owner_plans_overview',
    'owner_plans_pricing',
    'owner_plans_features',
    'owner_plans_contact'
  ],
  'buyer-plans': [
    'buyer_plans_hero',
    'buyer_plans_overview',
    'buyer_plans_pricing',
    'buyer_plans_features',
    'buyer_plans_contact'
  ],
  'seller-plans': [
    'seller_plans_hero',
    'seller_plans_overview',
    'seller_plans_pricing',
    'seller_plans_features',
    'seller_plans_contact'
  ],
  'service-suite': [
    'service_suite_hero',
    'service_suite_overview',
    'service_suite_services',
    'service_suite_features',
    'service_suite_contact'
  ],
  'careers': [
    'careers_hero',
    'careers_overview',
    'careers_positions',
    'careers_benefits',
    'careers_contact'
  ],
  'corporate-enquiry': [
    'corporate_hero',
    'corporate_form',
    'corporate_info',
    'corporate_benefits'
  ],
  'commercial-owner-plans': [
    'commercial_owner_hero',
    'commercial_owner_overview',
    'commercial_owner_pricing',
    'commercial_owner_features'
  ],
  'commercial-buyer-plan': [
    'commercial_buyer_hero',
    'commercial_buyer_overview',
    'commercial_buyer_pricing',
    'commercial_buyer_features'
  ],
  'commercial-seller-plans': [
    'commercial_seller_hero',
    'commercial_seller_overview',
    'commercial_seller_pricing',
    'commercial_seller_features'
  ],
  'rental-agreement': [
    'rental_hero',
    'rental_overview',
    'rental_process',
    'rental_pricing',
    'rental_contact'
  ],
  'rent-receipts': [
    'receipts_hero',
    'receipts_overview',
    'receipts_process',
    'receipts_pricing',
    'receipts_contact'
  ],
  'refer-earn': [
    'refer_hero',
    'refer_overview',
    'refer_process',
    'refer_rewards',
    'refer_contact'
  ],
  'nri-services': [
    'nri_hero',
    'nri_overview',
    'nri_services',
    'nri_process',
    'nri_contact'
  ],
  'new-projects': [
    'projects_hero',
    'projects_overview',
    'projects_listing',
    'projects_features',
    'projects_contact'
  ],
  'buyers-forum': [
    'forum_hero',
    'forum_overview',
    'forum_categories',
    'forum_features',
    'forum_contact'
  ],
  'buyers-guide': [
    'guide_hero',
    'guide_overview',
    'guide_content',
    'guide_tips',
    'guide_contact'
  ],
  'sellers-guide': [
    'seller_guide_hero',
    'seller_guide_overview',
    'seller_guide_content',
    'seller_guide_tips',
    'seller_guide_contact'
  ],
  'nri-guide': [
    'nri_guide_hero',
    'nri_guide_overview',
    'nri_guide_content',
    'nri_guide_tips',
    'nri_guide_contact'
  ],
  'nri-queries': [
    'nri_queries_hero',
    'nri_queries_overview',
    'nri_queries_form',
    'nri_queries_faq'
  ],
  'rental-help': [
    'rental_help_hero',
    'rental_help_overview',
    'rental_help_content',
    'rental_help_faq',
    'rental_help_contact'
  ],
  'rent-calculator': [
    'calculator_hero',
    'calculator_overview',
    'calculator_form',
    'calculator_results',
    'calculator_tips'
  ],
  'budget-calculator': [
    'budget_calc_hero',
    'budget_calc_overview',
    'budget_calc_form',
    'budget_calc_results',
    'budget_calc_tips'
  ],
  'area-converter': [
    'area_hero',
    'area_overview',
    'area_converter',
    'area_examples',
    'area_tips'
  ]
};

export const VisualPageBuilder: React.FC = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<any>({});
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false); // Track if initial sync has been run
  const [deletedSections, setDeletedSections] = useState<string[]>([]); // Track deleted section IDs
  const { toast } = useToast();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadPageSections();
  }, [selectedPage]);

  const loadPageSections = async () => {
    try {
      setLoading(true);

      // 1) Fetch page-scoped elements
      const pageScoped = await contentElementsService.getContentElements(selectedPage);

      // 2) Fetch globally-scoped elements by known keys for this page (so components using useCMSContent match)
      const keys = PAGE_ELEMENT_KEYS[selectedPage] || [];
      let globalByKeys: ContentElement[] = [];
      if (keys.length > 0) {
        const { data: keyData, error: keyError } = await supabase
          .from('content_elements')
          .select('*')
          .in('element_key', keys)
          .eq('is_active', true);
        if (!keyError && keyData) {
          globalByKeys = keyData as ContentElement[];
        }

        // Auto-create any missing canonical keys so they become editable instantly
        const presentKeys = new Set<string>([
          ...pageScoped.map(e => e.element_key),
          ...globalByKeys.map(e => e.element_key),
        ]);
        const missingKeys = keys.filter(k => !presentKeys.has(k));

        if (missingKeys.length > 0) {
          const rows = missingKeys.map(k => ({
            element_key: k,
            element_type: KEY_METADATA[k]?.element_type || 'section',
            title: KEY_METADATA[k]?.title || k,
            content: KEY_METADATA[k]?.defaultContent ?? {},
            sort_order: 0,
            is_active: true,
            page_location: selectedPage,
            section_location: 'main',
          }));

          const { error: insertError } = await supabase
            .from('content_elements')
            .insert(rows);

          if (!insertError) {
            const { data: inserted } = await supabase
              .from('content_elements')
              .select('*')
              .in('element_key', missingKeys);
            if (inserted) {
              globalByKeys = [...globalByKeys, ...(inserted as any)];
            }
          } else {
            console.error('Error creating missing content elements', insertError);
          }
        }
      }

      // 3) Merge, preferring page-scoped versions when duplicate keys exist
      const byKey: Record<string, ContentElement> = {};
      [...globalByKeys, ...pageScoped].forEach((item) => {
        const existing = byKey[item.element_key];
        if (!existing) {
          byKey[item.element_key] = item;
        } else {
          // Prefer the item explicitly tied to this page
          if (existing.page_location !== selectedPage && item.page_location === selectedPage) {
            byKey[item.element_key] = item;
          }
        }
      });

      const merged = Object.values(byKey);

      const formattedSections: PageSection[] = merged
        .map((item, index) => ({
          id: item.id,
          element_type: item.element_type,
          element_key: item.element_key,
          title: item.title || item.element_key,
          content: item.content,
          sort_order: item.sort_order ?? index,
          is_active: item.is_active,
          page_location: item.page_location || selectedPage,
          section_location: item.section_location || 'main'
        }))
        .sort((a, b) => a.sort_order - b.sort_order);

      setSections(formattedSections);
    } catch (error) {
      console.error('Error loading sections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page sections',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        // Update sort_order for all items
        const updatedItems = reorderedItems.map((item, index) => ({
          ...item,
          sort_order: index
        }));
        
        setHasChanges(true);
        return updatedItems;
      });
    }

    setActiveId(null);
  };

  const addNewSection = async (template: typeof SECTION_TEMPLATES[0]) => {
    const newSection: PageSection = {
      id: `temp_${Date.now()}`,
      element_type: template.template.element_type,
      element_key: `${template.template.element_type}_${Date.now()}`,
      title: template.name,
      content: template.template.content,
      sort_order: sections.length,
      is_active: true,
      page_location: selectedPage,
      section_location: 'main'
    };

    setSections(prev => [...prev, newSection]);
    setHasChanges(true);
    
    toast({
      title: 'Section Added',
      description: `${template.name} has been added to the page`,
    });
  };

  const startEditing = (sectionId: string, content: any) => {
    setEditingSection(sectionId);
    setEditingContent({ ...content });
  };

  const saveEditing = () => {
    if (!editingSection) return;
    
    setSections(prev => 
      prev.map(section => 
        section.id === editingSection 
          ? { ...section, content: editingContent }
          : section
      )
    );
    
    setEditingSection(null);
    setEditingContent({});
    setHasChanges(true);
    
    toast({
      title: 'Content Updated',
      description: 'Section content has been updated',
    });
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditingContent({});
  };

  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    setDeletedSections(prev => [...prev, sectionId]);
    setHasChanges(true);
    
    toast({
      title: 'Section Deleted',
      description: 'The section has been removed from the page',
      variant: 'destructive'
    });
  };

  const saveAllChanges = async () => {
    try {
      setLoading(true);
      
      // First, handle deletions
      for (const deletedId of deletedSections) {
        try {
          await contentElementsService.deleteContentElement(deletedId);
          console.log('Deleted section:', deletedId);
        } catch (error) {
          console.error('Error deleting section:', deletedId, error);
          toast({
            title: 'Delete Failed',
            description: `Failed to delete section. Please try again.`,
            variant: 'destructive'
          });
        }
      }
      
      // Clear deleted sections after successful deletion
      setDeletedSections([]);
      
      // Then handle updates and creations
      for (const section of sections) {
        if (section.id.startsWith('temp_')) {
          // Create new sections
          await contentElementsService.createContentElement({
            element_type: section.element_type,
            element_key: section.element_key,
            title: section.title,
            content: section.content,
            sort_order: section.sort_order,
            is_active: section.is_active,
            page_location: section.page_location,
            section_location: section.section_location
          });
        } else {
          // Update existing sections
          await contentElementsService.updateContentElement(section.id, {
            content: section.content,
            sort_order: section.sort_order,
            title: section.title,
            is_active: section.is_active
          });
        }
      }
      
      setHasChanges(false);
      await loadPageSections(); // Reload to get proper IDs
      
      toast({
        title: 'Changes Saved',
        description: 'All page changes have been saved successfully',
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to initialize CMS with missing content elements (one-time only)
  const syncLiveContentToCMS = async () => {
    try {
      console.log('Starting one-time CMS initialization...');
      
      // First, clean up any duplicate Statistics sections
      console.log('Cleaning up duplicate Statistics sections...');
      const { data: duplicateStats, error: duplicateError } = await supabase
        .from('content_elements')
        .select('*')
        .or('element_key.eq.stats,element_key.eq.stats_section')
        .eq('page_location', 'homepage');

      if (!duplicateError && duplicateStats && duplicateStats.length > 1) {
        // Keep only the 'stats' element, delete 'stats_section'
        const statsSectionToDelete = duplicateStats.find(s => s.element_key === 'stats_section');
        if (statsSectionToDelete) {
          await supabase
            .from('content_elements')
            .delete()
            .eq('id', statsSectionToDelete.id);
          console.log('Deleted duplicate stats_section element');
        }
      }
      
      // Define the content elements that should exist based on live website components
      const requiredContentElements = [
        {
          element_key: 'header_nav',
          element_type: 'navigation',
          title: 'Main Navigation',
          content: {
            logo: "/lovable-uploads/main-logo-final.png",
            nav_items: [
              {"label": "Buy", "link": "/search?type=buy", "active": true},
              {"label": "Rent", "link": "/search?type=rent", "active": true}, 
              {"label": "Sell", "link": "/post-property", "active": true},
              {"label": "Services", "submenu": [
                {"label": "Loans", "link": "/loans"},
                {"label": "Home Security Services", "link": "/home-security-services"},
                {"label": "Packers & Movers", "link": "/packers-movers"},
                {"label": "Legal Services", "link": "/legal-services"},
                {"label": "Handover Services", "link": "/handover-services"},
                {"label": "Property Management", "link": "/property-management"},
                {"label": "Architects", "link": "/architects"},
                {"label": "Painting & Cleaning", "link": "/painting-cleaning"},
                {"label": "Interior Designers", "link": "/interior"}
              ]},
              {"label": "Plans", "submenu": [
                {"label": "Agent Plans", "link": "/agent-plans"},
                {"label": "Builder's Lifetime Plan", "link": "/builder-lifetime-plans"},
                {"label": "Property Renting Owner Plans", "link": "/owner-plans"},
                {"label": "Property Seller Plans", "link": "/buyer-plans"},
                {"label": "Property Owner Plans", "link": "/seller-plans"}
              ]},
              {"label": "Service Provider", "link": "/service-suite", "active": true},
              {"label": "Jobs", "link": "/careers", "active": true}
            ]
          },
          page_location: 'homepage',
          section_location: 'header',
          sort_order: 0
        },
        {
          element_key: 'hero-search',
          element_type: 'hero_section',
          title: 'Hero Search Section',
          content: {
            heroImage: "/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png",
            heading: "Find Your Dream Property",
            subtitle: "Buy, Rent, New Launch, PG/Co-living, Commercial & Plots",
            search_placeholder: "Search Sector 150 Noida",
            tabs: ["BUY", "RENT", "NEW LAUNCH", "PG / CO-LIVING", "COMMERCIAL", "PLOTS/LAND", "PROJECTS"]
          },
          page_location: 'homepage',
          section_location: 'hero',
          sort_order: 1
        },
        {
          element_key: 'footer_content',
          element_type: 'footer',
          title: 'Footer Content',
          content: {
            companyName: "HomeHNI",
            description: "Your trusted partner in real estate",
            logo: "/lovable-uploads/main-logo-final.png",
            address: "Delhi NCR, India",
            phone: "+91-XXXXX-XXXXX",
            email: "info@homehni.com",
            quick_links: [
              {"label": "About Us", "link": "/about-us"},
              {"label": "Contact", "link": "/contact-us"},
              {"label": "Privacy Policy", "link": "/privacy-policy"},
              {"label": "Terms & Conditions", "link": "/terms-and-conditions"}
            ],
            services: [
              {"label": "Buy Property", "link": "/search?type=buy"},
              {"label": "Rent Property", "link": "/search?type=rent"},
              {"label": "Sell Property", "link": "/post-property"},
              {"label": "Property Management", "link": "/property-management"}
            ]
          },
          page_location: 'homepage',
          section_location: 'footer',
          sort_order: 2
        },
        {
          element_key: 'stats',
          element_type: 'stats_section',
          title: 'Platform Statistics',
          content: {
            PropertiesListed: '1,000+',
            HappyCustomers: '10,000+',
            CountriesCovered: '15+',
            AwardsWon: '50+'
          },
          page_location: 'homepage',
          section_location: 'statistics',
          sort_order: 3
        },
        {
          element_key: 'testimonials_section',
          element_type: 'testimonials_section',
          title: 'Customer Testimonials',
          content: {
            heading: 'Our customers love us',
            subtitle: 'Real stories from verified buyers & owners.',
            rating: '4.8/5',
            reviewCount: '2,143 reviews',
            ownersMatched: '12k+ owners matched',
            brokerageSaved: '₹18+ crore brokerage saved'
          },
          page_location: 'homepage',
          section_location: 'testimonials',
          sort_order: 4
        },
        {
          element_key: 'home_services_section',
          element_type: 'services_showcase',
          title: 'Home Services',
          content: {
            heading: 'Home Services',
            subtitle: 'Complete property solutions',
            description: 'From buying to selling, we have you covered',
            services: [
              {"name": "Home Security Services", "description": "Professional security solutions for your property"},
              {"name": "Legal Services", "description": "Expert legal assistance for property transactions"},
              {"name": "Handover Services", "description": "Smooth property handover and documentation"},
              {"name": "Property Management", "description": "Complete property management solutions"}
            ]
          },
          page_location: 'homepage',
          section_location: 'services',
          sort_order: 5
        },
        {
          element_key: 'why-use',
          element_type: 'why_use_section',
          title: 'Why Use HomeHNI',
          content: {
            heading: 'Why Choose HomeHNI?',
            subtitle: 'Your trusted partner in real estate',
            description: 'Discover the benefits of using our platform',
            features: [
              {
                title: 'Verified Properties',
                description: 'All properties are verified for authenticity'
              },
              {
                title: 'Expert Support',
                description: '24/7 customer support from property experts'
              },
              {
                title: 'Transparent Pricing',
                description: 'No hidden fees or surprises'
              },
              {
                title: '24/7 Assistance',
                description: 'Round the clock support for all your needs'
              }
            ]
          },
          page_location: 'homepage',
          section_location: 'features',
          sort_order: 6
        },
        {
          element_key: 'mobile_app_section',
          element_type: 'mobile_app_section',
          title: 'Mobile App Promotion',
          content: {
            heading: 'Homes, Wherever You Are',
            subtitle: 'Download our app and discover properties anytime, anywhere',
            description: 'Get instant notifications for new listings that match your preferences.',
            buttonText: 'Download App',
            comingSoon: 'Coming Soon! Get ready for the ultimate property experience'
          },
          page_location: 'homepage',
          section_location: 'mobile_app',
          sort_order: 7
        }
      ];

      console.log('Checking for missing content elements...');

      // Only create missing content elements - DON'T overwrite existing ones
      let createdCount = 0;
      for (const element of requiredContentElements) {
        const { data: existing, error: selectError } = await supabase
          .from('content_elements')
          .select('id')
          .eq('element_key', element.element_key)
          .eq('page_location', element.page_location)
          .maybeSingle();

        if (selectError) {
          console.error('Error checking existing element:', selectError);
          continue;
        }

        if (!existing) {
          // Only create if it doesn't exist - preserve user changes
          const { error: insertError } = await supabase
            .from('content_elements')
            .insert({
              ...element,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating element:', insertError);
          } else {
            console.log('Created missing element:', element.element_key);
            createdCount++;
          }
        } else {
          console.log('Element already exists, preserving user changes:', element.element_key);
        }
      }

      console.log(`CMS initialization completed. Created ${createdCount} missing elements.`);
      
      // Mark as initialized so this only runs once
      setHasInitialized(true);
      
      // Refresh the sections
      await loadPageSections();
      
      if (createdCount > 0) {
        toast({
          title: "Initialization Complete",
          description: `Created ${createdCount} missing content elements. Your existing changes are preserved.`,
        });
      } else {
        toast({
          title: "Already Initialized",
          description: "All content elements already exist. Your changes are preserved.",
        });
      }
      
    } catch (error) {
      console.error('CMS initialization failed:', error);
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize CMS. Check console for details.",
        variant: "destructive",
      });
    }
  };

  // Function to clean up duplicate Statistics sections
  const cleanupDuplicateStats = async () => {
    try {
      setLoading(true);
      console.log('Cleaning up duplicate Statistics sections...');
      const { data: duplicateStats, error: duplicateError } = await supabase
        .from('content_elements')
        .select('*')
        .or('element_key.eq.stats,element_key.eq.stats_section')
        .eq('page_location', 'homepage');

      if (!duplicateError && duplicateStats && duplicateStats.length > 1) {
        const statsSectionToDelete = duplicateStats.find(s => s.element_key === 'stats_section');
        if (statsSectionToDelete) {
          await supabase
            .from('content_elements')
            .delete()
            .eq('id', statsSectionToDelete.id);
          console.log('Deleted duplicate stats_section element');
          toast({
            title: 'Duplicates Cleaned',
            description: 'Duplicate Statistics sections have been removed.',
          });
        }
      } else {
        toast({
          title: 'No Duplicates Found',
          description: 'No duplicate Statistics sections found to clean.',
        });
      }
    } catch (error) {
      console.error('Error cleaning up duplicates:', error);
      toast({
        title: 'Cleanup Failed',
        description: 'Failed to clean up duplicates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to create default content for a page when it's selected for the first time
  const createDefaultPageContent = async (pageKey: string) => {
    try {
      const keys = PAGE_ELEMENT_KEYS[pageKey] || [];
      if (keys.length === 0) return;

      console.log(`Creating default content for ${pageKey} with ${keys.length} sections...`);

      const defaultSections = keys.map((key, index) => {
        const sectionName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return {
          element_key: key,
          element_type: key.includes('_') ? key.split('_')[0] : 'section',
          title: sectionName,
          content: getDefaultContentForSection(key, pageKey),
          sort_order: index,
          is_active: true,
          page_location: pageKey,
          section_location: key.includes('_') ? key.split('_')[1] || 'main' : 'main'
        };
      });

      // Check which sections already exist
      const existingKeys = new Set<string>();
      for (const key of keys) {
        const { data: existing } = await supabase
          .from('content_elements')
          .select('id')
          .eq('element_key', key)
          .eq('page_location', pageKey)
          .maybeSingle();
        
        if (existing) {
          existingKeys.add(key);
        }
      }

      // Create only missing sections
      const missingSections = defaultSections.filter(section => !existingKeys.has(section.element_key));
      
      if (missingSections.length > 0) {
        const { error: insertError } = await supabase
          .from('content_elements')
          .insert(missingSections);

        if (insertError) {
          console.error('Error creating default sections:', insertError);
          toast({
            title: 'Error',
            description: 'Failed to create default page content',
            variant: 'destructive'
          });
        } else {
          console.log(`Created ${missingSections.length} default sections for ${pageKey}`);
          toast({
            title: 'Default Content Created',
            description: `Created ${missingSections.length} default sections for ${pageKey}`,
          });
        }
      }

      // Reload sections after creating defaults
      await loadPageSections();
    } catch (error) {
      console.error('Error creating default page content:', error);
    }
  };

  // Helper function to generate default content for different section types
  const getDefaultContentForSection = (sectionKey: string, pageKey: string): any => {
    const baseContent = {
      title: sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      subtitle: `Default subtitle for ${sectionKey}`,
      description: `Default description for ${sectionKey} section`,
      content: `Default content for ${sectionKey} section`,
      buttonText: 'Learn More',
      buttonLink: '#',
      image: '/placeholder.svg'
    };

    // Customize content based on section type
    if (sectionKey.includes('hero')) {
      return {
        ...baseContent,
        heading: `Welcome to ${pageKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        subtitle: `Discover amazing ${pageKey.replace(/-/g, ' ')} services and solutions`,
        buttonText: 'Get Started',
        backgroundImage: '/placeholder.svg'
      };
    }

    if (sectionKey.includes('contact')) {
      return {
        ...baseContent,
        title: 'Contact Us',
        subtitle: 'Get in touch with our team',
        description: 'We\'re here to help with all your questions and needs',
        phone: '+91-XXXXX-XXXXX',
        email: 'info@homehni.com',
        address: 'Delhi NCR, India',
        formFields: ['Name', 'Email', 'Phone', 'Message']
      };
    }

    if (sectionKey.includes('pricing')) {
      return {
        ...baseContent,
        title: 'Pricing Plans',
        subtitle: 'Choose the plan that fits your needs',
        plans: [
          {
            name: 'Basic',
            price: '₹999',
            features: ['Feature 1', 'Feature 2', 'Feature 3']
          },
          {
            name: 'Premium',
            price: '₹1999',
            features: ['All Basic Features', 'Feature 4', 'Feature 5']
          }
        ]
      };
    }

    if (sectionKey.includes('faq')) {
      return {
        ...baseContent,
        title: 'Frequently Asked Questions',
        subtitle: 'Common questions about our services',
        faqs: [
          {
            question: 'What services do you offer?',
            answer: 'We offer comprehensive property solutions including buying, selling, and management services.'
          },
          {
            question: 'How can I get started?',
            answer: 'Simply contact us through our website or call our support team.'
          }
        ]
      };
    }

    if (sectionKey.includes('process')) {
      return {
        ...baseContent,
        title: 'Our Process',
        subtitle: 'How we work with you',
        steps: [
          {
            step: 1,
            title: 'Initial Consultation',
            description: 'We discuss your requirements and goals'
          },
          {
            step: 2,
            title: 'Planning & Strategy',
            description: 'We create a customized plan for you'
          },
          {
            step: 3,
            title: 'Execution',
            description: 'We implement the plan with regular updates'
          }
        ]
      };
    }

    return baseContent;
  };

  // Group sections by logical categories for homepage
  const groupSectionsByCategory = (sections: PageSection[]) => {
    const categories = {
      'Header & Navigation': sections.filter(s => s.element_type.includes('header') || s.element_type.includes('nav')),
      'Hero Section': sections.filter(s => s.element_type.includes('hero')),
      'Services Showcase': sections.filter(s => s.element_type.includes('service')),
      'Featured Properties': sections.filter(s => s.element_type.includes('property') || s.element_key.includes('property')),
      'Value Proposition': sections.filter(s => s.element_type.includes('why') || s.element_key.includes('why')),
      'Testimonials': sections.filter(s => s.element_type.includes('testimonial')),
      'Mobile App Promotion': sections.filter(s => s.element_type.includes('mobile') || s.element_key.includes('mobile')),
      'Statistics': sections.filter(s => s.element_type.includes('stats')),
      'Footer': sections.filter(s => s.element_type.includes('footer'))
    };
    
    // Add any remaining sections to "Other"
    const categorizedIds = Object.values(categories).flat().map(s => s.id);
    const otherSections = sections.filter(s => !categorizedIds.includes(s.id));
    if (otherSections.length > 0) {
      categories['Other'] = otherSections;
    }
    
    return categories;
  };

  const renderDeletedSections = () => {
    if (deletedSections.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Deleted Sections</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {deletedSections.map(id => {
            const deletedSection = sections.find(s => s.id === id);
            if (!deletedSection) return null;

            return (
              <div key={id} className="flex items-center justify-between p-2 bg-destructive/10 rounded-md">
                <span>{deletedSection.title}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDeletedSections(prev => prev.filter(d => d !== id));
                    // Optionally, re-add the section if it's still in the CMS
                    // This requires fetching the element from the CMS and adding it back
                    // For now, we'll just remove it from the deleted list
                  }}
                >
                  Undo Delete
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStructuredHomepageEditor = () => {
    const categorizedSections = groupSectionsByCategory(sections);

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Homepage Content Manager</h2>
          <p className="text-muted-foreground">Organized sections for efficient content management</p>
        </div>

        {renderDeletedSections()}

        <Accordion type="multiple" className="space-y-4">
          {Object.entries(categorizedSections).map(([categoryName, categorySections]) => (
            categorySections.length > 0 && (
              <AccordionItem key={categoryName} value={categoryName} className="border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <h3 className="text-lg font-semibold text-left">{categoryName}</h3>
                    <Badge variant="secondary">{categorySections.length} section{categorySections.length !== 1 ? 's' : ''}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    {categorySections.map((section) => (
                      <div key={section.id} className="border rounded-lg p-4 bg-card">
                        {renderEditableContent(section)}
                      </div>
                    ))}
                    {categorySections.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No sections in this category yet.</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Section
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          ))}
        </Accordion>
      </div>
    );
  };

  const renderEditableContent = (section: PageSection) => {
    const isEditing = editingSection === section.id;
    const content = isEditing ? editingContent : section.content;

    if (isEditing) {
      return (
        <div className="space-y-3 p-4 border-2 border-primary rounded-lg bg-primary/5">
          <div className="flex justify-between items-center mb-3">
            <Badge variant="secondary">Editing Mode</Badge>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={cancelEditing}>
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={saveEditing}>
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
          
          {Object.entries(content || {}).map(([key, value]) => {
            // Debug logging to see field types
            console.log(`Field: ${key}, Type: ${typeof value}, Value:`, value);
            console.log(`Is Array: ${Array.isArray(value)}`);
            console.log(`Is Object: ${value && typeof value === 'object' && !Array.isArray(value)}`);
            
            return (
              <div key={key}>
                <label className="text-sm font-medium text-muted-foreground capitalize mb-1 block">
                  {key.replace(/_/g, ' ')}
                </label>

                {Array.isArray(value) ? (
                  value.length > 0 && typeof value[0] === 'object' ? (
                    <div className="space-y-2">
                      {(value as any[]).map((item, idx) => (
                        <div key={idx} className="p-3 border rounded-md space-y-2">
                          {(item?.name !== undefined || item?.title !== undefined) ? (
                            <>
                              <Input
                                placeholder="Name / Title"
                                value={item?.name ?? item?.title ?? ''}
                                onChange={(e) =>
                                  setEditingContent((prev: any) => {
                                    const arr = Array.isArray(prev[key]) ? [...prev[key]] : [];
                                    const current = { ...(arr[idx] || {}) };
                                    if (item?.name !== undefined || current?.name !== undefined) current.name = e.target.value;
                                    else current.title = e.target.value;
                                    arr[idx] = current;
                                    return { ...prev, [key]: arr };
                                  })
                                }
                              />
                              {'description' in item && (
                                <Textarea
                                  placeholder="Description"
                                  value={(item as any)?.description ?? ''}
                                  onChange={(e) =>
                                    setEditingContent((prev: any) => {
                                      const arr = Array.isArray(prev[key]) ? [...prev[key]] : [];
                                      const current = { ...(arr[idx] || {}) } as any;
                                      current.description = e.target.value;
                                      arr[idx] = current;
                                      return { ...prev, [key]: arr };
                                    })
                                  }
                                  rows={3}
                                />
                              )}
                            </>
                          ) : (
                            <Textarea
                              rows={4}
                              value={JSON.stringify(item, null, 2)}
                              onChange={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value);
                                  setEditingContent((prev: any) => {
                                    const arr = Array.isArray(prev[key]) ? [...prev[key]] : [];
                                    arr[idx] = parsed;
                                    return { ...prev, [key]: arr };
                                  });
                                } catch {}
                              }}
                            />
                          )}

                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setEditingContent((prev: any) => {
                                  const arr = Array.isArray(prev[key]) ? [...prev[key]] : [];
                                  arr.splice(idx, 1);
                                  return { ...prev, [key]: arr };
                                })
                              }
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Remove
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingContent((prev: any) => ({
                            ...prev,
                            [key]: [...(prev?.[key] || []), { name: '', description: '' }]
                          }))
                        }
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Item
                      </Button>
                    </div>
                  ) : (
                    <Textarea
                      value={(value as any[]).join('\n')}
                      onChange={(e) =>
                        setEditingContent((prev: any) => ({
                          ...prev,
                          [key]: e.target.value.split('\n')
                        }))
                      }
                      className="w-full"
                      rows={3}
                    />
                  )
                ) : (value && typeof value === 'object' && value !== null && !Array.isArray(value)) ? (
                  <Textarea
                    value={JSON.stringify(value, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setEditingContent((prev: any) => ({ ...prev, [key]: parsed }));
                      } catch {}
                    }}
                    className="w-full font-mono"
                    rows={6}
                  />
                ) : (
                  // Handle simple string/number fields (like ReviewCount, OwnersMatched, etc.)
                  typeof value === 'string' || typeof value === 'number' ? (
                    typeof value === 'string' && value.length > 50 ? (
                      <Textarea
                        value={value as string}
                        onChange={(e) => setEditingContent((prev: any) => ({ ...prev, [key]: e.target.value }))}
                        className="w-full"
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={String(value ?? '')}
                        onChange={(e) => setEditingContent((prev: any) => ({ ...prev, [key]: e.target.value }))}
                        className="w-full"
                      />
                    )
                  ) : (
                    // Fallback for any other types
                    <Textarea
                      value={JSON.stringify(value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setEditingContent((prev: any) => ({ ...prev, [key]: parsed }));
                        } catch {}
                      }}
                      className="w-full font-mono"
                      rows={4}
                    />
                  )
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // Preview mode
    return (
      <div className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors group">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-medium text-foreground">{section.title}</h4>
            <Badge variant="outline" className="text-xs mt-1">
              {section.element_type}
            </Badge>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => startEditing(section.id, section.content)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteSection(section.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          {Object.entries(content || {}).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium capitalize min-w-20">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="truncate">
                {Array.isArray(value)
                  ? (value.length > 0 && typeof value[0] === 'object'
                      ? (value as any[])
                          .map((v: any) => v?.name || v?.title || '')
                          .filter(Boolean)
                          .join(', ')
                      : (value as any[]).join(', '))
                  : (value && typeof value === 'object')
                    ? JSON.stringify(value)
                    : String(value ?? '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Section Library Sidebar */}
      <div className="w-80 border-r bg-muted/30">
        <SectionLibrary 
          templates={SECTION_TEMPLATES}
          onAddSection={addNewSection}
        />
      </div>

      {/* Main Editor Area - Full Width */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="border-b p-4 bg-background/95 backdrop-blur relative">
          
          <div className="flex justify-between items-center pr-12">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Visual Page Builder</h1>
              <select 
                value={selectedPage} 
                onChange={(e) => setSelectedPage(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <optgroup label="Main Pages">
                  <option value="homepage">Homepage</option>
                  <option value="about">About Page</option>
                  <option value="careers">Careers</option>
                  <option value="contact">Contact Page</option>
                </optgroup>
                
                <optgroup label="Services">
                  <option value="loans">Loans</option>
                  <option value="home-security-services">Home Security Services</option>
                  <option value="packers-movers">Packers & Movers</option>
                  <option value="legal-services">Legal Services</option>
                  <option value="handover-services">Handover Services</option>
                  <option value="property-management">Property Management</option>
                  <option value="painting-cleaning">Painting & Cleaning</option>
                  <option value="interior">Interior Design</option>
                  <option value="architects">Architects</option>
                  <option value="service-suite">Service Suite</option>
                </optgroup>
                
                <optgroup label="Plans">
                  <option value="agent-plans">Agent Plans</option>
                  <option value="builder-lifetime-plans">Builder Lifetime Plans</option>
                  <option value="owner-plans">Property Renting Owner Plans</option>
                  <option value="buyer-plans">Property Buyer Plans</option>
                  <option value="seller-plans">Property Seller Plans</option>
                  <option value="commercial-owner-plans">Commercial Owner Plans</option>
                  <option value="commercial-buyer-plan">Commercial Buyer Plans</option>
                  <option value="commercial-seller-plans">Commercial Seller Plans</option>
                </optgroup>
                
                <optgroup label="Legal & Documentation">
                  <option value="rental-agreement">Rental Agreement</option>
                  <option value="rent-receipts">Rent Receipts</option>
                </optgroup>
                
                <optgroup label="NRI Services">
                  <option value="nri-services">NRI Services</option>
                  <option value="nri-guide">NRI Guide</option>
                  <option value="nri-queries">NRI Queries</option>
                </optgroup>
                
                <optgroup label="Property Tools">
                  <option value="new-projects">New Projects</option>
                  <option value="buyers-forum">Buyers Forum</option>
                  <option value="buyers-guide">Buyers Guide</option>
                  <option value="sellers-guide">Sellers Guide</option>
                  <option value="rental-help">Rental Help</option>
                  <option value="rent-calculator">Rent Calculator</option>
                  <option value="budget-calculator">Budget Calculator</option>
                  <option value="area-converter">Area Converter</option>
                </optgroup>
                
                <optgroup label="Other">
                  <option value="refer-earn">Refer & Earn</option>
                  <option value="corporate-enquiry">Corporate Enquiry</option>
                </optgroup>
              </select>
              
              <Button 
                variant="outline"
                onClick={() => createDefaultPageContent(selectedPage)}
                disabled={loading}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Default Content
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="secondary" className="animate-pulse">
                  Unsaved Changes
                </Badge>
              )}
              <Button 
                variant="outline"
                onClick={cleanupDuplicateStats}
                disabled={loading}
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clean Duplicates
              </Button>
              {deletedSections.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => setDeletedSections([])}
                  disabled={loading}
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Deleted ({deletedSections.length})
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={syncLiveContentToCMS}
                disabled={loading || hasInitialized}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {hasInitialized ? 'Already Initialized' : 'Initialize CMS'}
              </Button>
              <Button 
                onClick={saveAllChanges} 
                disabled={!hasChanges || loading}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Page Sections */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Page Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {selectedPage === 'homepage' ? 'Homepage' : 
                       selectedPage.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Content Manager
                    </h2>
                    <p className="text-muted-foreground">
                      {sections.length} editable sections organized for efficient content management
                    </p>
                  </div>

                  {selectedPage === 'homepage' ? (
                    renderStructuredHomepageEditor()
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={sections.map(s => s.id)} 
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4 max-w-4xl mx-auto">
                          {sections.length === 0 ? (
                            <Card className="border-dashed border-2 border-muted-foreground/25">
                              <CardContent className="text-center py-12">
                                <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                  No sections yet
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                  Start building your page by creating default content or adding sections from the library
                                </p>
                                <div className="flex gap-2 justify-center">
                                  <Button variant="outline" onClick={() => createDefaultPageContent(selectedPage)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Default Content
                                  </Button>
                                  <Button variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Section
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            sections.map((section) => (
                              <DraggableSectionItem
                                key={section.id}
                                id={section.id}
                                section={section}
                                onEdit={() => startEditing(section.id, section.content)}
                                onDelete={() => deleteSection(section.id)}
                              >
                                {renderEditableContent(section)}
                              </DraggableSectionItem>
                            ))
                          )}
                        </div>
                      </SortableContext>

                      <DragOverlay>
                        {activeId ? (
                          <div className="bg-background border shadow-lg rounded-lg p-4 opacity-75">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {sections.find(s => s.id === activeId)?.title}
                              </span>
                            </div>
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};