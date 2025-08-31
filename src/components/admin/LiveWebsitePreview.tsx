import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Edit2, 
  Save, 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Users,
  Building,
  TrendingUp,
  CheckCircle,
  Smartphone,
  Download
} from 'lucide-react';

interface ContentSection {
  id: string;
  element_type: string;
  title: string;
  content: any;
  onUpdate: (id: string, content: any) => void;
}

interface LiveWebsitePreviewProps {
  sections: ContentSection[];
  onSectionUpdate: (id: string, content: any) => void;
}

export const LiveWebsitePreview: React.FC<LiveWebsitePreviewProps> = ({
  sections,
  onSectionUpdate
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<any>({});

  const startEditing = (sectionId: string, content: any) => {
    setEditingSection(sectionId);
    setEditingContent({ ...content });
  };

  const saveEditing = () => {
    if (!editingSection) return;
    onSectionUpdate(editingSection, editingContent);
    setEditingSection(null);
    setEditingContent({});
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditingContent({});
  };

  const renderHeroSection = (section: ContentSection) => {
    const isEditing = editingSection === section.id;
    const content = isEditing ? editingContent : section.content;

    return (
      <div 
        className="relative bg-gradient-to-r from-primary to-primary-foreground text-white py-20 px-8 text-center group cursor-pointer"
        onClick={() => !isEditing && startEditing(section.id, section.content)}
      >
        {!isEditing && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary">
              <Edit2 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        )}
        
        {isEditing && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button size="sm" variant="outline" onClick={cancelEditing}>
              <X className="h-3 w-3" />
            </Button>
            <Button size="sm" onClick={saveEditing}>
              <Save className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          {isEditing ? (
            <>
              <Input
                value={content?.title || ''}
                onChange={(e) => setEditingContent(prev => ({ ...prev, title: e.target.value }))}
                className="text-center text-4xl font-bold bg-white/10 border-white/20 text-white placeholder:text-white/70"
                placeholder="Hero Title"
              />
              <Textarea
                value={content?.subtitle || ''}
                onChange={(e) => setEditingContent(prev => ({ ...prev, subtitle: e.target.value }))}
                className="text-center text-xl bg-white/10 border-white/20 text-white placeholder:text-white/70"
                placeholder="Hero Subtitle"
                rows={2}
              />
              <Input
                value={content?.buttonText || ''}
                onChange={(e) => setEditingContent(prev => ({ ...prev, buttonText: e.target.value }))}
                className="w-48 mx-auto bg-white/10 border-white/20 text-white placeholder:text-white/70"
                placeholder="Button Text"
              />
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold mb-4">{content?.title || 'Welcome to Our Platform'}</h1>
              <p className="text-xl mb-8">{content?.subtitle || 'Discover amazing features and services'}</p>
              <Button size="lg" variant="secondary">
                {content?.buttonText || 'Get Started'}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderStatsSection = (section: ContentSection) => {
    const isEditing = editingSection === section.id;
    const content = isEditing ? editingContent : section.content;

    return (
      <div 
        className="bg-background py-16 px-8 group cursor-pointer relative"
        onClick={() => !isEditing && startEditing(section.id, section.content)}
      >
        {!isEditing && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="outline">
              <Edit2 className="h-3 w-3 mr-1" />
              Edit Stats
            </Button>
          </div>
        )}

        {isEditing && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button size="sm" variant="outline" onClick={cancelEditing}>
              <X className="h-3 w-3" />
            </Button>
            <Button size="sm" onClick={saveEditing}>
              <Save className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { key: 'properties', icon: <Building className="h-8 w-8" />, label: 'Properties' },
              { key: 'users', icon: <Users className="h-8 w-8" />, label: 'Happy Users' },
              { key: 'cities', icon: <MapPin className="h-8 w-8" />, label: 'Cities' },
              { key: 'satisfaction', icon: <TrendingUp className="h-8 w-8" />, label: 'Satisfaction' }
            ].map(({ key, icon, label }) => (
              <div key={key} className="text-center space-y-4">
                <div className="text-primary mx-auto w-fit">{icon}</div>
                {isEditing ? (
                  <Input
                    value={content?.[key] || ''}
                    onChange={(e) => setEditingContent(prev => ({ ...prev, [key]: e.target.value }))}
                    className="text-center text-3xl font-bold"
                    placeholder={`${label} Count`}
                  />
                ) : (
                  <div className="text-3xl font-bold text-foreground">
                    {content?.[key] || '0'}
                  </div>
                )}
                <p className="text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonial = (section: ContentSection) => {
    const isEditing = editingSection === section.id;
    const content = isEditing ? editingContent : section.content;

    return (
      <Card 
        className="max-w-2xl mx-auto group cursor-pointer"
        onClick={() => !isEditing && startEditing(section.id, section.content)}
      >
        <CardContent className="p-6 relative">
          {!isEditing && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost">
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          )}

          {isEditing && (
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Button size="sm" variant="outline" onClick={cancelEditing}>
                <X className="h-3 w-3" />
              </Button>
              <Button size="sm" onClick={saveEditing}>
                <Save className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {isEditing ? (
              <>
                <Textarea
                  value={content?.review || ''}
                  onChange={(e) => setEditingContent(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="Customer review"
                  rows={3}
                />
                <Input
                  value={content?.name || ''}
                  onChange={(e) => setEditingContent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                />
                <Input
                  value={content?.location || ''}
                  onChange={(e) => setEditingContent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Customer location"
                />
              </>
            ) : (
              <>
                <blockquote className="text-lg italic text-muted-foreground">
                  "{content?.review || 'Great service and amazing experience!'}"
                </blockquote>
                <div>
                  <p className="font-semibold">{content?.name || 'John Doe'}</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {content?.location || 'New York, USA'}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMobileAppSection = (section: ContentSection) => {
    const isEditing = editingSection === section.id;
    const content = isEditing ? editingContent : section.content;

    return (
      <div 
        className="bg-muted py-16 px-8 group cursor-pointer relative"
        onClick={() => !isEditing && startEditing(section.id, section.content)}
      >
        {!isEditing && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="outline">
              <Edit2 className="h-3 w-3 mr-1" />
              Edit App Section
            </Button>
          </div>
        )}

        {isEditing && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button size="sm" variant="outline" onClick={cancelEditing}>
              <X className="h-3 w-3" />
            </Button>
            <Button size="sm" onClick={saveEditing}>
              <Save className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="text-primary mx-auto w-fit">
            <Smartphone className="h-16 w-16" />
          </div>

          {isEditing ? (
            <>
              <Input
                value={content?.title || ''}
                onChange={(e) => setEditingContent(prev => ({ ...prev, title: e.target.value }))}
                className="text-center text-3xl font-bold"
                placeholder="App Section Title"
              />
              <Textarea
                value={content?.description || ''}
                onChange={(e) => setEditingContent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="App description"
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold">
                {content?.title || 'Download Our Mobile App'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {content?.description || 'Get the best experience on your mobile device'}
              </p>
            </>
          )}

          <div className="flex justify-center gap-4">
            <Button variant="default" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              App Store
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Play Store
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (section: ContentSection) => {
    switch (section.element_type) {
      case 'hero_section':
        return renderHeroSection(section);
      case 'stats_section':
        return renderStatsSection(section);
      case 'testimonial':
        return renderTestimonial(section);
      case 'mobile_app_section':
        return renderMobileAppSection(section);
      default:
        return (
          <Card className="my-4 group cursor-pointer" onClick={() => startEditing(section.id, section.content)}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{section.title}</h3>
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {section.element_type} - Click to edit
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Website Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">PropertyHub</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-foreground hover:text-primary">Home</a>
              <a href="#" className="text-foreground hover:text-primary">Properties</a>
              <a href="#" className="text-foreground hover:text-primary">Services</a>
              <a href="#" className="text-foreground hover:text-primary">About</a>
              <a href="#" className="text-foreground hover:text-primary">Contact</a>
            </nav>
            <Button>Sign In</Button>
          </div>
        </div>
      </header>

      {/* Live Website Content */}
      <main>
        {sections.map((section, index) => (
          <div key={section.id} className="relative">
            {renderSection(section)}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">
              No content sections yet
            </h2>
            <p className="text-muted-foreground">
              Add sections from the library to see them appear here
            </p>
          </div>
        )}
      </main>

      {/* Website Footer */}
      <footer className="bg-muted border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PropertyHub</h3>
              <p className="text-muted-foreground">
                Your trusted real estate partner
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Buy Property</li>
                <li>Rent Property</li>
                <li>Property Management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +1 234 567 8900
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  hello@propertyhub.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};