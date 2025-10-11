/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSettingsMap, setSetting, type SettingKey } from '@/services/settingsService';

type SettingsState = {
  maintenance_mode: boolean;
  auto_approve_properties: boolean;
  site_name?: string;
  admin_email?: string;
  notify_user_registration?: boolean;
};

type SettingsContextValue = {
  settings: SettingsState;
  loading: boolean;
  refresh: () => Promise<void>;
  set: (key: SettingKey, value: boolean | string) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>({
    maintenance_mode: false,
    auto_approve_properties: false,
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const map = await getSettingsMap([
      'maintenance_mode',
      'auto_approve_properties',
      'site_name',
      'admin_email',
      'notify_user_registration',
    ]);
    setSettings({
      maintenance_mode: Boolean(map['maintenance_mode']) as boolean,
      auto_approve_properties: Boolean(map['auto_approve_properties']) as boolean,
      site_name: (map['site_name'] as string) || undefined,
      admin_email: (map['admin_email'] as string) || undefined,
      notify_user_registration: Boolean(map['notify_user_registration']) as boolean,
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('platform-settings-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platform_settings' }, () => {
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const apiSet: SettingsContextValue['set'] = async (key, value) => {
    await setSetting(key, (typeof value === 'boolean' || typeof value === 'string') ? value : String(value));
    // optimistic update with explicit mapping to maintain types
    setSettings((prev) => {
      const next = { ...prev } as SettingsState;
      if (key === 'maintenance_mode') next.maintenance_mode = Boolean(value);
      else if (key === 'auto_approve_properties') next.auto_approve_properties = Boolean(value);
      else if (key === 'site_name') next.site_name = String(value);
      else if (key === 'admin_email') next.admin_email = String(value);
      if (key === 'notify_user_registration') next.notify_user_registration = Boolean(value);
      return next;
    });
  };

  const value = useMemo<SettingsContextValue>(() => ({ settings, loading, refresh: load, set: apiSet }), [settings, loading]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
