import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Building, MapPin, IndianRupee, Sparkles, Camera, Calendar } from 'lucide-react';

interface CommercialPreviewStepProps {
  onBack: () => void;
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
}

export const CommercialPreviewStep = ({
  onBack,
  onSubmit,
  currentStep,
  totalSteps,
  isSubmitting
}: CommercialPreviewStepProps) => {
  const completedSteps = [
    { icon: Building, label: 'Property Details', description: 'Commercial space details added' },
    { icon: MapPin, label: 'Locality Details', description: 'Location information provided' },
    { icon: IndianRupee, label: 'Rental Details', description: 'Pricing and terms configured' },
    { icon: Sparkles, label: 'Amenities', description: 'Amenities and facilities listed' },
    { icon: Camera, label: 'Gallery', description: 'Photos and videos uploaded' },
    { icon: Calendar, label: 'Schedule', description: 'Contact schedule set' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ready to Submit Your Commercial Property
        </h2>
        <p className="text-gray-600">
          Your property listing is complete. Review the details below and submit when ready.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <step.icon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{step.label}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your property will be reviewed by our team</li>
          <li>• Once approved, it will be live on the platform</li>
          <li>• You'll start receiving inquiries from potential tenants</li>
          <li>• We'll send you notifications for all activities</li>
        </ul>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary text-white hover:bg-primary/90"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Property Listing'}
        </Button>
      </div>
    </div>
  );
};