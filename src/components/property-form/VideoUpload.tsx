import React, { useRef, useEffect, useState } from 'react';
import { Upload, X, Video, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadProps {
  video: File | undefined;
  onVideoChange: (video: File | undefined) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  onVideoChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Create and cleanup object URL when video changes
  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoUrl(url);
      
      // Cleanup function to revoke object URL
      return () => {
        URL.revokeObjectURL(url);
        setVideoUrl('');
      };
    } else {
      setVideoUrl('');
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
          title: "Invalid File Type",
          description: "Please upload a valid video file (MP4, MOV, AVI)",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: "Please choose a video file smaller than 5MB",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      onVideoChange(file);
      toast({
        title: "Video Uploaded Successfully",
        description: "Your property video is ready for preview",
      });
      setIsLoading(false);
    }
  };

  const removeVideo = () => {
    onVideoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Upload Video (Optional)</Label>

      {video && videoUrl ? (
        <div className="relative bg-background rounded-lg border-2 border-border">
          <div className="aspect-video rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              className="w-full h-full object-cover bg-muted"
              controls
              preload="metadata"
              onError={() => {
                toast({
                  title: "Video Error",
                  description: "Unable to preview video. Please try uploading again.",
                  variant: "destructive"
                });
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 shadow-lg"
            onClick={removeVideo}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
          <div className="p-3 bg-muted/50 rounded-b-lg">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Play className="h-4 w-4 text-primary" />
              <span className="font-medium">{video.name}</span>
              <span className="text-muted-foreground">
                ({(video.size / (1024 * 1024)).toFixed(1)} MB)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Video preview ready - Use controls to play/pause
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`h-48 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
            isLoading
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-muted-foreground hover:border-primary text-muted-foreground hover:text-primary'
          }`}
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          <Video className={`h-12 w-12 mb-4 ${isLoading ? 'animate-pulse' : ''}`} />
          <span className="text-lg font-medium mb-2">
            {isLoading ? 'Processing Video...' : 'Upload Property Video'}
          </span>
          <span className="text-sm text-center">
            {isLoading ? 'Please wait...' : 'Click to browse or drag and drop'}
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/mov,video/avi,video/quicktime"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Upload property walkthrough video (MP4, MOV, AVI)</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Videos help buyers get a better view of your property</p>
      </div>
    </div>
  );
};