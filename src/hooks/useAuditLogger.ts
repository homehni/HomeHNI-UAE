import { useCallback } from 'react';
import { auditLogger, AuditService } from '@/services/auditService';
import { useAuth } from '@/hooks/useAuth';

export const useAuditLogger = () => {
  const { user } = useAuth();

  const logEvent = useCallback(async (
    action: string,
    tableName?: string,
    recordId?: string,
    details?: any
  ) => {
    try {
      await AuditService.logEvent({
        action,
        tableName,
        recordId,
        newValues: details
      });
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }, []);

  const logUserAction = useCallback(async (action: string, details?: string) => {
    if (user) {
      await AuditService.logUserEvent(
        action,
        user.id,
        { email: user.email, name: user.user_metadata?.full_name }
      );
    }
  }, [user]);

  const logPropertyAction = useCallback(async (
    action: string,
    propertyId: string,
    propertyTitle?: string,
    details?: any
  ) => {
    await AuditService.logPropertyEvent(action, propertyId, propertyTitle, undefined, details);
  }, []);

  const logAuthAction = useCallback(async (
    action: string,
    success: boolean = true,
    details?: string
  ) => {
    const email = user?.email || 'Unknown';
    await AuditService.logAuthEvent(action, email, success, details);
  }, [user]);

  const logAdminAction = useCallback(async (
    action: string,
    targetResource: string,
    targetId: string,
    details?: string
  ) => {
    await AuditService.logAdminAction(action, targetResource, targetId, details);
  }, []);

  const logSystemEvent = useCallback(async (
    action: string,
    details?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    await AuditService.logSystemEvent(action, details, severity);
  }, []);

  return {
    logEvent,
    logUserAction,
    logPropertyAction,
    logAuthAction,
    logAdminAction,
    logSystemEvent,
    // Pre-configured common actions
    logger: {
      // Authentication events
      loginSuccess: () => logAuthAction('User Login Success', true),
      loginFailed: (reason?: string) => logAuthAction('User Login Failed', false, reason),
      logout: () => logAuthAction('User Logout', true),
      
      // Property events
      propertyCreated: (propertyId: string, title: string) => 
        logPropertyAction('Property Created', propertyId, title),
      propertyUpdated: (propertyId: string, title: string) => 
        logPropertyAction('Property Updated', propertyId, title),
      propertyDeleted: (propertyId: string, title: string) => 
        logPropertyAction('Property Deleted', propertyId, title),
      
      // User events
      profileUpdated: () => logUserAction('Profile Updated'),
      roleChanged: (newRole: string) => logUserAction(`Role Changed to ${newRole}`),
      
      // Admin events
      adminLogin: () => logSystemEvent('Admin Access', 'Administrator logged in', 'medium'),
      dataExport: (exportType: string) => 
        logSystemEvent('Data Export', `Exported ${exportType}`, 'medium'),
      securityAlert: (message: string) => 
        logSystemEvent('Security Alert', message, 'critical'),
    }
  };
};