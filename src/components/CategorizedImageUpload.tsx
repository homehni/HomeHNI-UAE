import React, { useCallback, useRef } from 'react';
import { Upload, X, FileText, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CategorizedImages {
  gstCopy: File[];
  servicePortfolio: File[];
  capacityOfService: File[];
}

interface CategorizedImageUploadProps {
  images: CategorizedImages;
  onImagesChange: (images: CategorizedImages) => void;
  className?: string;
}

const categories = [
  {
    key: 'gstCopy' as keyof CategorizedImages,
    label: 'GST Copy',
    icon: FileText,
    description: 'Upload your GST certificate',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    key: 'servicePortfolio' as keyof CategorizedImages,
    label: 'Service Portfolio',
    icon: Briefcase,
    description: 'Upload your work samples',
    color: 'bg-green-100 text-green-600'
  },
  {
    key: 'capacityOfService' as keyof CategorizedImages,
    label: 'Capacity of Service',
    icon: Award,
    description: 'Upload capacity documents',
    color: 'bg-purple-100 text-purple-600'
  }
];

export const CategorizedImageUpload: React.FC<CategorizedImageUploadProps> = ({
  images,
  onImagesChange,
  className = ""
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (category: keyof CategorizedImages, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select an image or PDF file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    const updatedImages = {
      ...images,
      [category]: [...images[category], file]
    };
    
    onImagesChange(updatedImages);
    
    toast({
      title: "File added",
      description: `${file.name} has been added to ${categories.find(c => c.key === category)?.label}`
    });
  }, [images, onImagesChange, toast]);

  const removeImage = useCallback((category: keyof CategorizedImages, index: number) => {
    const updatedImages = {
      ...images,
      [category]: images[category].filter((_, i) => i !== index)
    };
    onImagesChange(updatedImages);
    
    toast({
      title: "File removed",
      description: "File has been removed successfully"
    });
  }, [images, onImagesChange, toast]);

  const handleUploadClick = useCallback((category: keyof CategorizedImages) => {
    const input = fileInputRefs.current[category];
    if (input) {
      input.click();
    }
  }, []);

  const totalImages = images.gstCopy.length + images.servicePortfolio.length + images.capacityOfService.length;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const categoryImages = images[category.key];
          
          return (
            <Card key={category.key} className="p-4 border border-muted-foreground/20">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">{category.label}</h4>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleUploadClick(category.key)}
                  className="h-8 text-xs"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Upload
                </Button>
              </div>
              
              <input
                ref={(el) => fileInputRefs.current[category.key] = el}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileSelect(category.key, e.target.files)}
                className="hidden"
              />
              
              {categoryImages.length > 0 && (
                <div className="space-y-2">
                  {categoryImages.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs">
                      <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(category.key, index)}
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {categoryImages.length === 0 && (
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-3 text-center cursor-pointer hover:border-muted-foreground/40 transition-colors"
                  onClick={() => handleUploadClick(category.key)}
                >
                  <p className="text-xs text-muted-foreground">
                    Click to upload or drag & drop files here
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Total files: {totalImages} | Supported formats: Images (PNG, JPG, GIF), PDF | Max size: 5MB per file
        </p>
      </div>
    </div>
  );
};