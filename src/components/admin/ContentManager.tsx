import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit3, 
  Save, 
  X, 
  FileText, 
  MessageSquare, 
  Users, 
  Star,
  Home,
  Settings2
} from 'lucide-react';

interface ContentSection {
  id: string;
  element_key: string;
  title: string;
  content: any;
  element_type: string;
  page_location?: string;
  section_location?: string;
}

export const ContentManager: React.FC = () => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const { canManageContent, userRole, isAdmin } = useRolePermissions();
  const { toast } = useToast();

  useEffect(() => {
    fetchContentSections();
  }, []);

  const fetchContentSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_elements')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setContentSections(data || []);
    } catch (error) {
      console.error('Error fetching content sections:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch content sections',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const canEditSection = (section: ContentSection): boolean => {
    if (isAdmin()) return true;
    
    // Map content types to permissions
    const contentTypeMap: Record<string, string> = {
      'testimonial': 'testimonials',
      'service': 'services',
      'hero': 'homepage_sections',
      'stats': 'homepage_sections',
      'feature': 'homepage_sections'
    };

    const permissionType = contentTypeMap[section.element_type] || section.element_type;
    return canManageContent(permissionType);
  };

  const startEditing = (sectionId: string, currentContent: any) => {
    setEditingSections(prev => new Set(prev).add(sectionId));
    setEditValues(prev => ({
      ...prev,
      [sectionId]: { ...currentContent }
    }));
  };

  const cancelEditing = (sectionId: string) => {
    setEditingSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[sectionId];
      return newValues;
    });
  };

  const saveChanges = async (sectionId: string) => {
    try {
      const newContent = editValues[sectionId];
      
      const { error } = await supabase
        .from('content_elements')
        .update({ 
          content: newContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', sectionId);

      if (error) throw error;

      // Update local state
      setContentSections(prev => 
        prev.map(section => 
          section.id === sectionId 
            ? { ...section, content: newContent }
            : section
        )
      );

      cancelEditing(sectionId);

      toast({
        title: 'Success',
        description: 'Content updated successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes',
        variant: 'destructive'
      });
    }
  };

  const updateEditValue = (sectionId: string, field: string, value: any) => {
    setEditValues(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  };

  const getContentTypeIcon = (elementType: string) => {
    switch (elementType) {
      case 'testimonial':
        return <MessageSquare className="h-4 w-4" />;
      case 'service':
        return <Settings2 className="h-4 w-4" />;
      case 'hero':
        return <Home className="h-4 w-4" />;
      case 'stats':
        return <Star className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderContentEditor = (section: ContentSection, isEditing: boolean) => {
    const content = isEditing ? editValues[section.id] : section.content;

    if (section.element_type === 'testimonial') {
      return (
        <div className="space-y-4">
          {isEditing ? (
            <>
              <Input
                placeholder="Heading"
                value={content?.heading || ''}
                onChange={(e) => updateEditValue(section.id, 'heading', e.target.value)}
                className="font-semibold"
              />
              <Textarea
                placeholder="Description"
                value={content?.description || ''}
                onChange={(e) => updateEditValue(section.id, 'description', e.target.value)}
                rows={2}
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Rating"
                  value={content?.rating || ''}
                  onChange={(e) => updateEditValue(section.id, 'rating', e.target.value)}
                />
                <Input
                  placeholder="Reviews Count"
                  value={content?.reviews || ''}
                  onChange={(e) => updateEditValue(section.id, 'reviews', e.target.value)}
                />
                <Input
                  placeholder="Savings Amount"
                  value={content?.savings || ''}
                  onChange={(e) => updateEditValue(section.id, 'savings', e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{content?.heading}</h3>
              <p className="text-muted-foreground text-sm">{content?.description}</p>
              <div className="flex gap-4 text-xs">
                <span>Rating: {content?.rating}</span>
                <span>Reviews: {content?.reviews}</span>
                <span>Savings: {content?.savings}</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Generic content editor for other types
    return (
      <div className="space-y-3">
        {Object.entries(content || {}).map(([key, value]) => (
          <div key={key}>
            <label className="text-xs font-medium text-muted-foreground capitalize">
              {key.replace(/_/g, ' ')}
            </label>
            {isEditing ? (
              typeof value === 'string' && value.length > 50 ? (
                <Textarea
                  value={value as string}
                  onChange={(e) => updateEditValue(section.id, key, e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              ) : (
                <Input
                  value={String(value || '')}
                  onChange={(e) => updateEditValue(section.id, key, e.target.value)}
                  className="mt-1"
                />
              )
            ) : (
              <p className="text-sm text-foreground mt-1">
                {String(value || 'Not set')}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Content Management</h1>
        <p className="text-muted-foreground">
          Manage website content based on your role: <Badge variant="secondary">{userRole}</Badge>
        </p>
      </div>

      <div className="grid gap-6">
        {contentSections.map((section) => {
          const isEditing = editingSections.has(section.id);
          const canEdit = canEditSection(section);

          return (
            <Card key={section.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getContentTypeIcon(section.element_type)}
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {section.title || section.element_key}
                      </CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {section.element_type}
                        </Badge>
                        {section.page_location && (
                          <Badge variant="outline" className="text-xs">
                            {section.page_location}
                          </Badge>
                        )}
                        {section.section_location && (
                          <Badge variant="outline" className="text-xs">
                            {section.section_location}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {canEdit && (
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelEditing(section.id)}
                            className="flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveChanges(section.id)}
                            className="flex items-center gap-1"
                          >
                            <Save className="h-3 w-3" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(section.id, section.content)}
                          className="flex items-center gap-1"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {renderContentEditor(section, isEditing)}
                
                {!canEdit && (
                  <div className="mt-3 p-2 bg-muted rounded text-xs text-muted-foreground">
                    You don't have permission to edit this content type.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {contentSections.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Content Found</h3>
            <p className="text-muted-foreground">
              No content sections are available for editing at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
