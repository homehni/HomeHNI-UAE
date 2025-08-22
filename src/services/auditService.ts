import { supabase } from '@/integrations/supabase/client';

interface AuditEventParams {
  action: string;
  tableName?: string;
  recordId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Log an audit event to the database
   */
  static async logEvent({
    action,
    tableName = 'system',
    recordId,
    oldValues,
    newValues,
    ipAddress,
    userAgent
  }: AuditEventParams): Promise<void> {
    try {
      // Get IP address from client if not provided
      if (!ipAddress) {
        try {
          // Try to get public IP (this is optional and may not work in all environments)
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          ipAddress = data.ip;
        } catch (error) {
          ipAddress = 'Unknown';
        }
      }

      // Get user agent if not provided
      if (!userAgent) {
        userAgent = navigator.userAgent;
      }

      const { error } = await supabase.rpc('log_audit_event', {
        p_action: action,
        p_table_name: tableName,
        p_record_id: recordId,
        p_old_values: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
        p_new_values: newValues ? JSON.parse(JSON.stringify(newValues)) : null,
        p_ip_address: ipAddress,
        p_user_agent: userAgent
      });

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }

  /**
   * Log authentication events
   */
  static async logAuthEvent(
    eventType: string,
    userEmail?: string,
    success = true,
    details?: string
  ): Promise<void> {
    try {
      let ipAddress = 'Unknown';
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (error) {
        // Fallback to unknown if IP fetch fails
      }

      const { error } = await supabase.rpc('log_auth_event', {
        p_event_type: eventType,
        p_user_email: userEmail,
        p_success: success,
        p_ip_address: ipAddress,
        p_user_agent: navigator.userAgent,
        p_details: details
      });

      if (error) {
        console.error('Failed to log auth event:', error);
      }
    } catch (error) {
      console.error('Error logging auth event:', error);
    }
  }

  /**
   * Log property-related events
   */
  static async logPropertyEvent(
    action: string,
    propertyId: string,
    propertyTitle?: string,
    oldValues?: any,
    newValues?: any
  ): Promise<void> {
    await this.logEvent({
      action,
      tableName: 'properties',
      recordId: propertyId,
      oldValues,
      newValues: {
        ...newValues,
        title: propertyTitle
      }
    });
  }

  /**
   * Log user-related events
   */
  static async logUserEvent(
    action: string,
    userId: string,
    userDetails?: any,
    oldValues?: any,
    newValues?: any
  ): Promise<void> {
    await this.logEvent({
      action,
      tableName: 'profiles',
      recordId: userId,
      oldValues,
      newValues: {
        ...newValues,
        ...userDetails
      }
    });
  }

  /**
   * Log admin actions
   */
  static async logAdminAction(
    action: string,
    targetResource: string,
    targetId: string,
    details?: string
  ): Promise<void> {
    await this.logEvent({
      action: `Admin Action: ${action}`,
      tableName: targetResource,
      recordId: targetId,
      newValues: {
        details,
        admin_action: true
      }
    });
  }

  /**
   * Log system events
   */
  static async logSystemEvent(
    action: string,
    details?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<void> {
    await this.logEvent({
      action: `System: ${action}`,
      tableName: 'system',
      newValues: {
        details,
        severity
      }
    });
  }
}

// Export convenience methods for easier usage
export const auditLogger = {
  // Authentication events
  loginSuccess: (userEmail: string) => 
    AuditService.logAuthEvent('Login Success', userEmail, true),
  
  loginFailed: (userEmail: string, reason?: string) => 
    AuditService.logAuthEvent('Login Failed', userEmail, false, reason),
  
  logout: (userEmail: string) => 
    AuditService.logAuthEvent('User Logout', userEmail, true),
  
  passwordReset: (userEmail: string) => 
    AuditService.logAuthEvent('Password Reset Request', userEmail, true),

  // Property events
  propertyCreated: (propertyId: string, title: string) =>
    AuditService.logPropertyEvent('Property Created', propertyId, title),
  
  propertyUpdated: (propertyId: string, title: string, oldValues?: any, newValues?: any) =>
    AuditService.logPropertyEvent('Property Updated', propertyId, title, oldValues, newValues),
  
  propertyDeleted: (propertyId: string, title: string) =>
    AuditService.logPropertyEvent('Property Deleted', propertyId, title),
  
  propertyStatusChanged: (propertyId: string, title: string, oldStatus: string, newStatus: string) =>
    AuditService.logPropertyEvent(
      `Property Status Changed: ${oldStatus} → ${newStatus}`, 
      propertyId, 
      title,
      { status: oldStatus },
      { status: newStatus }
    ),

  // User events  
  userRegistered: (userId: string, userName: string, userEmail: string) =>
    AuditService.logUserEvent('User Registered', userId, { name: userName, email: userEmail }),
  
  userProfileUpdated: (userId: string, oldValues?: any, newValues?: any) =>
    AuditService.logUserEvent('User Profile Updated', userId, undefined, oldValues, newValues),
  
  userRoleChanged: (userId: string, oldRole: string, newRole: string) =>
    AuditService.logUserEvent(
      `User Role Changed: ${oldRole} → ${newRole}`, 
      userId,
      undefined,
      { role: oldRole },
      { role: newRole }
    ),

  // Admin actions
  adminPropertyAction: (action: string, propertyId: string, details?: string) =>
    AuditService.logAdminAction(action, 'properties', propertyId, details),
  
  adminUserAction: (action: string, userId: string, details?: string) =>
    AuditService.logAdminAction(action, 'users', userId, details),

  // System events
  dataExport: (exportType: string, recordCount?: number) =>
    AuditService.logSystemEvent('Data Export', `Exported ${exportType}: ${recordCount} records`, 'medium'),
  
  systemError: (error: string, details?: string) =>
    AuditService.logSystemEvent('System Error', `${error}: ${details}`, 'high'),
  
  securityAlert: (alert: string, details?: string) =>
    AuditService.logSystemEvent('Security Alert', `${alert}: ${details}`, 'critical'),
};