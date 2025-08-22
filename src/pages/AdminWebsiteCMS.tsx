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
  
  // Unified CMS states
  const [showUnifiedCreator, setShowUnifiedCreator] = useState(false);
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

  // Unified form states for page + sections creation
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

  const [pageSections, setPageSections] = useState<Array<{
    id: string;
    section_type: string;
    template_id?: string;
    content: any;
    sort_order: number;
    is_custom: boolean;
  }>>([]);

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
        sections: []
      };

      setPages(prev => [liveHomepage, ...pagesData || []]);

    } catch (error) {
      console.error('Error fetching CMS data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load CMS data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Utility functions
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const ensureUniqueSlug = async (slug: string): Promise<string> => {
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
      const { data: existingPages } = await supabase
        .from('content_pages')
        .select('slug')
        .eq('slug', uniqueSlug);

      if (!existingPages || existingPages.length === 0) {
        break;
      }

      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }

    return uniqueSlug;
  };

  // Handlers: edit, preview, delete, and save updates for pages
  const loadPageForEditing = async (page: ContentPage) => {
    try {
      if (page.page_type === 'live') {
        toast({
          title: 'Not supported',
          description: 'Editing the live homepage is managed elsewhere.',
          variant: 'destructive',
        });
        return;
      }
      setEditingPage(page);
      setPageForm({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        meta_keywords: Array.isArray(page.meta_keywords) ? page.meta_keywords.join(', ') : (page.meta_keywords as any) || '',
        page_type: page.page_type || 'page',
        is_published: page.is_published ?? false,
      });

      const { data: sectionsData, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('sort_order');

      if (error) throw error;

      setPageSections(
        (sectionsData || []).map((s: any) => ({
          id: s.id,
          section_type: s.section_type,
          content: s.content || {},
          sort_order: typeof s.sort_order === 'number' ? s.sort_order : 0,
          is_custom: true,
        }))
      );

      setShowUnifiedCreator(true);
    } catch (err) {
      console.error('Error loading page for editing:', err);
      toast({ title: 'Error', description: 'Failed to load page for editing', variant: 'destructive' });
    }
  };

  const updatePageWithSections = async () => {
    if (!editingPage) return;
    try {
      const { error: pageError } = await supabase
        .from('content_pages')
        .update({
          title: pageForm.title,
          slug: pageForm.slug || (await ensureUniqueSlug(generateSlug(pageForm.title))),
          content: pageForm.content,
          meta_title: pageForm.meta_title,
          meta_description: pageForm.meta_description,
          meta_keywords: pageForm.meta_keywords ? pageForm.meta_keywords.split(',').map((k: string) => k.trim()) : [],
          page_type: pageForm.page_type,
          is_published: pageForm.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingPage.id);

      if (pageError) throw pageError;

      const { data: existing, error: existingErr } = await supabase
        .from('page_sections')
        .select('id')
        .eq('page_id', editingPage.id);
      if (existingErr) throw existingErr;

      const existingIds = new Set((existing || []).map((s: any) => s.id));
      const currentIds = new Set(pageSections.filter(s => !String(s.id).startsWith('temp-')).map(s => s.id));

      const toDelete = [...existingIds].filter(id => !currentIds.has(id));
      if (toDelete.length) {
        const { error: delErr } = await supabase.from('page_sections').delete().in('id', toDelete);
        if (delErr) throw delErr;
      }

      const newSections = pageSections.filter(s => String(s.id).startsWith('temp-')).map(s => ({
        page_id: editingPage.id,
        section_type: s.section_type,
        content: s.content,
        sort_order: s.sort_order,
        is_active: true,
      }));
      if (newSections.length) {
        const { error: insertErr } = await supabase.from('page_sections').insert(newSections);
        if (insertErr) throw insertErr;
      }

      const updates = pageSections
        .filter(s => !String(s.id).startsWith('temp-'))
        .map(s =>
          supabase
            .from('page_sections')
            .update({
              section_type: s.section_type,
              content: s.content,
              sort_order: s.sort_order,
              is_active: true,
            })
            .eq('id', s.id)
        );
      if (updates.length) {
        const results = await Promise.all(updates);
        const anyErr = results.find((r: any) => r && r.error);
        if (anyErr && anyErr.error) throw anyErr.error;
      }

      toast({ title: 'Saved', description: 'Page updated successfully' });
      setShowUnifiedCreator(false);
      setEditingPage(null);
      setPageSections([]);
      await fetchData();
    } catch (err) {
      console.error('Error updating page:', err);
      toast({ title: 'Error', description: 'Failed to save changes', variant: 'destructive' });
    }
  };

  const handlePreviewPage = (page: ContentPage) => {
    const url = page.page_type === 'live' ? '/' : `/${page.slug || ''}`;
    window.open(url, '_blank', 'noopener');
  };

  const handleDeletePage = async (page: ContentPage) => {
    if (page.page_type === 'live') return;
    const ok = window.confirm(`Delete page "${page.title}"? This cannot be undone.`);
    if (!ok) return;
    try {
      const { data: secIds, error: secErr } = await supabase
        .from('page_sections')
        .select('id')
        .eq('page_id', page.id);
      if (secErr) throw secErr;
      if (secIds && secIds.length) {
        const { error: delSecErr } = await supabase
          .from('page_sections')
          .delete()
          .in('id', secIds.map((s: any) => s.id));
        if (delSecErr) throw delSecErr;
      }
      const { error: pageDelErr } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', page.id);
      if (pageDelErr) throw pageDelErr;

      toast({ title: 'Deleted', description: 'Page deleted successfully' });
      await fetchData();
    } catch (e) {
      console.error('Error deleting page:', e);
      toast({ title: 'Error', description: 'Failed to delete page', variant: 'destructive' });
    }
  };

  // Add section template to current page sections
  const addSectionTemplate = (sectionType: string, templateId: string) => {
    const template = sectionTemplates[sectionType]?.find(t => t.id === templateId);
    if (!template) return;

    const newSection = {
      id: `temp-${Date.now()}`,
      section_type: sectionType,
      template_id: templateId,
      content: template.content,
      sort_order: pageSections.length,
      is_custom: false
    };

    setPageSections(prev => [...prev, newSection]);
  };

  // Add custom section
  const addCustomSection = (sectionType: string) => {
    const newSection = {
      id: `temp-${Date.now()}`,
      section_type: sectionType,
      content: {},
      sort_order: pageSections.length,
      is_custom: true
    };

    setPageSections(prev => [...prev, newSection]);
  };

  // Remove section from page
  const removeSection = (sectionId: string) => {
    setPageSections(prev => prev.filter(s => s.id !== sectionId));
  };

  // Update section content
  const updateSectionContent = (sectionId: string, content: any) => {
    setPageSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, content } : section
    ));
  };

  // Create page with sections
  const createPageWithSections = async () => {
    if (!pageForm.title.trim()) {
      toast({
        title: 'Error',
        description: 'Page title is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const slug = await ensureUniqueSlug(generateSlug(pageForm.title));
      
      // Create the page first
      const { data: page, error: pageError } = await supabase
        .from('content_pages')
        .insert({
          title: pageForm.title,
          slug,
          content: pageForm.content,
          meta_title: pageForm.meta_title,
          meta_description: pageForm.meta_description,
          meta_keywords: pageForm.meta_keywords ? pageForm.meta_keywords.split(',').map(k => k.trim()) : [],
          page_type: pageForm.page_type,
          is_published: pageForm.is_published
        })
        .select()
        .single();

      if (pageError) throw pageError;

      // Create sections if any
      if (pageSections.length > 0) {
        const sectionsData = pageSections.map(section => ({
          page_id: page.id,
          section_type: section.section_type,
          content: section.content,
          sort_order: section.sort_order,
          is_active: true
        }));

        const { error: sectionsError } = await supabase
          .from('page_sections')
          .insert(sectionsData);

        if (sectionsError) throw sectionsError;
      }

      toast({
        title: 'Success',
        description: `Page "${pageForm.title}" created successfully with ${pageSections.length} sections`,
      });

      // Reset form
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
      setPageSections([]);
      setShowUnifiedCreator(false);
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        title: 'Error',
        description: 'Failed to create page',
        variant: 'destructive',
      });
    }
  };

  // Handle drag and drop for sections
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pageSections.findIndex(section => section.id === active.id);
    const newIndex = pageSections.findIndex(section => section.id === over.id);

    const reorderedSections = arrayMove(pageSections, oldIndex, newIndex).map((section, index) => ({
      ...section,
      sort_order: index
    }));

    setPageSections(reorderedSections);
  };

  // Initialize data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-generate slug from title
  useEffect(() => {
    if (pageForm.title && !pageForm.slug) {
      setPageForm(prev => ({ 
        ...prev, 
        slug: generateSlug(pageForm.title) 
      }));
    }
  }, [pageForm.title]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Website CMS</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage website pages with integrated sections
            </p>
          </div>
          <Button 
            onClick={() => setShowUnifiedCreator(true)}
            className="bg-brand-red hover:bg-brand-red/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Page + Sections
          </Button>
        </div>

        {/* Page Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
            <CardDescription>
              Manage your website pages and their sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>
                      {page.slug ? (
                        <Badge variant="outline">{page.slug}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Live Homepage</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={page.page_type === 'live' ? 'default' : 'secondary'}>
                        {page.page_type === 'live' ? 'Live' : page.page_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={page.is_published ? 'default' : 'secondary'}>
                        {page.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {page.sections?.length || 0} sections
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(page.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => loadPageForEditing(page)} disabled={page.page_type === 'live'}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePreviewPage(page)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {page.page_type !== 'live' && (
                          <Button variant="outline" size="sm" onClick={() => handleDeletePage(page)}>
                            <Trash2 className="w-4 h-4" />
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

        {/* Unified Page + Sections Creator Dialog */}
        <Dialog open={showUnifiedCreator} onOpenChange={setShowUnifiedCreator}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPage ? 'Edit Page + Sections' : 'Create New Page + Sections'}</DialogTitle>
              <DialogDescription>
                {editingPage ? 'Update this page and manage its sections' : 'Create a new page and add sections with templates or custom content'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Page Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Page Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Page Title *</Label>
                    <Input
                      id="title"
                      value={pageForm.title}
                      onChange={(e) => setPageForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter page title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={pageForm.slug}
                      onChange={(e) => setPageForm(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="auto-generated-slug"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pageType">Page Type</Label>
                    <Select 
                      value={pageForm.page_type} 
                      onValueChange={(value) => setPageForm(prev => ({ ...prev, page_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page">Static Page</SelectItem>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="service">Service Page</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                    <Input
                      id="metaTitle"
                      value={pageForm.meta_title}
                      onChange={(e) => setPageForm(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="SEO optimized title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                    <Textarea
                      id="metaDescription"
                      value={pageForm.meta_description}
                      onChange={(e) => setPageForm(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="Brief description for search engines"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaKeywords">Meta Keywords (SEO)</Label>
                    <Input
                      id="metaKeywords"
                      value={pageForm.meta_keywords}
                      onChange={(e) => setPageForm(prev => ({ ...prev, meta_keywords: e.target.value }))}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={pageForm.is_published}
                      onCheckedChange={(checked) => setPageForm(prev => ({ ...prev, is_published: checked }))}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>
                </div>
              </div>

              {/* Sections Builder */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Page Sections</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCustomSection('content')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Custom Section
                  </Button>
                </div>

                {/* Section Templates */}
                <div className="space-y-4">
                  {Object.entries(sectionTemplates).map(([sectionType, templates]) => (
                    <div key={sectionType} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 capitalize">{sectionType.replace('-', ' ')} Templates</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {templates.map((template) => (
                          <div key={template.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium text-sm">{template.name}</div>
                              <div className="text-xs text-muted-foreground">{template.preview}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addSectionTemplate(sectionType, template.id)}
                            >
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Page Sections */}
                {pageSections.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Added Sections ({pageSections.length})</h4>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleSectionDragEnd}
                    >
                      <SortableContext
                        items={pageSections.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {pageSections.map((section) => (
                            <SortableItem key={section.id} id={section.id}>
                              <Collapsible>
                                <div className="border rounded-lg p-3 bg-card">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                                          <ChevronRight className="h-4 w-4" />
                                        </Button>
                                      </CollapsibleTrigger>
                                      <div className="flex-1">
                                        <div className="font-medium text-sm capitalize">
                                          {section.section_type.replace('-', ' ')}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {section.is_custom ? 'Custom Section' : `Template: ${section.template_id}`}
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeSection(section.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>

                                  <CollapsibleContent className="space-y-3">
                                    {/* Content Editor based on section type */}
                                    {section.section_type === 'hero-search' && (
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-xs">Hero Title</Label>
                                          <Input
                                            value={section.content.title || ''}
                                            onChange={(e) => updateSectionContent(section.id, {
                                              ...section.content,
                                              title: e.target.value
                                            })}
                                            placeholder="Enter hero title"
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs">Subtitle</Label>
                                          <Textarea
                                            value={section.content.subtitle || ''}
                                            onChange={(e) => updateSectionContent(section.id, {
                                              ...section.content,
                                              subtitle: e.target.value
                                            })}
                                            placeholder="Enter subtitle"
                                            rows={2}
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs">Primary CTA Text</Label>
                                          <Input
                                            value={section.content.primaryCTA || ''}
                                            onChange={(e) => updateSectionContent(section.id, {
                                              ...section.content,
                                              primaryCTA: e.target.value
                                            })}
                                            placeholder="Button text"
                                            className="text-sm"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {section.section_type === 'services' && (
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-xs">Section Title</Label>
                                          <Input
                                            value={section.content.title || ''}
                                            onChange={(e) => updateSectionContent(section.id, {
                                              ...section.content,
                                              title: e.target.value
                                            })}
                                            placeholder="Enter section title"
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs">Section Subtitle</Label>
                                          <Input
                                            value={section.content.subtitle || ''}
                                            onChange={(e) => updateSectionContent(section.id, {
                                              ...section.content,
                                              subtitle: e.target.value
                                            })}
                                            placeholder="Enter subtitle"
                                            className="text-sm"
                                          />
                                        </div>
                                        {section.content.services?.map((service, idx) => (
                                          <div key={idx} className="border rounded p-2 space-y-2">
                                            <Label className="text-xs">Service {idx + 1}</Label>
                                            <Input
                                              value={service.title || ''}
                                              onChange={(e) => {
                                                const newServices = [...(section.content.services || [])];
                                                newServices[idx] = { ...service, title: e.target.value };
                                                updateSectionContent(section.id, {
                                                  ...section.content,
                                                  services: newServices
                                                });
                                              }}
                                              placeholder="Service title"
                                              className="text-sm"
                                            />
                                            <Textarea
                                              value={service.description || ''}
                                              onChange={(e) => {
                                                const newServices = [...(section.content.services || [])];
                                                newServices[idx] = { ...service, description: e.target.value };
                                                updateSectionContent(section.id, {
                                                  ...section.content,
                                                  services: newServices
                                                });
                                              }}
                                              placeholder="Service description"
                                              rows={2}
                                              className="text-sm"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {section.section_type === 'testimonials' && (
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-xs">Section Title</Label>
                                          <Input
                                            value={section.content.title || ''}
                                            onChange={(e) => updateSectionContent(section.id, {
                                              ...section.content,
                                              title: e.target.value
                                            })}
                                            placeholder="Enter section title"
                                            className="text-sm"
                                          />
                                        </div>
                                        {section.content.testimonials?.map((testimonial, idx) => (
                                          <div key={idx} className="border rounded p-2 space-y-2">
                                            <Label className="text-xs">Testimonial {idx + 1}</Label>
                                            <Input
                                              value={testimonial.name || ''}
                                              onChange={(e) => {
                                                const newTestimonials = [...(section.content.testimonials || [])];
                                                newTestimonials[idx] = { ...testimonial, name: e.target.value };
                                                updateSectionContent(section.id, {
                                                  ...section.content,
                                                  testimonials: newTestimonials
                                                });
                                              }}
                                              placeholder="Customer name"
                                              className="text-sm"
                                            />
                                            <Textarea
                                              value={testimonial.text || ''}
                                              onChange={(e) => {
                                                const newTestimonials = [...(section.content.testimonials || [])];
                                                newTestimonials[idx] = { ...testimonial, text: e.target.value };
                                                updateSectionContent(section.id, {
                                                  ...section.content,
                                                  testimonials: newTestimonials
                                                });
                                              }}
                                              placeholder="Testimonial text"
                                              rows={3}
                                              className="text-sm"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {section.section_type === 'mobile-app' && (
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-xs">App Section Title</Label>
                                          <Input
                                            value={section.content.title || ''}
                                            onChange={(e) => updateSectionContent(section.id, {
                                              ...section.content,
                                              title: e.target.value
                                            })}
                                            placeholder="Enter app section title"
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs">Description</Label>
                                          <Textarea
                                            value={section.content.description || ''}
                                            onChange={(e) => updateSectionContent(section.id, {
                                              ...section.content,
                                              description: e.target.value
                                            })}
                                            placeholder="App description"
                                            rows={3}
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs">App Image</Label>
                                          <ImageUpload
                                            existingImages={section.content.appImage ? [section.content.appImage] : []}
                                            onImageUploaded={(url) => updateSectionContent(section.id, {
                                              ...section.content,
                                              appImage: url
                                            })}
                                            onImageRemoved={() => updateSectionContent(section.id, {
                                              ...section.content,
                                              appImage: ''
                                            })}
                                            maxImages={1}
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Custom Content Editor */}
                                    {section.is_custom && (
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-xs">Custom Content</Label>
                                          <RichTextEditor
                                            value={section.content.html || ''}
                                            onChange={(html) => updateSectionContent(section.id, {
                                              ...section.content,
                                              html
                                            })}
                                          />
                                        </div>
                                         <div>
                                           <Label className="text-xs">Section Images</Label>
                                           <ImageUpload
                                             existingImages={section.content.image ? [section.content.image] : []}
                                             onImageUploaded={(url) => updateSectionContent(section.id, {
                                               ...section.content,
                                               image: url
                                             })}
                                             onImageRemoved={() => updateSectionContent(section.id, {
                                               ...section.content,
                                               image: ''
                                             })}
                                             maxImages={1}
                                           />
                                         </div>
                                      </div>
                                    )}
                                  </CollapsibleContent>
                                </div>
                              </Collapsible>
                            </SortableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowUnifiedCreator(false); setEditingPage(null); }}>
                Cancel
              </Button>
              <Button onClick={editingPage ? updatePageWithSections : createPageWithSections} disabled={!pageForm.title.trim()}>
                {editingPage ? 'Save Changes' : `Create Page${pageSections.length > 0 ? ` + ${pageSections.length} Sections` : ''}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};