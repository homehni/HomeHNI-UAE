import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Star, BarChart, Wrench, Edit2, Save, X } from 'lucide-react';

interface QuickEditSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  elementKey: string;
  pageLocation: string;
  sectionLocation: string;
  content: any;
  isActive: boolean;
}

export const QuickContentEditor: React.FC = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<QuickEditSection[]>([]);
  const [editingSection, setEditingSection] = useState<QuickEditSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuickEditSections();
    
    // Real-time updates
    const channel = supabase
      .channel('quick-content-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_elements' }, () => {
        fetchQuickEditSections();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQuickEditSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_elements')
        .select('*')
        .in('element_key', [
          'mobile_app_section',
          'testimonials_section',
          'stats_section',
          'home_services_section',
          'featured_property'
        ]);

      if (error) throw error;

      const quickSections: QuickEditSection[] = (data || []).map(item => ({
        id: item.id,
        title: getSectionTitle(item.element_key),
        description: getSectionDescription(item.element_key),
        icon: getSectionIcon(item.element_key),
        elementKey: item.element_key,
        pageLocation: item.page_location || 'homepage',
        sectionLocation: item.section_location || 'main',
        content: item.content,
        isActive: item.is_active
      }));

      setSections(quickSections);
    } catch (error) {
      console.error('Error fetching quick edit sections:', error);
      toast({
        title: "Error",
        description: "Failed to load content sections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSectionTitle = (elementKey: string): string => {
    switch (elementKey) {
      case 'mobile_app_section': return 'Mobile App Promotion';
      case 'testimonials_section': return 'Customer Testimonials';
      case 'stats_section': return 'Platform Statistics';
      case 'home_services_section': return 'Home Services';
      case 'featured_property': return 'Featured Property';
      default: return 'Content Section';
    }
  };

  const getSectionDescription = (elementKey: string): string => {
    switch (elementKey) {
      case 'mobile_app_section': return 'Manage app download links and promotional content';
      case 'testimonials_section': return 'Edit customer reviews and testimonials';
      case 'stats_section': return 'Update platform statistics and achievements';
      case 'home_services_section': return 'Manage service offerings and descriptions';
      case 'featured_property': return 'Edit featured property details';
      default: return 'Edit section content';
    }
  };

  const getSectionIcon = (elementKey: string): React.ReactNode => {
    switch (elementKey) {
      case 'mobile_app_section': return <Smartphone className="h-5 w-5" />;
      case 'testimonials_section': return <Star className="h-5 w-5" />;
      case 'stats_section': return <BarChart className="h-5 w-5" />;
      case 'home_services_section': return <Wrench className="h-5 w-5" />;
      case 'featured_property': return <Edit2 className="h-5 w-5" />;
      default: return <Edit2 className="h-5 w-5" />;
    }
  };

  const updateSection = async (section: QuickEditSection, updates: any) => {
    try {
      const { error } = await supabase
        .from('content_elements')
        .update({
          content: updates.content || section.content,
          is_active: updates.isActive !== undefined ? updates.isActive : section.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content updated successfully and is now live on the website",
      });
      
      fetchQuickEditSections();
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  const renderSectionEditor = (section: QuickEditSection) => {
    switch (section.elementKey) {
      case 'mobile_app_section':
        return (
          <div className="space-y-4">
            <div>
              <Label>Heading</Label>
              <Input 
                value={section.content?.heading || section.content?.headline || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, heading: e.target.value, headline: e.target.value }
                })}
                placeholder="Homes, Wherever You Are!"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea 
                value={section.content?.subtitle || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, subtitle: e.target.value }
                })}
                placeholder="Download our app and discover properties anytime, anywhere"
                rows={2}
              />
            </div>
            <div>
              <Label>ButtonText</Label>
              <Input 
                value={section.content?.buttonText || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, buttonText: e.target.value }
                })}
                placeholder="Download App"
              />
            </div>
            <div>
              <Label>ComingSoon</Label>
              <Textarea 
                value={section.content?.comingSoon || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, comingSoon: e.target.value }
                })}
                placeholder="Coming Soon! Get ready for the ultimate property experience!!"
                rows={2}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                value={section.content?.description || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, description: e.target.value }
                })}
                placeholder="Get instant notifications for new listings that match your preferences!"
                rows={3}
              />
            </div>
            <div>
              <Label>Google Play Store Link</Label>
              <Input 
                value={section.content?.googlePlayLink || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, googlePlayLink: e.target.value }
                })}
                placeholder="https://play.google.com/store/apps/details?id=..."
              />
            </div>
            <div>
              <Label>App Store Link</Label>
              <Input 
                value={section.content?.appStoreLink || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, appStoreLink: e.target.value }
                })}
                placeholder="https://apps.apple.com/app/..."
              />
            </div>
          </div>
        );

      case 'stats_section':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Properties Listed</Label>
                <Input 
                  value={section.content?.propertiesListed || ''} 
                  onChange={(e) => setEditingSection({
                    ...section,
                    content: { ...section.content, propertiesListed: e.target.value }
                  })}
                  placeholder="1,000+"
                />
              </div>
              <div>
                <Label>Happy Customers</Label>
                <Input 
                  value={section.content?.happyCustomers || ''} 
                  onChange={(e) => setEditingSection({
                    ...section,
                    content: { ...section.content, happyCustomers: e.target.value }
                  })}
                  placeholder="10,000+"
                />
              </div>
              <div>
                <Label>Countries Covered</Label>
                <Input 
                  value={section.content?.countriesCovered || ''} 
                  onChange={(e) => setEditingSection({
                    ...section,
                    content: { ...section.content, countriesCovered: e.target.value }
                  })}
                  placeholder="15+"
                />
              </div>
              <div>
                <Label>Awards Won</Label>
                <Input 
                  value={section.content?.awardsWon || ''} 
                  onChange={(e) => setEditingSection({
                    ...section,
                    content: { ...section.content, awardsWon: e.target.value }
                  })}
                  placeholder="50+"
                />
              </div>
            </div>
          </div>
        );

      case 'testimonials_section':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input 
                value={section.content?.title || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, title: e.target.value }
                })}
                placeholder="Our customers love us"
              />
            </div>
            <div>
              <Label>Section Subtitle</Label>
              <Input 
                value={section.content?.subtitle || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, subtitle: e.target.value }
                })}
                placeholder="Real stories from verified buyers & owners"
              />
            </div>
            <div>
              <Label>Rating</Label>
              <Input 
                value={section.content?.rating || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, rating: e.target.value }
                })}
                placeholder="4.8/5"
              />
            </div>
            <div>
              <Label>Review Count</Label>
              <Input 
                value={section.content?.reviewCount || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, reviewCount: e.target.value }
                })}
                placeholder="2,143 reviews"
              />
            </div>
            <div>
              <Label>Owners Matched</Label>
              <Input 
                value={section.content?.ownersMatched || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, ownersMatched: e.target.value }
                })}
                placeholder="12k+ owners matched"
              />
            </div>
            <div>
              <Label>Brokerage Saved</Label>
              <Input 
                value={section.content?.brokerageSaved || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, brokerageSaved: e.target.value }
                })}
                placeholder="₹18+ crore brokerage saved"
              />
            </div>
          </div>
        );

      case 'home_services_section':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input 
                value={section.content?.title || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, title: e.target.value }
                })}
                placeholder="Home Services"
              />
            </div>
            <div>
              <Label>Services (one per line)</Label>
              <Textarea 
                value={section.content?.services?.map((service: any) => `${service.name}: ${service.description}`).join('\n') || ''} 
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim());
                  const services = lines.map(line => {
                    const [name, ...descParts] = line.split(':');
                    return {
                      name: name?.trim() || '',
                      description: descParts.join(':').trim() || ''
                    };
                  });
                  setEditingSection({
                    ...section,
                    content: { ...section.content, services }
                  });
                }}
                placeholder="Home Security Services: Professional security solutions for your property&#10;Legal Services: Expert legal assistance for property transactions"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">Format: Service Name: Description (one per line)</p>
            </div>
          </div>
        );

      case 'featured_property':
        return (
          <div className="space-y-4">
            <div>
              <Label>Property Title</Label>
              <Input 
                value={section.content?.title || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, title: e.target.value }
                })}
                placeholder="Luxury 3BHK Apartment"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input 
                value={section.content?.location || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, location: e.target.value }
                })}
                placeholder="Whitefield, Bangalore"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>BHK</Label>
                <Input 
                  value={section.content?.bhk || ''} 
                  onChange={(e) => setEditingSection({
                    ...section,
                    content: { ...section.content, bhk: e.target.value }
                  })}
                  placeholder="3bhk"
                />
              </div>
              <div>
                <Label>Size</Label>
                <Input 
                  value={section.content?.size || ''} 
                  onChange={(e) => setEditingSection({
                    ...section,
                    content: { ...section.content, size: e.target.value }
                  })}
                  placeholder="1200 sq ft"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input 
                  value={section.content?.price || ''} 
                  onChange={(e) => setEditingSection({
                    ...section,
                    content: { ...section.content, price: e.target.value }
                  })}
                  placeholder="₹85,00,000"
                />
              </div>
              <div>
                <Label>Property Type</Label>
                <Input 
                  value={section.content?.propertyType || ''} 
                  onChange={(e) => setEditingSection({
                    ...section,
                    content: { ...section.content, propertyType: e.target.value }
                  })}
                  placeholder="apartment"
                />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input 
                value={section.content?.image || ''} 
                onChange={(e) => setEditingSection({
                  ...section,
                  content: { ...section.content, image: e.target.value }
                })}
                placeholder="/placeholder.svg"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>Content (JSON Format)</Label>
              <Textarea 
                rows={10}
                value={JSON.stringify(section.content, null, 2)} 
                onChange={(e) => {
                  try {
                    const content = JSON.parse(e.target.value);
                    setEditingSection({ ...section, content });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
              />
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading quick edit options...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Quick Content Editor</h3>
        <p className="text-sm text-muted-foreground">
          Quickly edit key website sections. Changes are applied in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card key={section.id} className={!section.isActive ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <CardDescription className="text-xs">{section.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={section.isActive}
                    onCheckedChange={(checked) => updateSection(section, { isActive: checked })}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingSection(section)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit {section.title}</DialogTitle>
                      </DialogHeader>
                      {editingSection && editingSection.id === section.id && (
                        <div className="space-y-4">
                          {renderSectionEditor(editingSection)}
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setEditingSection(null)}>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button onClick={() => {
                              updateSection(editingSection, { content: editingSection.content });
                              setEditingSection(null);
                            }}>
                              <Save className="h-4 w-4 mr-2" />
                              Save & Apply
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};