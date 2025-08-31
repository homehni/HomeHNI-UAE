import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface PageSection {
  id: string;
  element_type: string;
  element_key: string;
  title: string;
  content: any;
  sort_order: number;
  is_active: boolean;
  page_location: string;
  section_location: string;
}

interface DraggableSectionItemProps {
  id: string;
  section: PageSection;
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility?: () => void;
}

export const DraggableSectionItem: React.FC<DraggableSectionItemProps> = ({
  id,
  section,
  children,
  onEdit,
  onDelete,
  onToggleVisibility
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSectionIcon = (elementType: string) => {
    const iconMap: Record<string, string> = {
      'hero_section': '🏠',
      'testimonial': '⭐',
      'stats_section': '📊',
      'service': '⚙️',
      'featured_property': '🏢',
      'mobile_app_section': '📱',
      'home_services_section': '🔧'
    };
    return iconMap[elementType] || '📄';
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <Card 
        className={`
          border transition-all duration-200 
          ${isDragging ? 'shadow-2xl border-primary' : 'hover:shadow-md'}
          ${!section.is_active ? 'opacity-50' : ''}
        `}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <Button
              variant="ghost"
              size="sm"
              className="cursor-grab active:cursor-grabbing h-8 w-8 p-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Section Info */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{getSectionIcon(section.element_type)}</span>
              <div>
                <h3 className="font-medium text-foreground text-sm">
                  {section.title}
                </h3>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {section.element_type}
                  </Badge>
                  {section.page_location && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {section.page_location}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-8 w-8 p-0"
                title={section.is_active ? 'Hide section' : 'Show section'}
              >
                {section.is_active ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
              title="Edit section"
            >
              <Edit2 className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              title="Delete section"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-0">
          {children}
        </div>

        {/* Section Footer */}
        <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground flex justify-between">
          <span>Order: {section.sort_order + 1}</span>
          <span>ID: {section.element_key}</span>
        </div>
      </Card>
    </div>
  );
};