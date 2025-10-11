import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { settings: globalSettings, set: setGlobalSetting, refresh } = useSettings();
  
  useEffect(() => {
    // Set up real-time subscription for platform settings
    const channel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_settings'
        },
        () => {
          // Refetch settings when they change
          toast({
            title: 'Settings Updated',
            description: 'Settings have been updated by another admin',
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Local editable state (seeded from global settings)
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      newPropertyAlerts: true,
      userRegistrationAlerts: false,
      dailyReports: true,
    },
    general: {
      siteName: globalSettings.site_name || 'HomeHNI',
      adminEmail: globalSettings.admin_email || 'admin@homehni.com',
      maintenanceMode: Boolean(globalSettings.maintenance_mode),
      autoApproveProperties: Boolean(globalSettings.auto_approve_properties),
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
    }
  });

  // Keep local UI state in sync when global settings load/change
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        siteName: globalSettings.site_name || prev.general.siteName,
        adminEmail: globalSettings.admin_email || prev.general.adminEmail,
        maintenanceMode: Boolean(globalSettings.maintenance_mode),
        autoApproveProperties: Boolean(globalSettings.auto_approve_properties),
      }
    }));
  }, [globalSettings.site_name, globalSettings.admin_email, globalSettings.maintenance_mode, globalSettings.auto_approve_properties]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Persist platform settings
      await Promise.all([
        setGlobalSetting('maintenance_mode', settings.general.maintenanceMode),
        setGlobalSetting('auto_approve_properties', settings.general.autoApproveProperties),
        setGlobalSetting('site_name', settings.general.siteName),
        setGlobalSetting('admin_email', settings.general.adminEmail),
        setGlobalSetting('notify_user_registration', settings.notifications.userRegistrationAlerts),
      ]);
      await refresh();
      
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (section: 'notifications' | 'general' | 'security', key: string, value: boolean | string | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Settings</h1>
        <p className="text-muted-foreground">Configure system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.general.siteName}
                onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.general.adminEmail}
                onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable public access
                </p>
              </div>
              <Switch
                checked={settings.general.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve Properties</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve new listings
                </p>
              </div>
              <Switch
                checked={settings.general.autoApproveProperties}
                onCheckedChange={(checked) => updateSetting('general', 'autoApproveProperties', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications
                </p>
              </div>
              <Switch
                checked={settings.notifications.emailAlerts}
                onCheckedChange={(checked) => updateSetting('notifications', 'emailAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Property Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alert when properties are submitted
                </p>
              </div>
              <Switch
                checked={settings.notifications.newPropertyAlerts}
                onCheckedChange={(checked) => updateSetting('notifications', 'newPropertyAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alert when users register
                </p>
              </div>
              <Switch
                checked={settings.notifications.userRegistrationAlerts}
                onCheckedChange={(checked) => updateSetting('notifications', 'userRegistrationAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily activity reports
                </p>
              </div>
              <Switch
                checked={settings.notifications.dailyReports}
                onCheckedChange={(checked) => updateSetting('notifications', 'dailyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Enhanced security for admin login
                </p>
              </div>
              <Switch
                checked={settings.security.twoFactorAuth}
                onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
              />
            </div>

            <div className="pt-4">
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Security Status: Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Application Version</Label>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Database Status</Label>
              <Badge variant="default" className="text-xs">
                <Database className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={loading} className="min-w-32">
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;