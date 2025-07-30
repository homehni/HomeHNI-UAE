import { supabase } from '@/integrations/supabase/client';

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
    
    const { data, error } = await supabase.storage
      .from('property-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

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