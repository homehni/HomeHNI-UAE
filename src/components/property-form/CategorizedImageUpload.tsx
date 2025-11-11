import React, { useRef, useState } from 'react';
import { Upload, X, Camera, Home, Bath, Bed, ChefHat, Eye, Building2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CategorizedImages {
  bathroom: File[];
  bedroom: File[];
  hall: File[];
  kitchen: File[];
  frontView: File[];
  balcony: File[];
  others: File[];
}

interface CategorizedImageUploadProps {
  images: CategorizedImages;
  onImagesChange: (images: CategorizedImages) => void;
  maxImagesPerCategory?: number;
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

export const CategorizedImageUpload: React.FC<CategorizedImageUploadProps> = ({
  images,
  onImagesChange,
  maxImagesPerCategory = 5
}) => {
  const { toast } = useToast();
  console.log('📸 CategorizedImageUpload rendered with images:', images);
  console.log('📸 CategorizedImageUpload images type check:', {
    bathroom: Array.isArray(images.bathroom),
    bedroom: Array.isArray(images.bedroom),
    hall: Array.isArray(images.hall),
    kitchen: Array.isArray(images.kitchen),
    frontView: Array.isArray(images.frontView),
    balcony: Array.isArray(images.balcony),
    others: Array.isArray(images.others)
  });
  console.log('📸 CategorizedImageUpload bathroom content:', images.bathroom);
  console.log('📸 CategorizedImageUpload bathroom item type:', typeof images.bathroom[0]);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  // Cache object URLs to avoid memory leaks on mobile; revoke on cleanup
  const objectUrlMapRef = useRef<Map<File, string>>(new Map());
  const [activeCategory, setActiveCategory] = useState<keyof CategorizedImages | null>(null);
  const getTotalImages = () => {
    return Object.values(images).reduce((total, categoryImages) => total + categoryImages.length, 0);
  };

  // Revoke object URLs for files that were removed to prevent memory leaks
  React.useEffect(() => {
    const currentFiles = new Set<File>(
      Object.values(images).flat()
    );
    for (const [file, url] of objectUrlMapRef.current.entries()) {
      if (!currentFiles.has(file)) {
        URL.revokeObjectURL(url);
        objectUrlMapRef.current.delete(file);
      }
    }
    return () => {
      for (const [, url] of objectUrlMapRef.current.entries()) {
        URL.revokeObjectURL(url);
      }
      objectUrlMapRef.current.clear();
    };
  }, [images]);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, category: keyof CategorizedImages) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    const currentCategoryImages = images[category];
    
    // Check for duplicates based on file name and size
    const uniqueFiles = validFiles.filter(newFile => {
      const isDuplicate = currentCategoryImages.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      );
      if (isDuplicate) {
        toast({
          title: "Duplicate Image",
          description: "This image has already been uploaded. Please choose a different image.",
          variant: "destructive",
        });
      }
      return !isDuplicate;
    });

    if (uniqueFiles.length === 0 && validFiles.length > 0) {
      return; // All files were duplicates
    }

    const newCategoryImages = [...currentCategoryImages, ...uniqueFiles].slice(0, maxImagesPerCategory);
    
    onImagesChange({
      ...images,
      [category]: newCategoryImages
    });
  };

  const removeImage = (category: keyof CategorizedImages, index: number) => {
    const fileToRemove = images[category][index];
    // Revoke any cached object URL for this file
    const cachedUrl = objectUrlMapRef.current.get(fileToRemove);
    if (cachedUrl) {
      URL.revokeObjectURL(cachedUrl);
      objectUrlMapRef.current.delete(fileToRemove);
    }
    const newCategoryImages = images[category].filter((_, i) => i !== index);
    onImagesChange({
      ...images,
      [category]: newCategoryImages
    });
  };
  const handleUploadClick = (category: keyof CategorizedImages) => {
    fileInputRefs.current[category]?.click();
  };

  const getImagePreview = (file: File): string => {
    let url = objectUrlMapRef.current.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      objectUrlMapRef.current.set(file, url);
    }
    return url;
  };
  return (
    <div className="space-y-6">

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const categoryImages = images[category.key];
          const IconComponent = category.icon;
          
          return (
            <Card key={category.key} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  {category.label}
                  <Badge variant="outline" className="ml-auto">
                    {categoryImages.length}/{maxImagesPerCategory}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Upload area when no images */}
                {categoryImages.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => handleUploadClick(category.key)}
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
                          onClick={() => removeImage(category.key, index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {/* Add more button */}
                    {categoryImages.length < maxImagesPerCategory && (
                      <div
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center space-y-1 transition-colors"
                        onClick={() => handleUploadClick(category.key)}
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
                {categoryImages.length > 0 && categoryImages.length < maxImagesPerCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleUploadClick(category.key)}
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
                  onChange={(e) => {
                    handleFileSelect(e, category.key);
                    // Reset to allow picking the same file again on mobile
                    e.currentTarget.value = '';
                  }}
                  className="hidden"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
};
