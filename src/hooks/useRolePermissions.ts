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
      // Get user's role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        return;
      }

      const role = roleData?.role;
      setUserRole(role);

      if (role) {
        // Get role permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .rpc('get_role_permissions', { _role: role });

        if (permissionsError) {
          console.error('Error fetching permissions:', permissionsError);
          return;
        }

        setPermissions(permissionsData || []);
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

  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  const isContentManager = (): boolean => {
    return ['content_manager', 'blog_content_creator', 'static_page_manager'].includes(userRole || '');
  };

  return {
    permissions,
    userRole,
    loading,
    hasPermission,
    canManageContent,
    isAdmin,
    isContentManager,
    refetch: fetchUserRoleAndPermissions
  };
};