import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { AuditTestPanel } from '@/components/admin/AuditTestPanel';
import { AlertTriangle, User, FileText, Settings, Eye, Download } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  userRole: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const AdminAudit: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(auditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Load initial audit logs from database
  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      
      // Fetch audit logs
      const { data: auditData, error: auditError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (auditError) throw auditError;

      // Transform database logs to component format
      const logs: AuditLog[] = await Promise.all(
        (auditData || []).map(async (log) => {
          let userEmail = 'System';
          let userRole = 'system';

          // Try to get user email from auth.users if user_id exists
          if (log.user_id) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('user_id', log.user_id)
                .single();
              
              if (profile?.full_name) {
                userEmail = profile.full_name;
              }

              // Get user role
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', log.user_id)
                .single();
              
              if (roleData?.role) {
                userRole = roleData.role;
              }
            } catch (error) {
              console.warn('Could not fetch user details:', error);
            }
          }

          // Determine severity based on action
          let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
          
          if (log.action.toLowerCase().includes('deleted') || 
              log.action.toLowerCase().includes('failed') ||
              log.action.toLowerCase().includes('unauthorized')) {
            severity = 'high';
          } else if (log.action.toLowerCase().includes('admin') ||
                     log.action.toLowerCase().includes('export') ||
                     log.action.toLowerCase().includes('critical')) {
            severity = 'critical';
          } else if (log.action.toLowerCase().includes('role') ||
                     log.action.toLowerCase().includes('status') ||
                     log.action.toLowerCase().includes('updated')) {
            severity = 'medium';
          }

          return {
            id: log.id,
            action: log.action,
            user: userEmail,
            userRole: userRole,
            resource: log.table_name || 'System',
            resourceId: log.record_id || '',
            details: log.new_values ? JSON.stringify(log.new_values, null, 2) : 'No details available',
            ipAddress: log.ip_address?.toString() || 'Unknown',
            userAgent: log.user_agent || 'Unknown',
            timestamp: log.created_at,
            severity
          };
        })
      );

      setAuditLogs(logs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, severityFilter, resourceFilter]);
  
  useEffect(() => {
    // Set up comprehensive real-time subscriptions
    const auditChannel = supabase
      .channel('comprehensive-audit-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs'
        },
        async (payload) => {
          console.log('New audit log received:', payload);
          
          let userEmail = 'System';
          let userRole = 'system';

          // Get user details if user_id exists
          if (payload.new.user_id) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('user_id', payload.new.user_id)
                .single();
              
              if (profile?.full_name) {
                userEmail = profile.full_name;
              }

              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', payload.new.user_id)
                .single();
              
              if (roleData?.role) {
                userRole = roleData.role;
              }
            } catch (error) {
              console.warn('Could not fetch user details for real-time event:', error);
            }
          }

          // Determine severity
          let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
          
          if (payload.new.action.toLowerCase().includes('deleted') || 
              payload.new.action.toLowerCase().includes('failed') ||
              payload.new.action.toLowerCase().includes('unauthorized')) {
            severity = 'high';
          } else if (payload.new.action.toLowerCase().includes('admin') ||
                     payload.new.action.toLowerCase().includes('export') ||
                     payload.new.action.toLowerCase().includes('critical')) {
            severity = 'critical';
          } else if (payload.new.action.toLowerCase().includes('role') ||
                     payload.new.action.toLowerCase().includes('status') ||
                     payload.new.action.toLowerCase().includes('updated')) {
            severity = 'medium';
          }

          const newLog: AuditLog = {
            id: payload.new.id,
            action: payload.new.action,
            user: userEmail,
            userRole: userRole,
            resource: payload.new.table_name || 'System',
            resourceId: payload.new.record_id || '',
            details: payload.new.new_values ? JSON.stringify(payload.new.new_values, null, 2) : 'No details available',
            ipAddress: payload.new.ip_address?.toString() || 'Unknown',
            userAgent: payload.new.user_agent || 'Unknown',
            timestamp: payload.new.created_at,
            severity
          };
          
          setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep only 100 most recent
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'properties'
        },
        async (payload) => {
          console.log('New property created:', payload);
          
          const newLog: AuditLog = {
            id: `prop-${payload.new.id}`,
            action: 'Property Created',
            user: 'User',
            userRole: 'user',
            resource: 'Property',
            resourceId: payload.new.id,
            details: `New property: ${payload.new.title}`,
            ipAddress: 'Real-time',
            userAgent: 'System',
            timestamp: payload.new.created_at,
            severity: 'low'
          };
          
          setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'properties'
        },
        async (payload) => {
          console.log('Property updated:', payload);
          
          const newLog: AuditLog = {
            id: `prop-update-${payload.new.id}`,
            action: `Property Updated`,
            user: 'User',
            userRole: 'user',
            resource: 'Property',
            resourceId: payload.new.id,
            details: `Property updated: ${payload.new.title}`,
            ipAddress: 'Real-time',
            userAgent: 'System',
            timestamp: new Date().toISOString(),
            severity: 'low'
          };
          
          setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles'
        },
        async (payload) => {
          console.log('New user profile created:', payload);
          
          const newLog: AuditLog = {
            id: `profile-${payload.new.id}`,
            action: 'New User Registered',
            user: payload.new.full_name || 'New User',
            userRole: 'user',
            resource: 'User',
            resourceId: payload.new.user_id,
            details: `New user registered: ${payload.new.full_name}`,
            ipAddress: 'Real-time',
            userAgent: 'System',
            timestamp: payload.new.created_at,
            severity: 'low'
          };
          
          setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        async (payload) => {
          console.log('User role changed:', payload);
          
          let action = 'User Role Modified';
          const newData = payload.new as any;
          const oldData = payload.old as any;
          
          if (payload.eventType === 'INSERT') {
            action = `Role Assigned: ${newData?.role || 'Unknown'}`;
          } else if (payload.eventType === 'UPDATE') {
            action = `Role Changed: ${oldData?.role || 'Unknown'} → ${newData?.role || 'Unknown'}`;
          } else if (payload.eventType === 'DELETE') {
            action = `Role Removed: ${oldData?.role || 'Unknown'}`;
          }
          
          const resourceId: string = (payload.new as any)?.user_id || (payload.old as any)?.user_id || '';
          
          const newLog: AuditLog = {
            id: `role-${Date.now()}`,
            action: action,
            user: 'Admin',
            userRole: 'admin',
            resource: 'User',
            resourceId: resourceId,
            details: `User role modification`,
            ipAddress: 'Real-time',
            userAgent: 'System',
            timestamp: new Date().toISOString(),
            severity: ((payload.new as any)?.role === 'admin' || (payload.old as any)?.role === 'admin') ? 'critical' : 'medium'
          };
          
          setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(auditChannel);
    };
  }, []);

  const filterLogs = () => {
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    if (resourceFilter !== 'all') {
      filtered = filtered.filter(log => log.resource.toLowerCase() === resourceFilter.toLowerCase());
    }

    setFilteredLogs(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'user': return <User className="h-4 w-4" />;
      case 'property': return <FileText className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'User', 'Resource', 'Severity', 'IP Address', 'Details'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.action,
        log.user,
        log.resource,
        log.severity,
        log.ipAddress,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: auditLogs.length,
    critical: auditLogs.filter(log => log.severity === 'critical').length,
    high: auditLogs.filter(log => log.severity === 'high').length,
    today: auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading audit logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Security & Audit</h1>
          <p className="text-muted-foreground">Real-time monitoring of system activities and security events</p>
        </div>
        <Button onClick={handleExportLogs}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.today}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.high}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add test panel for demonstration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>System activities and security events</CardDescription>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(log.severity)}
                      {log.action}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.user}</div>
                      <Badge variant="outline" className="text-xs">
                        {log.userRole}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResourceIcon(log.resource)}
                      <span>{log.resource}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getSeverityColor(log.severity)}>
                      {log.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedLog(log);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
      
      {/* Test Panel */}
      <div className="lg:col-span-1">
        <AuditTestPanel />
      </div>
    </div>

      {/* Log Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this audit event
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Action</h4>
                  <p>{selectedLog.action}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Severity</h4>
                  <Badge variant="secondary" className={getSeverityColor(selectedLog.severity)}>
                    {selectedLog.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">User</h4>
                  <p>{selectedLog.user}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {selectedLog.userRole}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Resource</h4>
                  <p>{selectedLog.resource}</p>
                  <p className="text-sm text-muted-foreground font-mono">{selectedLog.resourceId}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">IP Address</h4>
                  <p className="font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Timestamp</h4>
                  <p>{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Details</h4>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedLog.details}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">User Agent</h4>
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {selectedLog.userAgent}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};