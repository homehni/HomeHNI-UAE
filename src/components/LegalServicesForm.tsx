import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PersonalDetailsStep from './legal-form/PersonalDetailsStep';
import PropertyInformationStep from './legal-form/PropertyInformationStep';
import LegalQueryStep from './legal-form/LegalQueryStep';
import FileUploadStep from './legal-form/FileUploadStep';
import ConsultationPreferencesStep from './legal-form/ConsultationPreferencesStep';

interface LegalServicesFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  personalDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
    country: string;
    state: string;
    city: string;
  };
  propertyInformation: {
    propertyAddress: string;
    propertyType: string;
    ownershipStatus: string;
    surveyNo?: string;
  };
  legalQuery: {
    assistanceNeeded: string[];
    otherDescription: string;
    issueDescription: string;
  };
  fileUpload: {
    salesDeed: File[];
    ror: File[];
    naksha: File[];
  };
  consultationPreferences: {
    mode: string;
    preferredDate: string;
    preferredTime: string;
  };
}

const LegalServicesForm = ({ isOpen, onClose }: LegalServicesFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    personalDetails: {
      fullName: '',
      email: '',
      phoneNumber: '',
      country: '',
      state: '',
      city: '',
    },
    propertyInformation: {
      propertyAddress: '',
      propertyType: '',
      ownershipStatus: '',
      surveyNo: '',
    },
    legalQuery: {
      assistanceNeeded: [],
      otherDescription: '',
      issueDescription: '',
    },
    fileUpload: {
      salesDeed: [],
      ror: [],
      naksha: [],
    },
    consultationPreferences: {
      mode: '',
      preferredDate: '',
      preferredTime: '',
    },
  });

  const steps = [
    { id: 1, title: 'Personal Details', component: PersonalDetailsStep },
    { id: 2, title: 'Property Information', component: PropertyInformationStep },
    { id: 3, title: 'Legal Query', component: LegalQueryStep },
    { id: 4, title: 'Document Upload', component: FileUploadStep },
    { id: 5, title: 'Consultation Preferences', component: ConsultationPreferencesStep },
  ];

  const validatePersonalDetails = () => {
    const { fullName, email, phoneNumber } = formData.personalDetails;
    if (!fullName || !email || !phoneNumber) {
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // For step 1 (Personal Details), validate required fields
      if (currentStep === 1) {
        if (!validatePersonalDetails()) {
          toast({
            title: "Required Fields",
            description: "Please fill in all required fields (Name, Email, Phone) correctly.",
            variant: "destructive"
          });
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted', formData);
    
    // Show toast notification
    toast({
      title: "Consultation Request Submitted!",
      description: "Thank you for your request. Our legal team will contact you within 24 hours.",
      className: "border-l-4 border-l-green-500 border-green-200"
    });
    
    // Close the form
    onClose();
  };

  const updateFormData = (step: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep
            data={formData.personalDetails}
            onChange={(data) => updateFormData('personalDetails', data)}
          />
        );
      case 2:
        return (
          <PropertyInformationStep
            data={formData.propertyInformation}
            onChange={(data) => updateFormData('propertyInformation', data)}
          />
        );
      case 3:
        return (
          <LegalQueryStep
            data={formData.legalQuery}
            onChange={(data) => updateFormData('legalQuery', data)}
          />
        );
      case 4:
        return (
          <FileUploadStep
            data={formData.fileUpload}
            onChange={(data) => updateFormData('fileUpload', data)}
          />
        );
      case 5:
        return (
          <ConsultationPreferencesStep
            data={formData.consultationPreferences}
            onChange={(data) => updateFormData('consultationPreferences', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 sm:p-6">
        <div className="flex flex-col h-full">
          {/* Header - Mobile responsive */}
          <DialogHeader className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                  Legal Services Consultation
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Step {currentStep} of {totalSteps}: {steps.find(step => step.id === currentStep)?.title}
                </p>
              </div>
            </div>

            {/* Progress Bar - Mobile responsive */}
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-600">Progress</span>
                <span className="text-xs sm:text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-red h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </DialogHeader>

          {/* Form Content - Mobile responsive scrollable area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {renderCurrentStep()}
          </div>

          {/* Footer Navigation - Mobile responsive */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`w-full sm:w-auto ${currentStep === 1 ? 'hidden' : ''}`}
              >
                <ChevronLeft size={16} className="mr-2" />
                Previous
              </Button>

              <div className="flex gap-2 ml-auto">
                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    className="flex-1 sm:flex-none bg-brand-red hover:bg-brand-red-dark text-white"
                  >
                    Next
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
                  >
                    Submit Consultation Request
                  </Button>
                )}
              </div>
            </div>

            {/* Step indicators for mobile */}
            <div className="flex justify-center mt-4 sm:hidden">
              <div className="flex space-x-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full ${
                      step.id === currentStep
                        ? 'bg-brand-red'
                        : step.id < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalServicesForm;
