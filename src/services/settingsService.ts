import { supabase } from '@/integrations/supabase/client';

// Basic JSON type compatible with Supabase typed client
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type SettingKey =
  | 'site_name'
  | 'admin_email'
  | 'maintenance_mode'
  | 'auto_approve_properties'
  | 'notify_user_registration';

export async function getSetting<T = unknown>(key: SettingKey): Promise<T | null> {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) {
    console.warn('getSetting error', key, error);
    return null;
  }
  return (data?.value as T) ?? null;
}

export async function setSetting<T extends Json>(key: SettingKey, value: T): Promise<boolean> {
  const { error } = await supabase
    .from('platform_settings')
    .upsert([{ key, value: value as Json }], { onConflict: 'key' });
  if (error) {
    console.error('setSetting error', key, error);
    return false;
  }
  return true;
}

export async function getSettingsMap(keys: SettingKey[]): Promise<Record<SettingKey, Json | undefined>> {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('key, value')
    .in('key', keys);
  if (error) {
    console.warn('getSettingsMap error', error);
    return {} as Record<SettingKey, Json | undefined>;
  }
  const map = {} as Record<SettingKey, Json | undefined>;
  for (const row of data || []) {
    map[row.key as SettingKey] = row.value;
  }
  return map;
}