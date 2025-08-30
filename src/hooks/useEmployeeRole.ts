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
      
      // Check if user is an employee and get their role
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('role, status')
        .eq('email', user.email)
        .single();

      console.log('Employee data response:', { employeeData, error });

      if (error) {
        console.log('User is not an employee or error occurred:', error.message);
        setRoleState({
          employeeRole: null,
          loading: false,
          isFinanceAdmin: false,
          isHRAdmin: false,
          isEmployee: false,
        });
        return;
      }

      const role = employeeData?.role as EmployeeRole;
      const isActive = employeeData?.status === 'active';

      console.log('Employee role detected:', { role, isActive });

      setRoleState({
        employeeRole: isActive ? role : null,
        loading: false,
        isFinanceAdmin: isActive && role === 'finance_admin',
        isHRAdmin: isActive && role === 'hr_admin',
        isEmployee: isActive && !!role,
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