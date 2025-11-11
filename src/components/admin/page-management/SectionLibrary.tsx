import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, FileText, Home, Scale, Mail, Building2 } from 'lucide-react';
import { getAllExtractedSections, getSectionsBySourcePage, ExtractedSection } from '@/services/sectionExtractor';

// Source page options with icons
const sourcePages = [
  { value: 'All', label: 'All Pages', icon: Home },
  { value: 'Homepage', label: 'Homepage', icon: Home },
  { value: 'About Us', label: 'About Us', icon: FileText },
  { value: 'Legal Services', label: 'Legal Services', icon: Scale },
  { value: 'Contact Us', label: 'Contact Us', icon: Mail },
  { value: 'Property Management', label: 'Property Management', icon: Building2 }
];

// Get all unique categories from extracted sections
const getAllCategories = (sections: ExtractedSection[]): string[] => {
  const categories = new Set(sections.map(section => section.category));
  return ['All', ...Array.from(categories).sort()];
};

interface SectionLibraryProps {
  onSelectSection: (sectionType: string) => void;
}

export const SectionLibrary: React.FC<SectionLibraryProps> = ({ onSelectSection }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSourcePage, setSelectedSourcePage] = useState('All');

  // Get all extracted sections
  const allSections = useMemo(() => getAllExtractedSections(), []);
  
  // Get categories dynamically from sections
  const categories = useMemo(() => getAllCategories(allSections), [allSections]);

  // Filter sections based on search, category, and source page
  const filteredSections = useMemo(() => {
    return allSections.filter(section => {
      const matchesSearch = section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           section.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || section.category === selectedCategory;
      const matchesSourcePage = selectedSourcePage === 'All' || section.sourcePage === selectedSourcePage;
      
      return matchesSearch && matchesCategory && matchesSourcePage;
    });
  }, [allSections, searchQuery, selectedCategory, selectedSourcePage]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose from Real Website Sections</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select sections extracted from your existing website pages. All content comes from real pages with actual data and structure.
          </p>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sections by name, description, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Source Page Filter */}
              <div className="flex-1">
                <Select value={selectedSourcePage} onValueChange={setSelectedSourcePage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by source page" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourcePages.map(page => {
                      const IconComponent = page.icon;
                      return (
                        <SelectItem key={page.value} value={page.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {page.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Category Filter */}
              <div className="flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Category Badges for quick selection */}
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 8).map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map(section => (
              <Card key={section.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border-b relative">
                  {section.previewImage && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-20"
                      style={{ backgroundImage: `url(${section.previewImage})` }}
                    />
                  )}
                  <div className="text-center p-4 relative z-10">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <div className="text-primary font-bold text-xs">
                        {section.category.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {section.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      from {section.sourcePage}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{section.name}</h4>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="text-xs">
                        {section.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {section.sourcePage}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {section.description}
                  </p>
                  <div className="text-xs text-muted-foreground mb-4">
                    <strong>Type:</strong> {section.type}
                  </div>
                  <Button
                    onClick={() => {
                      console.log('Real section selected:', section);
                      console.log('Section type being passed:', section.type);
                      console.log('onSelectSection function:', onSelectSection);
                      onSelectSection(section.type);
                    }}
                    className="w-full flex items-center gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Use This Section
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No sections found matching your criteria.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
