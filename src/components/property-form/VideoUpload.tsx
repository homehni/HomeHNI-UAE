import React, { useRef } from 'react';
import { Upload, X, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface VideoUploadProps {
  video: File | undefined;
  onVideoChange: (video: File | undefined) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  onVideoChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (isVideo && isValidSize) {
        onVideoChange(file);
      }
    }
  };

  const removeVideo = () => {
    onVideoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getVideoPreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Upload Video (Optional)</Label>

      {video ? (
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden border-2 border-border">
            <video
              src={getVideoPreview(video)}
              className="w-full h-full object-cover"
              controls
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeVideo}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            {video.name} ({(video.size / (1024 * 1024)).toFixed(1)} MB)
          </div>
        </div>
      ) : (
        <div
          className="h-48 rounded-lg border-2 border-dashed border-muted-foreground hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <Video className="h-12 w-12 mb-4" />
          <span className="text-lg font-medium mb-2">Upload Property Video</span>
          <span className="text-sm text-center">Click to browse or drag and drop</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-sm text-muted-foreground">
        <p>• Upload property walkthrough video (MP4, MOV, AVI)</p>
        <p>• Maximum file size: 50MB</p>
        <p>• Videos help buyers get a better view of your property</p>
      </div>
    </div>
  );
};