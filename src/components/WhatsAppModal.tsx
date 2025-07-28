import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, FileText } from 'lucide-react';

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
    const whatsappUrl = "https://wa.me/918905999888?text=Hi! I want to list my property on Home HNI. Please help me get started.";
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Choose Your Listing Method</DialogTitle>
          <DialogDescription className="text-center">
            Want faster listing? You can list your property directly via WhatsApp and skip the form.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <Button 
            onClick={handleWhatsAppListing}
            className="w-full h-12 text-left justify-start"
            variant="outline"
          >
            <MessageCircle className="h-5 w-5 mr-3 text-green-600" />
            <div>
              <div className="font-medium">✅ List via WhatsApp</div>
              <div className="text-sm text-muted-foreground">Quick & Easy - No form needed</div>
            </div>
          </Button>
          
          <Button 
            onClick={onContinueToForm}
            className="w-full h-12 text-left justify-start"
            variant="outline"
          >
            <FileText className="h-5 w-5 mr-3 text-blue-600" />
            <div>
              <div className="font-medium">📝 Continue to Form</div>
              <div className="text-sm text-muted-foreground">Fill detailed form online</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};