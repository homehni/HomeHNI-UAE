import { supabase } from '@/integrations/supabase/client';
import { mapPropertyType } from '@/utils/propertyMappings';

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
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${folder}/${Date.now()}_${index}.${fileExt}`;
    
const { data, error } = await uploadWithRetry(
      'property-media',
      fileName,
      file,
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
    const fileExt = file.name.split('.').pop();
    const unique = `${Date.now()}_${index}${userId ? `_${userId.slice(0, 8)}` : ''}.${fileExt}`;
    const path = `${basePath}/${unique}`;

const { error } = await uploadWithRetry(
      'property-media',
      path,
      file,
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