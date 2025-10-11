import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { sendWelcomeEmail, sendUserRegistrationAdminAlert } from '@/services/emailService';

export function useUserRegistrationAlerts() {
  const { settings } = useSettings();

  useEffect(() => {
    // Subscribe to new profiles and send a welcome/alert email when enabled
    const channel = supabase
      .channel('user-registration-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, async (payload: { new: { email?: string; full_name?: string } }) => {
        if (!settings.notify_user_registration) return;
        try {
          const email = payload.new?.email;
          const name = payload.new?.full_name || 'there';
          if (email) {
            await sendWelcomeEmail(email, name);
            // Also notify admin if an admin email is configured
            if (settings.admin_email) {
              await sendUserRegistrationAdminAlert(settings.admin_email, email, name);
            }
          }
        } catch (e) {
          console.warn('Failed to send registration alert email:', e);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [settings.notify_user_registration, settings.admin_email]);
}
