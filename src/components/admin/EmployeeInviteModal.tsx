import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface EmployeeInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeInvited: () => void;
}

interface InviteFormData {
  email: string;
  full_name: string;
  phone: string;
  department: string;
  designation: string;
  role: 'hr_admin' | 'finance_admin' | 'content_manager' | 'blog_manager' | 'employee_manager' | 'employee';
  salary: string;
  join_date: string;
}

export const EmployeeInviteModal: React.FC<EmployeeInviteModalProps> = ({
  isOpen,
  onClose,
  onEmployeeInvited
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InviteFormData>({
    email: '',
    full_name: '',
    phone: '',
    department: '',
    designation: '',
    role: 'employee',
    salary: '',
    join_date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('employee-invite', {
        body: {
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone,
          department: formData.department,
          designation: formData.designation,
          role: formData.role,
          salary: formData.salary ? parseFloat(formData.salary) : undefined,
          join_date: formData.join_date
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Success',
          description: data.message
        });
        onEmployeeInvited();
        handleClose();
      } else {
        throw new Error(data.error || 'Failed to invite employee');
      }

    } catch (err: any) {
      console.error('Employee invite error:', err);
      toast({
        title: 'Error',
        description: err?.message || 'Failed to invite employee',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      department: '',
      designation: '',
      role: 'employee',
      salary: '',
      join_date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  const handleInputChange = (field: keyof InviteFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite New Employee</DialogTitle>
          <DialogDescription id="dialog-description">
            Fill in the details below to invite a new employee to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="join_date">Join Date *</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date}
                onChange={(e) => handleInputChange('join_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Customer Support">Customer Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                placeholder="e.g., Senior Manager, Executive"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Employee Role *</Label>
              <Select onValueChange={(value) => handleInputChange('role', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="employee_manager">Employee Manager</SelectItem>
                  <SelectItem value="content_manager">Content Manager</SelectItem>
                  <SelectItem value="blog_manager">Blog Manager</SelectItem>
                  <SelectItem value="hr_admin">HR Admin</SelectItem>
                  <SelectItem value="finance_admin">Finance Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Salary (₹)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="Enter monthly salary"
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                'Invite Employee'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};