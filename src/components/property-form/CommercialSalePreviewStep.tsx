import { Button } from '@/components/ui/button';
import { CommercialSaleFormData } from '@/types/commercialSaleProperty';

interface CommercialSalePreviewStepProps {
  formData: CommercialSaleFormData;
  onSubmit: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
}

export const CommercialSalePreviewStep = ({
  formData,
  onSubmit,
  onBack,
  currentStep,
  totalSteps,
  isSubmitting
}: CommercialSalePreviewStepProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your commercial property listing</p>
        <div className="mt-4 text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
        <div>
          <h3 className="font-semibold text-lg mb-2">Property Details</h3>
          <p><strong>Title:</strong> {formData.propertyInfo.propertyDetails.title}</p>
          <p><strong>Space Type:</strong> {formData.propertyInfo.propertyDetails.spaceType}</p>
          <p><strong>Area:</strong> {formData.propertyInfo.propertyDetails.superBuiltUpArea} sq ft</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Location</h3>
          <p><strong>City:</strong> {formData.propertyInfo.locationDetails.city}</p>
          <p><strong>Locality:</strong> {formData.propertyInfo.locationDetails.locality}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Sale Details</h3>
          <p><strong>Expected Price:</strong> ₹{formData.propertyInfo.saleDetails.expectedPrice?.toLocaleString()}</p>
          <p><strong>Price Negotiable:</strong> {formData.propertyInfo.saleDetails.priceNegotiable ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Listing'}
        </Button>
      </div>
    </div>
  );
};