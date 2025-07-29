import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyDraft } from '@/types/propertyDraft';
import { ArrowLeft, Eye, Save, Send } from 'lucide-react';
import { PreviewModal } from './PreviewModal';
import { useToast } from '@/hooks/use-toast';

interface PreviewStepProps {
  data: PropertyDraft;
  onBack: () => void;
  onSaveAsDraft: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSavingDraft: boolean;
}

export const PreviewStep = ({ 
  data, 
  onBack, 
  onSaveAsDraft, 
  onSubmit, 
  isSubmitting, 
  isSavingDraft 
}: PreviewStepProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const validateRequiredFields = () => {
    const requiredFields = [
      { field: data.title, name: 'Property Title' },
      { field: data.property_type, name: 'Property Type' },
      { field: data.listing_type, name: 'Listing Type' },
      { field: data.bhk_type, name: 'BHK Type' },
      { field: data.super_area, name: 'Super Area' },
      { field: data.expected_price, name: 'Expected Price' },
      { field: data.state, name: 'State' },
      { field: data.city, name: 'City' },
      { field: data.locality, name: 'Locality' },
      { field: data.pincode, name: 'Pincode' },
      { field: data.owner_name, name: 'Owner Name' },
      { field: data.owner_phone, name: 'Owner Phone' },
      { field: data.owner_email, name: 'Owner Email' },
    ];

    const missingFields = requiredFields.filter(item => !item.field).map(item => item.name);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please complete: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateRequiredFields()) return;
    onSubmit();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Final Step</h2>
        <p className="text-muted-foreground">
          Preview and submit your property listing
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {data.title || 'Untitled Property'}
              </h3>
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl font-bold text-primary">
                  {data.expected_price ? `₹${(data.expected_price / 100000).toFixed(1)}L` : 'Price not set'}
                </span>
                <Badge variant="secondary" className="capitalize">
                  For {data.listing_type}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {data.locality}, {data.city} • {data.bhk_type} • {data.super_area} sq ft
              </p>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsPreviewOpen(true)}
                className="gap-2"
              >
                <Eye className="h-5 w-5" />
                Preview Listing
              </Button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold">{data.images?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Images</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{data.videos?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {data.description ? Math.ceil(data.description.length / 100) : 0}
                </div>
                <div className="text-sm text-muted-foreground">Description Lines</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="sm:w-auto w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Property Details
        </Button>
        
        <div className="flex-1" />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onSaveAsDraft}
            disabled={isSavingDraft}
            className="sm:w-auto w-full gap-2"
          >
            <Save className="h-4 w-4" />
            {isSavingDraft ? 'Saving...' : 'Save as Draft'}
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="sm:w-auto w-full gap-2"
            size="lg"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Listing'}
          </Button>
        </div>
      </div>

      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={data}
      />
    </div>
  );
};