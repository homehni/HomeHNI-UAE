import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/RichTextEditor';

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
}

export const PageEditor: React.FC<PageEditorProps> = ({
  page,
  isCreating,
  onSave,
  onSelectSections
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

  useEffect(() => {
    if (page && !isCreating) {
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
    } else {
      // Reset form for new page
      setFormData({
        title: '',
        slug: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_published: false,
        content: {}
      });
      setSections([]);
    }
  }, [page, isCreating]);

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

      if (isCreating) {
        const { error } = await supabase
          .from('content_pages')
          .insert([pageData]);
        
        if (error) throw error;
        
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

  const addSection = (type: string) => {
    let defaultContent = {};
    
    // Set default content based on section type
    switch(type) {
      case 'hero_search':
        defaultContent = {
          hero_image: '/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png',
          search_placeholder: 'Search \'Sector 150 Noida\''
        };
        break;
      case 'featured_properties':
        defaultContent = {
          heading: 'Featured Properties',
          description: 'Discover our handpicked selection of premium properties across India\'s top cities',
          show_filters: true,
          max_properties: 20
        };
        break;
      case 'services_grid':
        defaultContent = {
          heading: 'Our Services',
          description: 'Comprehensive real estate solutions tailored to meet all your property needs',
          services: [
            {
              title: 'Property Search',
              description: 'Find your perfect property with our advanced search filters and personalized recommendations.',
              icon: 'search'
            },
            {
              title: 'Verified Listings',
              description: 'All our properties are verified and come with authentic documents for your peace of mind.',
              icon: 'shield'
            },
            {
              title: 'Legal Assistance',
              description: 'Get expert legal guidance for property documentation and registration processes.',
              icon: 'file-text'
            }
          ]
        };
        break;
      case 'stats_section':
        defaultContent = {
          background_style: 'gradient',
          stats: [
            { number: '1,000+', label: 'Properties Listed', icon: 'home' },
            { number: '10,000+', label: 'Happy Customers', icon: 'users' },
            { number: '15+', label: 'Countries Covered', icon: 'building' },
            { number: '50+', label: 'Awards Won', icon: 'award' }
          ]
        };
        break;
      case 'testimonials_section':
        defaultContent = {
          heading: 'Our customers love us',
          description: 'Real stories from verified buyers & owners.',
          show_video: true
        };
        break;
      case 'steps':
        defaultContent = {
          title: 'How It Works',
          steps: [
            { title: 'Search Properties', description: 'Browse through thousands of verified listings' },
            { title: 'Schedule Visit', description: 'Book a convenient time to visit your shortlisted properties' },
            { title: 'Make Decision', description: 'Get expert guidance to make the right choice' }
          ]
        };
        break;
      case 'team':
        defaultContent = {
          title: 'Our Team',
          show_contact_info: true,
          agents: [
            { name: 'John Doe', role: 'Senior Property Consultant', contact: '+91 9876543210' },
            { name: 'Jane Smith', role: 'Real Estate Expert', contact: '+91 9876543211' },
            { name: 'Mike Johnson', role: 'Property Manager', contact: '+91 9876543212' }
          ]
        };
        break;
      default:
        defaultContent = {
          title: `New ${type.replace('_', ' ')} Section`,
          description: 'Section description'
        };
    }

    const newSection: PageSection = {
      id: `temp_${Date.now()}`,
      section_type: type,
      content: defaultContent,
      sort_order: sections.length,
      page_id: page?.id || '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSections([...sections, newSection]);
  };

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
            {sections.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <p className="text-muted-foreground mb-4">No sections added yet</p>
                <Button onClick={onSelectSections} variant="outline">
                  Choose from Template Library
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center gap-3 p-4 border rounded-lg">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Badge variant="outline">{section.section_type}</Badge>
                    <span className="flex-1 font-medium">{section.section_type} Section</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editSection(section)}
                      className="h-8 w-8 p-0"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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