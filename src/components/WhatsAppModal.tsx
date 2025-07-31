import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 fill-white"
    viewBox="0 0 32 32"
  >
    <path d="M16 .396C7.16.396.004 7.55.004 16.39c0 2.875.74 5.703 2.152 8.203L.072 32l7.554-2.031c2.453 1.344 5.227 2.055 8.117 2.055 8.84 0 15.996-7.156 15.996-15.996S24.84.396 16 .396zm0 29.207c-2.574 0-5.07-.684-7.254-1.98l-.52-.301-4.484 1.203 1.195-4.387-.34-.566c-1.34-2.25-2.051-4.824-2.051-7.461 0-7.602 6.195-13.796 13.796-13.796S29.796 8.788 29.796 16.39 23.602 29.603 16 29.603zM23.266 19.7c-.324-.16-1.922-.949-2.222-1.055-.3-.109-.523-.16-.746.164-.219.32-.855 1.055-1.051 1.27-.195.219-.387.246-.711.082-.32-.16-1.352-.5-2.574-1.59-.953-.851-1.598-1.902-1.785-2.222-.187-.32-.02-.492.14-.653.145-.144.32-.375.48-.562.16-.195.215-.32.324-.539.11-.219.055-.41-.027-.574-.082-.16-.746-1.8-1.02-2.465-.266-.641-.535-.555-.746-.566-.195-.008-.418-.01-.64-.01-.219 0-.574.082-.875.41s-1.15 1.125-1.15 2.742c0 1.617 1.176 3.18 1.34 3.398.16.219 2.309 3.516 5.598 4.926.782.336 1.39.535 1.867.684.785.25 1.5.215 2.066.133.63-.094 1.922-.785 2.195-1.547.27-.758.27-1.406.188-1.547-.082-.141-.3-.223-.629-.375z" />
  </svg>
);


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
    const whatsappUrl = "https://wa.me/918074017388?text=Hi%20I%20want%20to%20list%20my%20property";
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-fade-in animate-scale-in transition-all duration-300 ease-out">
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
          <DialogTitle className="text-center text-xl font-bold">Tired of filling forms?</DialogTitle>
          <DialogDescription className="text-center text-base">
            You can list your property directly via WhatsApp!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <Button 
  onClick={handleWhatsAppListing}
  className="w-full h-12"
  variant="default"
>
  <WhatsAppIcon />
  Submit via WhatsApp
</Button>

        </div>
      </DialogContent>
    </Dialog>
  );
};