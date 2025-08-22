import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { Play, User, FileText, Shield, AlertTriangle } from 'lucide-react';

export const AuditTestPanel = () => {
  const { logger, logEvent, logSystemEvent } = useAuditLogger();

  const generateTestEvents = async () => {
    const events = [
      () => logger.loginSuccess(),
      () => logger.propertyCreated('test-prop-' + Date.now(), 'Test Property ' + Date.now()),
      () => logger.profileUpdated(),
      () => logger.adminLogin(),
      () => logEvent('Test User Action', 'users', 'user-123', { action: 'profile_view' }),
      () => logEvent('Test Property Status Change', 'properties', 'prop-456', { 
        old_status: 'pending', 
        new_status: 'approved' 
      }),
      () => logSystemEvent('System Maintenance', 'Scheduled maintenance completed', 'low'),
      () => logger.securityAlert('Suspicious activity detected from IP 192.168.1.100'),
    ];

    // Generate events with delays to show real-time updates
    for (let i = 0; i < events.length; i++) {
      await events[i]();
      // Small delay between events
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const generateSingleEvents = {
    userRegistration: () => logEvent('New User Registration', 'profiles', 'user-' + Date.now(), {
      name: 'Test User',
      email: 'testuser@example.com'
    }),
    
    propertyApproval: () => logEvent('Property Approved', 'properties', 'prop-' + Date.now(), {
      title: 'Luxury Apartment',
      status: 'approved',
      admin_action: true
    }),
    
    loginAttempt: () => logEvent('Login Attempt Failed', 'authentication', 'auth-' + Date.now(), {
      email: 'suspicious@example.com',
      reason: 'Invalid credentials',
      ip_address: '203.0.113.1'
    }),
    
    adminAction: () => logEvent('Admin Role Assignment', 'user_roles', 'role-' + Date.now(), {
      user_email: 'newadmin@example.com',
      role: 'admin',
      assigned_by: 'super_admin'
    }),
    
    dataExport: () => logger.dataExport('User Data CSV'),
    
    securityIncident: () => logger.securityAlert('Multiple failed login attempts detected')
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Audit Testing Panel
        </CardTitle>
        <CardDescription>
          Generate test audit events to see real-time monitoring in action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button 
            onClick={generateTestEvents}
            className="w-full mb-4"
            variant="default"
          >
            Generate Multiple Test Events
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={generateSingleEvents.userRegistration}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            User Registration
          </Button>
          
          <Button 
            onClick={generateSingleEvents.propertyApproval}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Property Approval
          </Button>
          
          <Button 
            onClick={generateSingleEvents.loginAttempt}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-orange-600"
          >
            <Shield className="h-4 w-4" />
            Failed Login
          </Button>
          
          <Button 
            onClick={generateSingleEvents.adminAction}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-purple-600"
          >
            <Shield className="h-4 w-4" />
            Admin Action
          </Button>
          
          <Button 
            onClick={generateSingleEvents.dataExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-blue-600"
          >
            <FileText className="h-4 w-4" />
            Data Export
          </Button>
          
          <Button 
            onClick={generateSingleEvents.securityIncident}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600"
          >
            <AlertTriangle className="h-4 w-4" />
            Security Alert
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted rounded">
          <strong>Note:</strong> These are test events for demonstration. 
          Real audit events are automatically captured when users perform actual actions.
        </div>
      </CardContent>
    </Card>
  );
};