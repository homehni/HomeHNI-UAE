import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize } from '@/utils/imageCompression';

interface ImageCompressionProgressProps {
  isCompressing: boolean;
  isUploading: boolean;
  compressionComplete: boolean;
  uploadComplete: boolean;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
  fileName: string;
  error?: string;
}

export const ImageCompressionProgress: React.FC<ImageCompressionProgressProps> = ({
  isCompressing,
  isUploading,
  compressionComplete,
  uploadComplete,
  originalSize,
  compressedSize,
  compressionRatio,
  fileName,
  error
}) => {
  const getStatus = () => {
    if (error) return { text: 'Error occurred', icon: AlertCircle, color: 'text-destructive' };
    if (uploadComplete) return { text: 'Upload complete', icon: CheckCircle, color: 'text-green-600' };
    if (isUploading) return { text: 'Uploading...', icon: Loader2, color: 'text-blue-600' };
    if (compressionComplete) return { text: 'Compression complete', icon: CheckCircle, color: 'text-green-600' };
    if (isCompressing) return { text: 'Compressing image...', icon: Loader2, color: 'text-blue-600' };
    return { text: 'Processing...', icon: Loader2, color: 'text-gray-600' };
  };

  const getProgress = () => {
    if (error) return 0;
    if (uploadComplete) return 100;
    if (isUploading) return 80;
    if (compressionComplete) return 60;
    if (isCompressing) return 30;
    return 10;
  };

  const status = getStatus();
  const StatusIcon = status.icon;
  const progress = getProgress();

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-3">
        <StatusIcon 
          className={`h-4 w-4 ${status.color} ${
            (isCompressing || isUploading) && !error ? 'animate-spin' : ''
          }`} 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground truncate" title={fileName}>
              {fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName}
            </p>
            {uploadComplete && (
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            )}
          </div>
          <p className={`text-xs ${status.color}`}>
            {status.text}
          </p>
        </div>
      </div>

      <Progress value={progress} className="h-1.5" />

      {compressionComplete && originalSize && compressedSize && (
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Original:</span>
            <span className="ml-1 font-medium">{formatFileSize(originalSize)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Compressed:</span>
            <span className="ml-1 font-medium text-green-600">
              {formatFileSize(compressedSize)} ({compressionRatio}% smaller)
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
};
