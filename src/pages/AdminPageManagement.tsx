import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PagesDashboard } from '@/components/admin/page-management/PagesDashboard';
import { PageEditor } from '@/components/admin/page-management/PageEditor';
import { SectionLibrary } from '@/components/admin/page-management/SectionLibrary';
import { PagePreview } from '@/components/admin/page-management/PagePreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';

export type PageManagementView = 'dashboard' | 'editor' | 'sections' | 'preview';

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

const AdminPageManagement = () => {
  const [currentView, setCurrentView] = useState<PageManagementView>('dashboard');
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sections, setSections] = useState<PageSection[]>([]);
  const addSectionCallbackRef = useRef<((type: string) => void) | null>(null);
  
  // Debug: Log when callback is set
  useEffect(() => {
    console.log('addSectionCallback ref changed:', addSectionCallbackRef.current);
  }, []); // Empty dependency array since ref.current doesn't trigger re-renders

  const handleCreatePage = () => {
    setSelectedPage(null);
    setIsCreating(true);
    setCurrentView('editor');
  };

  const handleEditPage = (page: ContentPage) => {
    setSelectedPage(page);
    setIsCreating(false);
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedPage(null);
    setIsCreating(false);
  };

  const handlePreviewPage = (page: ContentPage) => {
    setSelectedPage(page);
    setCurrentView('preview');
  };

  // Helper function to get current callback value
  const getCurrentCallback = () => {
    const callback = addSectionCallbackRef.current;
    console.log('Getting current callback:', callback);
    console.log('Callback type:', typeof callback);
    return callback;
  };

  // Callback to update sections from PageEditor
  const handleSectionsUpdate = (newSections: PageSection[]) => {
    console.log('AdminPageManagement: Sections updated:', newSections);
    setSections(newSections);
  };

  const renderHeader = () => {
    switch (currentView) {
      case 'editor':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Pages
              </Button>
              <h1 className="text-2xl font-bold">
                {isCreating ? 'Create New Page' : `Edit: ${selectedPage?.title}`}
              </h1>
            </div>
            {selectedPage && (
              <Button
                variant="outline"
                onClick={() => handlePreviewPage(selectedPage)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            )}
          </div>
        );
      case 'sections':
        return (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('editor')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
            <h1 className="text-2xl font-bold">Section Template Library</h1>
          </div>
        );
      case 'preview':
        return (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('editor')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
            <h1 className="text-2xl font-bold">Page Preview: {selectedPage?.title}</h1>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Page Management</h1>
            <Button onClick={handleCreatePage} className="bg-primary hover:bg-primary/90">
              Create New Page
            </Button>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'editor':
        return (
          <PageEditor
            page={selectedPage}
            isCreating={isCreating}
            onSave={handleBackToDashboard}
            onSelectSections={() => setCurrentView('sections')}
            onSectionsUpdate={handleSectionsUpdate}
            onAddSectionReady={(callback) => {
              console.log('AdminPageManagement: onAddSectionReady called with:', callback);
              console.log('Callback type:', typeof callback);
              if (typeof callback === 'function') {
                console.log('Setting addSectionCallback to function');
                addSectionCallbackRef.current = callback;
              } else {
                console.error('AdminPageManagement: Invalid callback received:', callback);
              }
            }}
          />
        );
      case 'sections':
        return (
          <SectionLibrary
            onSelectSection={(sectionType) => {
              console.log('SectionLibrary onSelectSection called with:', sectionType);
              // Ensure the editor is mounted before invoking the callback
              setCurrentView('editor');

              // Defer to the next tick so PageEditor mounts and registers the callback
              setTimeout(() => {
                const cb = addSectionCallbackRef.current;
                console.log('addSectionCallback exists:', !!cb);
                if (typeof cb === 'function') {
                  try {
                    console.log('Calling addSectionCallback after returning to editor...');
                    cb(sectionType);
                    console.log('addSectionCallback executed successfully');
                  } catch (error) {
                    console.error('Error executing addSectionCallback:', error as any);
                  }
                } else {
                  console.error('addSectionCallback is null/undefined or not a function!', cb);
                }
              }, 0);
            }}
          />
        );
      case 'preview':
        return (
          <PagePreview page={selectedPage} sections={sections} />
        );
      default:
        return (
          <PagesDashboard
            onEditPage={handleEditPage}
            onCreatePage={handleCreatePage}
            onPreviewPage={handlePreviewPage}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default AdminPageManagement;