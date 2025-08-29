import React, { useRef, useState } from 'react';
import { Upload, X, Camera, Home, Bath, Bed, ChefHat, Eye, Building2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { compressImage, shouldCompress } from '@/utils/imageCompression';
import { ImageCompressionProgress } from '@/components/ui/image-compression-progress';

interface CategorizedImages {
  bathroom: File[];
  bedroom: File[];
  hall: File[];
  kitchen: File[];
  frontView: File[];
  balcony: File[];
  others: File[];
}

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages: number;
  minImages: number;
  onUploadClick?: () => void;
}

const categories = [
  { key: 'bathroom' as keyof CategorizedImages, label: 'Bathroom', icon: Bath, color: 'bg-blue-100 text-blue-700' },
  { key: 'bedroom' as keyof CategorizedImages, label: 'Bedroom', icon: Bed, color: 'bg-purple-100 text-purple-700' },
  { key: 'hall' as keyof CategorizedImages, label: 'Hall', icon: Home, color: 'bg-green-100 text-green-700' },
  { key: 'kitchen' as keyof CategorizedImages, label: 'Kitchen', icon: ChefHat, color: 'bg-orange-100 text-orange-700' },
  { key: 'frontView' as keyof CategorizedImages, label: 'Front View', icon: Eye, color: 'bg-teal-100 text-teal-700' },
  { key: 'balcony' as keyof CategorizedImages, label: 'Balcony', icon: Building2, color: 'bg-cyan-100 text-cyan-700' },
  { key: 'others' as keyof CategorizedImages, label: 'Others', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-700' }
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages,
  minImages
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
  
  // Convert flat array to categorized structure
  const [categorizedImages, setCategorizedImages] = useState<CategorizedImages>(() => {
    return {
      bathroom: [],
      bedroom: [],
      hall: [],
      kitchen: [],
      frontView: [],
      balcony: [],
      others: [...images] // Start with all existing images in others
    };
  });

  const handleCategorizedFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, category: keyof CategorizedImages) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select image files only",
          variant: "destructive"
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} must be less than 5MB`,
          variant: "destructive"
        });
        continue;
      }

      setCompressionProgress({
        isCompressing: false,
        isUploading: false,
        compressionComplete: false,
        uploadComplete: false,
        fileName: file.name,
      });

      try {
        let processedFile = file;

        // Compress image if it's large enough
        if (shouldCompress(file)) {
          setCompressionProgress(prev => prev ? { ...prev, isCompressing: true } : null);
          
          try {
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

        const maxPerCategory = 5;
        const currentCategoryImages = categorizedImages[category];
        
        if (currentCategoryImages.length >= maxPerCategory) {
          toast({
            title: "Category full",
            description: `Maximum ${maxPerCategory} images per category`,
            variant: "destructive"
          });
          return;
        }

        const newCategoryImages = [...currentCategoryImages, processedFile].slice(0, maxPerCategory);
        
        const updatedCategorized = {
          ...categorizedImages,
          [category]: newCategoryImages
        };
        setCategorizedImages(updatedCategorized);

        // Convert back to flat array for parent component
        const allImages = Object.values(updatedCategorized).flat();
        onImagesChange(allImages.slice(0, maxImages));

        // Clear progress after a delay
        setTimeout(() => {
          setCompressionProgress(null);
        }, 2000);

      } catch (error) {
        console.error('File processing error:', error);
        setCompressionProgress(prev => prev ? {
          ...prev,
          isCompressing: false,
          isUploading: false,
          error: 'Processing failed'
        } : null);
        
        setTimeout(() => {
          setCompressionProgress(null);
        }, 3000);
      }
    }
  };

  const removeCategorizedImage = (category: keyof CategorizedImages, index: number) => {
    const newCategoryImages = categorizedImages[category].filter((_, i) => i !== index);
    const updatedCategorized = {
      ...categorizedImages,
      [category]: newCategoryImages
    };
    setCategorizedImages(updatedCategorized);

    // Convert back to flat array for parent component
    const allImages = Object.values(updatedCategorized).flat();
    onImagesChange(allImages.slice(0, maxImages));
  };

  const handleCategorizedUploadClick = (category: keyof CategorizedImages) => {
    fileInputRefs.current[category]?.click();
  };

  const getImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const getTotalCategorizedImages = () => {
    return Object.values(categorizedImages).reduce((total, categoryImages) => total + categoryImages.length, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header with total count */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Add Property Images by Category</h3>
        <p className="text-sm text-muted-foreground">
          Upload images for different areas of your property. All categories are optional.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-sm">
            Total Images: {getTotalCategorizedImages()}
          </Badge>
          <Badge variant={getTotalCategorizedImages() >= minImages ? "default" : "destructive"} className="text-sm">
            Minimum: {minImages}
          </Badge>
        </div>
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const categoryImages = categorizedImages[category.key];
          const IconComponent = category.icon;
          const maxPerCategory = 5;
          
          return (
            <Card key={category.key} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  {category.label}
                  <Badge variant="outline" className="ml-auto">
                    {categoryImages.length}/{maxPerCategory}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Upload area when no images */}
                {categoryImages.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => handleCategorizedUploadClick(category.key)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-muted/50 rounded-full p-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Add {category.label.toLowerCase()} photos</p>
                    </div>
                  </div>
                )}

                {/* Image grid */}
                {categoryImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {categoryImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={getImagePreview(image)}
                            alt={`${category.label} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeCategorizedImage(category.key, index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {/* Add more button */}
                    {categoryImages.length < maxPerCategory && (
                      <div
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center space-y-1 transition-colors"
                        onClick={() => handleCategorizedUploadClick(category.key)}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground text-center">
                          Add more
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload button for categories with images */}
                {categoryImages.length > 0 && categoryImages.length < maxPerCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleCategorizedUploadClick(category.key)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add More {category.label} Photos
                  </Button>
                )}

                {/* Hidden file input */}
                <input
                  ref={(el) => fileInputRefs.current[category.key] = el}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleCategorizedFileSelect(e, category.key)}
                  className="hidden"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upload guidelines */}
      <div className="text-sm text-muted-foreground space-y-1 bg-muted/50 p-4 rounded-lg">
        <p>• Upload high-quality images (JPEG, PNG)</p>
        <p>• Maximum file size: 5MB per image</p>
        <p>• Up to 5 images per category</p>
        <p>• Minimum {minImages} total images required</p>
        <p>• All categories are optional - add images where relevant</p>
      </div>

      {/* Warning if minimum not met */}
      {getTotalCategorizedImages() < minImages && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
          <p className="text-sm text-destructive font-medium">
            Please upload at least {minImages - getTotalCategorizedImages()} more image(s) to continue
          </p>
        </div>
      )}
    </div>
  );
};