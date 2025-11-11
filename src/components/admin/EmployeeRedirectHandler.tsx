import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEmployeeRole } from '@/hooks/useEmployeeRole';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';

interface EmployeeRedirectHandlerProps {
  children: React.ReactNode;
}

export const EmployeeRedirectHandler: React.FC<EmployeeRedirectHandlerProps> = ({ children }) => {
  const { isFinanceAdmin, isHRAdmin, isEmployee, loading: employeeLoading } = useEmployeeRole();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!employeeLoading && !adminLoading) {
      const currentPath = location.pathname;
      
      // If user is on employee-dashboard but is a finance/HR admin, redirect them
      if (currentPath === '/employee-dashboard') {
        if (isFinanceAdmin && !isAdmin) {
          console.log('Finance admin detected, redirecting to finance dashboard');
          navigate('/admin/finance', { replace: true });
          return;
        } else if (isHRAdmin && !isAdmin) {
          console.log('HR admin detected, redirecting to HR dashboard');  
          navigate('/admin/hr', { replace: true });
          return;
        }
      }

      // If user is on dashboard and tries to access employee dashboard
      if (currentPath === '/dashboard' && isEmployee && !isAdmin) {
        if (isFinanceAdmin) {
          console.log('Finance admin on dashboard, should go to finance portal');
        } else if (isHRAdmin) {
          console.log('HR admin on dashboard, should go to HR portal');
        }
      }
    }
  }, [isFinanceAdmin, isHRAdmin, isEmployee, isAdmin, employeeLoading, adminLoading, location.pathname, navigate]);

  if (employeeLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
