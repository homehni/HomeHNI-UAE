import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { UserCheck, Building2 } from 'lucide-react';
import { AgentDetailsForm } from './AgentDetailsForm';
import { useAuth } from '@/contexts/AuthContext';

interface AgentVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export const AgentVerificationDialog: React.FC<AgentVerificationDialogProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const { user } = useAuth();
  const [isIndependentAgent, setIsIndependentAgent] = useState<boolean | null>(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showAgencyPrompt, setShowAgencyPrompt] = useState(false);

  const handleIndependentAgent = () => {
    setIsIndependentAgent(true);
    setShowDetailsForm(true);
  };

  const handleNotIndependent = () => {
    setIsIndependentAgent(false);
    setShowAgencyPrompt(true);
    // Save flag to prevent dialog from showing again
    if (user) {
      const key = `agent_works_with_agency_${user.id}`;
      localStorage.setItem(key, 'true');
    }
  };

  const handleAgencyPromptClose = () => {
    setShowAgencyPrompt(false);
    onOpenChange(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleFormComplete = () => {
    setShowDetailsForm(false);
    onOpenChange(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleFormCancel = () => {
    setShowDetailsForm(false);
    setIsIndependentAgent(null);
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsIndependentAgent(null);
      setShowDetailsForm(false);
      setShowAgencyPrompt(false);
    }
  }, [open]);

  if (showDetailsForm) {
    return (
      <AgentDetailsForm
        open={true}
        onOpenChange={(open) => {
          if (!open) {
            handleFormCancel();
          }
        }}
        onComplete={handleFormComplete}
      />
    );
  }

  return (
    <>
      <Dialog open={open && isIndependentAgent === null && !showAgencyPrompt} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Are you an independent agent?</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Please let us know your agent status to continue with profile creation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-6">
            <Button
              onClick={handleIndependentAgent}
              className="flex flex-col items-center justify-center gap-3 p-8 h-auto hover:bg-primary/90 transition-all"
              variant="default"
            >
              <UserCheck className="w-12 h-12" />
              <span className="text-base font-medium">Yes, I am an independent agent</span>
            </Button>
            <Button
              onClick={handleNotIndependent}
              className="flex flex-col items-center justify-center gap-3 p-8 h-auto hover:bg-secondary transition-all"
              variant="outline"
            >
              <Building2 className="w-12 h-12" />
              <span className="text-base font-medium">No, I work with an agency</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Agency Prompt Dialog */}
      <AlertDialog open={showAgencyPrompt} onOpenChange={setShowAgencyPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Agency Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Please contact your agency or register with the "Agency" details from the post property page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAgencyPromptClose}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

