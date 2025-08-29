import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { compressImage, shouldCompress } from '@/utils/imageCompression';
import { ImageCompressionProgress } from '@/components/ui/image-compression-progress';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  existingImages?: string[];
  onImageRemoved?: (url: string) => void;
  maxImages?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  existingImages = [],
  onImageRemoved,
  maxImages = 10,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
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
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setCompressionProgress({
      isCompressing: false,
      isUploading: false,
      compressionComplete: false,
      uploadComplete: false,
      fileName: file.name,
    });

    try {
      let fileToUpload = file;

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
          
          fileToUpload = compressionResult.compressedFile;
          
          setCompressionProgress(prev => prev ? {
            ...prev,
            isCompressing: false,
            compressionComplete: true,
            originalSize: compressionResult.originalSize,
            compressedSize: compressionResult.compressedSize,
            compressionRatio: compressionResult.compressionRatio
          } : null);
        } catch (compressionError) {
          console.error('Compression error:', compressionError);
          // Continue with original file if compression fails
          setCompressionProgress(prev => prev ? {
            ...prev,
            isCompressing: false,
            compressionComplete: true,
            error: 'Compression failed, uploading original'
          } : null);
        }
      } else {
        setCompressionProgress(prev => prev ? {
          ...prev,
          compressionComplete: true,
          originalSize: file.size,
          compressedSize: file.size,
          compressionRatio: 0
        } : null);
      }

      // Start upload
      setCompressionProgress(prev => prev ? { ...prev, isUploading: true } : null);

      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `content-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-media')
        .upload(filePath, fileToUpload);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-media')
        .getPublicUrl(filePath);

      setCompressionProgress(prev => prev ? { ...prev, isUploading: false, uploadComplete: true } : null);

      onImageUploaded(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });

      // Clear progress after a delay
      setTimeout(() => {
        setCompressionProgress(null);
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setCompressionProgress(prev => prev ? {
        ...prev,
        isCompressing: false,
        isUploading: false,
        error: 'Upload failed'
      } : null);
      
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      
      setTimeout(() => {
        setCompressionProgress(null);
      }, 5000);
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploading || existingImages.length >= maxImages}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              {uploading ? (
                "Uploading..."
              ) : existingImages.length >= maxImages ? (
                `Maximum ${maxImages} images reached`
              ) : (
                <>
                  <span className="font-medium">Click to upload</span> or drag and drop
                  <br />
                  PNG, JPG, GIF up to 5MB
                </>
              )}
            </div>
          </label>
        </div>
      </Card>

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

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {existingImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img
                  src={imageUrl}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5TDEzLjA5IDEwLjI2TDE1IDkuMzRWMTNINVY5SDEyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                  }}
                />
              </div>
              {onImageRemoved && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onImageRemoved(imageUrl)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
