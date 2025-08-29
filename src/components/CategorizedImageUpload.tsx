import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, FileText, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { compressImage, shouldCompress } from '@/utils/imageCompression';
import { ImageCompressionProgress } from '@/components/ui/image-compression-progress';

interface CategorizedImages {
  gstCopy: File[];
  servicePortfolio: File[];
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
  }
];

export const CategorizedImageUpload: React.FC<CategorizedImageUploadProps> = ({
  images,
  onImagesChange,
  className = ""
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { toast } = useToast();
  const [compressionProgress, setCompressionProgress] = useState<{
    isCompressing: boolean;
    isUploading: boolean;
    compressionComplete: boolean;
    uploadComplete: boolean;
    originalSize?: number;
    compressedSize?: number;
    compressionRatio?: number;
    fileName: string;
    error?: string;
  } | null>(null);

  const handleFileSelect = useCallback(async (category: keyof CategorizedImages, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (!isImage && !isPDF) {
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

    let processedFile = file;

    // Only compress image files, not PDFs
    if (isImage) {
      setCompressionProgress({
        isCompressing: false,
        isUploading: false,
        compressionComplete: false,
        uploadComplete: false,
        fileName: file.name,
      });

      try {
        if (shouldCompress(file)) {
          setCompressionProgress(prev => prev ? { ...prev, isCompressing: true } : null);
          
          const compressionResult = await compressImage(file, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.8,
            maxSizeKB: 800
          });
          
          processedFile = compressionResult.compressedFile;
          
          setCompressionProgress(prev => prev ? {
            ...prev,
            isCompressing: false,
            compressionComplete: true,
            uploadComplete: true,
            originalSize: compressionResult.originalSize,
            compressedSize: compressionResult.compressedSize,
            compressionRatio: compressionResult.compressionRatio
          } : null);
        } else {
          setCompressionProgress(prev => prev ? {
            ...prev,
            compressionComplete: true,
            uploadComplete: true,
            originalSize: file.size,
            compressedSize: file.size,
            compressionRatio: 0
          } : null);
        }
      } catch (compressionError) {
        console.error('Compression error:', compressionError);
        setCompressionProgress(prev => prev ? {
          ...prev,
          isCompressing: false,
          compressionComplete: true,
          uploadComplete: true,
          error: 'Compression failed, using original'
        } : null);
      }

      // Clear progress after a delay
      setTimeout(() => {
        setCompressionProgress(null);
      }, 2000);
    }

    const updatedImages = {
      ...images,
      [category]: [...images[category], processedFile]
    };
    
    onImagesChange(updatedImages);
    
    toast({
      title: "File added",
      description: `${processedFile.name} has been added to ${categories.find(c => c.key === category)?.label}`
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

  const totalImages = images.gstCopy.length + images.servicePortfolio.length;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const categoryImages = images[category.key];
          
          return (
            <Card key={category.key} className="p-2 border border-muted-foreground/20">
              <div className="flex flex-col items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <h4 className="text-xs font-medium text-foreground">{category.label}</h4>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleUploadClick(category.key)}
                  className="h-7 text-xs px-2"
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
                <div className="space-y-1">
                  {categoryImages.map((file, index) => (
                    <div key={index} className="flex items-center gap-1 p-1 bg-muted/30 rounded text-[10px]">
                      <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 truncate" title={file.name}>
                        {file.name.length > 12 ? file.name.substring(0, 12) + '...' : file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(category.key, index)}
                        className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
            </Card>
          );
        })}
      </div>
      
      {/* Compression Progress */}
      {compressionProgress && (
        <ImageCompressionProgress
          isCompressing={compressionProgress.isCompressing}
          isUploading={compressionProgress.isUploading}
          compressionComplete={compressionProgress.compressionComplete}
          uploadComplete={compressionProgress.uploadComplete}
          originalSize={compressionProgress.originalSize}
          compressedSize={compressionProgress.compressedSize}
          compressionRatio={compressionProgress.compressionRatio}
          fileName={compressionProgress.fileName}
          error={compressionProgress.error}
        />
      )}
    </div>
  );
};