
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, AlertCircle } from 'lucide-react';

interface LegalQueryData {
  assistanceNeeded: string[];
  otherDescription: string;
  issueDescription: string;
}

interface LegalQueryStepProps {
  data: LegalQueryData;
  onChange: (data: Partial<LegalQueryData>) => void;
}

const LegalQueryStep = ({ data, onChange }: LegalQueryStepProps) => {
  const assistanceOptions = [
    'Title Verification',
    'Sale Agreement Drafting/Review',
    'Property Dispute',
    'Mutation Issues',
    'Registration Support',
    'Power of Attorney',
    'Others'
  ];

  const handleAssistanceChange = (option: string, checked: boolean) => {
    const updatedNeeded = checked
      ? [...data.assistanceNeeded, option]
      : data.assistanceNeeded.filter(item => item !== option);
    
    onChange({ assistanceNeeded: updatedNeeded });
  };

  const showOtherDescription = data.assistanceNeeded.includes('Others');
  const charCount = data.issueDescription?.length || 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full mb-4">
          <FileText className="h-8 w-8 text-brand-red" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Query</h3>
        <p className="text-gray-600">Help us understand your legal requirements</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Nature of Legal Assistance Needed
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assistanceOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={data.assistanceNeeded.includes(option)}
                  onCheckedChange={(checked) => handleAssistanceChange(option, checked as boolean)}
                />
                <Label htmlFor={option} className="text-sm font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {showOtherDescription && (
          <div>
            <Label htmlFor="otherDescription" className="text-sm font-medium text-gray-700 mb-2 block">
              Please describe your issue
            </Label>
            <Textarea
              id="otherDescription"
              placeholder="Describe your specific legal requirement"
              value={data.otherDescription}
              onChange={(e) => onChange({ otherDescription: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
        )}

        <div>
          <Label htmlFor="issueDescription" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Description of the Issue <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="issueDescription"
            placeholder="Please provide a detailed description of your legal issue (minimum 200 characters)"
            value={data.issueDescription}
            onChange={(e) => onChange({ issueDescription: e.target.value })}
            className="mt-1"
            rows={6}
            required
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Minimum 200 characters required, maximum 500 characters
            </p>
            <span className={`text-xs ${charCount < 200 ? 'text-red-500' : charCount > 500 ? 'text-red-500' : 'text-green-600'}`}>
              {charCount}/500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalQueryStep;
