import React, { useRef, useState } from 'react';
import { Upload, X, Camera, Home, Bath, Bed, ChefHat, Eye, Building2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  minTotalImages?: number;
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
  maxImagesPerCategory = 5,
  minTotalImages = 3
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [activeCategory, setActiveCategory] = useState<keyof CategorizedImages | null>(null);

  const getTotalImages = () => {
    return Object.values(images).reduce((total, categoryImages) => total + categoryImages.length, 0);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, category: keyof CategorizedImages) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    const currentCategoryImages = images[category];
    const newCategoryImages = [...currentCategoryImages, ...validFiles].slice(0, maxImagesPerCategory);
    
    onImagesChange({
      ...images,
      [category]: newCategoryImages
    });
  };

  const removeImage = (category: keyof CategorizedImages, index: number) => {
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
    return URL.createObjectURL(file);
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
            Total Images: {getTotalImages()}
          </Badge>
          <Badge variant={getTotalImages() >= minTotalImages ? "default" : "destructive"} className="text-sm">
            Minimum: {minTotalImages}
          </Badge>
        </div>
      </div>

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
                  onChange={(e) => handleFileSelect(e, category.key)}
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
        <p>• Up to {maxImagesPerCategory} images per category</p>
        <p>• Minimum {minTotalImages} total images required</p>
        <p>• All categories are optional - add images where relevant</p>
      </div>

      {/* Warning if minimum not met */}
      {getTotalImages() < minTotalImages && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
          <p className="text-sm text-destructive font-medium">
            Please upload at least {minTotalImages - getTotalImages()} more image(s) to continue
          </p>
        </div>
      )}
    </div>
  );
};