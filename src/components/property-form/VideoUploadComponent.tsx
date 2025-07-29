import { useState, useCallback } from 'react';
import { Upload, X, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface VideoUploadComponentProps {
  videos: string[];
  onVideosChange: (videos: string[]) => void;
  maxVideos?: number;
}

export const VideoUploadComponent = ({ 
  videos, 
  onVideosChange, 
  maxVideos = 3 
}: VideoUploadComponentProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user?.id) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/videos/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('property-media')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('property-media')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || !user?.id) return;

    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (videos.length + fileArray.length > maxVideos) {
      toast.error(`Maximum ${maxVideos} videos allowed`);
      return;
    }

    // Validate file types and sizes
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a valid video file`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(`${file.name} is too large. Maximum size is 50MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        const url = await uploadFile(file);
        if (url) {
          uploadedUrls.push(url);
        }
        setUploadProgress(((i + 1) / validFiles.length) * 100);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    onVideosChange([...videos, ...uploadedUrls]);
    setUploading(false);
    setUploadProgress(0);

    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} video(s) uploaded successfully`);
    }
  }, [videos, onVideosChange, maxVideos, user?.id]);

  const removeVideo = (indexToRemove: number) => {
    const newVideos = videos.filter((_, index) => index !== indexToRemove);
    onVideosChange(newVideos);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Property Videos (Optional)
        </label>
        <span className="text-xs text-muted-foreground">
          {videos.length}/{maxVideos} videos
        </span>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('video-upload')?.click()}
      >
        <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Drop videos here or click to select
        </p>
        <p className="text-xs text-muted-foreground">
          MP4, WebM, MOV up to 50MB each
        </p>
        <input
          id="video-upload"
          type="file"
          multiple
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
          disabled={uploading}
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Uploading...</span>
            <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Video Preview Grid */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((videoUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeVideo(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};