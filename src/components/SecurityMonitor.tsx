import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface SecurityEvent {
  id: string;
  event_type: 'property_status_change' | 'role_assignment' | 'failed_login' | 'suspicious_activity';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  user_id?: string;
  metadata?: any;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  pendingReviews: number;
  lastUpdate: string;
}

/**
 * Security monitoring dashboard for admins to track security events and audit logs
 */
export const SecurityMonitor: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityStats, setSecurityStats] = useState<SecurityStats>({
    totalEvents: 0,
    criticalEvents: 0,
    pendingReviews: 0,
    lastUpdate: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  // Only show to admins
  if (!isAdmin) {
    return null;
  }

  useEffect(() => {
    loadSecurityData();
    
    // Set up real-time subscription for security events
    const channel = supabase.channel('security-events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'property_audit_log' }, 
        () => {
          loadSecurityData();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_role_audit_log' }, 
        () => {
          loadSecurityData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Load property audit logs
      const { data: propertyLogs, error: propertyError } = await supabase
        .from('property_audit_log')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(10);

      if (propertyError) throw propertyError;

      // Load user role audit logs
      const { data: roleLogs, error: roleError } = await supabase
        .from('user_role_audit_log')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(10);

      if (roleError) throw roleError;

      // Transform audit logs into security events
      const propertyEvents: SecurityEvent[] = (propertyLogs || []).map(log => ({
        id: log.id,
        event_type: 'property_status_change' as const,
        description: `Property status changed from ${log.old_status} to ${log.new_status}`,
        severity: log.new_status === 'approved' ? 'low' : 'medium' as const,
        timestamp: log.changed_at,
        user_id: log.changed_by,
        metadata: { property_id: log.property_id, reason: log.reason }
      }));

      const roleEvents: SecurityEvent[] = (roleLogs || []).map(log => ({
        id: log.id,
        event_type: 'role_assignment' as const,
        description: `User role changed from ${log.old_role || 'none'} to ${log.new_role}`,
        severity: log.new_role === 'admin' ? 'critical' : 'medium' as const,
        timestamp: log.changed_at,
        user_id: log.changed_by,
        metadata: { target_user: log.user_id, reason: log.reason }
      }));

      const allEvents = [...propertyEvents, ...roleEvents]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20);

      setSecurityEvents(allEvents);

      // Calculate stats
      const criticalEvents = allEvents.filter(e => e.severity === 'critical').length;
      
      setSecurityStats({
        totalEvents: allEvents.length,
        criticalEvents,
        pendingReviews: criticalEvents, // Assuming critical events need review
        lastUpdate: new Date().toISOString()
      });

    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive', 
      medium: 'default',
      low: 'secondary'
    } as const;

    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'secondary'}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Activity className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{securityStats.totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Events</p>
                <p className="text-2xl font-bold text-red-500">{securityStats.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold text-orange-500">{securityStats.pendingReviews}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {securityStats.criticalEvents > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription>
            {securityStats.criticalEvents} critical security event(s) require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Latest security events and audit logs from system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No security events recorded</p>
              </div>
            ) : (
              securityEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="mt-1">
                    {getSeverityIcon(event.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{event.description}</p>
                      {getSeverityBadge(event.severity)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Type: {event.event_type.replace('_', ' ')}</span>
                      <span>Time: {new Date(event.timestamp).toLocaleString()}</span>
                      {event.user_id && <span>User: {event.user_id.substring(0, 8)}...</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};