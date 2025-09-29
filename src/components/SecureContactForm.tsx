import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeText, sanitizeEmail, sanitizePhone } from '@/utils/inputSanitization';
import { Loader2, Shield, Mail, Phone, User } from 'lucide-react';
import { checkContactUsage, useContactAttempt } from '@/services/contactUsageService';

interface SecureContactFormProps {
  propertyId: string;
  propertyTitle: string;
  listingType?: string;
  onSuccess?: () => void;
}

/**
 * Secure contact form that creates leads without exposing owner contact information
 * Replaces direct contact access with a secure inquiry system
 */
export const SecureContactForm: React.FC<SecureContactFormProps> = ({
  propertyId,
  propertyTitle,
  listingType,
  onSuccess
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canContact, setCanContact] = useState(true);
  const [remainingUses, setRemainingUses] = useState(3);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Check contact usage when component mounts
  useEffect(() => {
    checkContactUsage().then((status) => {
      setCanContact(status.canContact);
      setRemainingUses(status.remainingUses);
    });
  }, []);

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
    
    if (!formData.phone.trim()) {
      errors.push('Phone number is required');
    } else if (formData.phone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }
    
    if (formData.message.length > 1000) {
      errors.push('Message must be less than 1000 characters');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user can still contact
    if (!canContact) {
      toast({
        title: 'Contact Limit Reached',
        description: 'You\'ve used all your free contacts. Subscribe to continue contacting property owners.',
        className: "bg-white border border-orange-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(38, 92%, 50%)",
        },
      });
      navigate('/plans');
      return;
    }
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: 'Validation Error',
        description: validationErrors.join(', '),
        className: "bg-white border border-red-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(0, 84%, 60%)",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('SecureContactForm: Creating lead with RPC call');
      const { data, error } = await supabase.rpc('create_contact_lead', {
        p_property_id: propertyId,
        p_user_name: formData.name.trim(),
        p_user_email: formData.email.trim(),
        p_user_phone: formData.phone.trim(),
        p_message: formData.message.trim() || undefined
      });
      console.log('SecureContactForm: Lead creation result:', { data, error });

      if (error) {
        throw new Error(error.message);
      }

      console.log('SecureContactForm: Success! Listing type:', listingType);

      // Use a contact attempt (decrement free uses)
      const contactResult = await useContactAttempt();
      if (contactResult.success) {
        setRemainingUses(contactResult.remainingUses);
        setCanContact(contactResult.remainingUses > 0);
        console.log('SecureContactForm: Contact attempt used, remaining:', contactResult.remainingUses);
      }

      // Show success message with remaining uses info
      const successMessage = contactResult.remainingUses > 0 
        ? `Inquiry sent! You have ${contactResult.remainingUses} free contacts remaining.`
        : "Inquiry sent! You've used all free contacts. Subscribe to continue contacting more properties.";

      toast({
        title: 'Inquiry Sent Successfully',
        description: successMessage,
        className: "bg-white border border-green-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(120, 100%, 25%)",
        },
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      // Call onSuccess first if it exists
      onSuccess?.();

      // Redirect logic based on remaining uses
      setTimeout(() => {
        if (contactResult.remainingUses === 0) {
          // No more free uses - redirect to payment plans
          console.log('SecureContactForm: No free uses left, redirecting to plans');
          navigate('/plans');
        } else {
          // Still have free uses - redirect to appropriate plans page
          console.log('SecureContactForm: Redirecting with listing type:', listingType);
          if (listingType === 'sale') {
            console.log('SecureContactForm: Navigating to buyer plans');
            navigate('/plans?tab=buyer');
          } else if (listingType === 'rent') {
            console.log('SecureContactForm: Navigating to rental plans');  
            navigate('/plans?tab=rental');
          }
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to send inquiry:', error);
      toast({
        title: 'Failed to Send Inquiry',
        description: error instanceof Error ? error.message : 'Please try again later',
        className: "bg-white border border-red-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "8px solid hsl(0, 84%, 60%)",
        },
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
        {canContact && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              Free contacts remaining: <span className="font-semibold">{remainingUses}</span>
            </p>
          </div>
        )}
        {!canContact && (
          <div className="bg-orange-50 p-3 rounded-md">
            <p className="text-sm text-orange-700">
              You've used all your free contacts. <span className="font-semibold">Subscribe to continue contacting properties.</span>
            </p>
          </div>
        )}
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
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
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
            disabled={isSubmitting || !canContact}
          >
            {!canContact ? (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Subscribe to Contact Properties
              </>
            ) : isSubmitting ? (
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