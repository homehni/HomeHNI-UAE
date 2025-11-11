interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export const compressImage = (
  file: File, 
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 0.8,
      maxSizeKB = 800
    } = options;

    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels until we get under the size limit
      let currentQuality = quality;
      let compressedFile: File | null = null;

      const tryCompress = (q: number) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });

              const sizeKB = newFile.size / 1024;
              
              if (sizeKB <= maxSizeKB || q <= 0.3) {
                // Either we're under the limit or we've reduced quality as much as we can
                const compressionRatio = ((file.size - newFile.size) / file.size) * 100;
                
                resolve({
                  compressedFile: newFile,
                  originalSize: file.size,
                  compressedSize: newFile.size,
                  compressionRatio: Math.round(compressionRatio)
                });
              } else {
                // Try with lower quality
                tryCompress(q - 0.1);
              }
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          q
        );
      };

      tryCompress(currentQuality);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const shouldCompress = (file: File): boolean => {
  const sizeKB = file.size / 1024;
  return sizeKB > 300; // Only compress files larger than 300KB
};
