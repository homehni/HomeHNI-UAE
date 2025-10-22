import { supabase } from '@/integrations/supabase/client';
import { mapPropertyType } from '@/utils/propertyMappings';

// Image compression utility
const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Ensure a valid auth session before storage operations and retry once on "exp" errors
const uploadWithRetry = async (
  bucket: string,
  path: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
) => {
  const attempt = () =>
    supabase.storage.from(bucket).upload(path, file, options);

  // First attempt
  let { data, error } = await attempt();

  // If token expired or unauthorized due to exp claim, try to refresh and retry once
  if (error && (String(error.message || '').toLowerCase().includes('exp') || (error as any).statusCode === '403')) {
    try {
      await supabase.auth.refreshSession();
    } catch (_) {
      // ignore
    }
    ({ data, error } = await attempt());

    // If still failing with exp, clear stale session and retry as a last resort
    if (error && String(error.message || '').toLowerCase().includes('exp')) {
      try {
        await supabase.auth.signOut();
      } catch (_) {
        // ignore
      }
      ({ data, error } = await attempt());
    }
  }

  return { data, error };
};

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadFilesToStorage = async (
  files: File[], 
  folder: string,
  userId: string
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(async (file, index) => {
    // Compress image if it's an image file
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
      try {
        console.log(`🔍 Compressing image ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        fileToUpload = await compressImage(file);
        console.log(`🔍 Compressed image ${file.name} to ${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`);
      } catch (error) {
        console.warn(`Failed to compress image ${file.name}, using original:`, error);
        // Continue with original file if compression fails
      }
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${userId}/${folder}/${Date.now()}_${index}.${fileExt}`;
    
const { data, error } = await uploadWithRetry(
      'property-media',
      fileName,
      fileToUpload,
      { cacheControl: '3600', upsert: false }
    );

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-media')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      path: fileName
    };
  });

  return Promise.all(uploadPromises);
};

export const uploadSingleFile = async (
  file: File,
  folder: string,
  userId: string
): Promise<UploadResult> => {
  const results = await uploadFilesToStorage([file], folder, userId);
  return results[0];
};

// Upload property images into typed folders under content-images/<type>
// type is derived from property type: e.g., apartment, villa, independent_house -> independent-house
const propertyTypeToFolderSlug = (propertyTypeRaw: string): string => {
  if (!propertyTypeRaw) return 'misc';
  const mapped = mapPropertyType(propertyTypeRaw); // e.g., independent_house
  return mapped.replace(/_/g, '-');
};

export const uploadPropertyImagesByType = async (
  files: File[],
  propertyTypeRaw: string,
  userId?: string
): Promise<UploadResult[]> => {
  const typeSlug = propertyTypeToFolderSlug(propertyTypeRaw);
  const basePath = `content-images/${typeSlug}`;

  const uploadPromises = files.map(async (file, index) => {
    // Compress image if it's an image file
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
      try {
        console.log(`🔍 Compressing property image ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        fileToUpload = await compressImage(file);
        console.log(`🔍 Compressed property image ${file.name} to ${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`);
      } catch (error) {
        console.warn(`Failed to compress property image ${file.name}, using original:`, error);
        // Continue with original file if compression fails
      }
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const unique = `${Date.now()}_${index}${userId ? `_${userId.slice(0, 8)}` : ''}.${fileExt}`;
    const path = `${basePath}/${unique}`;

const { error } = await uploadWithRetry(
      'property-media',
      path,
      fileToUpload,
      { cacheControl: '3600', upsert: false }
    );

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('property-media')
      .getPublicUrl(path);

    return { url: publicUrl, path };
  });

  return Promise.all(uploadPromises);
};