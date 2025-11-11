import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Search, Globe, Code, FileText, BarChart3 } from 'lucide-react';

interface MetaTag {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

interface TrackingCode {
  id: string;
  name: string;
  type: 'google-analytics' | 'facebook-pixel' | 'google-tag-manager' | 'custom';
  code: string;
  active: boolean;
}

export const AdminSEO: React.FC = () => {
  const [metaTags, setMetaTags] = useState<MetaTag[]>([
    {
      id: '1',
      page: 'Homepage',
      title: 'HomeHNI - Premium Real Estate Platform',
      description: 'Find your perfect home with HomeHNI. Premium real estate listings, verified properties, and trusted agents.',
      keywords: 'real estate, property, homes, apartments, buy, sell, rent',
      ogTitle: 'HomeHNI - Premium Real Estate Platform',
      ogDescription: 'Find your perfect home with HomeHNI',
      ogImage: '/og-image.jpg'
    },
    {
      id: '2', 
      page: 'Properties',
      title: 'Properties for Sale & Rent - HomeHNI',
      description: 'Browse premium properties for sale and rent. Find apartments, houses, and commercial spaces.',
      keywords: 'properties, sale, rent, apartments, houses, commercial',
    },
    {
      id: '3',
      page: 'About',
      title: 'About HomeHNI - Your Trusted Real Estate Partner',
      description: 'Learn about HomeHNI, your trusted partner in real estate. Our mission, vision, and commitment to excellence.',
      keywords: 'about, real estate, trusted, partner, mission, vision',
    }
  ]);

  const [trackingCodes, setTrackingCodes] = useState<TrackingCode[]>([
    {
      id: '1',
      name: 'Google Analytics',
      type: 'google-analytics',
      code: 'GA_MEASUREMENT_ID',
      active: false
    },
    {
      id: '2',
      name: 'Facebook Pixel',
      type: 'facebook-pixel',
      code: 'FACEBOOK_PIXEL_ID',
      active: false
    },
    {
      id: '3',
      name: 'Google Tag Manager',
      type: 'google-tag-manager',
      code: 'GTM-XXXXXXX',
      active: true
    }
  ]);

  const [selectedMeta, setSelectedMeta] = useState<MetaTag>(metaTags[0]);
  const [sitemapSettings, setSitemapSettings] = useState({
    autoGenerate: true,
    updateFrequency: 'daily',
    priority: {
      homepage: '1.0',
      properties: '0.8',
      pages: '0.6'
    }
  });

  const { toast } = useToast();
  
  useEffect(() => {
    // Set up real-time subscription for content pages (for SEO data)
    const channel = supabase
      .channel('seo-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_pages'
        },
        () => {
          // Notify when SEO data changes
          toast({
            title: 'SEO Data Updated',
            description: 'SEO settings have been updated by another admin',
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleSaveMetaTags = () => {
    setMetaTags(prev => prev.map(meta => 
      meta.id === selectedMeta.id ? selectedMeta : meta
    ));
    
    toast({
      title: 'Success',
      description: 'Meta tags updated successfully'
    });
  };

  const handleSaveTrackingCodes = () => {
    toast({
      title: 'Success',
      description: 'Tracking codes updated successfully'
    });
  };

  const toggleTrackingCode = (id: string) => {
    setTrackingCodes(prev => prev.map(code =>
      code.id === id ? { ...code, active: !code.active } : code
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'google-analytics': return <BarChart3 className="h-4 w-4" />;
      case 'facebook-pixel': return <Globe className="h-4 w-4" />;
      case 'google-tag-manager': return <Code className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'google-analytics': return 'bg-orange-100 text-orange-800';
      case 'facebook-pixel': return 'bg-blue-100 text-blue-800';
      case 'google-tag-manager': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">SEO Management</h1>
        <p className="text-muted-foreground">Manage SEO settings, meta tags, and tracking codes</p>
      </div>

      <Tabs defaultValue="meta" className="space-y-4">
        <TabsList>
          <TabsTrigger value="meta">Meta Tags</TabsTrigger>
          <TabsTrigger value="tracking">Tracking Codes</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="schema">Schema Markup</TabsTrigger>
        </TabsList>

        <TabsContent value="meta" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Page List */}
            <Card>
              <CardHeader>
                <CardTitle>Pages</CardTitle>
                <CardDescription>Select a page to edit meta tags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metaTags.map((meta) => (
                    <Button
                      key={meta.id}
                      variant={selectedMeta.id === meta.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedMeta(meta)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {meta.page}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meta Tag Editor */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Meta Tags - {selectedMeta.page}</CardTitle>
                  <CardDescription>Update SEO meta tags for this page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={selectedMeta.title}
                      onChange={(e) => setSelectedMeta(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter page title"
                    />
                    <p className="text-xs text-muted-foreground">
                      {selectedMeta.title.length}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Meta Description</Label>
                    <Textarea
                      id="description"
                      value={selectedMeta.description}
                      onChange={(e) => setSelectedMeta(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter meta description"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {selectedMeta.description.length}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      value={selectedMeta.keywords}
                      onChange={(e) => setSelectedMeta(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="Enter keywords separated by commas"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Open Graph Tags</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ogTitle">OG Title</Label>
                        <Input
                          id="ogTitle"
                          value={selectedMeta.ogTitle || ''}
                          onChange={(e) => setSelectedMeta(prev => ({ ...prev, ogTitle: e.target.value }))}
                          placeholder="Open Graph title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ogDescription">OG Description</Label>
                        <Textarea
                          id="ogDescription"
                          value={selectedMeta.ogDescription || ''}
                          onChange={(e) => setSelectedMeta(prev => ({ ...prev, ogDescription: e.target.value }))}
                          placeholder="Open Graph description"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ogImage">OG Image URL</Label>
                        <Input
                          id="ogImage"
                          value={selectedMeta.ogImage || ''}
                          onChange={(e) => setSelectedMeta(prev => ({ ...prev, ogImage: e.target.value }))}
                          placeholder="/path/to/og-image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveMetaTags} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Meta Tags
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Codes</CardTitle>
              <CardDescription>Manage analytics and tracking codes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Code/ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trackingCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(code.type)}
                          {code.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getTypeColor(code.type)}>
                          {code.type.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {code.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={code.active ? "default" : "secondary"}>
                          {code.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={code.active}
                          onCheckedChange={() => toggleTrackingCode(code.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <Button onClick={handleSaveTrackingCodes}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Tracking Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Settings</CardTitle>
              <CardDescription>Configure automatic sitemap generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto-generate Sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate and update sitemap.xml
                  </p>
                </div>
                <Switch 
                  checked={sitemapSettings.autoGenerate}
                  onCheckedChange={(checked) => 
                    setSitemapSettings(prev => ({ ...prev, autoGenerate: checked }))
                  }
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Priority Settings</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Homepage</Label>
                    <Input
                      value={sitemapSettings.priority.homepage}
                      onChange={(e) => setSitemapSettings(prev => ({
                        ...prev,
                        priority: { ...prev.priority, homepage: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Properties</Label>
                    <Input
                      value={sitemapSettings.priority.properties}
                      onChange={(e) => setSitemapSettings(prev => ({
                        ...prev,
                        priority: { ...prev.priority, properties: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Pages</Label>
                    <Input
                      value={sitemapSettings.priority.pages}
                      onChange={(e) => setSitemapSettings(prev => ({
                        ...prev,
                        priority: { ...prev.priority, pages: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Sitemap Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schema Markup</CardTitle>
              <CardDescription>Configure structured data for better SEO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Organization Schema</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Basic organization information for your real estate platform
                  </p>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    {JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": "HomeHNI",
                      "url": "https://homehni.com",
                      "logo": "https://homehni.com/logo.png"
                    }, null, 2)}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Real Estate Listing Schema</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Structured data for property listings
                  </p>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    {JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "RealEstateListing",
                      "name": "Property Title",
                      "url": "https://homehni.com/property/123",
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "City",
                        "addressRegion": "State"
                      }
                    }, null, 2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
