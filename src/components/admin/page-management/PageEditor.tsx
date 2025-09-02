import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Settings, Trash2, GripVertical } from 'lucide-react';
import { SectionEditor } from './SectionEditor';
import { SectionRenderer } from './SectionRenderer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { getSectionById, getAllExtractedSections } from '@/services/sectionExtractor';

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PageSection {
  id: string;
  section_type: string;
  content: any;
  sort_order: number;
  page_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PageEditorProps {
  page: ContentPage | null;
  isCreating: boolean;
  onSave: () => void;
  onSelectSections: () => void;
  onAddSectionReady?: (addSection: (type: string) => void) => void;
  onSectionsUpdate?: (sections: PageSection[]) => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  page,
  isCreating,
  onSave,
  onSelectSections,
  onAddSectionReady,
  onSectionsUpdate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_published: false,
    content: {}
  });

  const [sections, setSections] = useState<PageSection[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const hasCalledOnAddSectionReady = useRef(false);

  // Debug: Log sections state changes
  useEffect(() => {
    console.log('Sections state changed:', sections);
    console.log('Rendering sections in UI:', sections);
  }, [sections]);

  // Notify parent component when sections change
  useEffect(() => {
    console.log('=== Sections update effect triggered ===');
    console.log('sections:', sections);
    console.log('onSectionsUpdate exists:', !!onSectionsUpdate);
    console.log('sections length:', sections.length);
    
    if (onSectionsUpdate) {
      console.log('Calling onSectionsUpdate with sections:', sections);
      onSectionsUpdate(sections);
    }
  }, [sections]); // Removed onSectionsUpdate dependency to prevent unnecessary re-runs

  // Reset the callback flag when page changes
  useEffect(() => {
    hasCalledOnAddSectionReady.current = false;
  }, [page?.id]);

  useEffect(() => {
    console.log('=== Page/creating change effect triggered ===');
    console.log('page:', page);
    console.log('isCreating:', isCreating);
    console.log('current sections before change:', sections);
    
    if (page && !isCreating) {
      console.log('Loading existing page, fetching sections...');
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        meta_keywords: page.meta_keywords?.join(', ') || '',
        is_published: page.is_published || false,
        content: page.content || {}
      });
      fetchPageSections(page.id);
    } else if (!page && isCreating) {
      console.log('Creating new page, resetting form but keeping sections...');
      setFormData({
        title: '',
        slug: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_published: false,
        content: {}
      });
      // Don't reset sections here - they should persist during page creation
    }
  }, [page?.id, isCreating]); // Changed dependency to page?.id instead of page

  const fetchPageSections = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching page sections:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Page title is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: 'Error',
        description: 'Page slug is required',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    
    try {
      const pageData = {
        title: formData.title,
        slug: formData.slug,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        meta_keywords: formData.meta_keywords ? formData.meta_keywords.split(',').map(k => k.trim()) : null,
        is_published: formData.is_published,
        content: formData.content
      };

      let pageId = page?.id;

      if (isCreating) {
        const { data, error } = await supabase
          .from('content_pages')
          .insert([pageData])
          .select()
          .single();
        
        if (error) throw error;
        pageId = data.id;
        
        toast({
          title: 'Success',
          description: 'Page created successfully'
        });
      } else if (page) {
        const { error } = await supabase
          .from('content_pages')
          .update(pageData)
          .eq('id', page.id);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Page updated successfully'
        });
      }

      // Save temporary sections to database
      if (pageId) {
        console.log('=== Saving temporary sections ===');
        console.log('All sections:', sections);
        console.log('Page ID:', pageId);
        
        const tempSections = sections.filter(s => s.id.startsWith('temp_'));
        console.log('Temporary sections to save:', tempSections);
        
        if (tempSections.length > 0) {
          const sectionsToInsert = tempSections.map((section, index) => ({
            page_id: pageId,
            section_type: section.section_type,
            content: section.content,
            sort_order: index, // Use index for proper ordering
            is_active: section.is_active || true
          }));

          console.log('Sections to insert:', sectionsToInsert);

          const { data: insertedSections, error: sectionsError } = await supabase
            .from('page_sections')
            .insert(sectionsToInsert)
            .select();

          if (sectionsError) {
            console.error('Error saving sections:', sectionsError);
            toast({
              title: 'Error',
              description: `Failed to save sections: ${sectionsError.message}`,
              variant: 'destructive'
            });
          } else {
            console.log('Sections saved successfully:', insertedSections);
            toast({
              title: 'Success',
              description: `${tempSections.length} sections saved successfully`
            });
          }
        } else {
          console.log('No temporary sections to save');
        }
      }

      onSave();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: 'Error',
        description: 'Failed to save page',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const addSection = useCallback(async (type: string) => {
    console.log('=== addSection function called ===');
    console.log('addSection called with type:', type);
    console.log('Type of type parameter:', typeof type);
    console.log('Type parameter value:', JSON.stringify(type));
    console.log('Current page:', page);
    console.log('Current sections:', sections);
    console.log('isCreating:', isCreating);
    console.log('Stack trace:', new Error().stack);
    
    // Ensure type is a string and not null/undefined
    if (!type || typeof type !== 'string') {
      console.error('Invalid type parameter:', type);
      console.error('Type parameter is not a string, it is:', typeof type);
      console.error('Type parameter value:', type);
      console.error('Stack trace:', new Error().stack);
      toast({
        title: 'Error',
        description: 'Invalid section type provided',
        variant: 'destructive'
      });
      return;
    }
    
    // Get real content from extracted sections
    const allSections = getAllExtractedSections();
    const matchingSection = allSections.find(section => section.type === type);
    
    let defaultContent = {};
    
    if (matchingSection) {
      // Use real content from existing website pages
      console.log('Found matching section with real content:', matchingSection);
      defaultContent = matchingSection.content;
    } else {
      // Fallback to basic content if no matching section found
      console.log('No matching section found, using fallback content');
      defaultContent = {
        title: `New ${type.replace('_', ' ')} Section`,
        description: 'Section description'
      };
    }

    // For now, let's add sections as temporary sections regardless of page ID
    // This will help us test the functionality without database complications
    console.log('=== Adding section (temporary for testing) ===');
    
    // Create a temporary section
    const newSection: PageSection = {
      id: `temp_${Date.now()}`,
      section_type: type,
      content: defaultContent,
      sort_order: 0, // Will be set properly in setState callback
      page_id: page?.id || '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('=== Adding temporary section ===');
    console.log('New temporary section:', newSection);
    
    setSections(prevSections => {
      const newSections = [...prevSections, {
        ...newSection,
        sort_order: prevSections.length // Set sort_order based on current state
      }];
      console.log('=== Adding temporary section to state ===');
      console.log('Previous sections:', prevSections);
      console.log('New section:', newSection);
      console.log('Updated sections state:', newSections);
      console.log('Total sections count:', newSections.length);
      console.log('State update function called');
      return newSections;
    });
    
    toast({
      title: 'Success',
      description: 'Section added successfully'
    });

    // TODO: Implement database saving when page is saved
    // The original database logic is commented out for now to focus on the UI functionality
  }, [page?.id, toast]); // Keep only essential dependencies

  // Create a stable function to pass to parent component
  const stableSafeAddSection = useCallback((type: string) => {
    if (type && typeof type === 'string' && type.trim() !== '') {
      console.log('stableSafeAddSection: Valid type, calling addSection');
      addSection(type).catch(error => {
        console.error('Error in addSection:', error);
      });
    } else {
      console.error('stableSafeAddSection: Invalid type parameter:', type);
    }
  }, [addSection]);

  // Pass addSection function to parent component
  useEffect(() => {
    console.log('PageEditor useEffect triggered');
    console.log('onAddSectionReady exists:', !!onAddSectionReady);
    
    // Only call onAddSectionReady if we have the callback
    if (onAddSectionReady && !hasCalledOnAddSectionReady.current) {
      console.log('Calling onAddSectionReady with stableSafeAddSection function...');
      onAddSectionReady(stableSafeAddSection);
      hasCalledOnAddSectionReady.current = true;
      console.log('onAddSectionReady called successfully');
    } else {
      console.log('onAddSectionReady is null/undefined or already called');
    }
  }, [onAddSectionReady, stableSafeAddSection]);

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const updateSection = (updatedSection: PageSection) => {
    setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
    setEditingSection(null);
  };

  const editSection = (section: PageSection) => {
    setEditingSection(section);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter page title..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="page-url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Page Description</Label>
              <RichTextEditor
                value={(formData.content as any)?.description || ''}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  content: { ...prev.content, description: value }
                }))}
                placeholder="Enter page description..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Page Sections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle>Content Sections</CardTitle>
            <Button onClick={onSelectSections} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Debug Info:</strong> {sections.length} sections in state
                {sections.length > 0 && (
                  <span className="ml-2">
                    ({sections.filter(s => s.id.startsWith('temp_')).length} temporary)
                  </span>
                )}
              </p>
            </div>
            {sections.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <p className="text-muted-foreground mb-4">No sections added yet</p>
                <Button onClick={onSelectSections} variant="outline">
                  Choose from Template Library
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div key={section.id} className="relative">
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    </div>
                    <div className="ml-8">
                      <SectionRenderer
                        section={section}
                        onEdit={editSection}
                        onDelete={removeSection}
                        showActions={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <SectionEditor
              section={editingSection}
              onUpdate={updateSection}
              onClose={() => setEditingSection(null)}
            />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Published</Label>
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, is_published: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full"
              >
                {saving ? 'Saving...' : (isCreating ? 'Create Page' : 'Update Page')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Meta Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={formData.meta_title}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                placeholder="Page title for search engines"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta-keywords">Meta Keywords</Label>
              <Input
                id="meta-keywords"
                value={formData.meta_keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="Brief description for search results (150-160 characters)"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};