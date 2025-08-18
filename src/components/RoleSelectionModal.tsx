import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ShoppingCart, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserRole } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onComplete
}) => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'consultant' | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleSelect = async () => {
    if (!selectedRole || !user) return;

    setIsUpdating(true);
    try {
      await updateUserRole(user.id, selectedRole);
      await refreshProfile();
      
      toast({
        title: "Welcome to HomeHNI!",
        description: `Your account has been set up as a ${selectedRole}.`,
      });
      
      onComplete();
    } catch (error) {
      console.error('Error setting role:', error);
      toast({
        title: "Error",
        description: "Failed to set your role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-5xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to HomeHNI!</DialogTitle>
          <DialogDescription className="text-center">
            Let's set up your account. Choose your role to get started with HomeHNI.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === 'buyer' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedRole('buyer')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <ShoppingCart className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>I'm Looking for Property</CardTitle>
              <CardDescription>
                Find your dream home, office space, or rental property
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Search and filter properties</li>
                <li>• Save favorites and get alerts</li>
                <li>• Contact property owners directly</li>
                <li>• Schedule property visits</li>
                <li>• Access to loan and legal services</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === 'seller' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedRole('seller')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Home className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>I Want to List Property</CardTitle>
              <CardDescription>
                Sell or rent out your residential or commercial property
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• List properties for free</li>
                <li>• Upload photos and videos</li>
                <li>• Manage inquiries and leads</li>
                <li>• Schedule property visits</li>
                <li>• Get verified seller badge</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === 'consultant' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedRole('consultant')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>I'm a Property Professional</CardTitle>
              <CardDescription>
                Real estate agent, broker, or consultant managing properties
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Manage multiple property listings</li>
                <li>• Professional profile showcase</li>
                <li>• Client ratings and reviews</li>
                <li>• Analytics and lead management</li>
                <li>• Bulk property uploads</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleRoleSelect}
            disabled={!selectedRole || isUpdating}
            size="lg"
            className="px-8"
          >
            {isUpdating ? 'Setting up...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};