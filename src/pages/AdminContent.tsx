import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
  Tag,
  Globe,
  Clock,
  User,
  ExternalLink,
  Home,
  Layout
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { contentElementsService, ContentElement } from '@/services/contentElementsService';

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
}

export const AdminContent: React.FC = () => {
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [contentElements, setContentElements] = useState<ContentElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [elementDialogOpen, setElementDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [editingElement, setEditingElement] = useState<ContentElement | null>(null);
  const { toast } = useToast();

  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    page_type: 'page',
    is_published: false,
    images: [] as string[]
  });

  const [sectionForm, setSectionForm] = useState({
    section_type: 'content',
    content: '',
    sort_order: 0,
    is_active: true,
    images: [] as string[]
  });

  const [elementForm, setElementForm] = useState({
    element_type: 'text',
    element_key: '',
    title: '',
    content: '{}',
    page_location: 'homepage',
    section_location: '',
    sort_order: 0,
    is_active: true,
    images: [] as string[]
  });

  // Fetch content elements
  const fetchContentElements = useCallback(async () => {
    try {
      const elements = await contentElementsService.getAllContentElements();
      setContentElements(elements);
    } catch (error) {
      console.error('Error fetching content elements:', error);
    }
  }, []);

  // Fetch content pages
  const fetchContentPages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setContentPages(data || []);
    } catch (error) {
      console.error('Error fetching content pages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content pages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch page sections
  const fetchPageSections = useCallback(async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('sort_order');

      if (error) throw error;
      setPageSections(data || []);
    } catch (error) {
      console.error('Error fetching page sections:', error);
    }
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    fetchContentPages();
    fetchContentElements();

    // Subscribe to content_pages changes
    const pagesChannel = supabase
      .channel('content_pages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_pages' },
        () => fetchContentPages()
      )
      .subscribe();

    // Subscribe to page_sections changes
    const sectionsChannel = supabase
      .channel('page_sections_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'page_sections' },
        () => {
          if (selectedPage) {
            fetchPageSections(selectedPage.id);
          }
        }
      )
      .subscribe();

    // Subscribe to content_elements changes
    const elementsChannel = supabase
      .channel('content_elements_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'content_elements' },
        () => fetchContentElements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pagesChannel);
      supabase.removeChannel(sectionsChannel);
      supabase.removeChannel(elementsChannel);
    };
  }, [fetchContentPages, fetchPageSections, fetchContentElements, selectedPage]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle page form changes
  const handlePageFormChange = (field: string, value: any) => {
    setPageForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !editingPage ? { slug: generateSlug(value) } : {})
    }));
  };

  // Handle section form changes
  const handleSectionFormChange = (field: string, value: any) => {
    setSectionForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle element form changes
  const handleElementFormChange = (field: string, value: any) => {
    setElementForm(prev => ({ ...prev, [field]: value }));
  };

  // Create/Update element
  const handleSaveElement = async () => {
    try {
      let contentData;
      try {
        contentData = JSON.parse(elementForm.content);
      } catch {
        contentData = { text: elementForm.content };
      }

      const elementData = {
        element_type: elementForm.element_type,
        element_key: elementForm.element_key,
        title: elementForm.title,
        content: contentData,
        page_location: elementForm.page_location,
        section_location: elementForm.section_location,
        sort_order: elementForm.sort_order,
        is_active: elementForm.is_active,
        images: elementForm.images
      };

      if (editingElement) {
        await contentElementsService.updateContentElement(editingElement.id, elementData);
        toast({ 
          title: "Success", 
          description: "Element updated successfully",
          className: "bg-white border border-green-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(120, 100%, 25%)",
          },
        });
      } else {
        await contentElementsService.createContentElement(elementData);
        toast({ 
          title: "Success", 
          description: "Element created successfully",
          className: "bg-white border border-green-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(120, 100%, 25%)",
          },
        });
      }

      setElementDialogOpen(false);
      resetElementForm();
    } catch (error) {
      console.error('Error saving element:', error);
      toast({
        title: "Error",
        description: "Failed to save element",
        variant: "destructive"
      });
    }
  };

  // Delete element
  const handleDeleteElement = async (elementId: string) => {
    try {
      await contentElementsService.deleteContentElement(elementId);
      toast({ 
        title: "Success", 
        description: "Element deleted successfully",
        className: "bg-white border border-green-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(120, 100%, 25%)",
        },
      });
    } catch (error) {
      console.error('Error deleting element:', error);
      toast({
        title: "Error",
        description: "Failed to delete element",
        variant: "destructive"
      });
    }
  };

  // Create/Update page
  const handleSavePage = async () => {
    try {
      const pageData = {
        title: pageForm.title,
        slug: pageForm.slug,
        content: { 
          html: pageForm.content,
          images: pageForm.images 
        },
        meta_title: pageForm.meta_title || null,
        meta_description: pageForm.meta_description || null,
        meta_keywords: pageForm.meta_keywords ? pageForm.meta_keywords.split(',').map(k => k.trim()) : null,
        page_type: pageForm.page_type,
        is_published: pageForm.is_published
      };

      if (editingPage) {
        const { error } = await supabase
          .from('content_pages')
          .update(pageData)
          .eq('id', editingPage.id);

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Page updated successfully",
          className: "bg-white border border-green-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(120, 100%, 25%)",
          },
        });
      } else {
        const { error } = await supabase
          .from('content_pages')
          .insert(pageData);

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Page created successfully",
          className: "bg-white border border-green-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(120, 100%, 25%)",
          },
        });
      }

      setDialogOpen(false);
      resetPageForm();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive"
      });
    }
  };

  // Create/Update section
  const handleSaveSection = async () => {
    if (!selectedPage) return;

    try {
      const sectionData = {
        page_id: selectedPage.id,
        section_type: sectionForm.section_type,
        content: {
          html: sectionForm.content,
          images: sectionForm.images
        },
        sort_order: sectionForm.sort_order,
        is_active: sectionForm.is_active
      };

      if (editingSection) {
        const { error } = await supabase
          .from('page_sections')
          .update(sectionData)
          .eq('id', editingSection.id);

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Section updated successfully",
          className: "bg-white border border-green-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(120, 100%, 25%)",
          },
        });
      } else {
        const { error } = await supabase
          .from('page_sections')
          .insert(sectionData);

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Section created successfully",
          className: "bg-white border border-green-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(120, 100%, 25%)",
          },
        });
      }

      setSheetOpen(false);
      resetSectionForm();
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: "Error",
        description: "Failed to save section",
        variant: "destructive"
      });
    }
  };

  // Delete page
  const handleDeletePage = async (pageId: string) => {
    try {
      // Delete sections first
      await supabase
        .from('page_sections')
        .delete()
        .eq('page_id', pageId);

      // Then delete the page
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: "Page deleted successfully",
        className: "bg-white border border-green-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(120, 100%, 25%)",
        },
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive"
      });
    }
  };

  // Delete section
  const handleDeleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: "Section deleted successfully",
        className: "bg-white border border-green-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(120, 100%, 25%)",
        },
      });
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive"
      });
    }
  };

  // Reset forms
  const resetPageForm = () => {
    setPageForm({
      title: '',
      slug: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      page_type: 'page',
      is_published: false,
      images: []
    });
    setEditingPage(null);
  };

  const resetSectionForm = () => {
    setSectionForm({
      section_type: 'content',
      content: '',
      sort_order: pageSections.length,
      is_active: true,
      images: []
    });
    setEditingSection(null);
  };

  const resetElementForm = () => {
    setElementForm({
      element_type: 'text',
      element_key: '',
      title: '',
      content: '{}',
      page_location: 'homepage',
      section_location: '',
      sort_order: 0,
      is_active: true,
      images: []
    });
    setEditingElement(null);
  };

  // Handle create page
  const handleCreatePage = () => {
    resetPageForm();
    setDialogOpen(true);
  };

  // Handle create element
  const handleCreateElement = () => {
    resetElementForm();
    setElementDialogOpen(true);
  };

  // Handle edit element
  const handleEditElement = (element: ContentElement) => {
    setEditingElement(element);
    setElementForm({
      element_type: element.element_type,
      element_key: element.element_key,
      title: element.title || '',
      content: JSON.stringify(element.content, null, 2),
      page_location: element.page_location || 'homepage',
      section_location: element.section_location || '',
      sort_order: element.sort_order,
      is_active: element.is_active,
      images: element.images || []
    });
    setElementDialogOpen(true);
  };

  // Handle edit page
  const handleEditPage = (page: ContentPage) => {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content?.html || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords?.join(', ') || '',
      page_type: page.page_type,
      is_published: page.is_published,
      images: page.content?.images || []
    });
    setDialogOpen(true);
  };

  // Handle view page sections
  const handleViewPage = (page: ContentPage) => {
    setSelectedPage(page);
    fetchPageSections(page.id);
  };

  // Handle create section
  const handleCreateSection = () => {
    resetSectionForm();
    setSectionForm(prev => ({ ...prev, sort_order: pageSections.length }));
    setSheetOpen(true);
  };

  // Handle edit section
  const handleEditSection = (section: PageSection) => {
    setEditingSection(section);
    setSectionForm({
      section_type: section.section_type,
      content: section.content?.html || '',
      sort_order: section.sort_order,
      is_active: section.is_active,
      images: section.content?.images || []
    });
    setSheetOpen(true);
  };

  const getStatusBadge = (isPublished: boolean) => (
    <Badge variant={isPublished ? "default" : "secondary"}>
      {isPublished ? "Published" : "Draft"}
    </Badge>
  );

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      blog: "bg-blue-100 text-blue-800",
      page: "bg-green-100 text-green-800",
      faq: "bg-purple-100 text-purple-800",
      announcement: "bg-orange-100 text-orange-800"
    };
    
    return (
      <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>
        {type}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Manage website content, pages, sections, and live elements in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateElement} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Element
          </Button>
          <Button onClick={handleCreatePage}>
            <Plus className="h-4 w-4 mr-2" />
            Create Page
          </Button>
        </div>
      </div>

      <Tabs defaultValue="elements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="elements" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Website Elements
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sections
          </TabsTrigger>
        </TabsList>

        {/* Website Elements Tab */}
        <TabsContent value="elements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Website Elements
              </CardTitle>
              <CardDescription>
                Manage all editable website content including section headers, text content, images, and CTAs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentElements
                    .filter(element => element.element_type !== 'featured_property')
                    .map((element) => (
                    <TableRow key={element.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{element.title || 'Untitled'}</div>
                          <div className="text-sm text-muted-foreground">{element.element_key}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{element.element_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{element.page_location}</div>
                          {element.section_location && (
                            <div className="text-muted-foreground">{element.section_location}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={element.is_active ? "default" : "secondary"}>
                          {element.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditElement(element)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteElement(element.id)}
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
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pages List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Pages
                  </CardTitle>
                  <CardDescription>Manage all your website pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contentPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{page.title}</div>
                              <div className="text-sm text-muted-foreground">/{page.slug}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(page.page_type)}</TableCell>
                          <TableCell>{getStatusBadge(page.is_published)}</TableCell>
                          <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`/preview/${page.slug}`, '_blank')}
                                title="Preview Page"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPage(page)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPage(page)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePage(page.id)}
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
            </div>
          </div>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Page Sections
                {selectedPage && (
                  <Badge variant="outline" className="ml-2">
                    {selectedPage.title}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {selectedPage ? 'Manage sections for the selected page' : 'Select a page to view sections'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPage ? (
                <>
                  <Button 
                    onClick={handleCreateSection} 
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                  
                  <div className="space-y-2">
                    {pageSections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium capitalize">{section.section_type}</div>
                          <div className="text-sm text-muted-foreground">
                            Order: {section.sort_order}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={section.is_active}
                            onCheckedChange={async (checked) => {
                              try {
                                await supabase
                                  .from('page_sections')
                                  .update({ is_active: checked })
                                  .eq('id', section.id);
                              } catch (error) {
                                console.error('Error updating section:', error);
                              }
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSection(section)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a page from the Pages tab to manage its sections
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Element Dialog */}
      <Dialog open={elementDialogOpen} onOpenChange={setElementDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingElement ? 'Edit Element' : 'Create New Element'}
            </DialogTitle>
            <DialogDescription>
              {editingElement ? 'Update the element content and settings' : 'Create a new editable element for your website'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="element_type">Element Type *</Label>
                <Select 
                  value={elementForm.element_type} 
                  onValueChange={(value) => handleElementFormChange('element_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="section_content">Section Header</SelectItem>
                    <SelectItem value="text">Text Content</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="button">Button/CTA</SelectItem>
                    <SelectItem value="hero_text">Hero Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="element_key">Element Key *</Label>
                <Input
                  id="element_key"
                  value={elementForm.element_key}
                  onChange={(e) => handleElementFormChange('element_key', e.target.value)}
                  placeholder="unique_element_key"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="element_title">Title</Label>
              <Input
                id="element_title"
                value={elementForm.title}
                onChange={(e) => handleElementFormChange('title', e.target.value)}
                placeholder="Element title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="page_location">Page Location</Label>
                <Select 
                  value={elementForm.page_location} 
                  onValueChange={(value) => handleElementFormChange('page_location', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="about">About Page</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section_location">Section Location</Label>
                <Input
                  id="section_location"
                  value={elementForm.section_location}
                  onChange={(e) => handleElementFormChange('section_location', e.target.value)}
                  placeholder="featured_properties, hero, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="element_content">Content (JSON)</Label>
              <Textarea
                id="element_content"
                value={elementForm.content}
                onChange={(e) => handleElementFormChange('content', e.target.value)}
                placeholder='{"text": "Content here", "price": "₹1.2 Cr", "location": "Delhi"}'
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                For properties: {"{"}"location", "price", "area", "bedrooms", "bathrooms", "image", "propertyType"{"}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <ImageUpload
                existingImages={elementForm.images}
                onImageUploaded={(url) => 
                  handleElementFormChange('images', [...elementForm.images, url])
                }
                onImageRemoved={(url) => 
                  handleElementFormChange('images', elementForm.images.filter(img => img !== url))
                }
                maxImages={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={elementForm.sort_order}
                  onChange={(e) => handleElementFormChange('sort_order', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex items-center justify-between pt-6">
                <Label htmlFor="element_active">Active</Label>
                <Switch
                  id="element_active"
                  checked={elementForm.is_active}
                  onCheckedChange={(checked) => handleElementFormChange('is_active', checked)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setElementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveElement}>
              <Save className="h-4 w-4 mr-2" />
              {editingElement ? 'Update' : 'Create'} Element
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Page Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? 'Edit Page' : 'Create New Page'}
            </DialogTitle>
            <DialogDescription>
              {editingPage ? 'Update the page content and settings' : 'Create a new page for your website'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={pageForm.title}
                  onChange={(e) => handlePageFormChange('title', e.target.value)}
                  placeholder="Enter page title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={pageForm.slug}
                  onChange={(e) => handlePageFormChange('slug', e.target.value)}
                  placeholder="page-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="min-h-[300px]">
                  <RichTextEditor
                    value={pageForm.content}
                    onChange={(value) => handlePageFormChange('content', value)}
                    placeholder="Enter page content..."
                    height="300px"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <ImageUpload
                  existingImages={pageForm.images}
                  onImageUploaded={(url) => 
                    handlePageFormChange('images', [...pageForm.images, url])
                  }
                  onImageRemoved={(url) => 
                    handlePageFormChange('images', pageForm.images.filter(img => img !== url))
                  }
                  maxImages={10}
                />
              </div>
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              {/* Basic Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Page Type</Label>
                    <Select 
                      value={pageForm.page_type} 
                      onValueChange={(value) => handlePageFormChange('page_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page">Page</SelectItem>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Published</Label>
                    <Switch
                      id="published"
                      checked={pageForm.is_published}
                      onCheckedChange={(checked) => handlePageFormChange('is_published', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    SEO Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={pageForm.meta_title}
                      onChange={(e) => handlePageFormChange('meta_title', e.target.value)}
                      placeholder="SEO title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Input
                      id="meta_description"
                      value={pageForm.meta_description}
                      onChange={(e) => handlePageFormChange('meta_description', e.target.value)}
                      placeholder="SEO description"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                    <Input
                      id="meta_keywords"
                      value={pageForm.meta_keywords}
                      onChange={(e) => handlePageFormChange('meta_keywords', e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePage}>
              <Save className="h-4 w-4 mr-2" />
              {editingPage ? 'Update' : 'Create'} Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Section Editor Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingSection ? 'Edit Section' : 'Create Section'}
            </SheetTitle>
            <SheetDescription>
              {editingSection ? 'Update section content' : 'Add a new section to the page'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section Type</Label>
                <Select 
                  value={sectionForm.section_type} 
                  onValueChange={(value) => handleSectionFormChange('section_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">Text Content</SelectItem>
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="gallery">Image Gallery</SelectItem>
                    <SelectItem value="cta">Call to Action</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={sectionForm.sort_order}
                  onChange={(e) => handleSectionFormChange('sort_order', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section_content">Content</Label>
              <div className="min-h-[200px]">
                <RichTextEditor
                  value={sectionForm.content}
                  onChange={(value) => handleSectionFormChange('content', value)}
                  placeholder="Enter section content..."
                  height="200px"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Section Images</Label>
              <ImageUpload
                existingImages={sectionForm.images}
                onImageUploaded={(url) => 
                  handleSectionFormChange('images', [...sectionForm.images, url])
                }
                onImageRemoved={(url) => 
                  handleSectionFormChange('images', sectionForm.images.filter(img => img !== url))
                }
                maxImages={5}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="section_active">Active</Label>
              <Switch
                id="section_active"
                checked={sectionForm.is_active}
                onCheckedChange={(checked) => handleSectionFormChange('is_active', checked)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={() => setSheetOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveSection} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {editingSection ? 'Update' : 'Create'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
