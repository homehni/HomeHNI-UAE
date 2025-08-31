import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { contentElementsService, ContentElement } from '@/services/contentElementsService';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronDown,
  ChevronRight,
  Save,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Navigation,
  Layout,
  Wrench,
  Building,
  Target,
  Star,
  Smartphone,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface SectionGroup {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  sections: PageSection[];
  isOpen: boolean;
}

const SECTION_MAPPINGS = {
  'header_navigation': 'header_navigation',
  'hero_section': 'hero_section',
  'services_showcase': 'services_showcase', 
  'featured_properties': 'featured_properties',
  'value_proposition': 'value_proposition',
  'testimonials': 'testimonials',
  'mobile_app_section': 'mobile_app_section',
  'footer': 'footer'
};

export const StructuredHomepageEditor: React.FC = () => {
  const [sectionGroups, setSectionGroups] = useState<SectionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<any>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const initializeSectionGroups = (sections: PageSection[]): SectionGroup[] => {
    return [
      {
        id: 'header_navigation',
        name: 'Header & Navigation',
        description: 'Controls the global header elements and main navigation',
        icon: <Navigation className="h-4 w-4" />,
        sections: sections.filter(s => s.section_location === 'header' || s.element_type === 'navigation'),
        isOpen: false
      },
      {
        id: 'hero_section',
        name: 'Hero Section',
        description: 'Main banner at the top of the homepage',
        icon: <Layout className="h-4 w-4" />,
        sections: sections.filter(s => s.element_type === 'hero_section' || s.element_key.includes('hero')),
        isOpen: true
      },
      {
        id: 'services_showcase',
        name: 'Services Showcase',
        description: 'Highlights primary services HOMEhni offers',
        icon: <Wrench className="h-4 w-4" />,
        sections: sections.filter(s => 
          s.element_type === 'home_services_section' || 
          s.element_key.includes('service') ||
          s.element_key === 'home_services_header'
        ),
        isOpen: false
      },
      {
        id: 'featured_properties',
        name: 'Featured Properties',
        description: 'Curated list of properties displayed on homepage',
        icon: <Building className="h-4 w-4" />,
        sections: sections.filter(s => 
          s.element_type === 'featured_property' || 
          s.element_key.includes('featured_properties') ||
          s.section_location === 'featured_properties'
        ),
        isOpen: false
      },
      {
        id: 'value_proposition',
        name: 'Value Proposition ("Why Use HOMEhni")',
        description: 'Key benefits of using HOMEhni platform',
        icon: <Target className="h-4 w-4" />,
        sections: sections.filter(s => 
          s.element_key.includes('why_use') ||
          s.element_type === 'value_proposition' ||
          s.element_key === 'why_use_section'
        ),
        isOpen: false
      },
      {
        id: 'testimonials',
        name: 'Testimonials ("Our Customers Love Us")',
        description: 'Customer feedback and testimonials',
        icon: <Star className="h-4 w-4" />,
        sections: sections.filter(s => 
          s.element_type === 'testimonial' || 
          s.element_key.includes('testimonial') ||
          s.element_key === 'customer_testimonials_header'
        ),
        isOpen: false
      },
      {
        id: 'mobile_app_section',
        name: 'Mobile App Promotion',
        description: 'Encourages users to download the mobile app',
        icon: <Smartphone className="h-4 w-4" />,
        sections: sections.filter(s => 
          s.element_type === 'mobile_app_section' || 
          s.element_key.includes('mobile_app') ||
          s.element_key === 'mobile_app_section'
        ),
        isOpen: false
      },
      {
        id: 'footer',
        name: 'Footer',
        description: 'Site-wide footer content and links',
        icon: <Globe className="h-4 w-4" />,
        sections: sections.filter(s => 
          s.element_type === 'footer' || 
          s.element_key.includes('footer') ||
          s.section_location === 'footer'
        ),
        isOpen: false
      }
    ];
  };

  useEffect(() => {
    loadHomepageContent();
  }, []);

  const loadHomepageContent = async () => {
    try {
      setLoading(true);
      const data = await contentElementsService.getContentElements('homepage');
      const formattedSections: PageSection[] = data.map((item, index) => ({
        id: item.id,
        element_type: item.element_type,
        element_key: item.element_key,
        title: item.title || item.element_key,
        content: item.content,
        sort_order: item.sort_order || index,
        is_active: item.is_active,
        page_location: item.page_location || 'homepage',
        section_location: item.section_location || 'main'
      }));
      
      const groups = initializeSectionGroups(formattedSections);
      setSectionGroups(groups);
    } catch (error) {
      console.error('Error loading homepage content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load homepage content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSectionGroup = (groupId: string) => {
    setSectionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, isOpen: !group.isOpen }
          : group
      )
    );
  };

  const startEditing = (sectionId: string, content: any) => {
    setEditingSection(sectionId);
    setEditingContent({ ...content });
  };

  const saveEditing = async () => {
    if (!editingSection) return;
    
    try {
      // Update in database
      await contentElementsService.updateContentElement(editingSection, {
        content: editingContent
      });
      
      // Update local state
      setSectionGroups(prev => 
        prev.map(group => ({
          ...group,
          sections: group.sections.map(section => 
            section.id === editingSection 
              ? { ...section, content: editingContent }
              : section
          )
        }))
      );
      
      setEditingSection(null);
      setEditingContent({});
      setHasChanges(false);
      
      toast({
        title: 'Content Updated',
        description: 'Section content has been saved successfully',
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditingContent({});
    setHasChanges(false);
  };

  const deleteSection = async (sectionId: string) => {
    try {
      await contentElementsService.deleteContentElement(sectionId);
      
      setSectionGroups(prev => 
        prev.map(group => ({
          ...group,
          sections: group.sections.filter(section => section.id !== sectionId)
        }))
      );
      
      toast({
        title: 'Section Deleted',
        description: 'The section has been removed',
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete section',
        variant: 'destructive'
      });
    }
  };

  const createNewSection = async (groupId: string) => {
    const templates = {
      'header_navigation': {
        element_type: 'navigation',
        element_key: `nav_${Date.now()}`,
        title: 'Navigation Item',
        content: { label: 'New Link', url: '/', order: 1 },
        section_location: 'header'
      },
      'hero_section': {
        element_type: 'hero_section',
        element_key: `hero_${Date.now()}`,
        title: 'Hero Section',
        content: { 
          title: 'Welcome to HOMEhni',
          subtitle: 'Find your perfect property',
          buttonText: 'Get Started',
          buttonLink: '/properties'
        },
        section_location: 'hero'
      },
      'services_showcase': {
        element_type: 'service',
        element_key: `service_${Date.now()}`,
        title: 'Service Item',
        content: {
          title: 'New Service',
          description: 'Service description',
          icon: 'home'
        },
        section_location: 'services'
      },
      'featured_properties': {
        element_type: 'featured_property',
        element_key: `featured_${Date.now()}`,
        title: 'Featured Property',
        content: {
          title: 'Luxury Apartment',
          location: 'City Center',
          price: '₹50,00,000',
          bhk: '2bhk',
          size: '1000 sq ft'
        },
        section_location: 'featured_properties'
      },
      'mobile_app_section': {
        element_type: 'mobile_app_section',
        element_key: `mobile_app_${Date.now()}`,
        title: 'Mobile App Promotion',
        content: {
          title: 'Download Our App',
          description: 'Get the best experience on mobile',
          appStoreLink: '#',
          playStoreLink: '#'
        },
        section_location: 'mobile_app'
      },
      'footer': {
        element_type: 'footer',
        element_key: `footer_${Date.now()}`,
        title: 'Footer Content',
        content: {
          companyName: 'HOMEhni',
          description: 'Your trusted property partner',
          copyright: '© 2024 HOMEhni. All rights reserved.'
        },
        section_location: 'footer'
      }
    };

    const template = templates[groupId as keyof typeof templates];
    if (!template) return;

    try {
      const newSection = await contentElementsService.createContentElement({
        ...template,
        page_location: 'homepage',
        sort_order: 999,
        is_active: true
      });

      // Reload content to reflect changes
      await loadHomepageContent();
      
      toast({
        title: 'Section Added',
        description: 'New section has been created',
      });
    } catch (error) {
      console.error('Error creating section:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create new section',
        variant: 'destructive'
      });
    }
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
                  onChange={(e) => {
                    setEditingContent(prev => ({ ...prev, [key]: e.target.value }));
                    setHasChanges(true);
                  }}
                  className="w-full"
                  rows={3}
                />
              ) : (
                <Input
                  value={String(value || '')}
                  onChange={(e) => {
                    setEditingContent(prev => ({ ...prev, [key]: e.target.value }));
                    setHasChanges(true);
                  }}
                  className="w-full"
                />
              )}
            </div>
          ))}
        </div>
      );
    }

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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/employee-dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Homepage Content Manager</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="animate-pulse">
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={loadHomepageContent}>
              Refresh Content
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 max-w-4xl mx-auto space-y-4">
            {sectionGroups.map((group) => (
              <Card key={group.id} className="w-full">
                <Collapsible open={group.isOpen} onOpenChange={() => toggleSectionGroup(group.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-md text-primary">
                            {group.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {group.sections.length} items
                          </Badge>
                          {group.isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {group.sections.length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                            <p className="text-muted-foreground mb-4">No content sections in this category</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => createNewSection(group.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Section
                            </Button>
                          </div>
                        ) : (
                          <>
                            {group.sections.map((section) => (
                              <div key={section.id}>
                                {renderEditableContent(section)}
                              </div>
                            ))}
                            <div className="pt-2 border-t">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => createNewSection(group.id)}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Section
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};