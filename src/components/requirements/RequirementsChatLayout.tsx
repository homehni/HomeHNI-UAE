import React, { useState } from 'react';
import { RequirementsSidebar } from './RequirementsSidebar';
import { RequirementDetails } from './RequirementDetails';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Plus, Search, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PropertyRequirement {
  id: string;
  user_id: string;
  title: string;
  payload: any;
  status: string;
  created_at: string;
  city?: string;
  state?: string;
}

interface RequirementsChatLayoutProps {
  requirements: PropertyRequirement[];
}

export const RequirementsChatLayout: React.FC<RequirementsChatLayoutProps> = ({
  requirements
}) => {
  const [selectedRequirement, setSelectedRequirement] = useState<PropertyRequirement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Use custom breakpoint for this layout (1024px)
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Show empty state if no requirements
  if (requirements.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <Building className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h3 className="text-xl font-medium text-muted-foreground">No requirements posted yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Start by posting your first property requirement to see real-time matches
          </p>
          <Button onClick={() => window.location.href = '/post-property'} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Post Your First Requirement
          </Button>
        </div>
      </div>
    );
  }

  const handleSelectRequirement = (requirement: PropertyRequirement) => {
    setSelectedRequirement(requirement);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleBack = () => {
    if (isMobile) {
      setSidebarOpen(true);
      setSelectedRequirement(null);
    }
  };

  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Header */}
        {selectedRequirement && (
          <div className="border-b border-border p-2 bg-background">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-2"
            >
              <Menu className="h-4 w-4 mr-2" />
              Requirements
            </Button>
          </div>
        )}
        
        {/* Mobile Content */}
        {selectedRequirement ? (
          <RequirementDetails
            requirement={selectedRequirement}
            onBack={handleBack}
            showBackButton={true}
          />
        ) : (
          <div className="h-full">
            <RequirementsSidebar
              requirements={requirements}
              selectedRequirement={selectedRequirement}
              onSelectRequirement={handleSelectRequirement}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Panel - Requirements Sidebar */}
        <ResizablePanel
          defaultSize={32}
          minSize={20}
          maxSize={45}
          className="min-w-[320px]"
        >
          <RequirementsSidebar
            requirements={requirements}
            selectedRequirement={selectedRequirement}
            onSelectRequirement={handleSelectRequirement}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Requirement Details */}
        <ResizablePanel defaultSize={68} minSize={55}>
          <RequirementDetails
            requirement={selectedRequirement}
            showBackButton={false}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};