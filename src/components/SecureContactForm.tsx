import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SecurePropertyService } from '@/services/securePropertyService';
import { sanitizeText, sanitizeEmail, sanitizePhone } from '@/utils/inputSanitization';
import { Loader2, Shield, Mail, Phone, User } from 'lucide-react';

interface SecureContactFormProps {
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

/**
 * Secure contact form that creates leads without exposing owner contact information
 * Replaces direct contact access with a secure inquiry system
 */
export const SecureContactForm: React.FC<SecureContactFormProps> = ({
  propertyId,
  propertyTitle,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    let sanitizedValue = value;
    
    // Real-time input sanitization
    switch (field) {
      case 'name':
        sanitizedValue = sanitizeText(value, { maxLength: 100, stripWhitespace: false });
        break;
      case 'email':
        sanitizedValue = sanitizeEmail(value);
        break;
      case 'phone':
        sanitizedValue = sanitizePhone(value);
        break;
      case 'message':
        sanitizedValue = sanitizeText(value, { maxLength: 1000, stripWhitespace: false });
        break;
    }

    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.name.trim() || formData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (formData.phone && formData.phone.length > 0 && formData.phone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }
    
    if (formData.message.length > 1000) {
      errors.push('Message must be less than 1000 characters');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: 'Validation Error',
        description: validationErrors.join(', '),
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData = {
        property_id: propertyId,
        interested_user_name: formData.name.trim(),
        interested_user_email: formData.email.trim(),
        interested_user_phone: formData.phone.trim() || undefined,
        message: formData.message.trim() || undefined
      };
      
      console.log('SecureContactForm: Creating lead with data:', leadData);
      const { data, error } = await SecurePropertyService.createPropertyLead(leadData);
      console.log('SecureContactForm: Lead creation result:', { data, error });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Inquiry Sent Successfully',
        description: 'Your inquiry has been securely sent to the property owner. They will contact you soon!'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      onSuccess?.();

    } catch (error) {
      console.error('Failed to send inquiry:', error);
      toast({
        title: 'Failed to Send Inquiry',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Contact Property Owner
        </CardTitle>
        <CardDescription>
          Send a secure inquiry for "{propertyTitle}". Your message will be forwarded to the owner.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any specific questions or requirements..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              maxLength={1000}
              rows={4}
            />
            <div className="text-xs text-muted-foreground">
              {formData.message.length}/1000 characters
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending Secure Inquiry...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Send Secure Inquiry
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <Shield className="h-4 w-4 inline mr-1" />
            <strong>Privacy Protected:</strong> Your contact information will only be shared with the property owner. 
            Owner contact details are not publicly displayed for security reasons.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};