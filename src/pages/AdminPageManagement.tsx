import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, FileText, Search, Eye, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  page_type: string;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const AdminPageManagement: React.FC = () => {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    page_type: 'page',
    is_published: false
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('pages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_pages'
        },
        () => {
          fetchPages();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterPages();
  }, [pages, searchTerm, statusFilter, typeFilter]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pages',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPages = () => {
    let filtered = pages;

    if (searchTerm) {
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.meta_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(page => 
        statusFilter === 'published' ? page.is_published : !page.is_published
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(page => page.page_type === typeFilter);
    }

    setFilteredPages(filtered);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Ensure unique slug by appending -2, -3, ... if needed
  const ensureUniqueSlug = async (baseSlug: string, excludeId?: string) => {
    let slug = baseSlug;
    let counter = 1;
    while (counter < 50) {
      const { data } = await supabase
        .from('content_pages')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!data || (excludeId && data.id === excludeId)) return slug;

      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }
    return `${baseSlug}-${Date.now()}`;
  };

  const handleCreate = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      page_type: 'page',
      is_published: false
    });
    setDialogOpen(true);
  };

  const handleEdit = (page: ContentPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: typeof page.content === 'string' ? page.content : JSON.stringify(page.content, null, 2),
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords?.join(', ') || '',
      page_type: page.page_type,
      is_published: page.is_published
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast({
        title: 'Error',
        description: 'Please fill in title and slug',
        variant: 'destructive'
      });
      return;
    }

    try {
      const base = formData.slug.trim();
      const slug = await ensureUniqueSlug(base || generateSlug(formData.title), editingPage?.id);

      // Normalize content: try JSON else keep as string
      let contentValue: any = formData.content;
      if (typeof contentValue === 'string') {
        const trimmed = contentValue.trim();
        if (trimmed) {
          try {
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
              contentValue = JSON.parse(trimmed);
            } else {
              contentValue = trimmed;
            }
          } catch {
            contentValue = trimmed;
          }
        } else {
          contentValue = null;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();

      const pageData: any = {
        title: formData.title.trim(),
        slug,
        content: contentValue,
        meta_title: formData.meta_title.trim() || null,
        meta_description: formData.meta_description.trim() || null,
        meta_keywords: formData.meta_keywords
          ? formData.meta_keywords.split(',').map(k => k.trim()).filter(Boolean)
          : null,
        page_type: formData.page_type,
        is_published: formData.is_published
      };

      if (editingPage) {
        // Update existing page
        const { data, error } = await supabase
          .from('content_pages')
          .update(pageData)
          .eq('id', editingPage.id)
          .select();

        if (error) throw error;

        toast({ title: 'Success', description: 'Page updated successfully' });
      } else {
        // Include created_by for RLS policies if present
        pageData.created_by = user?.id ?? null;
        const { data, error } = await supabase
          .from('content_pages')
          .insert([pageData])
          .select();

        if (error) throw error;

        toast({ title: 'Success', description: 'Page created successfully' });
      }

      setDialogOpen(false);
      fetchPages();
    } catch (error: any) {
      console.error('Error saving page:', error);
      let errorMessage = error?.message || 'Failed to save page';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Page deleted successfully'
      });
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete page',
        variant: 'destructive'
      });
    }
  };

  const togglePublished = async (page: ContentPage) => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .update({ is_published: !page.is_published })
        .eq('id', page.id);

      if (error) throw error;

      fetchPages();
    } catch (error) {
      console.error('Error toggling page status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update page status',
        variant: 'destructive'
      });
    }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Page Management</h1>
          <p className="text-muted-foreground">Create and manage website pages and content</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pages.length}</div>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {pages.filter(p => !p.is_published).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Page Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {new Set(pages.map(p => p.page_type)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Pages</CardTitle>
          <CardDescription>Manage your website pages and content</CardDescription>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="landing">Landing</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{page.title}</div>
                        {page.meta_title && (
                          <div className="text-sm text-muted-foreground">SEO: {page.meta_title}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">/{page.slug}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{page.page_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(page)}
                      className={page.is_published ? 'text-green-600' : 'text-yellow-600'}
                    >
                      {page.is_published ? 'Published' : 'Draft'}
                    </Button>
                  </TableCell>
                  <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {page.is_published && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(page)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(page.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle>
                {editingPage ? 'Edit Page' : 'Create New Page'}
              </DialogTitle>
              <DialogDescription>
                {editingPage ? 'Update the page information' : 'Create a new page for your website'}
              </DialogDescription>
            </div>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" size="sm">
              {editingPage ? 'Update' : 'Create'}
            </Button>
          </DialogHeader>
          
          <div className="space-y-4 pb-24">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      title,
                      slug: prev.slug || generateSlug(title)
                    }));
                  }}
                  placeholder="e.g., About Us"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., about-us"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="page_type">Page Type</Label>
                <Select 
                  value={formData.page_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, page_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Regular Page</SelectItem>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="legal">Legal Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 mt-8">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="rounded border border-input"
                />
                <Label htmlFor="is_published">Published (visible to public)</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Page Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your page content (supports HTML/Markdown)"
                rows={6}
              />
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">SEO Settings</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO title (60 characters max)"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.meta_title.length}/60 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO description (160 characters max)"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.meta_description.length}/160 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t mt-4 py-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              {editingPage ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};