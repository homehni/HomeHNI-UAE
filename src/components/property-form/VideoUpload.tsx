import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Video, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VideoUploadProps {
  video: File | undefined;
  onVideoChange: (video: File | undefined) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  onVideoChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate preview URL when video changes
  useEffect(() => {
    if (video) {
      try {
        const url = URL.createObjectURL(video);
        setVideoPreviewUrl(url);
        setPreviewError(null);
        
        // Clean up the URL when component unmounts or video changes
        return () => {
          URL.revokeObjectURL(url);
          setVideoPreviewUrl(null);
        };
      } catch (error) {
        console.error('Error creating video preview:', error);
        setPreviewError('Failed to create video preview');
      }
    } else {
      setVideoPreviewUrl(null);
    }
  }, [video]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isVideo) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file (MP4, MOV, AVI)",
          variant: "destructive",
        });
        setIsLoading(false);
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      if (!isValidSize) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const errorMessage = `File size (${fileSizeMB} MB) exceeds the 5MB limit. Please choose a smaller video.`;
        setSizeError(errorMessage);
        toast({
          title: "File too large",
          description: "Please choose a video smaller than 5MB",
          variant: "destructive",
        });
        setIsLoading(false);
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Clear any previous errors
      setSizeError(null);
      onVideoChange(file);
      
      // Loading will be set to false when the video loads in the UI
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const removeVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl(null);
    setPreviewError(null);
    onVideoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVideoError = () => {
    setPreviewError('Failed to load video preview');
    console.error('Video preview failed to load');
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Upload Video (Optional)</Label>

      {sizeError && (
        <Alert variant="destructive" className="py-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm font-medium">
              {sizeError}
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      {previewError && !sizeError && (
        <Alert variant="destructive" className="py-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm font-medium">
              {previewError}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {isLoading && (
        <div className="h-48 rounded-lg border-2 border-border bg-muted/20 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
          <span className="text-lg font-medium">Loading video preview...</span>
        </div>
      )}

      {!isLoading && video && videoPreviewUrl ? (
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden border-2 border-border bg-black">
            <video
              ref={videoRef}
              src={videoPreviewUrl}
              className="w-full h-full object-contain"
              controls
              onError={handleVideoError}
              onLoadedData={() => setIsLoading(false)}
              preload="metadata"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 shadow-md"
            onClick={removeVideo}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            {video.name} ({(video.size / (1024 * 1024)).toFixed(1)} MB)
          </div>
        </div>
      ) : !isLoading && (
        <div
          className={`h-48 rounded-lg border-2 border-dashed ${
            sizeError ? 'border-destructive' : 'border-muted-foreground hover:border-primary'
          } transition-colors cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Video className={`h-12 w-12 mb-4 ${sizeError ? 'text-destructive' : ''}`} />
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
        <p className={sizeError ? "font-bold text-destructive" : ""}>• Maximum file size: 5MB</p>
        <p>• Videos help buyers get a better view of your property</p>
      </div>
    </div>
  );
};