import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
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
          <DialogTitle className="text-xl font-bold pr-8">
            Terms & Conditions – Home HNI (Post Property Ads)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            By clicking "Start Posting Your Ad" on Home HNI, you agree to the following:
          </p>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-base mb-1">1. Eligibility</h3>
              <p>You must be 18 years or older and legally authorized to list the property (as owner, agent, or representative).</p>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-1">2. Accuracy & Content</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>All details provided must be true and accurate.</li>
                <li>Ads with false, misleading, offensive, or unlawful content will be removed.</li>
                <li>Images must be relevant to the property and free of copyright issues.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-1">3. Compliance</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Listings must follow Indian laws, including RERA (where applicable), the IT Act, 2000, and local regulations.</li>
                <li>Disputed, illegal, or non-compliant properties cannot be listed.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-1">4. Use of Content</h3>
              <p>By posting, you grant Home HNI the right to display and promote your ad across its platform and partner channels.</p>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-1">5. Payments (if applicable)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fees for premium listings are non-refundable.</li>
                <li>GST or other taxes may apply.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-1">6. Moderation & Liability</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Home HNI may edit, suspend, or remove ads at its discretion.</li>
                <li>Home HNI is a listing platform only and is not responsible for property transactions, disputes, or losses.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-1">7. Privacy</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your contact details may be shared with interested buyers/tenants.</li>
                <li>Data will be handled per our Privacy Policy.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-1">8. Governing Law</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>These Terms are governed by the laws of India.</li>
                <li>Disputes will fall under the exclusive jurisdiction of the courts in Hyderabad, Telangana.</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
