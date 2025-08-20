import React, { useRef, useState } from 'react';
import { Upload, X, Camera, Home, Bath, Bed, ChefHat, Eye, Building2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  minImages,
  onUploadClick
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [activeTab, setActiveTab] = useState<'simple' | 'categorized'>('simple');
  
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    const newImages = [...images, ...validFiles].slice(0, maxImages);
    onImagesChange(newImages);
  };

  const handleCategorizedFileSelect = (event: React.ChangeEvent<HTMLInputElement>, category: keyof CategorizedImages) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    const maxPerCategory = 5;
    const currentCategoryImages = categorizedImages[category];
    const newCategoryImages = [...currentCategoryImages, ...validFiles].slice(0, maxPerCategory);
    
    const updatedCategorized = {
      ...categorizedImages,
      [category]: newCategoryImages
    };
    setCategorizedImages(updatedCategorized);

    // Convert back to flat array for parent component
    const allImages = Object.values(updatedCategorized).flat();
    onImagesChange(allImages.slice(0, maxImages));
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
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

  const handleUploadClick = () => {
    if (onUploadClick) {
      onUploadClick();
    } else {
      fileInputRef.current?.click();
    }
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
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'simple' | 'categorized')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simple Upload</TabsTrigger>
          <TabsTrigger value="categorized">Upload by Category</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-4">
          {/* Simple Upload - Original Implementation */}
          {images.length === 0 && (
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={handleUploadClick}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="bg-muted/50 rounded-full p-4">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Add photos to get 5X more responses.</p>
                  <p className="text-muted-foreground">90% tenants contact on properties with photos.</p>
                </div>
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                Upload Images * (Min {minImages}, Max {maxImages})
              </Label>
              <span className="text-sm text-muted-foreground">
                {images.length}/{maxImages}
              </span>
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-border">
                    <img
                      src={getImagePreview(image)}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {images.length < maxImages && (
                <div
                  className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center space-y-2 transition-colors"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground text-center">
                    Add more
                  </span>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </TabsContent>

        <TabsContent value="categorized" className="space-y-6">
          {/* Categorized Upload */}
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

          {getTotalCategorizedImages() < minImages && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
              <p className="text-sm text-destructive font-medium">
                Please upload at least {minImages - getTotalCategorizedImages()} more image(s) to continue
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground">
        <p>• Upload high-quality images (JPEG, PNG)</p>
        <p>• Maximum file size: 5MB per image</p>
        <p>• Minimum {minImages} images required</p>
      </div>
    </div>
  );
};