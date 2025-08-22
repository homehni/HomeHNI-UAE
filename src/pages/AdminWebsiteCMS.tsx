import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  FileText, 
  Image as ImageIcon,
  Settings,
  Globe,
  Clock,
  Layout,
  GripVertical,
  ChevronDown,
  ChevronRight,
  History,
  Play,
  Pause
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  is_published: boolean;
  page_type: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  sections?: PageSection[];
}

interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  content: any;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  blocks?: ContentBlock[];
}

interface ContentBlock {
  id: string;
  section_id: string;
  block_type: string;
  content: any;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentVersion {
  id: string;
  content_id: string;
  content_type: string;
  content_data: any;
  version_number: number;
  created_by?: string;
  created_at: string;
  description?: string;
}

// Sortable Item Component
const SortableItem = ({ id, children, disabled = false }: { 
  id: string; 
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="flex items-center gap-2">
        {!disabled && (
          <div
            {...attributes}
            {...listeners}
            className="p-1 cursor-grab hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export const AdminWebsiteCMS: React.FC = () => {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Dialog states
  const [pageDialog, setPageDialog] = useState(false);
  const [sectionDialog, setSectionDialog] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);
  const [versionDialog, setVersionDialog] = useState(false);
  
  // Editing states
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  
  // Visual CMS states
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  // Expansion states
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const { toast } = useToast();

  // Form states
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    page_type: 'page',
    is_published: false
  });

  const [sectionForm, setSectionForm] = useState({
    section_type: 'content',
    content: '',
    sort_order: 0,
    is_active: true
  });

  const [blockForm, setBlockForm] = useState({
    block_type: 'text',
    content: '{}',
    sort_order: 0,
    is_active: true
  });

  // Live homepage friendly form state
  const [liveContentForm, setLiveContentForm] = useState<any>({});

  // Predefined templates for visual CMS
  const sectionTemplates = {
    'hero-search': [
      {
        id: 'modern',
        name: 'Modern Search Hero',
        preview: 'Clean design with centered search and CTA buttons',
        content: {
          title: 'Find Your Perfect Property',
          subtitle: 'Discover thousands of properties across India with zero brokerage',
          searchPlaceholder: 'Search by city, locality, or landmark',
          primaryCTA: 'Search Properties',
          secondaryCTA: 'Post Your Property Free'
        }
      },
      {
        id: 'minimal',
        name: 'Minimal Hero',
        preview: 'Simple and clean with focus on search',
        content: {
          title: 'Property Search Made Simple',
          subtitle: 'Browse verified properties without any hidden charges',
          searchPlaceholder: 'Enter location to search',
          primaryCTA: 'Find Properties',
          secondaryCTA: 'List Your Property'
        }
      }
    ],
    'services': [
      {
        id: 'grid-4',
        name: '4 Service Grid',
        preview: 'Four main services in a grid layout',
        content: {
          title: 'Our Services',
          subtitle: 'Comprehensive real estate solutions',
          services: [
            {
              icon: 'Home',
              title: 'Buy Property',
              description: 'Find your dream home from thousands of verified listings'
            },
            {
              icon: 'Building',
              title: 'Rent Property', 
              description: 'Discover rental properties that match your budget and preferences'
            },
            {
              icon: 'Upload',
              title: 'Sell Property',
              description: 'List your property and connect with genuine buyers'
            },
            {
              icon: 'Users',
              title: 'Property Management',
              description: 'Professional property management services'
            }
          ]
        }
      },
      {
        id: 'grid-6',
        name: '6 Service Grid',
        preview: 'Six services with additional options',
        content: {
          title: 'Complete Real Estate Services',
          subtitle: 'Everything you need for property transactions',
          services: [
            {
              icon: 'Home',
              title: 'Buy Property',
              description: 'Find your dream home'
            },
            {
              icon: 'Building',
              title: 'Rent Property',
              description: 'Rental solutions'
            },
            {
              icon: 'Upload',
              title: 'Sell Property',
              description: 'List your property'
            },
            {
              icon: 'FileText',
              title: 'Legal Services',
              description: 'Property documentation'
            },
            {
              icon: 'Calculator',
              title: 'Home Loans',
              description: 'Financing solutions'
            },
            {
              icon: 'Shield',
              title: 'Property Verification',
              description: 'Verified listings'
            }
          ]
        }
      }
    ],
    'stats': [
      {
        id: 'standard',
        name: 'Standard Stats',
        preview: 'Four key statistics with icons',
        content: {
          stats: [
            { icon: 'Home', number: '50,000+', label: 'Properties Listed', color: 'text-brand-red' },
            { icon: 'Users', number: '1,00,000+', label: 'Happy Customers', color: 'text-brand-maroon' },
            { icon: 'Building', number: '25+', label: 'Cities Covered', color: 'text-brand-red' },
            { icon: 'Award', number: '500+', label: 'Awards Won', color: 'text-brand-maroon' }
          ]
        }
      },
      {
        id: 'enhanced',
        name: 'Enhanced Stats',
        preview: 'Extended statistics with more metrics',
        content: {
          stats: [
            { icon: 'Home', number: '75,000+', label: 'Properties Listed', color: 'text-brand-red' },
            { icon: 'Users', number: '2,00,000+', label: 'Happy Customers', color: 'text-brand-maroon' },
            { icon: 'Building', number: '50+', label: 'Cities Covered', color: 'text-brand-red' },
            { icon: 'Award', number: '1000+', label: 'Successful Deals', color: 'text-brand-maroon' },
            { icon: 'Shield', number: '100%', label: 'Verified Properties', color: 'text-brand-red' },
            { icon: 'Clock', number: '24/7', label: 'Customer Support', color: 'text-brand-maroon' }
          ]
        }
      }
    ],
    'testimonials': [
      {
        id: 'standard',
        name: 'Standard Testimonials',
        preview: 'Customer reviews with video section',
        content: {
          title: 'Our Customers Love us',
          testimonials: [
            {
              name: "Rajesh Kumar",
              rating: 5,
              text: "Home HNI is the best property site. I bought my house through them without paying any brokerage. The service was excellent and the team was very helpful."
            },
            {
              name: "Priya Sharma",
              rating: 5,
              text: "I sold my apartment within a month through Home HNI. The platform made it very easy to list my property and connect with genuine buyers."
            },
            {
              name: "Amit Patel",
              rating: 5,
              text: "Great experience with Home HNI. The legal assistance they provided was very helpful. I would recommend this platform to everyone."
            }
          ]
        }
      },
      {
        id: 'detailed',
        name: 'Detailed Testimonials',
        preview: 'Extended customer stories with more details',
        content: {
          title: 'Success Stories from Our Customers',
          testimonials: [
            {
              name: "Rajesh Kumar",
              location: "Mumbai",
              rating: 5,
              text: "Found my dream home in just 2 weeks! The zero brokerage policy saved me ₹2 lakhs. Highly recommended!"
            },
            {
              name: "Priya Sharma",
              location: "Delhi",
              rating: 5,
              text: "Sold my property within a month. The legal documentation support was excellent."
            },
            {
              name: "Amit Patel",
              location: "Bangalore",
              rating: 5,
              text: "Best property portal in India. Genuine buyers and sellers, verified properties."
            },
            {
              name: "Sunita Reddy",
              location: "Hyderabad",
              rating: 5,
              text: "The customer support team guided me through the entire process. Very professional!"
            }
          ]
        }
      }
    ],
    'mobile-app': [
      {
        id: 'standard',
        name: 'Standard App Promotion',
        preview: 'Mobile app download with store buttons',
        content: {
          title: 'Find A New Home On The Go',
          description: 'Download our app and discover properties anytime, anywhere. Get instant notifications for new listings that match your preferences.',
          appImage: '/lovable-uploads/homeAppPromotion.png'
        }
      },
      {
        id: 'feature-rich',
        name: 'Feature Rich Promotion',
        preview: 'Detailed app features and benefits',
        content: {
          title: 'Your Property Search Companion',
          description: 'Experience the future of property search with our mobile app. Get real-time notifications, save favorites, and connect with property owners instantly.',
          features: [
            'Real-time property notifications',
            'Save and organize favorites',
            'Direct contact with owners',
            'Virtual property tours',
            'Mortgage calculator',
            'Location-based search'
          ],
          appImage: '/lovable-uploads/homeAppPromotion.png'
        }
      }
    ]
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch live homepage components
      const { data: liveComponents, error: componentsError } = await supabase
        .from('content_elements')
        .select('*')
        .eq('page_location', 'live_homepage')
        .order('sort_order');

      if (componentsError) throw componentsError;

      // Fetch regular pages (non-homepage)
      const { data: pagesData, error: pagesError } = await supabase
        .from('content_pages')
        .select('*')
        .neq('slug', 'home') // Exclude any homepage entries
        .order('updated_at', { ascending: false });

      if (pagesError) throw pagesError;

      setPages(pagesData || []);
      
      // Store live components as a special "homepage" entry for UI
      const liveHomepage: ContentPage = {
        id: 'live-homepage',
        title: 'Live Homepage (Current Site)',
        slug: '',
        content: {},
        is_published: true,
        page_type: 'live',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sections: liveComponents?.map(component => ({
          id: component.id,
          page_id: 'live-homepage',
          section_type: component.element_type,
          content: component.content,
          sort_order: component.sort_order,
          is_active: component.is_active,
          created_at: component.created_at,
          updated_at: component.updated_at,
          blocks: []
        })) || []
      };

      setPages([liveHomepage, ...(pagesData || [])]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch versions for a specific content item
  const fetchVersions = async (contentId: string, contentType: string) => {
    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    fetchData();

    const pagesChannel = supabase
      .channel('cms_pages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_pages' },
        () => fetchData()
      )
      .subscribe();

    const sectionsChannel = supabase
      .channel('cms_sections_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'page_sections' },
        () => fetchData()
      )
      .subscribe();

    const blocksChannel = supabase
      .channel('cms_blocks_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'content_blocks' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pagesChannel);
      supabase.removeChannel(sectionsChannel);
      supabase.removeChannel(blocksChannel);
    };
  }, [fetchData]);

  // Save version before making changes
  const saveVersion = async (contentId: string, contentType: string, contentData: any, description?: string) => {
    try {
      // Get current version number
      const { data: existingVersions } = await supabase
        .from('content_versions')
        .select('version_number')
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .order('version_number', { ascending: false })
        .limit(1);

      const newVersionNumber = existingVersions?.[0]?.version_number ? existingVersions[0].version_number + 1 : 1;

      await supabase
        .from('content_versions')
        .insert({
          content_id: contentId,
          content_type: contentType,
          content_data: contentData,
          version_number: newVersionNumber,
          description: description || `Version ${newVersionNumber}`
        });
    } catch (error) {
      console.error('Error saving version:', error);
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle page operations
  const handleCreatePage = () => {
    setEditingPage(null);
    setPageForm({
      title: '',
      slug: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      page_type: 'page',
      is_published: false
    });
    setPageDialog(true);
  };

  const handleEditPage = (page: ContentPage) => {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: typeof page.content === 'string' ? page.content : JSON.stringify(page.content, null, 2),
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords?.join(', ') || '',
      page_type: page.page_type,
      is_published: page.is_published
    });
    setPageDialog(true);
  };

  const handleSavePage = async () => {
    try {
      const pageData = {
        title: pageForm.title,
        slug: pageForm.slug || generateSlug(pageForm.title),
        content: pageForm.content,
        meta_title: pageForm.meta_title || null,
        meta_description: pageForm.meta_description || null,
        meta_keywords: pageForm.meta_keywords ? pageForm.meta_keywords.split(',').map(k => k.trim()) : null,
        page_type: pageForm.page_type,
        is_published: pageForm.is_published
      };

      if (editingPage) {
        // Save version before updating
        await saveVersion(editingPage.id, 'page', editingPage, 'Page updated');
        
        const { error } = await supabase
          .from('content_pages')
          .update(pageData)
          .eq('id', editingPage.id);

        if (error) throw error;
        toast({ title: "Success", description: "Page updated successfully" });
      } else {
        const { error } = await supabase
          .from('content_pages')
          .insert(pageData);

        if (error) throw error;
        toast({ title: "Success", description: "Page created successfully" });
      }

      setPageDialog(false);
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save page",
        variant: "destructive"
      });
    }
  };

  // Handle section operations
  const handleCreateSection = (pageId: string) => {
    setEditingSection(null);
    setSectionForm({
      section_type: 'content',
      content: '',
      sort_order: sections.filter(s => s.page_id === pageId).length,
      is_active: true
    });
    setSelectedPage(pages.find(p => p.id === pageId) || null);
    setSectionDialog(true);
  };

  const handleEditSection = (section: PageSection) => {
    setEditingSection(section);
    setSectionForm({
      section_type: section.section_type,
      content: typeof section.content === 'string' ? section.content : JSON.stringify(section.content, null, 2),
      sort_order: section.sort_order,
      is_active: section.is_active
    });
    // Prepare friendly form for live homepage sections
    if (section.page_id === 'live-homepage') {
      try {
        const parsed = typeof section.content === 'string' ? JSON.parse(section.content) : (section.content || {});
        setLiveContentForm(parsed || {});
      } catch {
        setLiveContentForm({});
      }
      setShowTemplateSelector(true);
    } else {
      setLiveContentForm({});
      setShowTemplateSelector(false);
    }
    setSectionDialog(true);
  };

  const handleSaveSection = async () => {
    // Show publish dialog for live homepage sections
    if (editingSection && editingSection.page_id === 'live-homepage') {
      setPendingChanges(liveContentForm);
      setShowPublishDialog(true);
      return;
    }

    // Regular section save logic for non-live sections
    try {
      let contentData;
      try {
        contentData = typeof sectionForm.content === 'string' 
          ? JSON.parse(sectionForm.content) 
          : sectionForm.content;
      } catch {
        contentData = { text: sectionForm.content };
      }

      if (selectedPage && selectedPage.id !== 'live-homepage') {
        // Regular page section handling
        const sectionData = {
          page_id: selectedPage.id,
          section_type: sectionForm.section_type,
          content: contentData,
          sort_order: sectionForm.sort_order,
          is_active: sectionForm.is_active
        };

        if (editingSection) {
          await saveVersion(editingSection.id, 'section', editingSection, 'Section updated');
          
          const { error } = await supabase
            .from('page_sections')
            .update(sectionData)
            .eq('id', editingSection.id);

          if (error) throw error;
          toast({ title: "Success", description: "Section updated successfully" });
        } else {
          const { error } = await supabase
            .from('page_sections')
            .insert(sectionData);

          if (error) throw error;
          toast({ title: "Success", description: "Section created successfully" });
        }
      }

      setSectionDialog(false);
    } catch (error: any) {
      console.error('Error saving section:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save section",
        variant: "destructive"
      });
    }
  };

  // Handle publishing live changes
  const handlePublishLiveChanges = async () => {
    try {
      if (editingSection && pendingChanges) {
        await saveVersion(editingSection.id, 'element', editingSection, 'Live component updated');
        
        const { error } = await supabase
          .from('content_elements')
          .update({
            content: pendingChanges,
            is_active: sectionForm.is_active,
            sort_order: sectionForm.sort_order
          })
          .eq('id', editingSection.id);

        if (error) throw error;
        
        toast({ 
          title: "✅ Published Live!", 
          description: "Your changes are now visible on the website instantly",
          duration: 5000
        });
        
        setShowPublishDialog(false);
        setSectionDialog(false);
        setPendingChanges(null);
      }
    } catch (error: any) {
      console.error('Error publishing live changes:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish changes",
        variant: "destructive"
      });
    }
  };

  // Handle drag and drop for reordering
  const handleDragEnd = async (event: DragEndEvent, type: 'section' | 'block', parentId?: string) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    if (type === 'section' && selectedPage) {
      const oldIndex = sections.findIndex(s => s.id === active.id && s.page_id === selectedPage.id);
      const newIndex = sections.findIndex(s => s.id === over.id && s.page_id === selectedPage.id);
      
      const pageSections = sections.filter(s => s.page_id === selectedPage.id);
      const newOrder = arrayMove(pageSections, oldIndex, newIndex);
      
      // Update sort orders in database
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('page_sections')
          .update({ sort_order: i })
          .eq('id', newOrder[i].id);
      }
    } else if (type === 'block' && parentId) {
      const sectionBlocks = blocks.filter(b => b.section_id === parentId);
      const oldIndex = sectionBlocks.findIndex(b => b.id === active.id);
      const newIndex = sectionBlocks.findIndex(b => b.id === over.id);
      
      const newOrder = arrayMove(sectionBlocks, oldIndex, newIndex);
      
      // Update sort orders in database
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('content_blocks')
          .update({ sort_order: i })
          .eq('id', newOrder[i].id);
      }
    }

    fetchData(); // Refresh data
  };

  // Toggle expansion states
  const togglePageExpansion = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Website Content Management</h1>
          <p className="text-muted-foreground">
            Comprehensive CMS for managing all website content with real-time updates
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button onClick={handleCreatePage}>
            <Plus className="h-4 w-4 mr-2" />
            Create Page
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {pages.filter(p => p.is_published).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{sections.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Content Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{blocks.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="structure" className="w-full">
        <TabsList>
          <TabsTrigger value="structure">Page Structure</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Website Structure
              </CardTitle>
              <CardDescription>
                Manage your website's hierarchical content structure with drag-and-drop reordering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No content pages found</p>
                    <p className="text-sm">Start by creating your first page or check if data is loading correctly.</p>
                  </div>
                ) : (
                  pages.map((page) => (
                    <Collapsible
                      key={page.id}
                      open={expandedPages.has(page.id)}
                      onOpenChange={() => togglePageExpansion(page.id)}
                    >
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-3">
                              {expandedPages.has(page.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <FileText className="h-4 w-4" />
                              <div>
                                <h4 className="font-medium flex items-center gap-2">
                                  {page.title}
                                  {page.id === 'live-homepage' && (
                                    <Badge variant="default" className="text-xs bg-green-600">
                                      🔴 LIVE
                                    </Badge>
                                  )}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {page.id === 'live-homepage' ? 'Current website homepage' : `/${page.slug}`}
                                </p>
                              </div>
                              <Badge variant={page.is_published ? "default" : "secondary"}>
                                {page.is_published ? "Published" : "Draft"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {page.sections?.length || 0} sections
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCreateSection(page.id)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Section
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditPage(page)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {page.is_published && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a 
                                    href={page.slug === 'home' ? '/' : `/${page.slug}`} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Globe className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-4">
                          <div className="ml-6 space-y-2">
                            {page.sections && page.sections.length > 0 ? (
                              <DndContext 
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleDragEnd(event, 'section')}
                              >
                                <SortableContext 
                                  items={page.sections?.map(s => s.id) || []}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {page.sections?.map((section) => (
                                    <SortableItem key={section.id} id={section.id}>
                                      <Collapsible
                                        open={expandedSections.has(section.id)}
                                        onOpenChange={() => toggleSectionExpansion(section.id)}
                                      >
                                        <div className="border-l-2 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r">
                                          <CollapsibleTrigger asChild>
                                            <div className="flex items-center justify-between cursor-pointer">
                                              <div className="flex items-center gap-2">
                                                {expandedSections.has(section.id) ? (
                                                  <ChevronDown className="h-3 w-3" />
                                                ) : (
                                                  <ChevronRight className="h-3 w-3" />
                                                )}
                                                <Layout className="h-3 w-3" />
                                                <div>
                                                  <span className="text-sm font-medium capitalize">{section.section_type.replace('_', ' ')}</span>
                                                  <p className="text-xs text-gray-600">
                                                    {section.content?.title || section.content?.subtitle || 'No title'}
                                                  </p>
                                                </div>
                                                <Badge 
                                                  variant={section.is_active ? "default" : "secondary"} 
                                                  className="text-xs"
                                                >
                                                  {section.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                  {section.blocks?.length || 0} blocks
                                                </Badge>
                                              </div>
                                               <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                 <Button 
                                                   variant="ghost" 
                                                   size="sm" 
                                                   className="h-6 w-6 p-0"
                                                   onClick={() => handleEditSection(section)}
                                                 >
                                                   <Edit className="h-3 w-3" />
                                                 </Button>
                                                 <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-800">
                                                   <Trash2 className="h-3 w-3" />
                                                 </Button>
                                               </div>
                                            </div>
                                          </CollapsibleTrigger>
                                          
                                          <CollapsibleContent className="mt-2">
                                            <div className="ml-4 space-y-1">
                                              {section.blocks && section.blocks.length > 0 ? (
                                                section.blocks?.map((block) => (
                                                  <div key={block.id} className="flex items-center justify-between gap-2 p-2 bg-white rounded border">
                                                    <div className="flex items-center gap-2">
                                                      <ImageIcon className="h-3 w-3" />
                                                      <span className="text-xs font-medium">{block.block_type}</span>
                                                      <Badge 
                                                        variant={block.is_active ? "default" : "secondary"} 
                                                        className="text-xs"
                                                      >
                                                        {block.is_active ? "Active" : "Inactive"}
                                                      </Badge>
                                                    </div>
                                                    <div className="flex gap-1">
                                                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                                        <Edit className="h-3 w-3" />
                                                      </Button>
                                                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-600">
                                                        <Trash2 className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                ))
                                              ) : (
                                                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                                                  No content blocks - click to add content
                                                </div>
                                              )}
                                            </div>
                                          </CollapsibleContent>
                                        </div>
                                      </Collapsible>
                                    </SortableItem>
                                  ))}
                                </SortableContext>
                              </DndContext>
                            ) : (
                              <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded">
                                No sections found. Click "Add Section" to create content sections for this page.
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Pages</CardTitle>
              <CardDescription>Manage individual pages and their content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{page.title}</div>
                          <div className="text-sm text-muted-foreground">/{page.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{page.page_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.is_published ? "default" : "secondary"}>
                          {page.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{page.sections?.length || 0}</TableCell>
                      <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPage(page)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              fetchVersions(page.id, 'page');
                              setVersionDialog(true);
                            }}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          {page.is_published && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/${page.slug}`} target="_blank">
                                <Globe className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Version History
              </CardTitle>
              <CardDescription>Track changes and restore previous versions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Select a content item to view its version history
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Page Dialog */}
      <Dialog open={pageDialog} onOpenChange={setPageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Edit Page" : "Create New Page"}
            </DialogTitle>
            <DialogDescription>
              {editingPage ? "Update page content and settings" : "Create a new page for your website"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={pageForm.title}
                  onChange={(e) => setPageForm(prev => ({ 
                    ...prev, 
                    title: e.target.value,
                    slug: !editingPage ? generateSlug(e.target.value) : prev.slug
                  }))}
                  placeholder="Enter page title"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={pageForm.slug}
                  onChange={(e) => setPageForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="page-url-slug"
                />
              </div>

              <div>
                <Label htmlFor="page_type">Page Type</Label>
                <Select 
                  value={pageForm.page_type} 
                  onValueChange={(value) => setPageForm(prev => ({ ...prev, page_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={pageForm.is_published}
                  onCheckedChange={(checked) => setPageForm(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input
                  id="meta_title"
                  value={pageForm.meta_title}
                  onChange={(e) => setPageForm(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={pageForm.meta_description}
                  onChange={(e) => setPageForm(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Brief description for search engines"
                />
              </div>

              <div>
                <Label htmlFor="meta_keywords">Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={pageForm.meta_keywords}
                  onChange={(e) => setPageForm(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="content">Page Content</Label>
            <div className="mt-2">
              <RichTextEditor
                value={pageForm.content}
                onChange={(value) => setPageForm(prev => ({ ...prev, content: value }))}
                height="300px"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePage}>
              <Save className="h-4 w-4 mr-2" />
              Save Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={versionDialog} onOpenChange={setVersionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              View and restore previous versions of this content
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {versions.map((version) => (
              <div key={version.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Badge variant="outline">Version {version.version_number}</Badge>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {new Date(version.created_at).toLocaleString()}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Restore
                  </Button>
                </div>
                {version.description && (
                  <p className="text-sm text-muted-foreground">{version.description}</p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setVersionDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Section Dialog */}
      <Dialog open={sectionDialog} onOpenChange={setSectionDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Section" : "Create New Section"}
            </DialogTitle>
            <DialogDescription>
              {editingSection ? "Update section content and settings" : "Add a new content section to the page"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="section_type">Section Type</Label>
                <Select 
                  value={sectionForm.section_type} 
                  onValueChange={(value) => setSectionForm(prev => ({ ...prev, section_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero_search">Hero Search</SelectItem>
                    <SelectItem value="directory">Directory</SelectItem>
                    <SelectItem value="featured_properties">Featured Properties</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="why_use">Why Use</SelectItem>
                    <SelectItem value="stats">Statistics</SelectItem>
                    <SelectItem value="testimonials">Testimonials</SelectItem>
                    <SelectItem value="mobile_app">Mobile App</SelectItem>
                    <SelectItem value="content">General Content</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="cta">Call to Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={sectionForm.sort_order}
                  onChange={(e) => setSectionForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="section_active"
                checked={sectionForm.is_active}
                onCheckedChange={(checked) => setSectionForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="section_active">Active Section</Label>
            </div>

            <div>
              {editingSection?.page_id === 'live-homepage' ? (
                <div className="space-y-4">
                  {/* Hero Search */}
                  {sectionForm.section_type === 'hero_search' && (
                    <>
                      <div>
                        <Label>Background Image URL</Label>
                        <Input
                          value={liveContentForm.background_image_url || ''}
                          onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, background_image_url: e.target.value }))}
                          placeholder="/lovable-uploads/hero.jpg"
                        />
                      </div>
                      <div>
                        <Label>Search Placeholder</Label>
                        <Input
                          value={liveContentForm.placeholder || ''}
                          onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, placeholder: e.target.value }))}
                          placeholder="Search 'Noida'"
                        />
                      </div>
                    </>
                  )}

                  {/* Services */}
                  {sectionForm.section_type === 'services' && (
                    <>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={liveContentForm.title || ''}
                          onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, title: e.target.value }))}
                          placeholder="Our Services"
                        />
                      </div>
                      <div>
                        <Label>Subtitle</Label>
                        <Input
                          value={liveContentForm.subtitle || ''}
                          onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Comprehensive real estate solutions"
                        />
                      </div>
                      <div>
                        <Label>Items (one per line: Title|Description)</Label>
                        <Textarea
                          value={(liveContentForm.items || []).map((i: any) => `${i.title || ''}|${i.description || ''}`).join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n').filter(Boolean);
                            const items = lines.map(l => {
                              const [t, d] = l.split('|');
                              return { title: (t || '').trim(), description: (d || '').trim() };
                            });
                            setLiveContentForm((prev: any) => ({ ...prev, items }));
                          }}
                          placeholder={"Property Search|Find your perfect property"}
                          className="min-h-[120px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Why Use */}
                  {sectionForm.section_type === 'why_use' && (
                    <>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={liveContentForm.title || ''}
                          onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, title: e.target.value }))}
                          placeholder="Why Use Home HNI"
                        />
                      </div>
                      <div>
                        <Label>Top Services (one per line: Title|Badge)</Label>
                        <Textarea
                          value={(liveContentForm.topServices || []).map((i: any) => `${i.title || ''}|${i.badge || ''}`).join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n').filter(Boolean);
                            const topServices = lines.map(l => {
                              const [t, b] = l.split('|');
                              return { title: (t || '').trim(), badge: (b || '').trim() || undefined };
                            });
                            setLiveContentForm((prev: any) => ({ ...prev, topServices }));
                          }}
                          placeholder={"Builder Projects|New"}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <Label>Benefits (one per line: Title|Description)</Label>
                        <Textarea
                          value={(liveContentForm.benefits || []).map((i: any) => `${i.title || ''}|${i.description || ''}`).join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n').filter(Boolean);
                            const benefits = lines.map(l => {
                              const [t, d] = l.split('|');
                              return { title: (t || '').trim(), description: (d || '').trim() };
                            });
                            setLiveContentForm((prev: any) => ({ ...prev, benefits }));
                          }}
                          placeholder={"Avoid Brokers|We directly connect you to verified owners"}
                          className="min-h-[120px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Stats */}
                  {sectionForm.section_type === 'stats' && (
                    <div>
                      <Label>Stats (one per line: Number|Label)</Label>
                      <Textarea
                        value={(liveContentForm.items || []).map((i: any) => `${i.number || ''}|${i.label || ''}`).join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(Boolean);
                          const items = lines.map(l => {
                            const [n, lbl] = l.split('|');
                            return { number: (n || '').trim(), label: (lbl || '').trim() };
                          });
                          setLiveContentForm((prev: any) => ({ ...prev, items }));
                        }}
                        placeholder={"50,000+|Properties Listed"}
                        className="min-h-[120px]"
                      />
                    </div>
                  )}

                  {/* Testimonials */}
                  {sectionForm.section_type === 'testimonials' && (
                    <div>
                      <Label>Testimonials (one per line: Name|Rating 1-5|Text)</Label>
                      <Textarea
                        value={(liveContentForm.items || []).map((i: any) => `${i.name || ''}|${i.rating || 5}|${i.text || ''}`).join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(Boolean);
                          const items = lines.map(l => {
                            const [name, rating, text] = l.split('|');
                            return { name: (name || '').trim(), rating: Math.max(1, Math.min(5, parseInt((rating || '5').trim()) || 5)), text: (text || '').trim() };
                          });
                          setLiveContentForm((prev: any) => ({ ...prev, items }));
                        }}
                        placeholder={"Rajesh Kumar|5|Great platform!"}
                        className="min-h-[140px]"
                      />
                    </div>
                  )}

                  {/* Mobile App */}
                  {sectionForm.section_type === 'mobile_app' && (
                    <>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={liveContentForm.title || ''}
                          onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, title: e.target.value }))}
                          placeholder="Find A New Home On The Go"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={liveContentForm.description || ''}
                          onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, description: e.target.value }))}
                          placeholder="Download our app and discover properties..."
                        />
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={liveContentForm.image_url || ''}
                          onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, image_url: e.target.value }))}
                          placeholder="/lovable-uploads/homeAppPromotion.png"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Google Play Link</Label>
                          <Input
                            value={liveContentForm.play_link || ''}
                            onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, play_link: e.target.value }))}
                            placeholder="https://play.google.com/..."
                          />
                        </div>
                        <div>
                          <Label>App Store Link</Label>
                          <Input
                            value={liveContentForm.appstore_link || ''}
                            onChange={(e) => setLiveContentForm((prev: any) => ({ ...prev, appstore_link: e.target.value }))}
                            placeholder="https://apps.apple.com/..."
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Label htmlFor="section_content">Section Content (JSON Format)</Label>
                  <div className="mt-2">
                    <Textarea
                      id="section_content"
                      value={typeof sectionForm.content === 'string' ? sectionForm.content : JSON.stringify(sectionForm.content, null, 2)}
                      onChange={(e) => setSectionForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder='{"title": "Section Title", "subtitle": "Section Description"}'
                      className="min-h-[200px] font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter JSON content for this section. Example: {"{"}"title": "Our Services", "subtitle": "Complete real estate solutions"{"}"}
                  </p>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSectionDialog(false)}>
              Cancel
            </Button>
            {editingSection?.page_id === 'live-homepage' ? (
              <Button onClick={handleSaveSection} className="bg-green-600 hover:bg-green-700">
                <Globe className="h-4 w-4 mr-2" />
                Publish Live Changes
              </Button>
            ) : (
              <Button onClick={handleSaveSection}>
                <Save className="h-4 w-4 mr-2" />
                Save Section
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Live Changes Confirmation Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Publish Live Changes?
            </DialogTitle>
            <DialogDescription>
              This will instantly update your live website. Visitors will see the changes immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600">⚠️</div>
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Live Website Update</p>
                  <p className="text-yellow-700">
                    These changes will be visible to all website visitors immediately. Make sure the content is ready for publication.
                  </p>
                </div>
              </div>
            </div>

            {pendingChanges && (
              <div className="bg-gray-50 border rounded-lg p-4">
                <Label className="text-sm font-medium text-gray-700">Preview of Changes:</Label>
                <div className="mt-2 text-sm bg-white p-3 rounded border font-mono text-gray-600 max-h-32 overflow-y-auto">
                  {JSON.stringify(pendingChanges, null, 2)}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePublishLiveChanges}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Globe className="h-4 w-4 mr-2" />
              Yes, Publish Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};