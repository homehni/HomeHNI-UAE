import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Copy, Eye, EyeOff, Check } from 'lucide-react';

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
  const [loginCredentials, setLoginCredentials] = useState<{ email: string; temporaryPassword: string } | null>(null);
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
        // Set login credentials for display
        if (data.loginCredentials) {
          setLoginCredentials(data.loginCredentials);
        }
        
        toast({
          title: 'Success',
          description: data.message
        });
        onEmployeeInvited();
        // Don't close immediately if we have credentials to show
        if (!data.loginCredentials) {
          handleClose();
        }
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
    setLoginCredentials(null);
    onClose();
  };

  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: 'Copied!',
      description: `${fieldName} copied to clipboard`,
    });
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
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="join_date">Join Date</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date}
                onChange={(e) => handleInputChange('join_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
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
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                placeholder="e.g., Senior Manager, Executive"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Employee Role</Label>
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
                className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          {/* Login Credentials Display */}
          {loginCredentials && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                🎉 Employee Account Created Successfully!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                Share these login credentials with the new employee. They can use these to log in at /auth
              </p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-green-800 dark:text-green-200">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={loginCredentials.email}
                      readOnly
                      className="bg-white dark:bg-gray-800 border-green-300 dark:border-green-700"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(loginCredentials.email, 'Email')}
                      className="shrink-0"
                    >
                      {copiedField === 'Email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-green-800 dark:text-green-200">Temporary Password</Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={loginCredentials.temporaryPassword}
                        readOnly
                        className="bg-white dark:bg-gray-800 border-green-300 dark:border-green-700 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(loginCredentials.temporaryPassword, 'Password')}
                      className="shrink-0"
                    >
                      {copiedField === 'Password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> The employee should change their password after first login for security.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {loginCredentials ? 'Close' : 'Cancel'}
            </Button>
            {!loginCredentials && (
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
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};