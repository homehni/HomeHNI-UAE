import React, { useState } from 'react';
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

const AdminPageManagement = () => {
  const [currentView, setCurrentView] = useState<PageManagementView>('dashboard');
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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
          />
        );
      case 'sections':
        return (
          <SectionLibrary
            onSelectSection={(sectionType) => {
              // Handle section selection
              setCurrentView('editor');
            }}
          />
        );
      case 'preview':
        return (
          <PagePreview page={selectedPage} />
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