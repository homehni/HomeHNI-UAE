import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { sendCallbackRequestAdminAlert } from '@/services/emailService';

interface CallbackRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallbackRequestDialog: React.FC<CallbackRequestDialogProps> = ({ isOpen, onClose }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    city: '',
    class: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.number || !formData.city || !formData.class) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Send admin alert email
    try {
      const adminEmail = settings?.admin_email || 'homehni8@gmail.com';
      await sendCallbackRequestAdminAlert(adminEmail, {
        name: formData.name,
        email: formData.email,
        phone: formData.number,
        city: formData.city,
        userClass: formData.class,
        source: 'BuilderDealerPlans - Get a callback'
      });
    } catch (err) {
      // Non-blocking: still show success to user
      console.error('Callback admin email failed', err);
    }

    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      number: '',
      city: '',
      class: ''
    });
    onClose();

    // Show success toast
    setTimeout(() => {
      toast({
        title: "✓ Request Sent Successfully",
        description: "We'll get back to you shortly!",
      });
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">REQUEST INFORMATION</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">Request a callback to know more about our services</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-gray-700">
              Name: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
              placeholder="Enter your name or company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-700">
              Email Id: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number" className="text-sm text-gray-700">
              Number: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="number"
              type="tel"
              value={formData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              className="w-full"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm text-gray-700">
              Current City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full"
              placeholder="Enter your city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class" className="text-sm text-gray-700">
              Class<span className="text-red-500">*</span>
            </Label>
            <Select value={formData.class} onValueChange={(value) => handleInputChange('class', value)}>
              <SelectTrigger id="class" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="builder">Builder</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md mt-6"
          >
            SEND REQUEST
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackRequestDialog;
