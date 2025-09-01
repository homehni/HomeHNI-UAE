import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, GripVertical, Trash2 } from 'lucide-react';

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

interface SectionEditorProps {
  section: PageSection;
  onUpdate: (section: PageSection) => void;
  onClose: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdate,
  onClose
}) => {
  const [formData, setFormData] = useState(section.content || {});
  const [isActive, setIsActive] = useState(section.is_active);

  const handleSave = () => {
    const updatedSection = {
      ...section,
      content: formData,
      is_active: isActive
    };
    onUpdate(updatedSection);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    const currentArray = formData[field] || [];
    updateField(field, [...currentArray, defaultItem]);
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = formData[field] || [];
    updateField(field, currentArray.filter((_, i) => i !== index));
  };

  const updateArrayItem = (field: string, index: number, updates: any) => {
    const currentArray = formData[field] || [];
    const updatedArray = currentArray.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    );
    updateField(field, updatedArray);
  };

  const renderFieldEditor = () => {
    switch (section.section_type) {
      case 'hero_search':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero_image">Hero Background Image URL</Label>
              <Input
                id="hero_image"
                value={formData.hero_image || ''}
                onChange={(e) => updateField('hero_image', e.target.value)}
                placeholder="/lovable-uploads/hero-bg.jpg"
              />
            </div>
            <div>
              <Label htmlFor="search_placeholder">Search Placeholder Text</Label>
              <Input
                id="search_placeholder"
                value={formData.search_placeholder || ''}
                onChange={(e) => updateField('search_placeholder', e.target.value)}
                placeholder="Search 'Sector 150 Noida'"
              />
            </div>
          </div>
        );

      case 'featured_properties':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading">Section Heading</Label>
              <Input
                id="heading"
                value={formData.heading || ''}
                onChange={(e) => updateField('heading', e.target.value)}
                placeholder="Featured Properties"
              />
            </div>
            <div>
              <Label htmlFor="description">Section Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Discover our handpicked selection of premium properties..."
              />
            </div>
            <div>
              <Label htmlFor="max_properties">Maximum Properties to Show</Label>
              <Input
                id="max_properties"
                type="number"
                value={formData.max_properties || 20}
                onChange={(e) => updateField('max_properties', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show_filters"
                checked={formData.show_filters || false}
                onCheckedChange={(checked) => updateField('show_filters', checked)}
              />
              <Label htmlFor="show_filters">Show Property Type Filters</Label>
            </div>
          </div>
        );

      case 'services_grid':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading">Section Heading</Label>
              <Input
                id="heading"
                value={formData.heading || ''}
                onChange={(e) => updateField('heading', e.target.value)}
                placeholder="Our Services"
              />
            </div>
            <div>
              <Label htmlFor="description">Section Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Comprehensive real estate solutions..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Services</Label>
                <Button
                  onClick={() => addArrayItem('services', { 
                    title: 'New Service', 
                    description: 'Service description',
                    icon: 'service'
                  })}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.services || []).map((service: any, index: number) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400 mt-2" />
                      <div className="flex-1 space-y-2">
                        <Input
                          value={service.title || ''}
                          onChange={(e) => updateArrayItem('services', index, { title: e.target.value })}
                          placeholder="Service title"
                          className="font-medium"
                        />
                        <Textarea
                          value={service.description || ''}
                          onChange={(e) => updateArrayItem('services', index, { description: e.target.value })}
                          placeholder="Service description"
                          rows={2}
                        />
                      </div>
                      <Button
                        onClick={() => removeArrayItem('services', index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'stats_section':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="background_style">Background Style</Label>
              <Select
                value={formData.background_style || 'gradient'}
                onValueChange={(value) => updateField('background_style', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select background style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gradient">Red Gradient</SelectItem>
                  <SelectItem value="solid">Solid Color</SelectItem>
                  <SelectItem value="white">White Background</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Statistics</Label>
                <Button
                  onClick={() => addArrayItem('stats', { 
                    number: '1000+', 
                    label: 'New Stat',
                    icon: 'home'
                  })}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Stat
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.stats || []).map((stat: any, index: number) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400 mt-2" />
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          value={stat.number || ''}
                          onChange={(e) => updateArrayItem('stats', index, { number: e.target.value })}
                          placeholder="1000+"
                        />
                        <Input
                          value={stat.label || ''}
                          onChange={(e) => updateArrayItem('stats', index, { label: e.target.value })}
                          placeholder="Properties Listed"
                        />
                      </div>
                      <Button
                        onClick={() => removeArrayItem('stats', index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'testimonials_section':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading">Section Heading</Label>
              <Input
                id="heading"
                value={formData.heading || ''}
                onChange={(e) => updateField('heading', e.target.value)}
                placeholder="Our customers love us"
              />
            </div>
            <div>
              <Label htmlFor="description">Section Description</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Real stories from verified buyers & owners."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show_video"
                checked={formData.show_video || true}
                onCheckedChange={(checked) => updateField('show_video', checked)}
              />
              <Label htmlFor="show_video">Show Video Testimonials</Label>
            </div>
          </div>
        );

      case 'steps':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="How It Works"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Steps</Label>
                <Button
                  onClick={() => addArrayItem('steps', { 
                    title: 'New Step', 
                    description: 'Step description'
                  })}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.steps || []).map((step: any, index: number) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={step.title || ''}
                          onChange={(e) => updateArrayItem('steps', index, { title: e.target.value })}
                          placeholder="Step title"
                        />
                        <Textarea
                          value={step.description || ''}
                          onChange={(e) => updateArrayItem('steps', index, { description: e.target.value })}
                          placeholder="Step description"
                          rows={2}
                        />
                      </div>
                      <Button
                        onClick={() => removeArrayItem('steps', index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Section title"
              />
            </div>
            <div>
              <Label htmlFor="description">Section Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Section description"
              />
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This section type ({section.section_type}) doesn't have custom fields configured yet. 
                You can add basic title and description, or contact your developer to add specific fields.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="flex items-center gap-2">
            Edit Section
            <Badge variant="outline">{section.section_type}</Badge>
          </CardTitle>
        </div>
        <Button onClick={onClose} variant="ghost" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section Status */}
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="is_active">Section Active</Label>
        </div>

        <Separator />

        {/* Dynamic Fields */}
        {renderFieldEditor()}

        <Separator />

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};