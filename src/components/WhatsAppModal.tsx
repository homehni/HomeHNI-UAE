import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, FileText, X } from 'lucide-react';

interface WhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueToForm: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  open,
  onOpenChange,
  onContinueToForm
}) => {
  const handleWhatsAppListing = () => {
    const whatsappUrl = "https://wa.me/918074017388?text=Hi! I want to list my property on Home HNI. Please help me get started.";
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle className="text-center">Quick Property Listing</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Tired of filling the form? Just click the button below to list your property via WhatsApp.
          </p>
          
          <Button 
            onClick={handleWhatsAppListing}
            className="w-full h-12"
            variant="default"
          >
            <MessageCircle className="h-5 w-5 mr-3" />
            Post via WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};