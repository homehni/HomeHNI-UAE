import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  FileText, 
  Image, 
  Star, 
  BarChart3,
  Home,
  Users,
  Settings,
  Monitor
} from 'lucide-react';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

interface ContentElement {
  id: string;
  element_type: string;
  element_key: string;
  title?: string;
  content: any;
  images?: string[];
  sort_order: number;
  is_active: boolean;
  page_location?: string;
  section_location?: string;
  created_at: string;
  updated_at: string;
}

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content?: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  page_type: string;
  is_published: boolean;
  created_at: string;
}

interface FeaturedProperty {
  id: string;
  property_id: string;
  sort_order: number;
  is_active: boolean;
  featured_until?: string;
  properties?: {
    title: string;
    expected_price: number;
    city: string;
    images?: string[];
  };
}

export const ContentManagerDashboard: React.FC = () => {
  const { toast } = useToast();
  
  const [contentElements, setContentElements] = useState<ContentElement[]>([]);
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingElement, setEditingElement] = useState<ContentElement | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: any; type: string }>({ 
    isOpen: false, 
    item: null, 
    type: '' 
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllContent();
    
    // Set up real-time subscriptions
    const elementsChannel = supabase
      .channel('content-elements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_elements' }, () => {
        fetchContentElements();
      })
      .subscribe();

    const pagesChannel = supabase
      .channel('content-pages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_pages' }, () => {
        fetchContentPages();
      })
      .subscribe();

    const featuredChannel = supabase
      .channel('featured-properties-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'featured_properties' }, () => {
        fetchFeaturedProperties();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(elementsChannel);
      supabase.removeChannel(pagesChannel);
      supabase.removeChannel(featuredChannel);
    };
  }, []);

  const fetchAllContent = async () => {
    try {
      await Promise.all([
        fetchContentElements(),
        fetchContentPages(),
        fetchFeaturedProperties()
      ]);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContentElements = async () => {
    const { data, error } = await supabase
      .from('content_elements')
      .select('*')
      .order('page_location', { ascending: true })
      .order('section_location', { ascending: true })
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    setContentElements(data || []);
  };

  const fetchContentPages = async () => {
    const { data, error } = await supabase
      .from('content_pages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setContentPages(data || []);
  };

  const fetchFeaturedProperties = async () => {
    const { data, error } = await supabase
      .from('featured_properties')
      .select(`
        *,
        properties!inner (
          title,
          expected_price,
          city,
          images
        )
      `)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    setFeaturedProperties(data || []);
  };

  // Function to sync current live website content to CMS
  const syncLiveContentToCMS = async () => {
    try {
      console.log('Starting content sync...');
      
      // Define the content elements that should exist based on live website components
      const requiredContentElements = [
        {
          element_key: 'header_nav',
          element_type: 'navigation',
          title: 'Main Navigation',
          content: {
            logo: "/lovable-uploads/main-logo-final.png",
            nav_items: [
              {"label": "Buy", "link": "/search?type=buy", "active": true},
              {"label": "Rent", "link": "/search?type=rent", "active": true}, 
              {"label": "Sell", "link": "/post-property", "active": true},
              {"label": "Plans", "submenu": [
                {"label": "Agent Plans", "link": "/agent-plans"},
                {"label": "Builder's Lifetime Plan", "link": "/builder-lifetime-plans"},
                {"label": "Property Renting Owner Plans", "link": "/owner-plans"},
                {"label": "Property Seller Plans", "link": "/buyer-plans"},
                {"label": "Property Owner Plans", "link": "/seller-plans"}
              ]},
              {"label": "Jobs", "link": "/careers", "active": true}
            ]
          },
          page_location: 'homepage',
          section_location: 'header',
          sort_order: 0
        },
        {
          element_key: 'hero-search',
          element_type: 'hero_search',
          title: 'Hero Search Section',
          content: {
            title: "Find Your Dream Property",
            subtitle: "Buy, Rent, New Launch, PG/Co-living, Commercial & Plots",
            background_image: "/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png",
            search_placeholder: "Search Sector 150 Noida",
            tabs: ["BUY", "RENT", "NEW LAUNCH", "PG / CO-LIVING", "COMMERCIAL", "PLOTS/LAND", "PROJECTS"]
          },
          page_location: 'homepage',
          section_location: 'hero',
          sort_order: 1
        },
        {
          element_key: 'footer_content',
          element_type: 'footer',
          title: 'Footer Content',
          content: {
            company_info: {
              name: "HomeHNI",
              description: "Your trusted partner in real estate",
              logo: "/lovable-uploads/main-logo-final.png"
            },
            quick_links: [
              {"label": "About Us", "link": "/about-us"},
              {"label": "Contact", "link": "/contact-us"},
              {"label": "Privacy Policy", "link": "/privacy-policy"},
              {"label": "Terms & Conditions", "link": "/terms-and-conditions"}
            ],
            services: [
              {"label": "Buy Property", "link": "/search?type=buy"},
              {"label": "Rent Property", "link": "/search?type=rent"},
              {"label": "Sell Property", "link": "/post-property"},
            ],
            contact: {
              phone: "+91-XXXXX-XXXXX",
              email: "info@homehni.com",
              address: "Delhi NCR, India"
            },
            social: {
              facebook: "#",
              twitter: "#", 
              instagram: "#",
              linkedin: "#"
            }
          },
          page_location: 'homepage',
          section_location: 'footer',
          sort_order: 2
        },
        {
          element_key: 'stats',
          element_type: 'stats',
          title: 'Platform Statistics',
          content: {
            propertiesListed: '1,000+',
            happyCustomers: '10,000+',
            countriesCovered: '15+',
            awardsWon: '50+'
          },
          page_location: 'homepage',
          section_location: 'statistics',
          sort_order: 3
        },
        {
          element_key: 'testimonials_section',
          element_type: 'testimonial',
          title: 'Customer Testimonials',
          content: {
            title: 'Our customers love us',
            subtitle: 'Real stories from verified buyers & owners.',
            rating: '4.8/5',
            reviewCount: '2,143 reviews',
            ownersMatched: '12k+ owners matched',
            brokerageSaved: '₹18+ crore brokerage saved'
          },
          page_location: 'homepage',
          section_location: 'testimonials',
          sort_order: 4
        },
        {
          element_key: 'home_services_section',
          element_type: 'service',
          title: 'Home Services',
          content: {
            title: 'Home Services',
            services: []
          },
          page_location: 'homepage',
          section_location: 'services',
          sort_order: 5
        },
        {
          element_key: 'why-use',
          element_type: 'feature',
          title: 'Why Use HomeHNI',
          content: {
            title: 'Why Choose HomeHNI?',
            subtitle: 'Your trusted partner in real estate',
            features: [
              "Verified Properties",
              "Expert Support",
              "Transparent Pricing",
              "24/7 Assistance"
            ]
          },
          page_location: 'homepage',
          section_location: 'features',
          sort_order: 6
        },
        {
          element_key: 'mobile_app_section',
          element_type: 'mobile_app',
          title: 'Mobile App Promotion',
          content: {
            headline: 'Homes, Wherever You Are',
            description: 'Download our app and discover properties anytime, anywhere. Get instant notifications for new listings that match your preferences.',
            googlePlayLink: 'https://play.google.com/store/apps',
            appStoreLink: 'https://apps.apple.com/',
            comingSoon: 'Coming Soon! Get ready for the ultimate property experience'
          },
          page_location: 'homepage',
          section_location: 'mobile_app',
          sort_order: 7
        }
      ];

      console.log('Syncing', requiredContentElements.length, 'content elements...');

      // Upsert each required content element
      for (const element of requiredContentElements) {
        const { data: existing, error: selectError } = await supabase
          .from('content_elements')
          .select('id')
          .eq('element_key', element.element_key)
          .eq('page_location', element.page_location)
          .maybeSingle();

        if (selectError) {
          console.error('Error checking existing element:', selectError);
          continue;
        }

        if (existing) {
          // Update existing element
          const { error: updateError } = await supabase
            .from('content_elements')
            .update({
              content: element.content,
              title: element.title,
              element_type: element.element_type,
              section_location: element.section_location,
              sort_order: element.sort_order,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) {
            console.error('Error updating element:', updateError);
          } else {
            console.log('Updated:', element.element_key);
          }
        } else {
          // Create new element
          const { error: insertError } = await supabase
            .from('content_elements')
            .insert({
              ...element,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating element:', insertError);
          } else {
            console.log('Created:', element.element_key);
          }
        }
      }

      console.log('Content sync completed');
      
      // Refresh the content elements list
      await fetchContentElements();
      
    } catch (error) {
      console.error('Content sync failed:', error);
      throw error;
    }
  };

  const updateContentElement = async (element: ContentElement, updates: Partial<ContentElement>) => {
    try {
      console.log('Updating content element:', element.id, 'with updates:', updates);
      
      const { data, error } = await supabase
        .from('content_elements')
        .update(updates)
        .eq('id', element.id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful, new data:', data);

      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      
      fetchContentElements();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  const toggleElementVisibility = async (element: ContentElement) => {
    await updateContentElement(element, { is_active: !element.is_active });
  };

  const deleteContentElement = async (id: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('content_elements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content element deleted successfully",
      });
      
      fetchContentElements();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content element",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, item: null, type: '' });
    }
  };

  const updateFeaturedProperty = async (id: string, updates: Partial<FeaturedProperty>) => {
    try {
      const { error } = await supabase
        .from('featured_properties')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Featured property updated successfully",
      });
      
      fetchFeaturedProperties();
    } catch (error) {
      console.error('Error updating featured property:', error);
      toast({
        title: "Error",
        description: "Failed to update featured property",
        variant: "destructive",
      });
    }
  };

  const publishPage = async (page: ContentPage) => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .update({ is_published: !page.is_published })
        .eq('id', page.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Page ${page.is_published ? 'unpublished' : 'published'} successfully`,
      });
      
      fetchContentPages();
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive",
      });
    }
  };

  const getContentIcon = (elementType: string) => {
    switch (elementType) {
      case 'testimonial': return <Users className="h-4 w-4" />;
      case 'stats': return <BarChart3 className="h-4 w-4" />;
      case 'service': return <Settings className="h-4 w-4" />;
      case 'hero': return <Monitor className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading content management dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage all website content and make real-time updates</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              // Debug function to show all content elements
              console.log('=== ALL CONTENT ELEMENTS ===');
              contentElements.forEach((element, index) => {
                console.log(`${index + 1}. ${element.element_key} (${element.element_type})`);
                console.log('   Content:', element.content);
                console.log('   Active:', element.is_active);
                console.log('   Location:', element.page_location, '/', element.section_location);
                console.log('---');
              });
              
              toast({
                title: "Debug Info",
                description: `Logged ${contentElements.length} content elements to console. Check browser console for details.`,
              });
            }}
          >
            Debug Content
          </Button>
          <Button 
            variant="outline"
            onClick={async () => {
              try {
                // Sync current live website content to CMS
                await syncLiveContentToCMS();
                toast({
                  title: "Sync Complete",
                  description: "Live website content has been synced to CMS. Refresh to see changes.",
                });
              } catch (error) {
                console.error('Sync failed:', error);
                toast({
                  title: "Sync Failed",
                  description: "Failed to sync content. Check console for details.",
                  variant: "destructive",
                });
              }
            }}
          >
            Sync Live Content
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              // Check what content the live website is actually using
              console.log('=== LIVE WEBSITE CONTENT CHECK ===');
              console.log('This will show what content elements the live website is trying to load');
              console.log('Check the browser console for any CMS-related errors or missing content');
              
              // Try to fetch some key content elements
              const checkContent = async () => {
                const keys = ['header_nav', 'hero-search', 'footer_content', 'stats', 'testimonials_section'];
                
                for (const key of keys) {
                  try {
                    const { data, error } = await supabase
                      .from('content_elements')
                      .select('*')
                      .eq('element_key', key)
                      .eq('is_active', true)
                      .maybeSingle();
                    
                    if (error) {
                      console.error(`Error fetching ${key}:`, error);
                    } else if (data) {
                      console.log(`✅ ${key}: Found`, data);
                    } else {
                      console.log(`❌ ${key}: Not found or not active`);
                    }
                  } catch (err) {
                    console.error(`Exception fetching ${key}:`, err);
                  }
                }
              };
              
              checkContent();
              
              toast({
                title: "Content Check",
                description: "Checking live website content. See console for results.",
              });
            }}
          >
            Check Live Content
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Content Element</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Element Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                      <SelectItem value="stats">Statistics</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="hero">Hero Section</SelectItem>
                      <SelectItem value="text">Text Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-red-800 hover:bg-red-900 text-white">Create Content</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="elements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="elements">Content Elements</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="featured">Featured Properties</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Content Elements Tab */}
        <TabsContent value="elements" className="space-y-4">
          <div className="grid gap-4">
            {contentElements.map((element) => (
              <Card key={element.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getContentIcon(element.element_type)}
                      <div>
                        <CardTitle className="text-lg">
                          {element.title || `${element.element_type} - ${element.element_key}`}
                        </CardTitle>
                        <CardDescription>
                          {element.page_location} / {element.section_location} • Order: {element.sort_order}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={element.is_active ? 'default' : 'secondary'}>
                        {element.is_active ? 'Active' : 'Hidden'}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleElementVisibility(element)}
                        >
                          {element.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingElement(element)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteModal({ isOpen: true, item: element, type: 'element' })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <div className="space-y-2">
                      {typeof element.content === 'object' ? (
                        Object.entries(element.content).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value).substring(0, 100)}
                            {String(value).length > 100 && '...'}
                          </div>
                        ))
                      ) : (
                        <div>{String(element.content).substring(0, 200)}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <div className="grid gap-4">
            {contentPages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{page.title}</CardTitle>
                      <CardDescription>/{page.slug} • {page.page_type}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={page.is_published ? 'default' : 'secondary'}>
                        {page.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => publishPage(page)}
                      >
                        {page.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {page.meta_description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{page.meta_description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Featured Properties Tab */}
        <TabsContent value="featured" className="space-y-4">
          <div className="grid gap-4">
            {featuredProperties.map((featured) => (
              <Card key={featured.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{featured.properties?.title}</CardTitle>
                      <CardDescription>
                        ₹{featured.properties?.expected_price.toLocaleString()} • {featured.properties?.city}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={featured.is_active ? 'default' : 'secondary'}>
                        {featured.is_active ? 'Featured' : 'Hidden'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFeaturedProperty(featured.id, { is_active: !featured.is_active })}
                      >
                        {featured.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Content Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentElements.length}</div>
                <p className="text-xs text-muted-foreground">
                  {contentElements.filter(e => e.is_active).length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Published Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {contentPages.filter(p => p.is_published).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {contentPages.length} total pages
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Featured Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {featuredProperties.filter(f => f.is_active).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {featuredProperties.length} total featured
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Element Dialog */}
      {editingElement && (
        <Dialog open={!!editingElement} onOpenChange={() => setEditingElement(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit {editingElement.element_type}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label>Title</Label>
                <Input 
                  value={editingElement.title || ''} 
                  onChange={(e) => setEditingElement({...editingElement, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Content (JSON)</Label>
                <Textarea 
                  rows={10}
                  value={JSON.stringify(editingElement.content, null, 2)} 
                  onChange={(e) => {
                    try {
                      const content = JSON.parse(e.target.value);
                      setEditingElement({...editingElement, content});
                    } catch (error) {
                      // Invalid JSON, don't update
                    }
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={editingElement.is_active} 
                  onCheckedChange={(checked) => setEditingElement({...editingElement, is_active: checked})}
                />
                <Label>Active</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingElement(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                updateContentElement(editingElement, {
                  title: editingElement.title,
                  content: editingElement.content,
                  is_active: editingElement.is_active
                });
                setEditingElement(null);
              }}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, type: '' })}
        onConfirm={() => {
          if (deleteModal.type === 'element') {
            deleteContentElement(deleteModal.item.id);
          }
        }}
        title="Delete Content Element"
        description="Are you sure you want to delete this content element? This action cannot be undone and will immediately affect the live website."
        isDeleting={isDeleting}
      />
    </div>
  );
};