import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  designation: string;
  role: string;
  status: string;
}

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onDeleteSuccess: () => void;
}

export const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onDeleteSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!employee || confirmationText !== 'DELETE') {
      toast({
        title: 'Confirmation Required',
        description: 'Please type "DELETE" to confirm',
        variant: 'destructive'
      });
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Deleting employee:', employee.id);

      // Call edge function to handle complete employee deletion
      const { data, error } = await supabase.functions.invoke('delete-employee', {
        body: { 
          employeeId: employee.id,
          email: employee.email
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Employee Deleted',
        description: `${employee.full_name} has been successfully removed from the system`,
      });

      onDeleteSuccess();
      onClose();
      setConfirmationText('');
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      toast({
        title: 'Deletion Failed',
        description: error.message || 'Failed to delete employee',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Employee
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the employee and remove all their access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-red-800">Employee to be deleted:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Name:</span> {employee.full_name}</div>
              <div><span className="font-medium">ID:</span> {employee.employee_id}</div>
              <div><span className="font-medium">Email:</span> {employee.email}</div>
              <div><span className="font-medium">Department:</span> {employee.department}</div>
              <div>
                <span className="font-medium">Role:</span> 
                <Badge variant="destructive" className="ml-2">
                  {employee.role}
                </Badge>
              </div>
              <div><span className="font-medium">Status:</span> {employee.status}</div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">This will remove:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Employee record from the system</li>
              <li>• All authentication access</li>
              <li>• Transaction history (if any)</li>
              <li>• Payout requests (if any)</li>
              <li>• Role-based permissions</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div>
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm deletion:
            </label>
            <input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="Type DELETE to confirm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting || confirmationText !== 'DELETE'}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Employee'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};