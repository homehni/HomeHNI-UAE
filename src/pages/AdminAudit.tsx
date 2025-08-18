import React, { useState, useEffect } from 'react';
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
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      action: 'Property Approved',
      user: 'admin@homehni.com',
      userRole: 'admin',
      resource: 'Property',
      resourceId: 'prop_123',
      details: 'Property "Luxury Apartment in Mumbai" approved for listing',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      severity: 'low'
    },
    {
      id: '2',
      action: 'User Role Changed',
      user: 'admin@homehni.com',
      userRole: 'admin',
      resource: 'User',
      resourceId: 'user_456',
      details: 'Changed user role from buyer to consultant',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      severity: 'medium'
    },
    {
      id: '3',
      action: 'Login Attempt Failed',
      user: 'unknown@test.com',
      userRole: 'unknown',
      resource: 'Authentication',
      resourceId: 'auth_fail_789',
      details: 'Multiple failed login attempts detected',
      ipAddress: '203.0.113.1',
      userAgent: 'curl/7.68.0',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      severity: 'high'
    },
    {
      id: '4',
      action: 'Data Export',
      user: 'admin@homehni.com',
      userRole: 'admin',
      resource: 'System',
      resourceId: 'export_001',
      details: 'Exported user data for compliance audit',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      severity: 'critical'
    },
    {
      id: '5',
      action: 'Property Deleted',
      user: 'admin@homehni.com',
      userRole: 'admin',
      resource: 'Property',
      resourceId: 'prop_789',
      details: 'Deleted property listing for policy violation',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 450000).toISOString(),
      severity: 'medium'
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(auditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, severityFilter, resourceFilter]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">Monitor system activities and security events</p>
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