import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Permission {
  content_type: string;
  action: string;
}

export const useRolePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserRoleAndPermissions();
    }
  }, [user]);

  const fetchUserRoleAndPermissions = async () => {
    if (!user) return;

    try {
      // First check user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      let role = roleData?.role;

      // If no role in user_roles, check employees table for content manager role
      if (!role || roleError) {
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('role')
          .eq('email', user.email)
          .eq('status', 'active')
          .single();

        if (employeeData?.role === 'content_manager') {
          role = 'content_manager'; // Map employee content_manager to user content_manager
        }
      }

      setUserRole(role || null);

      if (role) {
        // Get role permissions - only if it's a user role, not employee role
        try {
          const { data: permissionsData, error: permissionsError } = await supabase
            .rpc('get_role_permissions', { _role: role });

          if (!permissionsError && permissionsData) {
            setPermissions(permissionsData || []);
          }
        } catch (error) {
          console.log('No permissions found for role:', role);
          setPermissions([]);
        }
      }
    } catch (error) {
      console.error('Error fetching role and permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (contentType: string, action: string): boolean => {
    return permissions.some(
      (permission) => 
        permission.content_type === contentType && 
        permission.action === action
    );
  };

  const canManageContent = (contentType: string): boolean => {
    return hasPermission(contentType, 'update') || hasPermission(contentType, 'create');
  };

  const hasRole = (role: string): boolean => {
    return userRole === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return userRole ? roles.includes(userRole) : false;
  };

  return {
    permissions,
    userRole,
    loading,
    hasPermission,
    canManageContent,
    hasRole,
    hasAnyRole,
    isAdmin: () => userRole === 'admin',
    isContentManager: () => ['content_manager', 'blog_content_creator', 'static_page_manager'].includes(userRole || ''),
    refetch: fetchUserRoleAndPermissions
  };
};