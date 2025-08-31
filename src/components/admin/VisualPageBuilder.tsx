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
  ArrowLeft
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

export const VisualPageBuilder: React.FC = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<any>({});
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
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
      const data = await contentElementsService.getContentElements(selectedPage);
      
      // Use content_elements as the single source of truth for featured properties on the selected page
      // Keep the Featured Properties section; show only cards that exist (is_active=true) in content_elements for this page
      const filteredData = data.filter(item => {
        if (item.element_type === 'featured_property') {
          // getContentElements already filters by page_location and is_active
          return true;
        }
        return true;
      });
      
      const formattedSections: PageSection[] = filteredData.map((item, index) => ({
        id: item.id,
        element_type: item.element_type,
        element_key: item.element_key,
        title: item.title || item.element_key,
        content: item.content,
        sort_order: item.sort_order || index,
        is_active: item.is_active,
        page_location: item.page_location || selectedPage,
        section_location: item.section_location || 'main'
      }));
      setSections(formattedSections.sort((a, b) => a.sort_order - b.sort_order));
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

  const renderStructuredHomepageEditor = () => {
    const categorizedSections = groupSectionsByCategory(sections);

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Homepage Content Manager</h2>
          <p className="text-muted-foreground">Organized sections for efficient content management</p>
        </div>

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
          
          {Object.entries(content || {}).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-muted-foreground capitalize mb-1 block">
                {key.replace(/_/g, ' ')}
              </label>
              {typeof value === 'string' && value.length > 50 ? (
                <Textarea
                  value={value}
                  onChange={(e) => setEditingContent(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full"
                  rows={3}
                />
              ) : (
                <Input
                  value={String(value || '')}
                  onChange={(e) => setEditingContent(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full"
                />
              )}
            </div>
          ))}
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
                {String(value).substring(0, 50)}
                {String(value).length > 50 && '...'}
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
        <div className="border-b p-4 bg-background/95 backdrop-blur">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/employee-dashboard')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Editor
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold text-foreground">Visual Page Builder</h1>
              <select 
                value={selectedPage} 
                onChange={(e) => setSelectedPage(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="homepage">Homepage</option>
                <option value="about">About Page</option>
                <option value="services">Services Page</option>
                <option value="contact">Contact Page</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="secondary" className="animate-pulse">
                  Unsaved Changes
                </Badge>
              )}
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
              ) : selectedPage === 'homepage' ? (
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
                              Start building your page by adding sections from the library
                            </p>
                            <Button variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Your First Section
                            </Button>
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
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};