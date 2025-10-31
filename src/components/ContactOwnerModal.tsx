import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { sendContactOwnerEmail } from '@/services/emailService';
import { checkContactUsage, useContactAttempt } from '@/services/contactUsageService';

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  listingType?: string;
}

export const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  listingType
}) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canContact, setCanContact] = useState(true);
  const [remainingUses, setRemainingUses] = useState(50);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-fill form with user profile data when modal opens and user is logged in
  useEffect(() => {
    if (isOpen && user && profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.full_name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [isOpen, user, profile]);

  // Check contact usage when modal opens
  useEffect(() => {
    if (isOpen) {
      checkContactUsage().then((status) => {
        // For non-logged-in users, show default 50 contacts available
        // The actual limit will be enforced server-side via create_contact_lead RPC
        if (!user) {
          setCanContact(true);
          setRemainingUses(50);
        } else {
          setCanContact(status.canContact);
          setRemainingUses(status.remainingUses);
        }
      });
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Name is required",
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(0, 84%, 60%)",
          },
        });
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
        toast({
          title: "Validation Error", 
          description: "Email is required",
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(0, 84%, 60%)",
          },
        });
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone.trim()) {
        toast({
          title: "Validation Error",
          description: "Phone number is required",
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(0, 84%, 60%)",
          },
        });
      setIsSubmitting(false);
      return;
    }

    if (formData.phone.length < 10) {
        toast({
          title: "Validation Error",
          description: "Phone number must be at least 10 digits",
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(0, 84%, 60%)",
          },
        });
      setIsSubmitting(false);
      return;
    }


    try {
      console.log('ContactOwnerModal: Creating lead with RPC call');
      
      // Use the same RPC function as SecureContactForm - it doesn't require authentication
      const { data, error } = await supabase.rpc('create_contact_lead', {
        p_property_id: propertyId,
        p_user_name: formData.name.trim(),
        p_user_email: formData.email.trim(),
        p_user_phone: formData.phone.trim(),
        p_message: formData.message.trim() || undefined
      });
      
      console.log('ContactOwnerModal: Lead creation result:', { data, error });
      
      if (error) {
        throw new Error(error.message);
      }

      console.log('ContactOwnerModal: Success! Listing type:', listingType);
      
      // Use a contact attempt (decrement free uses) - only for logged-in users
      let contactResult = { success: true, remainingUses: 50 };
      if (user) {
        contactResult = await useContactAttempt();
        if (contactResult.success) {
          setRemainingUses(contactResult.remainingUses);
          console.log('ContactOwnerModal: Contact attempt used, remaining:', contactResult.remainingUses);
        }
      }
      
      // Send email notification to property owner
      try {
        // Get property owner contact details using secure RPC function
        const { data: ownerData, error: ownerError } = await supabase
          .rpc('get_property_owner_contact', {
            property_id: propertyId
          });

        if (!ownerError && ownerData && ownerData.length > 0) {
          const owner = ownerData[0];
          await sendContactOwnerEmail(
            owner.owner_email,
            owner.owner_name || 'Property Owner',
            {
              inquirerName: formData.name.trim(),
              inquirerEmail: formData.email.trim(),
              inquirerPhone: formData.phone.trim(),
              message: formData.message.trim() || 'No specific message provided',
              propertyTitle: owner.property_title || propertyTitle,
              propertyId: propertyId,
              listingType: listingType
            }
          );
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't show error to user as the main action was successful
      }
      
      // Show success message with remaining uses info
      let successMessage = '';
      if (!user) {
        // Non-logged-in users - encourage signup
        successMessage = "Contact sent! Sign up to track your inquiries and get more features.";
      } else {
        successMessage = contactResult.remainingUses > 0 
          ? `Contact sent! You have ${contactResult.remainingUses} free contacts remaining.`
          : "Contact sent! You've used all free contacts. Subscribe to continue contacting more properties.";
      }
      
      // Show in-page success message
      setShowSuccess(true);
      
      // Hide success message after 6 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 6000);

      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Close modal and redirect after 6.5 seconds (after success message disappears)
      setTimeout(() => {
        onClose();
        
        // Trigger a custom event to notify Dashboard to refresh
        console.log('ContactOwnerModal: Dispatching contactCreated event for property:', propertyId);
        window.dispatchEvent(new CustomEvent('contactCreated', { 
          detail: { propertyId, timestamp: Date.now() } 
        }));
        console.log('ContactOwnerModal: Event dispatched successfully');
        
        // Redirect logic based on user state and remaining uses
        if (!user) {
          // Non-logged-in users - redirect to auth page
          console.log('ContactOwnerModal: Non-logged-in user, redirecting to auth');
          navigate('/auth?redirectTo=/search');
        } else if (contactResult.remainingUses === 0) {
          // No more free uses - redirect to payment plans
          console.log('ContactOwnerModal: No free uses left, redirecting to plans');
          navigate('/plans');
        } else {
          // Still have free uses - redirect to appropriate plans page
          console.log('ContactOwnerModal: Redirecting with listing type:', listingType);
          if (listingType === 'sale') {
            console.log('ContactOwnerModal: Navigating to buyer plans');
            navigate('/plans?tab=buyer');
          } else if (listingType === 'rent') {
            console.log('ContactOwnerModal: Navigating to rental plans');  
            navigate('/plans?tab=rental');
          }
        }
      }, 6500);
    } catch (error) {
      console.error('Error creating lead:', error);
        toast({
          title: "Error",
          description: "Failed to register your interest. Please try again.",
          className: "bg-white border border-red-200 shadow-lg rounded-lg",
          style: {
            borderLeft: "8px solid hsl(0, 84%, 60%)",
          },
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => {
          // Prevent Radix from closing immediately to avoid click-through
          e.preventDefault();
          // Stop the original outside event from bubbling to underlying elements
          // @ts-ignore - Radix event includes originalEvent
          e?.detail?.originalEvent?.stopPropagation?.();
          // Close after the current event loop to avoid triggering underlying onClick
          setTimeout(() => onClose(), 0);
        }}
        onInteractOutside={(e) => {
          // Extra safety: stop bubbling on any outside interaction
          // @ts-ignore - Radix event includes originalEvent
          e?.detail?.originalEvent?.stopPropagation?.();
        }}
      >
        {/* Success Message Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm mx-4 animate-scale-in">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Message Sent Successfully!</h3>
                  <p className="text-gray-600">
                    Your message has been sent to the property owner. They will contact you soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogHeader>
          <DialogTitle>Contact Property Owner</DialogTitle>
        </DialogHeader>
        <DialogDescription id="dialog-description" className="sr-only">
          Contact form to reach the property owner.
        </DialogDescription>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Property:</p>
            <p className="font-medium">{propertyTitle}</p>
          </div>
          
          {canContact && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                Free contacts remaining: <span className="font-semibold">{remainingUses}</span>
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                required
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
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
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