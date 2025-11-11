import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEmployeeRole } from '@/hooks/useEmployeeRole';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface FinanceProtectedRouteProps {
  children: React.ReactNode;
}

export const FinanceProtectedRoute: React.FC<FinanceProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isFinanceAdmin, loading: roleLoading } = useEmployeeRole();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const location = useLocation();

  const loading = authLoading || roleLoading || adminLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Verifying finance access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isFinanceAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Finance Access Required</AlertTitle>
            <AlertDescription>
              You need finance admin privileges to access this section. 
              Please contact your administrator if you believe this is an error.
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <button
              onClick={() => window.history.back()}
              className="text-primary hover:underline"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
