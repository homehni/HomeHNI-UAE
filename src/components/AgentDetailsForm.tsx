import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveAgentDetails, type AgentDetails } from '@/services/agentService';
import { uploadSingleFile } from '@/services/fileUploadService';
import { useToast } from '@/hooks/use-toast';
import { sendAgentVerificationAdminAlert } from '@/services/emailService';
import { supabase } from '@/integrations/supabase/client';

interface AgentDetailsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export const AgentDetailsForm: React.FC<AgentDetailsFormProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [previousWork, setPreviousWork] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [verificationDocuments, setVerificationDocuments] = useState<Array<{
    type: string;
    url: string;
    name: string;
    file?: File;
  }>>([]);
  const [documents, setDocuments] = useState<Array<{
    type: string;
    url: string;
    name: string;
    file?: File;
  }>>([]);

  const handleFileUpload = async (file: File, type: 'verification' | 'document') => {
    if (!user) return;

    try {
      const uploadResult = await uploadSingleFile(file, 'agent-documents', user.id);
      
      const documentData = {
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        url: uploadResult.url,
        name: file.name
      };

      if (type === 'verification') {
        setVerificationDocuments(prev => [...prev, documentData]);
      } else {
        setDocuments(prev => [...prev, documentData]);
      }

      toast({
        title: "File uploaded",
        description: `${file.name} uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeDocument = (index: number, type: 'verification' | 'document') => {
    if (type === 'verification') {
      setVerificationDocuments(prev => prev.filter((_, i) => i !== index));
    } else {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to submit agent details",
        variant: "destructive"
      });
      return;
    }

    if (!name || !email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const agentDetails: AgentDetails = {
        name,
        email,
        previous_work: previousWork || undefined,
        rera_number: reraNumber || undefined,
        verification_documents: verificationDocuments.length > 0 ? verificationDocuments.map(doc => ({
          type: doc.type,
          url: doc.url,
          name: doc.name
        })) : undefined,
        documents: documents.length > 0 ? documents.map(doc => ({
          type: doc.type,
          url: doc.url,
          name: doc.name
        })) : undefined
      };

      await saveAgentDetails(agentDetails);

      // Send admin notification email
      try {
        // Get admin email from settings or use default
        const { data: settings } = await supabase
          .from('app_settings')
          .select('admin_email')
          .single();

        const adminEmail = settings?.admin_email || 'admin@homehni.ae';
        
        await sendAgentVerificationAdminAlert(adminEmail, {
          name,
          email,
          previousWork: previousWork || undefined,
          reraNumber: reraNumber || undefined,
          verificationDocuments: verificationDocuments.map(doc => ({
            type: doc.type,
            url: doc.url,
            name: doc.name
          })),
          documents: documents.map(doc => ({
            type: doc.type,
            url: doc.url,
            name: doc.name
          }))
        });
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "Success",
        description: "Agent details submitted successfully. Admin will review your application.",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving agent details:', error);
      toast({
        title: "Error",
        description: "Failed to submit agent details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Agent Verification Details</DialogTitle>
          <DialogDescription>
            Please provide your details to verify your agent status. All information will be reviewed by our admin team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>

          {/* Previous Work */}
          <div>
            <Label htmlFor="previousWork">Previous Work Experience</Label>
            <Textarea
              id="previousWork"
              value={previousWork}
              onChange={(e) => setPreviousWork(e.target.value)}
              placeholder="Describe your previous work experience in real estate..."
              className="mt-1"
              rows={4}
            />
          </div>

          {/* RERA Number */}
          <div>
            <Label htmlFor="reraNumber">RERA Number (if applicable)</Label>
            <Input
              id="reraNumber"
              value={reraNumber}
              onChange={(e) => setReraNumber(e.target.value)}
              placeholder="Enter your RERA registration number"
              className="mt-1"
            />
          </div>

          {/* Verification Documents */}
          <div>
            <Label>Verification Documents</Label>
            <p className="text-sm text-gray-500 mb-2">Upload documents that verify your agent status (ID, license, etc.)</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, 'verification');
                  }
                }}
                className="hidden"
                id="verification-upload"
              />
              <label
                htmlFor="verification-upload"
                className="flex items-center justify-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Verification Document</span>
              </label>
            </div>
            {verificationDocuments.length > 0 && (
              <div className="mt-2 space-y-2">
                {verificationDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index, 'verification')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Documents */}
          <div>
            <Label>Additional Documents</Label>
            <p className="text-sm text-gray-500 mb-2">Upload any additional supporting documents</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, 'document');
                  }
                }}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="flex items-center justify-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Additional Document</span>
              </label>
            </div>
            {documents.length > 0 && (
              <div className="mt-2 space-y-2">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index, 'document')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !name || !email}
          >
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

