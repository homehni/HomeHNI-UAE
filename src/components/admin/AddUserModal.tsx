import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Mail, Lock, UserCog, Shield } from 'lucide-react';

interface Role {
  role_name: string;
  display_name: string;
  description: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'active'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableRoles();
    }
  }, [isOpen]);

  const fetchAvailableRoles = async () => {
    try {
      const { data, error } = await supabase.rpc('get_available_roles');
      if (error) throw error;
      setAvailableRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch available roles',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.role) {
        throw new Error('All fields are required');
      }

      // Call Edge Function to create user with admin privileges
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          status: formData.status
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to create user');
      }

      toast({
        title: 'Success',
        description: `User ${formData.name} has been created successfully`,
        variant: 'default'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: '',
        status: 'active'
      });

      onUserAdded();
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create user',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'content_manager':
        return <UserCog className="h-4 w-4 text-blue-500" />;
      case 'blog_content_creator':
        return <User className="h-4 w-4 text-green-500" />;
      case 'sales_team':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border" aria-describedby="add-user-description">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5" />
            Add User
          </DialogTitle>
          <p id="add-user-description" className="sr-only">
            Create a new user account with specified role and permissions
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-background border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email ID
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-background border-border"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-background border-border pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="showPassword" 
                  checked={showPassword} 
                  onCheckedChange={(checked) => setShowPassword(checked === true)} 
                />
                <Label htmlFor="showPassword" className="text-xs text-muted-foreground">
                  Show Password
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-foreground">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-foreground">
              Role
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.role_name} value={role.role_name}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role.role_name)}
                      <div className="flex flex-col">
                        <span className="font-medium">{role.display_name}</span>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-border"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Creating...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
