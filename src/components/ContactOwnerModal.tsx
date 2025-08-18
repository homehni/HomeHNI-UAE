import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createLead, CreateLeadData } from '@/services/leadService';
import { useToast } from '@/hooks/use-toast';

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

export const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData: CreateLeadData = {
        property_id: propertyId,
        interested_user_name: formData.name,
        interested_user_email: formData.email,
        interested_user_phone: formData.phone || undefined,
        message: formData.message || undefined
      };

      await createLead(leadData);
      
      toast({
        title: "Interest Registered Successfully!",
        description: "The property owner will contact you soon through your provided details.",
      });

      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
      onClose();
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: "Failed to register your interest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Property Owner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Property:</p>
            <p className="font-medium">{propertyTitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Any specific questions or requirements? (optional)"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>

          <div className="text-xs text-gray-500 mt-4">
            <p>
              Your contact information will be securely shared with the property owner. 
              We respect your privacy and will not use your data for any other purposes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};