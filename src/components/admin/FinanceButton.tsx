import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeRole } from '@/hooks/useEmployeeRole';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export const FinanceButton: React.FC = () => {
  const { isFinanceAdmin, isEmployee, loading } = useEmployeeRole();
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isFinanceAdmin || isAdmin) {
      navigate('/admin/finance');
    } else {
      navigate('/employee-dashboard');
    }
  };

  if (loading) {
    return (
      <Button 
        variant="secondary" 
        disabled
        className="bg-white text-blue-600 hover:bg-gray-100"
      >
        Loading...
      </Button>
    );
  }

  return (
    <Button 
      variant="secondary" 
      onClick={handleClick}
      className="bg-white text-blue-600 hover:bg-gray-100"
    >
      <DollarSign className="h-4 w-4 mr-2" />
      {isFinanceAdmin ? 'Finance Dashboard' : isEmployee ? 'Employee Panel' : 'Employee Access'}
    </Button>
  );
};
