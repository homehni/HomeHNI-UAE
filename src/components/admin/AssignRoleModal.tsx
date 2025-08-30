import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, User, UserCog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Role {
  role_name: string;
  display_name: string;
  description: string;
}

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const allowedRoleNames = ['content_manager', 'blog_content_creator', 'lead_manager', 'admin'] as const;

type AllowedRole = typeof allowedRoleNames[number];

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '' as '' | AllowedRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) fetchAvailableRoles();
  }, [isOpen]);

  const fetchAvailableRoles = async () => {
    try {
      const { data, error } = await supabase.rpc('get_available_roles');
      if (error) throw error;
      const filtered = (data || []).filter((r: Role) => allowedRoleNames.includes(r.role_name as AllowedRole));
      setAvailableRoles(filtered);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({ title: 'Error', description: 'Failed to fetch roles', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.email.trim() || !formData.role) {
        throw new Error('Email and role are required');
      }
      // Name+password required only when creating a brand-new user
      const payload: Record<string, string> = {
        email: formData.email.trim(),
        role: formData.role,
      };
      if (formData.name.trim()) payload.name = formData.name.trim();
      if (formData.password.trim()) payload.password = formData.password.trim();

      const { data, error } = await supabase.functions.invoke('assign-user-role', { body: payload });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to assign role');

      toast({ title: 'Success', description: 'Role assigned successfully', variant: 'default' });

      // Reset
      setFormData({ name: '', email: '', password: '', role: '' });
      onUserAdded();
      onClose();
    } catch (err: any) {
      console.error('Assign role error:', err);
      try {
        const resp = (err as any)?.context?.response;
        if (resp) {
          const text = await resp.text();
          console.error('Edge function response:', text);
          try {
            const json = JSON.parse(text);
            toast({ title: 'Error', description: json?.error || 'Failed to assign role', variant: 'destructive' });
          } catch {
            toast({ title: 'Error', description: text || (err?.message || 'Failed to assign role'), variant: 'destructive' });
          }
        } else {
          toast({ title: 'Error', description: err?.message || 'Failed to assign role', variant: 'destructive' });
        }
      } catch {
        toast({ title: 'Error', description: err?.message || 'Failed to assign role', variant: 'destructive' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'content_manager':
        return <UserCog className="h-4 w-4 text-blue-500" />;
      case 'blog_content_creator':
        return <User className="h-4 w-4 text-green-500" />;
      case 'lead_manager':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold text-foreground">Add a New Role</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new user or assign a role to an existing user. Provide name and password for new users, or just email for existing users.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (for new users)</Label>
              <Input id="name" placeholder="Full Name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password (for new users)</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox id="showPassword" checked={showPassword} onCheckedChange={(c) => setShowPassword(c === true)} />
                <Label htmlFor="showPassword" className="text-xs text-muted-foreground">Show Password</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
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
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground">
              {isSubmitting ? 'Saving...' : 'Assign Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRoleModal;
