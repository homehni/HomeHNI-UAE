import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';

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

interface PagePreviewProps {
  page: ContentPage | null;
}

export const PagePreview: React.FC<PagePreviewProps> = ({ page }) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  if (!page) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No page selected for preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-3">
              Live Preview: {page.title}
              <Badge variant={page.is_published ? "default" : "secondary"}>
                {page.is_published ? 'Published' : 'Draft'}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              /{page.slug}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className="h-8 px-3"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className="h-8 px-3"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            {page.is_published && (
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Live
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Preview Frame */}
      <Card>
        <CardContent className="p-6">
          <div className={`mx-auto bg-white border rounded-lg overflow-hidden transition-all duration-300 ${
            previewMode === 'mobile' 
              ? 'max-w-sm' 
              : 'max-w-full'
          }`}>
            {/* Simulated Browser Header */}
            <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-muted-foreground">
                yoursite.com/{page.slug}
              </div>
            </div>

            {/* Page Content Simulation */}
            <div className="bg-white">
              {/* Hero Section Simulation */}
              <div className="aspect-[16/6] bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative">
                <div className="text-center text-white">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">
                    {page.title}
                  </h1>
                  {page.content?.description && (
                    <p className="text-lg opacity-90 max-w-2xl">
                      {typeof page.content.description === 'string' 
                        ? page.content.description.replace(/<[^>]*>/g, '').slice(0, 100) + '...'
                        : 'Page content preview'
                      }
                    </p>
                  )}
                  <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
                    Learn More
                  </Button>
                </div>
                <Badge className="absolute top-4 left-4 bg-white/20 text-white border-white/30">
                  Hero Section
                </Badge>
              </div>

              {/* Content Sections Simulation */}
              <div className="p-6 space-y-8">
                {/* Search Section */}
                <div className="relative">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Find Your Perfect Property</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded border">Location</div>
                      <div className="bg-white p-3 rounded border">Property Type</div>
                      <div className="bg-white p-3 rounded border">Price Range</div>
                    </div>
                    <Button className="w-full mt-4">Search Properties</Button>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-700">
                    Search Section
                  </Badge>
                </div>

                {/* Featured Properties Grid */}
                <div className="relative">
                  <h3 className="font-semibold mb-4">Featured Properties</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gray-200"></div>
                        <div className="p-4">
                          <h4 className="font-medium">Property {i}</h4>
                          <p className="text-sm text-muted-foreground">₹{i * 50}.00 L</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Badge className="absolute top-0 right-0 bg-green-100 text-green-700">
                    Property Grid
                  </Badge>
                </div>

                {/* Testimonials Section */}
                <div className="relative">
                  <h3 className="font-semibold mb-4">What Our Clients Say</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      "Excellent service and helped us find our dream home!"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <div className="font-medium text-sm">John Doe</div>
                        <div className="text-xs text-muted-foreground">Happy Customer</div>
                      </div>
                    </div>
                  </div>
                  <Badge className="absolute top-0 right-0 bg-yellow-100 text-yellow-700">
                    Testimonials
                  </Badge>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-900 text-white p-6 text-center">
                <p className="text-sm opacity-75">
                  © 2024 Your Real Estate Company. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* Page Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-muted p-3 rounded">
              <div className="font-medium">SEO Title</div>
              <div className="text-muted-foreground">
                {page.meta_title || page.title}
              </div>
            </div>
            <div className="bg-muted p-3 rounded">
              <div className="font-medium">Meta Description</div>
              <div className="text-muted-foreground">
                {page.meta_description || 'No meta description set'}
              </div>
            </div>
            <div className="bg-muted p-3 rounded">
              <div className="font-medium">Keywords</div>
              <div className="text-muted-foreground">
                {page.meta_keywords?.length ? page.meta_keywords.join(', ') : 'No keywords set'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};