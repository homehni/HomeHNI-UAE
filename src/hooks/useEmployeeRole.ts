import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type EmployeeRole = 'hr_admin' | 'finance_admin' | 'content_manager' | 'blog_manager' | 'employee_manager' | 'employee';

interface EmployeeRoleState {
  employeeRole: EmployeeRole | null;
  loading: boolean;
  isFinanceAdmin: boolean;
  isHRAdmin: boolean;
  isEmployee: boolean;
}

export const useEmployeeRole = () => {
  const { user } = useAuth();
  const [roleState, setRoleState] = useState<EmployeeRoleState>({
    employeeRole: null,
    loading: true,
    isFinanceAdmin: false,
    isHRAdmin: false,
    isEmployee: false,
  });

  useEffect(() => {
    if (user) {
      fetchEmployeeRole();
    } else {
      setRoleState({
        employeeRole: null,
        loading: false,
        isFinanceAdmin: false,
        isHRAdmin: false,
        isEmployee: false,
      });
    }
  }, [user]);

  const fetchEmployeeRole = async () => {
    if (!user?.email) {
      setRoleState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      console.log('Fetching employee role for email:', user.email);
      
      // First check if user is an admin in user_roles table
      const { data: adminData, error: adminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (adminData?.role === 'admin') {
        console.log('User is an admin, granting employee access');
        setRoleState({
          employeeRole: 'content_manager', // Give admin content manager role
          loading: false,
          isFinanceAdmin: false,
          isHRAdmin: false,
          isEmployee: true,
        });
        return;
      }

      // Case-insensitive match on email; allow records without status to be treated as active
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('role, status')
        .ilike('email', user.email!)
        .maybeSingle();

      console.log('Employee data response:', { employeeData, error });

      if (error || !employeeData) {
        console.log('User is not an employee or error occurred:', error?.message);
        setRoleState({
          employeeRole: null,
          loading: false,
          isFinanceAdmin: false,
          isHRAdmin: false,
          isEmployee: false,
        });
        return;
      }

      const rawRole = (employeeData as any)?.role as string | null;
      const normalizedRole = (rawRole || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
      const isActive = ((employeeData as any)?.status ?? 'active') === 'active';

      console.log('Employee role detected:', { rawRole, normalizedRole, isActive });

      setRoleState({
        employeeRole: isActive && normalizedRole ? (normalizedRole as any) : null,
        loading: false,
        isFinanceAdmin: isActive && (normalizedRole === 'finance_admin' || normalizedRole === 'finance'),
        isHRAdmin: isActive && (normalizedRole === 'hr_admin' || normalizedRole === 'hr'),
        isEmployee: isActive && !!normalizedRole,
      });
    } catch (error) {
      console.error('Error fetching employee role:', error);
      setRoleState({
        employeeRole: null,
        loading: false,
        isFinanceAdmin: false,
        isHRAdmin: false,
        isEmployee: false,
      });
    }
  };

  return {
    ...roleState,
    refetch: fetchEmployeeRole,
  };
};